
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Upload, User, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fetchUserProfile, updateUserProfile } from "@/services/profileService";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  full_name: z.string().min(2, {
    message: "Name must contain at least 2 characters.",
  }),
  institution: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().max(300, {
    message: "Bio cannot be longer than 300 characters.",
  }).optional(),
});

export default function EditProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      institution: "",
      country: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: t("auth.loginRequired"),
        description: t("profile.loginToEditProfile"),
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await fetchUserProfile(user.id);
        if (profile) {
          form.reset({
            full_name: profile.full_name || "",
            institution: profile.institution || "",
            country: profile.country || "",
            bio: profile.bio || "",
          });
          setAvatarUrl(profile.avatar_url);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast({
          title: t("common.error"),
          description: t("profile.failedToLoadProfile"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user, navigate, form, toast, t]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`; // Save to a user-specific folder

    setUploading(true);

    try {
      // Upload file to Storage
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

      if (urlData && urlData.publicUrl) {
        setAvatarUrl(urlData.publicUrl);

        // Update profile with new avatar URL
        await updateUserProfile(user.id, {
          avatar_url: urlData.publicUrl,
        });

        toast({
          title: t("profile.avatarUpdated"),
          description: t("profile.avatarUpdateSuccess"),
        });
      } else {
        throw new Error("Could not get public URL for avatar");
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: t("common.uploadError"),
        description: t("profile.avatarUploadError"),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;

    setIsLoading(true);
    try {
      await updateUserProfile(user.id, {
        ...values,
        avatar_url: avatarUrl,
      });

      toast({
        title: t("profile.profileUpdated"),
        description: t("profile.profileUpdateSuccess"),
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t("common.updateError"),
        description: t("profile.profileUpdateError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="outline" 
          className="mb-4" 
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.backToProfile")}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{t("profile.editProfile")}</CardTitle>
            <CardDescription>
              {t("profile.updateProfileInfo")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                  <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex items-center">
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById("avatar")?.click()}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? t("common.uploading") : t("profile.uploadAvatar")}
                    </Button>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.fullName")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("profile.fullNamePlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("profile.institution")}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t("profile.institutionPlaceholder")} 
                              {...field} 
                              value={field.value || ""} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("profile.country")}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t("profile.countryPlaceholder")} 
                              {...field} 
                              value={field.value || ""} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("profile.aboutMe")}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t("profile.bioPlaceholder")} 
                              className="resize-none h-20" 
                              {...field} 
                              value={field.value || ""} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? t("common.saving") : t("common.saveChanges")}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
