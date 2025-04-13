
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Clock, 
  Tag, 
  ThumbsUp, 
  Award, 
  CheckCircle, 
  Play, 
  ChevronDown, 
  ChevronUp,
  Check,
  X,
  CpuIcon,
  TimerIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  useProblem, 
  useTestCases, 
  useUserSubmissions, 
  useSubmitSolution 
} from "@/services/problemsService";
import { executeCode, runTestCases } from "@/services/codeExecutionService";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" }
];

const difficultyColors = {
  Easy: "text-green-500",
  Medium: "text-yellow-500",
  Hard: "text-red-500"
};

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
  const [showHints, setShowHints] = useState(false);
  const [currentTab, setCurrentTab] = useState("problem");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: problem, isLoading: isLoadingProblem, error: problemError } = useProblem(problemId);
  const { data: testCases, isLoading: isLoadingTestCases } = useTestCases(problemId);
  const { data: submissions, isLoading: isLoadingSubmissions } = useUserSubmissions(problemId, user?.id || "");
  
  const submitMutation = useSubmitSolution();
  
  // Обновление шаблона кода при смене языка
  useEffect(() => {
    if (language in codeTemplates) {
      setCode(codeTemplates[language as keyof typeof codeTemplates]);
    }
  }, [language]);
  
  // Если ID проблемы некорректный или проблема не найдена
  if (problemError || (problemId <= 0 && !isLoadingProblem)) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Проблема не найдена</h1>
        <p className="mb-6">Запрошенная проблема не существует или была удалена.</p>
        <Button onClick={() => navigate("/problems")}>Вернуться к списку задач</Button>
      </div>
    );
  }
  
  // Отображение загрузки
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
  
  // Функция запуска кода
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
      if (allPassed) {
        toast({
          title: "Успех!",
          description: "Ваш код прошел все тестовые примеры.",
          variant: "default"
        });
      } else {
        toast({
          title: "Некоторые тесты не пройдены",
          description: "Проверьте результаты выполнения тестов.",
          variant: "default"
        });
      }
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
  
  // Функция отправки решения
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
      // Сначала запускаем тесты
      const results = await runTestCases(code, language, testCases || []);
      const allPassed = results.every(r => r.passed);
      
      // Отправляем решение в базу данных
      await submitMutation.mutateAsync({
        user_id: user.id,
        problem_id: problemId,
        code,
        language,
        status: allPassed ? "accepted" : "wrong_answer",
        execution_time: Math.max(...results.map(r => r.executionTime), 0),
        memory_used: Math.floor(Math.random() * 10000) // Симуляция
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
  
  // Проверка, решена ли задача пользователем
  const isSolved = submissions?.some(s => s.status === "accepted") || false;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Заголовок проблемы */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold flex items-center">
            {isSolved && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
            <span className="mr-2">{problem.id}.</span>
            {problem.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className={`font-medium ${difficultyColors[problem.difficulty as keyof typeof difficultyColors]}`}>
              {problem.difficulty}
            </span>
            
            <div className="flex items-center text-gray-500">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{problem.acceptance_rate}%</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {problem.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Вкладки */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="problem">Задача</TabsTrigger>
            <TabsTrigger value="submissions">Отправленные решения</TabsTrigger>
          </TabsList>
          
          {/* Вкладка с описанием задачи */}
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
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Редактор кода</h3>
                <div className="flex items-center space-x-2">
                  <Select value={language} onValueChange={(value) => {
                    setLanguage(value);
                    setCode(codeTemplates[value as keyof typeof codeTemplates] || "");
                  }}>
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
              
              <Card className="bg-gray-900">
                <CardContent className="p-0">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono text-gray-100 bg-transparent p-4 min-h-[300px] w-full border-none focus-visible:ring-0"
                  />
                </CardContent>
              </Card>
              
              {testResults.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-3">Результаты тестирования</h3>
                    <div className="space-y-3">
                      {testResults.map((result, index) => (
                        <div key={index} className={`border rounded-md p-3 ${result.passed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Тест {index + 1}</span>
                            <div className="flex items-center">
                              {result.passed ? (
                                <Check className="h-5 w-5 text-green-500 mr-1" />
                              ) : (
                                <X className="h-5 w-5 text-red-500 mr-1" />
                              )}
                              <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                                {result.passed ? 'Пройден' : 'Не пройден'}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Вход:</span> {result.testCase.input.replace(/\n/g, ', ')}</div>
                            <div><span className="font-medium">Ваш вывод:</span> {result.output}</div>
                            <div><span className="font-medium">Ожидаемый вывод:</span> {result.expected}</div>
                            <div className="flex items-center mt-1">
                              <TimerIcon className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="text-gray-600">Время выполнения: {result.executionTime} мс</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => {
                  setCode(codeTemplates[language as keyof typeof codeTemplates] || "");
                }}>
                  Сбросить
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleRunCode}
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
                  onClick={handleSubmit}
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
          </TabsContent>
          
          {/* Вкладка с отправленными решениями */}
          <TabsContent value="submissions" className="space-y-6">
            {!user ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4">Чтобы видеть историю своих решений, необходимо войти в систему.</p>
                  <Button onClick={() => navigate("/login")}>Войти</Button>
                </CardContent>
              </Card>
            ) : isLoadingSubmissions ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : submissions && submissions.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left">Статус</th>
                          <th className="px-4 py-3 text-left">Язык</th>
                          <th className="px-4 py-3 text-left">Время</th>
                          <th className="px-4 py-3 text-left">Память</th>
                          <th className="px-4 py-3 text-left">Дата отправки</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {submissions.map((submission) => (
                          <tr key={submission.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                submission.status === "accepted" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {submission.status === "accepted" ? "Принято" : "Ошибка"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{submission.language}</td>
                            <td className="px-4 py-3 text-sm">{submission.execution_time || "N/A"} мс</td>
                            <td className="px-4 py-3 text-sm">{submission.memory_used ? `${(submission.memory_used / 1024).toFixed(2)} МБ` : "N/A"}</td>
                            <td className="px-4 py-3 text-sm">
                              {new Date(submission.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>У вас еще нет решений для этой задачи.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
