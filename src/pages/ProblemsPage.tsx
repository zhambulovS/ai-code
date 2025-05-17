
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProblems } from "@/services/problemsService";
import { Check, Search, Filter, ArrowUpDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SeedDatabaseButton } from "@/components/admin/SeedDatabaseButton";
import { useToast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/SkeletonUI";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ensureProblemsExist } from "@/services/seedProblemsService";

export default function ProblemsPage() {
  const { data: problems, isLoading, error, refetch } = useProblems();
  const [filteredProblems, setFilteredProblems] = useState(problems || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkProblems = async () => {
      try {
        const hasAddedProblems = await ensureProblemsExist();
        if (hasAddedProblems) {
          toast({
            title: "Демонстрационные задачи добавлены",
            description: "В базу данных были автоматически добавлены демонстрационные задачи.",
          });
          // Обновляем список задач после добавления
          refetch();
        }
      } catch (error) {
        console.error("Error checking/adding problems:", error);
      }
    };

    checkProblems();
  }, [refetch, toast]);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Легкий";
      case "medium":
        return "Средний";
      case "hard":
        return "Сложный";
      default:
        return difficulty;
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Ошибка загрузки задач</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Произошла ошибка при загрузке задач. Пожалуйста, попробуйте позже.</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => refetch()}>Повторить попытку</Button>
            </div>
            <div className="flex justify-center mt-4">
              <SeedDatabaseButton />
            </div>
          </CardContent>
        </Card>
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
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск по названию или тегам..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:w-40">
              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Сложность" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="easy">Легкий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="hard">Сложный</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <TableSkeleton rows={10} columns={4} />
          ) : filteredProblems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                {problems?.length === 0
                  ? "В базе данных нет задач. Используйте кнопку выше, чтобы добавить демонстрационные задачи."
                  : "Нет задач, соответствующих заданным фильтрам."}
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">№</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                      <div className="flex items-center">
                        Название
                        {sortField === "title" && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("difficulty")}>
                      <div className="flex items-center">
                        Сложность
                        {sortField === "difficulty" && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Теги</TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort("acceptance_rate")}>
                      <div className="flex items-center justify-end">
                        Процент решения
                        {sortField === "acceptance_rate" && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProblems.map((problem) => (
                    <TableRow
                      key={problem.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/problems/${problem.id}`)}
                    >
                      <TableCell className="font-medium text-center">{problem.id}</TableCell>
                      <TableCell>{problem.title}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {getDifficultyLabel(problem.difficulty)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {problem.acceptance_rate ? `${problem.acceptance_rate.toFixed(1)}%` : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
