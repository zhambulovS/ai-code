
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SeedDatabaseButton } from "@/components/admin/SeedDatabaseButton";
import { useProblemsData } from "@/hooks/useProblemsData";
import { ProblemFilters } from "@/components/problems/ProblemFilters";
import { ProblemsTable } from "@/components/problems/ProblemsTable";
import { ErrorDisplay } from "@/components/problems/ErrorDisplay";

export default function ProblemsPage() {
  const {
    filteredProblems,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    difficultyFilter,
    setDifficultyFilter,
    sortField,
    sortOrder,
    handleSort,
    refetch
  } = useProblemsData();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Задачи по программированию</CardTitle>
            <SeedDatabaseButton />
          </div>
        </CardHeader>
        <CardContent>
          <ProblemFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            difficultyFilter={difficultyFilter}
            setDifficultyFilter={setDifficultyFilter}
          />
          
          <ProblemsTable 
            problems={filteredProblems}
            isLoading={isLoading}
            sortField={sortField}
            sortOrder={sortOrder}
            handleSort={handleSort}
          />
        </CardContent>
      </Card>
    </div>
  );
}
