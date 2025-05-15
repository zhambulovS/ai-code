
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  BookOpen, 
  Code, 
  ChevronRight,
  ArrowRight,
  BookMarked,
  TrendingUp
} from "lucide-react";
import { AIRecommendation } from "@/services/recommendations";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

interface AIRecommendationAlertProps {
  recommendations: AIRecommendation[];
}

export function AIRecommendationAlert({ recommendations }: AIRecommendationAlertProps) {
  const { t } = useTranslation();
  
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const getIcon = (type: AIRecommendation["type"]) => {
    switch(type) {
      case "problem":
        return <Code className="h-4 w-4 text-primary" />;
      case "course":
        return <BookOpen className="h-4 w-4 text-primary" />;
      case "continue":
        return <BookMarked className="h-4 w-4 text-primary" />;
      case "tip":
      default:
        return <Lightbulb className="h-4 w-4 text-primary" />;
    }
  };

  const renderRecommendation = (recommendation: AIRecommendation, index: number) => {
    const isLast = index === recommendations.length - 1;

    return (
      <div key={index} className={`py-3 ${!isLast ? "border-b" : ""}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {getIcon(recommendation.type)}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-1">{recommendation.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{recommendation.description}</p>
            
            {recommendation.progress !== undefined && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{t('profile.progress')}</span>
                  <span>{recommendation.progress}%</span>
                </div>
                <Progress value={recommendation.progress} className="h-2" />
              </div>
            )}
            
            {recommendation.link && (
              <Button variant="outline" size="sm" className="mt-1" asChild>
                <Link to={recommendation.link}>
                  {recommendation.type === "continue" ? t('profile.continue') : t('profile.viewDetails')}
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Alert className="mb-8 border-primary/20 bg-primary/5">
      <div className="flex items-center mb-2">
        <TrendingUp className="h-4 w-4 text-primary mr-2" />
        <AlertTitle>{t('profile.aiRecommendations')}</AlertTitle>
      </div>
      <AlertDescription className="pt-2">
        <div className="space-y-1">
          {recommendations.map((recommendation, index) => 
            renderRecommendation(recommendation, index)
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
