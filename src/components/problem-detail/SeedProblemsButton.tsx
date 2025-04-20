
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ensureProblemsExist, countProblems } from "@/services/seedProblemsService";
import { DatabaseIcon } from "lucide-react";

export function SeedProblemsButton() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSeedProblems = async () => {
    setIsLoading(true);
    try {
      const problemCount = await countProblems();
      
      if (problemCount > 0) {
        toast({
          title: "База данных уже содержит задачи",
          description: `В базе данных уже есть ${problemCount} задач.`,
        });
        return;
      }
      
      await ensureProblemsExist();
      
      toast({
        title: "Задачи успешно добавлены",
        description: "Демонстрационные задачи были успешно добавлены в базу данных.",
      });
    } catch (error) {
      console.error("Error seeding problems:", error);
      toast({
        title: "Ошибка добавления задач",
        description: "Произошла ошибка при добавлении демонстрационных задач.",
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
      onClick={handleSeedProblems}
      disabled={isLoading}
    >
      <DatabaseIcon className="mr-2 h-4 w-4" />
      {isLoading ? "Добавление задач..." : "Добавить демонстрационные задачи"}
    </Button>
  );
}
