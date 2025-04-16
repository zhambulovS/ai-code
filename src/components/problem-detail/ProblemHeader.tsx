
import { CheckCircle, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProblemHeaderProps {
  id: number;
  title: string;
  difficulty: string;
  acceptance_rate: number;
  tags: string[];
  isSolved: boolean;
}

const difficultyColors = {
  Easy: "text-green-500",
  Medium: "text-yellow-500",
  Hard: "text-red-500"
};

export function ProblemHeader({ 
  id, 
  title, 
  difficulty, 
  acceptance_rate, 
  tags,
  isSolved 
}: ProblemHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold flex items-center">
        {isSolved && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
        <span className="mr-2">{id}.</span>
        {title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-3">
        <span className={`font-medium ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}>
          {difficulty}
        </span>
        
        <div className="flex items-center text-gray-500">
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span>{acceptance_rate}%</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
