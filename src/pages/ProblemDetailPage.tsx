import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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

const codeTemplates = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Ваше решение здесь
}`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Ваше решение здесь
        pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Ваше решение здесь
        return new int[]{0, 0};
    }
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Ваше решение здесь
        return {0, 0};
    }
};`,
  csharp: `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // Ваше решение здесь
        return new int[]{0, 0};
    }
}`
};

const ProblemDetailPage = () => {
  const { id } = useParams();
  const problemId = parseInt(id || "0", 10);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(codeTemplates.javascript);
  const [currentTab, setCurrentTab] = useState("problem");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: problem, isLoading: isLoadingProblem, error: problemError } = useProblem(problemId);
  const { data: testCases, isLoading: isLoadingTestCases } = useTestCases(problemId);
  const { data: submissions, isLoading: isLoadingSubmissions } = useUserSubmissions(problemId, user?.id || "");
  
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
      const results = await runTestCases(code, language, testCases);
      setTestResults(results);
      
      const allPassed = results.every(r => r.passed);
      toast({
        title: allPassed ? "Успех!" : "Некоторые тесты не пройдены",
        description: allPassed 
          ? "Ваш код прошел все тестовые примеры."
          : "Проверьте результаты выполнения тестов.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Ошибка выполнения",
        description: error instanceof Error ? error.message : "Произошла неизвестная ошибка при выполнении кода",
        variant: "destructive"
      });
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
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const results = await runTestCases(code, language, testCases || []);
      const allPassed = results.every(r => r.passed);
      
      await submitMutation.mutateAsync({
        user_id: user.id,
        problem_id: problemId,
        code,
        language,
        status: allPassed ? "accepted" : "wrong_answer",
        execution_time: Math.max(...results.map(r => r.executionTime), 0),
        memory_used: Math.floor(Math.random() * 10000)
      });
      
      toast({
        title: allPassed ? "Решение принято!" : "Решение отправлено, но не все тесты пройдены",
        description: allPassed 
          ? "Поздравляем! Ваше решение было принято."
          : "Ваше решение было сохранено, но не все тесты были пройдены.",
        variant: allPassed ? "default" : "destructive"
      });
      
      setTestResults(results);
    } catch (error) {
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
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: problem.description }} />
                  
                  {testCases && testCases.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Примеры:</h3>
                      
                      {testCases.map((example, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-md">
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Вход:</span> {example.input.replace(/\n/g, ', ')}
                            </div>
                            <div>
                              <span className="font-medium">Ожидаемый выход:</span> {example.expected_output}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold">Ограничения:</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Ограничение по времени: {problem.time_limit} мс</li>
                      <li>Ограничение по памяти: {problem.memory_limit / 1024} МБ</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
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
            
            <TestResults results={testResults} />
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
