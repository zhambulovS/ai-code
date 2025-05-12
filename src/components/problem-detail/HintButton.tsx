
import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { generateHint, getHintHistory, type HintRequest } from "@/services/hintService";

interface HintButtonProps {
  problemId: number;
  code: string;
  language: string;
  testResults: any[];
  isLoggedIn: boolean;
}

export function HintButton({ problemId, code, language, testResults, isLoggedIn }: HintButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [hintHistory, setHintHistory] = useState<any[]>([]);
  const { toast } = useToast();

  const handleGetHint = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Необходимо войти в систему",
        description: "Чтобы получить подсказку, необходимо войти в систему.",
        variant: "destructive"
      });
      return;
    }

    if (!testResults.length || testResults.every(r => r.passed)) {
      toast({
        title: "Нет доступных подсказок",
        description: "Для получения подсказки необходимо выполнить тесты с ошибками.",
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
        throw new Error("Не удалось найти непройденный тест");
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
    } catch (error) {
      console.error("Error getting hint:", error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при получении подсказки",
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
        Получить подсказку
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Подсказка</DialogTitle>
            <DialogDescription>
              {hintHistory.length >= 3 ? (
                <div className="text-amber-600">
                  Вы достигли лимита подсказок для этой задачи (3 в 24 часа).
                </div>
              ) : (
                <div>
                  Использовано {hintHistory.length}/3 подсказок за последние 24 часа.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            {hintHistory.map((h, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-md">
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(h.created_at).toLocaleString()}:
                </div>
                <div className="whitespace-pre-wrap">{h.generated_hint}</div>
              </div>
            ))}
            
            {hint && hintHistory.length === 0 && (
              <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                {hint}
              </div>
            )}
            
            {hintHistory.length === 0 && !hint && (
              <div className="p-3 bg-gray-50 rounded-md">
                Загрузка подсказки...
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
