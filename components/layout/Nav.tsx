import Image from "next/image";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "@/components/dictionary/SearchBar";
import { Button } from "@/components/ui/button";
import { languages } from "@/constants/languages";
import { toast } from "sonner";

interface NavProps {
  currentLang: string;
  currentMode: 'native' | 'bilingual';
  onLanguageChange: (lang: string) => void;
  onModeChange: (mode: 'native' | 'bilingual') => void;
  onSearch: (word: string) => void;
}

function Nav({ currentLang, currentMode, onLanguageChange, onModeChange, onSearch }: NavProps) {
    const handleLanguageChange = (value: string) => {
        try {
            onLanguageChange(value);
            const selectedLanguage = languages.find(lang => lang.code === value);
            toast.success(`Switched to ${selectedLanguage?.name || value}`);
        } catch (error) {
            console.error('Language change error:', error);
            toast.error("Failed to change language");
        }
    };

    const handleModeChange = (value: 'native' | 'bilingual') => {
        try {
            onModeChange(value);
            toast.success(`Switched to ${value} mode`);
        } catch (error) {
            console.error('Mode change error:', error);
            toast.error("Failed to change mode");
        }
    };

    const currentLanguageName = languages.find(lang => lang.code === currentLang)?.name || currentLang.toUpperCase();

    return (
        <nav className="flex justify-between items-center bg-white p-2 md:px-6 md:py-2 lg:px-16 lg:py-4 shadow-sm shadow-slate-200 sticky left-0 right-0 top-0 z-10">
            <Link href="/dictionary" className="flex items-center">
                <Image src="/convex.svg" alt="AfriLex Logo" height={40} width={40} />
                <span className="ml-2 font-bold text-lg hidden md:block">AfriLex</span>
            </Link>
            
            <div className="flex-1 max-w-2xl mx-4">
                <SearchBar 
                    onSearch={onSearch}
                    placeholder={`Search in ${currentLanguageName}...`}
                />
            </div>
            
            <ul className="flex items-center gap-x-4">
                <div className="flex gap-x-2">
                    <li>
                        <Select value={currentMode} onValueChange={handleModeChange}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="native">Native</SelectItem>
                                <SelectItem value="bilingual">Bilingual</SelectItem>
                            </SelectContent>
                        </Select>
                    </li>
                    <li>
                        <Select value={currentLang} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map(language => (
                                    <SelectItem value={language.code} key={language.code}>
                                        {language.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </li>
                </div>
                <li>
                    <Button asChild>
                        <Link href="/support" className="text-white">Donate</Link>
                    </Button>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;