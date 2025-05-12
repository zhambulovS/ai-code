
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  useProblem, 
  useTestCases, 
  useUserSubmissions, 
  useSubmitSolution 
} from "@/services/problemsService";
import { ProblemHeader } from "@/components/problem-detail/ProblemHeader";
import { CodeEditor } from "@/components/problem-detail/CodeEditor";
import { TestResults } from "@/components/problem-detail/TestResults";
import { SubmissionsTable } from "@/components/problem-detail/SubmissionsTable";
import { runTestCases } from "@/services/codeExecutionService";
import { ProblemDescription } from "@/components/problem-detail/ProblemDescription";
import { CodeEditorToolbar } from "@/components/problem-detail/CodeEditorToolbar";
import codeTemplates from "@/components/problem-detail/codeTemplates";

const ProblemDetailPage = () => {
  const { id } = useParams();
  const problemId = parseInt(id || "0", 10);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(codeTemplates.javascript);
  const [currentTab, setCurrentTab] = useState("problem");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: problem, isLoading: isLoadingProblem, error: problemError } = useProblem(problemId);
  const { data: testCases, isLoading: isLoadingTestCases } = useTestCases(problemId);
  const { data: submissions, isLoading: isLoadingSubmissions, refetch: refetchSubmissions } = useUserSubmissions(problemId, user?.id || "");
  
  const submitMutation = useSubmitSolution();
  
  useEffect(() => {
    if (language in codeTemplates) {
      setCode(codeTemplates[language as keyof typeof codeTemplates]);
    }
  }, [language]);
  
  const handleRunCode = async () => {
    if (!testCases || testCases.length === 0) {
      toast({
        title: "Ошибка",
        description: "Нет доступных тестовых примеров для этой задачи.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    setTestResults([]);
    
    try {
      const results = await runTestCases(
        code, 
        language, 
        testCases,
        user ? problemId : undefined,
        user ? user.id : undefined
      );
      setTestResults(results);
      
      const allPassed = results.every(r => r.passed);
      toast({
        title: allPassed ? "Успех!" : "Некоторые тесты не пройдены",
        description: allPassed 
          ? "Ваш код прошел все тестовые примеры."
          : "Проверьте результаты выполнения тестов.",
        variant: allPassed ? "default" : "destructive"
      });
    } catch (error) {
      console.error("Error running tests:", error);
      toast({
        title: "Ошибка выполнения",
        description: error instanceof Error ? error.message : "Произошла неизвестная ошибка при выполнении кода",
        variant: "destructive"
      });
      setTestResults([{
        testCase: { input: "Error", expected_output: "N/A" },
        output: "Error: " + (error instanceof Error ? error.message : "Неизвестная ошибка"),
        expected: "N/A",
        passed: false,
        executionTime: 0,
        error: error instanceof Error ? error.message : "Неизвестная ошибка"
      }]);
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Необходимо войти в систему",
        description: "Чтобы отправить решение, необходимо войти в систему.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const results = await runTestCases(
        code, 
        language, 
        testCases || [],
        problemId,
        user.id
      );
      
      setTestResults(results);
      
      const allPassed = results.every(r => r.passed);
      
      await submitMutation.mutateAsync({
        user_id: user.id,
        problem_id: problemId,
        code,
        language,
        status: allPassed ? "accepted" : "wrong_answer",
        execution_time: Math.max(...results.map(r => r.executionTime), 0),
        memory_used: Math.max(...(results.map(r => r.memoryUsed || 0)), 0)
      });
      
      await refetchSubmissions();
      
      toast({
        title: allPassed ? "Решение принято!" : "Решение отправлено, но не все тесты пройдены",
        description: allPassed 
          ? "Поздравляем! Ваше решение было принято."
          : "Ваше решение было сохранено, но не все тесты были пройдены.",
        variant: allPassed ? "default" : "destructive"
      });
      
      if (allPassed) {
        setCurrentTab("submissions");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Ошибка отправки",
        description: error instanceof Error ? error.message : "Произошла неизвестная ошибка при отправке решения",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (problemError || (problemId <= 0 && !isLoadingProblem)) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Проблема не найдена</h1>
        <p className="mb-6">Запрошенная проблема не существует или была удалена.</p>
        <Button onClick={() => navigate("/problems")}>Вернуться к списку задач</Button>
      </div>
    );
  }
  
  if (isLoadingProblem) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!problem) {
    return <div className="container mx-auto px-4 py-8">Проблема не найдена</div>;
  }

  const isSolved = submissions?.some(s => s.status === "accepted") || false;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <ProblemHeader 
          id={problem.id}
          title={problem.title}
          difficulty={problem.difficulty}
          acceptance_rate={problem.acceptance_rate}
          tags={problem.tags}
          isSolved={isSolved}
        />
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="problem">Задача</TabsTrigger>
            <TabsTrigger value="submissions">Отправленные решения</TabsTrigger>
          </TabsList>
          
          <TabsContent value="problem" className="space-y-6">
            <ProblemDescription 
              description={problem.description}
              testCases={testCases || []}
              timeLimit={problem.time_limit}
              memoryLimit={problem.memory_limit}
            />
            
            <div className="space-y-4">
              <CodeEditorToolbar
                language={language}
                onLanguageChange={setLanguage}
                onReset={() => setCode(codeTemplates[language as keyof typeof codeTemplates] || "")}
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
                onCodeChange={setCode}
                onLanguageChange={setLanguage}
                onReset={() => setCode(codeTemplates[language as keyof typeof codeTemplates] || "")}
                onRun={handleRunCode}
                onSubmit={handleSubmit}
              />
            </div>
            
            <TestResults 
              results={testResults} 
              isRunning={isRunning}
              onRerun={handleRunCode}
            />
          </TabsContent>
          
          <TabsContent value="submissions">
            <SubmissionsTable 
              submissions={submissions}
              isLoading={isLoadingSubmissions}
              user={user}
              onLogin={() => navigate("/login")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
