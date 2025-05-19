
import { useState, useEffect } from "react";
import { useProblems } from "@/services/problemsService";
import { useToast } from "@/hooks/use-toast";
import { ensureProblemsExist } from "@/services/seedProblemsService";
import { useTranslation } from "react-i18next";

export function useProblemsData() {
  const { data: problems, isLoading, error, refetch } = useProblems();
  const [filteredProblems, setFilteredProblems] = useState(problems || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const checkProblems = async () => {
      try {
        const hasAddedProblems = await ensureProblemsExist();
        if (hasAddedProblems) {
          toast({
            title: t("problems.demoProblemAdded") || "Демонстрационные задачи добавлены",
            description: t("problems.demoAddedDescription") || "В базу данных были автоматически добавлены демонстрационные задачи.",
          });
          // Обновляем список задач после добавления
          refetch();
        }
      } catch (error) {
        console.error("Error checking/adding problems:", error);
      }
    };

    checkProblems();
  }, [refetch, toast, t]);

  useEffect(() => {
    if (problems) {
      let filtered = [...problems];

      // Apply difficulty filter
      if (difficultyFilter !== "all") {
        filtered = filtered.filter(problem => problem.difficulty === difficultyFilter);
      }

      // Apply search filter
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          problem =>
            problem.title.toLowerCase().includes(term) ||
            problem.tags.some(tag => tag.toLowerCase().includes(term))
        );
      }

      // Apply sort
      filtered.sort((a, b) => {
        let valueA, valueB;

        switch (sortField) {
          case "title":
            valueA = a.title;
            valueB = b.title;
            break;
          case "difficulty":
            const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
            valueA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
            valueB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
            break;
          case "acceptance_rate":
            valueA = a.acceptance_rate || 0;
            valueB = b.acceptance_rate || 0;
            break;
          default: // id is default
            valueA = a.id;
            valueB = b.id;
        }

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });

      setFilteredProblems(filtered);
    }
  }, [problems, searchTerm, difficultyFilter, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return {
    problems,
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
    refetch,
  };
}
