
import { useNavigate } from "react-router-dom";
import { ArrowUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/SkeletonUI";
import { Problem } from "@/services/problemsService";

interface ProblemsTableProps {
  problems: Problem[];
  isLoading: boolean;
  sortField: string;
  sortOrder: "asc" | "desc";
  handleSort: (field: string) => void;
}

export function ProblemsTable({
  problems,
  isLoading,
  sortField,
  sortOrder,
  handleSort
}: ProblemsTableProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        return t("problems.easy") || "Легкий";
      case "medium":
        return t("problems.medium") || "Средний";
      case "hard":
        return t("problems.hard") || "Сложный";
      default:
        return difficulty;
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={10} columns={4} />;
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          {t("problems.noProblems") || "Нет задач, соответствующих заданным фильтрам."}
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">{t("problems.id") || "№"}</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
              <div className="flex items-center">
                {t("problems.title") || "Название"}
                {sortField === "title" && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("difficulty")}>
              <div className="flex items-center">
                {t("problems.difficulty") || "Сложность"}
                {sortField === "difficulty" && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>{t("problems.tags") || "Теги"}</TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort("acceptance_rate")}>
              <div className="flex items-center justify-end">
                {t("problems.acceptanceRate") || "Процент решения"}
                {sortField === "acceptance_rate" && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem) => (
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
  );
}
