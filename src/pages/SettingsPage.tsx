
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Languages } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") as "light" | "dark" || "light"
  );
  const [language, setLanguage] = useState(i18n.language);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Apply theme on change
  useEffect(() => {
    const root = window.document.documentElement;
    const oldTheme = theme === "dark" ? "light" : "dark";
    root.classList.remove(oldTheme);
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    toast({
      title: theme === "light" 
        ? t("settings.darkModeEnabled") 
        : t("settings.lightModeEnabled"),
      duration: 2000,
    });
  };

  const handleLanguageChange = (value: string) => {
    if (value && (value === "en" || value === "kk")) {
      setLanguage(value);
      i18n.changeLanguage(value);
      localStorage.setItem("language", value);
      
      toast({
        title: value === "en" 
          ? "Language changed to English" 
          : "Тіл қазақшаға өзгертілді",
        duration: 2000,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">{t("settings.title")}</h1>
      
      <div className="grid gap-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.appearance")}</CardTitle>
            <CardDescription>{t("settings.appearanceDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <div>
                  <p className="font-medium">{t("settings.theme")}</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === "light" ? t("settings.lightMode") : t("settings.darkMode")}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.language")}</CardTitle>
            <CardDescription>{t("settings.languageDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Languages className="h-5 w-5" />
              <div>
                <p className="font-medium">{t("settings.selectLanguage")}</p>
              </div>
            </div>
            <ToggleGroup
              type="single"
              value={language}
              onValueChange={handleLanguageChange}
              className="justify-start"
            >
              <ToggleGroupItem value="en">English</ToggleGroupItem>
              <ToggleGroupItem value="kk">Қазақша</ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.account")}</CardTitle>
            <CardDescription>{t("settings.accountDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => navigate("/edit-profile")}
            >
              {t("settings.editProfile")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
