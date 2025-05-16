
import { Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TestResult } from "@/services/codeExecutionService";

interface CodeEditorProps {
  code: string;
  language: string;
  isRunning: boolean;
  isSubmitting: boolean;
  testResults: TestResult[];
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onReset: () => void;
  onRun: () => void;
  onSubmit: () => void;
}

export function CodeEditor({
  code,
  isRunning,
  isSubmitting,
  onCodeChange,
  onRun,
  onSubmit
}: CodeEditorProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-lg">
        <Textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="font-mono text-gray-100 bg-transparent p-4 min-h-[300px] w-full border-none focus-visible:ring-0"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button 
          variant="outline"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-base"
          onClick={onRun}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
              Выполнение...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Запустить код
            </>
          )}
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-base"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
              Отправка...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Отправить решение
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
