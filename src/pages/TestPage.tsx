
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchTestById,
  fetchTestQuestions,
  submitTestAttempt,
  fetchCourseById
} from "@/services/coursesService";

export default function TestPage() {
  const { courseId, testId } = useParams<{ courseId: string; testId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to take tests",
        variant: "destructive"
      });
      navigate("/login", { state: { from: `/courses/${courseId}/tests/${testId}` } });
    }
  }, [user, courseId, testId, navigate, toast]);

  // Fetch test data
  const { data: test, isLoading: isLoadingTest } = useQuery({
    queryKey: ['test', testId],
    queryFn: () => fetchTestById(testId || ''),
    enabled: !!testId && !!user,
  });

  // Fetch course data
  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId || ''),
    enabled: !!courseId && !!user,
  });

  // Fetch test questions
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['testQuestions', testId],
    queryFn: () => fetchTestQuestions(testId || ''),
    enabled: !!testId && !!user,
  });

  // Submit test attempt
  const { mutate: submitTest, isPending: isSubmitting } = useMutation({
    mutationFn: () => submitTestAttempt(testId || '', user?.id || '', answers),
    onSuccess: (data) => {
      setTestResult(data);
      setShowResults(true);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['courseProgress', courseId, user?.id] });
      
      toast({
        title: data.passed ? "Test passed!" : "Test not passed",
        description: `Your score: ${data.score}%`,
        variant: data.passed ? "default" : "destructive"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit test",
        variant: "destructive"
      });
    }
  });

  const isLoading = isLoadingTest || isLoadingQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    // Check if all questions have been answered
    const answeredCount = Object.keys(answers).length;
    
    if (answeredCount < questions.length) {
      toast({
        title: "Incomplete test",
        description: `Please answer all questions before submitting. ${answeredCount}/${questions.length} answered.`,
        variant: "destructive"
      });
      return;
    }
    
    submitTest();
  };

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Test not found</h1>
        <p className="mb-6">The test you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate(`/courses/${courseId}`)}>
          Back to Course
        </Button>
      </div>
    );
  }

  // If showing results
  if (showResults && testResult) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Course
        </Button>
        
        <Card className="mb-6">
          <CardHeader className={testResult.passed ? "bg-green-50" : "bg-red-50"}>
            <CardTitle className="flex items-center">
              {testResult.passed ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  Test Passed!
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500 mr-2" />
                  Test Not Passed
                </>
              )}
            </CardTitle>
            <CardDescription>
              Your Score: {testResult.score}% (Passing Score: {test.passing_score}%)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Progress value={testResult.score} className="h-2" />
            </div>
            
            <div className="space-y-8 mt-8">
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correct_answer;
                
                return (
                  <div key={question.id} className={`p-4 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                    <h3 className="font-medium mb-2">
                      Question {index + 1}: {question.question}
                    </h3>
                    
                    <div className="ml-6 mt-3 space-y-2">
                      {Object.entries(question.options).map(([key, value]) => (
                        <div key={key} className={`
                          p-2 rounded flex items-start
                          ${key === question.correct_answer ? 'bg-green-100' : 
                            key === userAnswer && key !== question.correct_answer ? 'bg-red-100' : ''}
                        `}>
                          <div className="mr-2 mt-0.5">
                            {key === question.correct_answer ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : key === userAnswer && key !== question.correct_answer ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border border-gray-300"></div>
                            )}
                          </div>
                          <div>
                            <span className="font-medium">{key}:</span> {value as string}
                            {key === question.correct_answer && key !== userAnswer && (
                              <div className="text-sm text-green-600 mt-1">
                                This is the correct answer
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-md">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div>
                            <span className="font-medium">Explanation:</span>
                            <p className="mt-1">{question.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => {
              setShowResults(false);
              setAnswers({});
              setCurrentQuestionIndex(0);
            }}>
              Retake Test
            </Button>
            
            <Button onClick={() => navigate(`/courses/${courseId}`)}>
              Back to Course
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(`/courses/${courseId}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Course
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>{test.title}</CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              {currentQuestion && (
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h3>
                  
                  <p className="mb-6">{currentQuestion.question}</p>
                  
                  <RadioGroup
                    value={answers[currentQuestion.id] || ""}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                        <RadioGroupItem value={key} id={`option-${key}`} />
                        <Label htmlFor={`option-${key}`} className="flex-grow cursor-pointer">
                          <span className="font-medium">{key}:</span> {value as string}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
              
              {currentQuestionIndex === questions.length - 1 ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Test"}
                </Button>
              ) : (
                <Button
                  onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
                  disabled={!answers[currentQuestion?.id]}
                >
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Progress</CardTitle>
              <CardDescription>
                {Object.keys(answers).length} of {questions.length} questions answered
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <Progress 
                  value={(Object.keys(answers).length / questions.length) * 100} 
                  className="h-2" 
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2 mt-4">
                {questions.map((q, index) => (
                  <Button
                    key={q.id}
                    variant={currentQuestionIndex === index ? "default" : answers[q.id] ? "outline" : "secondary"}
                    size="sm"
                    className={`w-10 h-10 p-0 ${answers[q.id] ? "border-green-500" : ""}`}
                    onClick={() => navigateToQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
            
            <CardFooter>
              <div className="text-sm">
                <p className="font-medium">Passing score: {test.passing_score}%</p>
                <p className="text-muted-foreground mt-1">
                  You must answer correctly to get a passing grade.
                </p>
              </div>
            </CardFooter>
          </Card>
          
          {course && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">About this course</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium">{course.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{course.difficulty}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
