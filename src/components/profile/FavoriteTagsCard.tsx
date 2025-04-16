
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FavoriteTag } from "@/services/profileService";

interface FavoriteTagsCardProps {
  tags: FavoriteTag[];
}

export function FavoriteTagsCard({ tags }: FavoriteTagsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Favorite Tags
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag.tag} variant="outline">
              {tag.tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
