
import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { HintDialog } from "./HintDialog";
import { useHints } from "./useHints";

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
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const { 
    hint,
    hintHistory, 
    personalizedHint,
    isLoadingPersonalized,
    loadHintHistory,
    handleGetPersonalizedHint,
    generateNewHint
  } = useHints(problemId, isLoggedIn);

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
      // Load hint history first
      await loadHintHistory();
      
      // If already reached the limit, just show the dialog with history
      if (hintHistory.length >= 3) {
        setIsOpen(true);
        setIsLoading(false);
        return;
      }

      // Get a failed test for hint generation
      const failedTest = testResults.find(r => !r.passed);
      if (!failedTest) {
        throw new Error(t("problem.noFailedTests"));
      }

      // Generate the hint
      await generateNewHint({
        problemId,
        failedSubmission: code,
        testOutput: `Input: ${failedTest.testCase.input}\nExpected: ${failedTest.expected}\nYour Output: ${failedTest.output}\nError: ${failedTest.error || 'None'}`
      });
      
      // Try to get a personalized hint
      await handleGetPersonalizedHint(problemDifficulty);
      
      // Open the dialog
      setIsOpen(true);
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

      <HintDialog 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        hint={hint}
        hintHistory={hintHistory}
        personalizedHint={personalizedHint}
        isLoadingPersonalized={isLoadingPersonalized}
        onGetPersonalizedHint={() => handleGetPersonalizedHint(problemDifficulty)}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
