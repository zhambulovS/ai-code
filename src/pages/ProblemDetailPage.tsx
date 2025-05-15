
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProblemDetail } from "@/hooks/useProblemDetail";
import { ProblemHeader } from "@/components/problem-detail/ProblemHeader";
import { ProblemContent } from "@/components/problem-detail/ProblemContent";
import { SubmissionsTable } from "@/components/problem-detail/SubmissionsTable";
import { LoadingIndicator } from "@/components/problem-detail/LoadingIndicator";
import { ErrorDisplay } from "@/components/problem-detail/ErrorDisplay";

const ProblemDetailPage = () => {
  const {
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
    handleRunCode,
    handleSubmit
  } = useProblemDetail();

  if (problemError || (problemId <= 0 && !isLoadingProblem)) {
    return <ErrorDisplay onReturn={() => navigate("/problems")} />;
  }
  
  if (isLoadingProblem) {
    return <LoadingIndicator />;
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
          
          <TabsContent value="problem">
            <ProblemContent 
              problemId={problemId}
              description={problem.description}
              testCases={testCases || []}
              timeLimit={problem.time_limit}
              memoryLimit={problem.memory_limit}
              language={language}
              code={code}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              testResults={testResults}
              user={user}
              onLanguageChange={setLanguage}
              onCodeChange={setCode}
              onRun={handleRunCode}
              onSubmit={handleSubmit}
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
