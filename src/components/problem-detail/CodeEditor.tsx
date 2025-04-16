
import { useState } from "react";
import { Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" }
];

export function CodeEditor({
  code,
  language,
  isRunning,
  isSubmitting,
  testResults,
  onCodeChange,
  onLanguageChange,
  onReset,
  onRun,
  onSubmit
}: CodeEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Редактор кода</h3>
        <div className="flex items-center space-x-2">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Выберите язык" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-lg">
        <Textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="font-mono text-gray-100 bg-transparent p-4 min-h-[300px] w-full border-none focus-visible:ring-0"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onReset}>
          Сбросить
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700"
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
              <CheckCircle className="mr-2 h-4 w-4" />
              Отправить решение
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
