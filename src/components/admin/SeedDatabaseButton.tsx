
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ensureProblemsExist, countProblems } from "@/services/seedProblemsService";
import { ensureCoursesExist, countCourses } from "@/services/seedCoursesService";
import { DatabaseIcon } from "lucide-react";

export function SeedDatabaseButton() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSeedDatabase = async () => {
    setIsLoading(true);
    try {
      const [problemCount, courseCount] = await Promise.all([
        countProblems(),
        countCourses()
      ]);
      
      if (problemCount > 0 && courseCount > 0) {
        toast({
          title: "База данных уже содержит данные",
          description: `В базе данных уже есть ${problemCount} задач и ${courseCount} курсов.`,
        });
        return;
      }
      
      await Promise.all([
        ensureProblemsExist(),
        ensureCoursesExist()
      ]);
      
      toast({
        title: "Демонстрационные данные добавлены",
        description: "Задачи и курсы были успешно добавлены в базу данных.",
      });
    } catch (error) {
      console.error("Error seeding database:", error);
      toast({
        title: "Ошибка добавления данных",
        description: "Произошла ошибка при добавлении демонстрационных данных.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSeedDatabase}
      disabled={isLoading}
    >
      <DatabaseIcon className="mr-2 h-4 w-4" />
      {isLoading ? "Добавление данных..." : "Добавить демонстрационные данные"}
    </Button>
  );
}
