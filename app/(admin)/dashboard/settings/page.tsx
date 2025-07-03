import { Settings2, User, Shield, Bell, Globe, CreditCard, Database, Key } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main settings content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
              <User className="h-5 w-5" />
              <div>
                <h2 className="text-lg font-medium">Account</h2>
                <p className="text-sm text-muted-foreground">
                  Update your profile information
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Profile Information</p>
                  <p className="text-sm text-muted-foreground">
                    Update your name, email, and profile picture
                  </p>
                </div>
                <Button variant="outline">Edit</Button>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-muted-foreground">
                    Update your authentication credentials
                  </p>
                </div>
                <Button variant="outline">Change</Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
              <Shield className="h-5 w-5" />
              <div>
                <h2 className="text-lg font-medium">Privacy</h2>
                <p className="text-sm text-muted-foreground">
                  Control your data sharing preferences
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Data Collection</p>
                  <p className="text-sm text-muted-foreground">
                    Allow anonymous usage analytics
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Public Profile</p>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to other users
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
              <Bell className="h-5 w-5" />
              <div>
                <h2 className="text-lg font-medium">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Configure how you receive alerts
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get alerts on your devices
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary sidebar */}
        <div className="space-y-6">
          {/* App Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
              <Settings2 className="h-5 w-5" />
              <div>
                <h2 className="text-lg font-medium">App Preferences</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Dark Mode</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">
                    English
                  </p>
                </div>
                <Button variant="outline">Change</Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Quick Actions</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Globe className="h-4 w-4" />
                View Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <CreditCard className="h-4 w-4" />
                Billing Information
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Database className="h-4 w-4" />
                Data Export
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Key className="h-4 w-4" />
                API Access
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <h2 className="text-lg font-medium text-red-600">Danger Zone</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  Delete all your dictionaries and data
                </p>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}