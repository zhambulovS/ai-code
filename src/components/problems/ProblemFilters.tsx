
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface ProblemFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (value: string) => void;
}

export function ProblemFilters({
  searchTerm,
  setSearchTerm,
  difficultyFilter,
  setDifficultyFilter
}: ProblemFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t("problems.searchPlaceholder") || "Поиск по названию или тегам..."}
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
            <SelectValue placeholder={t("problems.difficulty") || "Сложность"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("problems.all") || "Все"}</SelectItem>
            <SelectItem value="easy">{t("problems.easy") || "Легкий"}</SelectItem>
            <SelectItem value="medium">{t("problems.medium") || "Средний"}</SelectItem>
            <SelectItem value="hard">{t("problems.hard") || "Сложный"}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
