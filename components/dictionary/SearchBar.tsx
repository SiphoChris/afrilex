"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  search: z.string().min(3, {
    message: "Please enter at least 3 characters",
  }).max(100, {
    message: "Search term is too long (max 100 characters)"
  }),
});

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export function SearchBar({ onSearch, placeholder = "hamba", defaultValue = "" }: SearchBarProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: defaultValue,
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      onSearch(values.search.trim());
      toast.success("Searching for: " + values.search);
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Search failed. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await form.trigger();
    if (!isValid) {
      const error = form.formState.errors.search;
      if (error) {
        toast.error(error.message);
      }
      return;
    }
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-4xl">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder={placeholder}
                    className="pl-10" 
                    {...field} 
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="text-white flex items-center gap-2">
          Search
        </Button>
      </form>
    </Form>
  );
}