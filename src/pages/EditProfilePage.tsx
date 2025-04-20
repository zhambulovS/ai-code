
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Upload, User, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
    message: "Имя должно содержать минимум 2 символа.",
  }),
  institution: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().max(300, {
    message: "Биография не может быть длиннее 300 символов.",
  }).optional(),
});

export default function EditProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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
        title: "Требуется вход в систему",
        description: "Для редактирования профиля необходимо войти в систему.",
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
          title: "Ошибка",
          description: "Не удалось загрузить данные профиля.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user, navigate, form, toast]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setUploading(true);

    try {
      // Проверяем, существует ли бакет, и создаем его, если нет
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) throw bucketsError;
      
      const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
      
      if (!avatarBucketExists) {
        const { error: createBucketError } = await supabase.storage.createBucket('avatars', {
          public: true
        });
        
        if (createBucketError) throw createBucketError;
      }

      // Загрузка файла в хранилище Supabase
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Получение публичного URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      
      if (data) {
        setAvatarUrl(data.publicUrl);
        
        // Обновление профиля с новым URL аватара
        await updateUserProfile(user.id, {
          avatar_url: data.publicUrl,
        });

        toast({
          title: "Аватар обновлен",
          description: "Ваша фотография профиля была успешно обновлена.",
        });
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Ошибка загрузки",
        description: "Произошла ошибка при загрузке аватара.",
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
        title: "Профиль обновлен",
        description: "Ваш профиль был успешно обновлен.",
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Ошибка обновления",
        description: "Произошла ошибка при обновлении профиля.",
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
          Вернуться к профилю
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Редактирование профиля</CardTitle>
            <CardDescription>
              Обновите информацию вашего профиля
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
                      {uploading ? "Загрузка..." : "Загрузить аватар"}
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
                          <FormLabel>Полное имя</FormLabel>
                          <FormControl>
                            <Input placeholder="Иван Иванов" {...field} />
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
                          <FormLabel>Учебное заведение</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Университет или организация" 
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
                          <FormLabel>Страна</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ваша страна" 
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
                          <FormLabel>О себе</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Расскажите о себе..." 
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
                      {isLoading ? "Сохранение..." : "Сохранить изменения"}
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
