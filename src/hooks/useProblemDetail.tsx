
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  useProblem, 
  useTestCases, 
  useUserSubmissions, 
  useSubmitSolution 
} from "@/services/problemsService";
import { runTestCases } from "@/services/codeExecutionService";
import codeTemplates from "@/components/problem-detail/codeTemplates";

export function useProblemDetail() {
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
  
  // Set the initial code template when language changes
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

  return {
    problemId,
    navigate,
    user,
    language,
    code,
    currentTab,
    testResults,
    isRunning,
    isSubmitting,
    problem,
    isLoadingProblem,
    problemError,
    testCases,
    isLoadingTestCases,
    submissions,
    isLoadingSubmissions,
    setLanguage,
    setCode,
    setCurrentTab,
    setTestResults,
    handleRunCode,
    handleSubmit
  };
}
