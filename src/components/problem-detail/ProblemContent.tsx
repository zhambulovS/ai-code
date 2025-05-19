import { ProblemDescription } from "@/components/problem-detail/ProblemDescription";
import { CodeEditorToolbar } from "@/components/problem-detail/CodeEditorToolbar";
import { CodeEditor } from "@/components/problem-detail/CodeEditor";
import { TestResults } from "@/components/problem-detail/TestResults";
import { TestResult } from "@/services/codeExecutionService";
import codeTemplates from "@/components/problem-detail/codeTemplates";
import { HintButton } from "@/components/problem-detail/hints";

interface ProblemContentProps {
  problemId: number;
  description: string;
  testCases: any[];
  timeLimit: number;
  memoryLimit: number;
  language: string;
  code: string;
  isRunning: boolean;
  isSubmitting: boolean;
  testResults: TestResult[];
  user: any;
  onLanguageChange: (language: string) => void;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onSubmit: () => void;
}

export function ProblemContent({
  problemId,
  description,
  testCases,
  timeLimit,
  memoryLimit,
  language,
  code,
  isRunning,
  isSubmitting,
  testResults,
  user,
  onLanguageChange,
  onCodeChange,
  onRun,
  onSubmit
}: ProblemContentProps) {
  return (
    <div className="space-y-6">
      <ProblemDescription 
        description={description}
        testCases={testCases}
        timeLimit={timeLimit}
        memoryLimit={memoryLimit}
      />
      
      <div className="space-y-4">
        <CodeEditorToolbar
          language={language}
          onLanguageChange={onLanguageChange}
          onReset={() => onCodeChange(codeTemplates[language as keyof typeof codeTemplates] || "")}
          problemId={problemId}
          code={code}
          testResults={testResults}
          isLoggedIn={!!user}
        />
        
        <CodeEditor 
          code={code}
          language={language}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
          testResults={testResults}
          onCodeChange={onCodeChange}
          onLanguageChange={onLanguageChange}
          onReset={() => onCodeChange(codeTemplates[language as keyof typeof codeTemplates] || "")}
          onRun={onRun}
          onSubmit={onSubmit}
        />
      </div>
      
      <TestResults 
        results={testResults} 
        isRunning={isRunning}
        onRerun={onRun}
      />
    </div>
  );
}
