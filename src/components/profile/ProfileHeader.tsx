
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { UserProfile } from "@/services/profileService";

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditProfile: () => void;
}

export function ProfileHeader({ profile, onEditProfile }: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {profile.full_name?.split(' ').map(n => n[0]).join('') || '?'}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-2xl font-bold">{profile.full_name}</h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <span>{profile.level}</span>
              <span className="text-gray-300">•</span>
              <span>Rank #{profile.rank}</span>
              {profile.institution && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>{profile.institution}</span>
                </>
              )}
            </div>
            {profile.bio && (
              <p className="mt-2 text-gray-600">{profile.bio}</p>
            )}
          </div>
        </div>
        
        <Button variant="outline" onClick={onEditProfile}>
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
