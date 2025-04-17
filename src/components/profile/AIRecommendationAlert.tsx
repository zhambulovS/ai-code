
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import { AIRecommendation } from "@/services/recommendationService";

interface AIRecommendationAlertProps {
  recommendations: AIRecommendation[];
}

export function AIRecommendationAlert({ recommendations }: AIRecommendationAlertProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Alert className="mb-8 border-primary/20 bg-primary/10">
      <Lightbulb className="h-4 w-4 text-primary" />
      <AlertTitle>AI Recommendation</AlertTitle>
      <AlertDescription>
        {recommendations[0].description}
      </AlertDescription>
    </Alert>
  );
}
