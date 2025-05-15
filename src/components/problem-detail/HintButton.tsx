
import { useState, useEffect } from "react";
import { Lightbulb, RotateCw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  generateHint, 
  getHintHistory, 
  type HintRequest 
} from "@/services/hintService";
import { getPersonalizedHint } from "@/services/recommendations";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

interface HintButtonProps {
  problemId: number;
  code: string;
  language: string;
  testResults: any[];
  isLoggedIn: boolean;
  problemDifficulty?: string;
}

export function HintButton({ 
  problemId, 
  code, 
  language, 
  testResults, 
  isLoggedIn,
  problemDifficulty = "medium" 
}: HintButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [hintHistory, setHintHistory] = useState<any[]>([]);
  const [personalizedHint, setPersonalizedHint] = useState<string | null>(null);
  const [isLoadingPersonalized, setIsLoadingPersonalized] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Загружаем историю подсказок при открытии диалога
  useEffect(() => {
    if (isOpen && isLoggedIn && !hintHistory.length) {
      loadHintHistory();
    }
  }, [isOpen, isLoggedIn]);

  const loadHintHistory = async () => {
    try {
      const history = await getHintHistory(problemId);
      setHintHistory(history);
    } catch (error) {
      console.error("Error loading hint history:", error);
    }
  };

  const handleGetHint = async () => {
    if (!isLoggedIn) {
      toast({
        title: t("problem.loginRequired"),
        description: t("problem.loginToGetHint"),
        variant: "destructive"
      });
      return;
    }

    if (!testResults.length || testResults.every(r => r.passed)) {
      toast({
        title: t("problem.noHintsAvailable"),
        description: t("problem.runFailedTestsForHint"),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get hint history first
      const history = await getHintHistory(problemId);
      setHintHistory(history);
      
      // If already reached the limit, just show the dialog with history
      if (history.length >= 3) {
        setIsOpen(true);
        setIsLoading(false);
        return;
      }

      // Create the hint request
      const failedTest = testResults.find(r => !r.passed);
      if (!failedTest) {
        throw new Error(t("problem.noFailedTests"));
      }

      const hintRequest: HintRequest = {
        problemId,
        failedSubmission: code,
        testOutput: `Input: ${failedTest.testCase.input}\nExpected: ${failedTest.expected}\nYour Output: ${failedTest.output}\nError: ${failedTest.error || 'None'}`
      };

      // Generate hint
      const result = await generateHint(hintRequest);
      setHint(result.hint);
      
      // Update history after getting a new hint
      const updatedHistory = await getHintHistory(problemId);
      setHintHistory(updatedHistory);
      
      // Open the dialog
      setIsOpen(true);

      // Try to get a personalized hint based on user's experience
      await handleGetPersonalizedHint();
      
    } catch (error) {
      console.error("Error getting hint:", error);
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : t("problem.errorGettingHint"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetPersonalizedHint = async () => {
    if (!isLoggedIn) return;
    
    setIsLoadingPersonalized(true);
    try {
      const personalHint = await getPersonalizedHint(
        "current-user-id", // В идеале, это должен быть реальный ID пользователя
        problemId,
        problemDifficulty,
        hintHistory.length
      );
      setPersonalizedHint(personalHint);
    } catch (error) {
      console.error("Error getting personalized hint:", error);
    } finally {
      setIsLoadingPersonalized(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={handleGetHint}
        disabled={isLoading}
        className="flex gap-1 items-center"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
        ) : (
          <Lightbulb size={16} className="mr-1" />
        )}
        {t("problem.getHint")}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("problem.hint")}</DialogTitle>
            <DialogDescription>
              {hintHistory.length >= 3 ? (
                <div className="text-amber-600">
                  {t("problem.hintLimitReached")}
                </div>
              ) : (
                <div>
                  {t("problem.hintsUsed", { count: hintHistory.length, max: 3 })}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {personalizedHint && (
            <Card className="border-primary/20 bg-primary/5 mb-4">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <BookOpen className="h-4 w-4 text-primary mr-2" />
                  <h4 className="text-sm font-medium">{t("problem.personalizedAdvice")}</h4>
                </div>
                <p className="text-sm">{personalizedHint}</p>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-4 space-y-4">
            {hintHistory.map((h, i) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {new Date(h.created_at).toLocaleString()}:
                </div>
                <div className="whitespace-pre-wrap">{h.generated_hint}</div>
              </div>
            ))}
            
            {hint && hintHistory.length === 0 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md whitespace-pre-wrap">
                {hint}
              </div>
            )}
            
            {hintHistory.length === 0 && !hint && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                {t("common.loading")}...
              </div>
            )}
          </div>
          
          {isLoadingPersonalized && (
            <div className="flex justify-center my-4">
              <RotateCw className="h-4 w-4 animate-spin text-primary" />
            </div>
          )}
          
          {hintHistory.length < 3 && !isLoading && (
            <Button 
              variant="outline" 
              className="w-full mt-2" 
              onClick={handleGetPersonalizedHint}
              disabled={isLoadingPersonalized}
            >
              {isLoadingPersonalized ? (
                <RotateCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Lightbulb className="h-4 w-4 mr-2" />
              )}
              {t("problem.getPersonalizedAdvice")}
            </Button>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
