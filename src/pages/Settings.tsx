import { useAuth } from "@/components/auth/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  Bell,
  Download,
  Eye,
  Globe,
  Keyboard,
  LogOut,
  Moon,
  Palette,
  Settings as SettingsIcon,
  Shield,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface SettingsState {
  // Appearance
  compactMode: boolean;
  showAnimations: boolean;
  // Notifications
  emailNotifications: boolean;
  interviewReminders: boolean;
  reminderTime: string;
  // Privacy
  showProfilePublic: boolean;
  // Data
  autoDeleteRejected: boolean;
  deleteAfterDays: string;
}

const defaultSettings: SettingsState = {
  compactMode: false,
  showAnimations: true,
  emailNotifications: true,
  interviewReminders: true,
  reminderTime: "24",
  showProfilePublic: false,
  autoDeleteRejected: false,
  deleteAfterDays: "30",
};

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem("interntrack-settings");
    return saved
      ? { ...defaultSettings, ...JSON.parse(saved) }
      : defaultSettings;
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("interntrack-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem("interntrack-settings", JSON.stringify(settings));
    setHasChanges(false);
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  const handleExportData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4001/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const applications = await response.json();

      const exportData = {
        exportedAt: new Date().toISOString(),
        user: user?.username,
        applications,
        settings,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `interntrack-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded as JSON.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAllData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4001/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const applications = await response.json();

      // Delete all applications
      for (const app of applications) {
        await fetch(`http://localhost:4001/api/applications/${app._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast({
        title: "Data deleted",
        description: "All your applications have been deleted.",
      });

      // Reload the page to refresh all data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not delete your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
        {hasChanges && <Button onClick={handleSave}>Save Changes</Button>}
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-white">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <p className="font-medium text-lg">{user?.username || "User"}</p>
              <p className="text-sm text-muted-foreground">@{user?.username}</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                Free Plan
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              defaultValue={user?.username || ""}
              disabled
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how InternTrack looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Theme</Label>
              <p className="text-sm text-muted-foreground">
                Select your preferred theme
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => theme === "dark" && toggleTheme()}
                className="gap-2"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => theme === "light" && toggleTheme()}
                className="gap-2"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
            </div>
          </div>

          <Separator />

          {/* Compact Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use smaller spacing and fonts
              </p>
            </div>
            <Switch
              checked={settings.compactMode}
              onCheckedChange={(checked) =>
                updateSetting("compactMode", checked)
              }
            />
          </div>

          {/* Animations */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Animations</Label>
              <p className="text-sm text-muted-foreground">
                Enable smooth transitions and effects
              </p>
            </div>
            <Switch
              checked={settings.showAnimations}
              onCheckedChange={(checked) =>
                updateSetting("showAnimations", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                updateSetting("emailNotifications", checked)
              }
            />
          </div>

          <Separator />

          {/* Interview Reminders */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Interview Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminded before interviews
              </p>
            </div>
            <Switch
              checked={settings.interviewReminders}
              onCheckedChange={(checked) =>
                updateSetting("interviewReminders", checked)
              }
            />
          </div>

          {/* Reminder Time */}
          {settings.interviewReminders && (
            <div className="flex items-center justify-between pl-6 border-l-2 border-primary/20">
              <div className="space-y-0.5">
                <Label className="text-base">Reminder Time</Label>
                <p className="text-sm text-muted-foreground">
                  How early to be reminded
                </p>
              </div>
              <Select
                value={settings.reminderTime}
                onValueChange={(value) => updateSetting("reminderTime", value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour before</SelectItem>
                  <SelectItem value="3">3 hours before</SelectItem>
                  <SelectItem value="24">1 day before</SelectItem>
                  <SelectItem value="48">2 days before</SelectItem>
                  <SelectItem value="168">1 week before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Control your data and visibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Public Profile */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Public Profile</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to see your profile
              </p>
            </div>
            <Switch
              checked={settings.showProfilePublic}
              onCheckedChange={(checked) =>
                updateSetting("showProfilePublic", checked)
              }
            />
          </div>

          <Separator />

          {/* Change Password */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Password</Label>
              <p className="text-sm text-muted-foreground">
                Change your account password
              </p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Export or delete your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto Delete Rejected */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Auto-delete Rejected</Label>
              <p className="text-sm text-muted-foreground">
                Automatically remove rejected applications
              </p>
            </div>
            <Switch
              checked={settings.autoDeleteRejected}
              onCheckedChange={(checked) =>
                updateSetting("autoDeleteRejected", checked)
              }
            />
          </div>

          {settings.autoDeleteRejected && (
            <div className="flex items-center justify-between pl-6 border-l-2 border-primary/20">
              <div className="space-y-0.5">
                <Label className="text-base">Delete After</Label>
                <p className="text-sm text-muted-foreground">
                  Days to keep rejected apps
                </p>
              </div>
              <Select
                value={settings.deleteAfterDays}
                onValueChange={(value) =>
                  updateSetting("deleteAfterDays", value)
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* Export & Delete Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export All Data
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete All Applications
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    all your applications and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAllData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </CardTitle>
          <CardDescription>Quick actions for power users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { keys: ["Ctrl", "N"], action: "New Application" },
              { keys: ["Ctrl", "S"], action: "Save Changes" },
              { keys: ["Ctrl", "K"], action: "Quick Search" },
              { keys: ["Ctrl", "/"], action: "Show Shortcuts" },
              { keys: ["Ctrl", "D"], action: "Toggle Dark Mode" },
              { keys: ["Esc"], action: "Close Dialog" },
            ].map(({ keys, action }) => (
              <div
                key={action}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
              >
                <span className="text-sm">{action}</span>
                <div className="flex gap-1">
                  {keys.map((key) => (
                    <kbd
                      key={key}
                      className="px-2 py-0.5 text-xs bg-background border rounded shadow-sm font-mono"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Section */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-destructive">
            <LogOut className="h-5 w-5" />
            Session
          </CardTitle>
          <CardDescription>Manage your current session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Sign Out</Label>
              <p className="text-sm text-muted-foreground">
                End your current session
              </p>
            </div>
            <Button variant="destructive" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Version Info */}
      <div className="text-center text-xs text-muted-foreground py-4">
        <p>InternTrack v1.0.0</p>
        <p className="mt-1">Made with ❤️ for job seekers</p>
      </div>
    </div>
  );
};

export default Settings;
