
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Check,
  CheckCircle2, 
  Clock,
  Tag,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProblems } from "@/services/problemsService";

const difficultyColors = {
  Easy: "text-green-500",
  Medium: "text-yellow-500",
  Hard: "text-red-500"
};

const ProblemsPage = () => {
  const { user } = useAuth();
  const { data: problems, isLoading } = useProblems();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSolved, setShowSolved] = useState<boolean>(true);
  const [showUnsolved, setShowUnsolved] = useState<boolean>(true);

  // Получаем все уникальные теги из задач
  const allTags = problems 
    ? Array.from(new Set(problems.flatMap(problem => problem.tags))).sort()
    : [];

  // Фильтруем задачи
  const filteredProblems = problems?.filter(problem => {
    // Фильтр по поисковому запросу
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Фильтр по сложности
    const matchesDifficulty = selectedDifficulty.length === 0 || 
      selectedDifficulty.includes(problem.difficulty);
    
    // Фильтр по тегам
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => problem.tags.includes(tag));
    
    // В реальном приложении здесь был бы фильтр по статусу "решено/не решено"
    // Для демонстрации просто всегда возвращаем true
    const matchesSolved = true;
    
    return matchesSearch && matchesDifficulty && matchesTags && matchesSolved;
  }) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Каталог задач</h1>
        
        {/* Поиск и фильтры */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Поиск задач..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            {/* Фильтр по сложности */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Сложность
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {["Easy", "Medium", "Hard"].map(difficulty => (
                  <DropdownMenuCheckboxItem
                    key={difficulty}
                    checked={selectedDifficulty.includes(difficulty)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedDifficulty([...selectedDifficulty, difficulty]);
                      } else {
                        setSelectedDifficulty(selectedDifficulty.filter(d => d !== difficulty));
                      }
                    }}
                    className={difficultyColors[difficulty as keyof typeof difficultyColors]}
                  >
                    {difficulty}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Фильтр по тегам */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  Теги
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 max-h-80 overflow-y-auto">
                {allTags.map(tag => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTags([...selectedTags, tag]);
                      } else {
                        setSelectedTags(selectedTags.filter(t => t !== tag));
                      }
                    }}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Фильтр по статусу решения (если пользователь авторизован) */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Статус
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuCheckboxItem
                    checked={showSolved}
                    onCheckedChange={(checked) => setShowSolved(!!checked)}
                  >
                    Решенные
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={showUnsolved}
                    onCheckedChange={(checked) => setShowUnsolved(!!checked)}
                  >
                    Нерешенные
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        {/* Список задач */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProblems.length > 0 ? (
              filteredProblems.map(problem => (
                <Link to={`/problems/${problem.id}`} key={problem.id}>
                  <Card className="hover:border-primary hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <h3 className="font-semibold">{problem.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {problem.description.replace(/<[^>]*>/g, '')}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {problem.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={difficultyColors[problem.difficulty as keyof typeof difficultyColors]}>
                            {problem.difficulty}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{problem.acceptance_rate}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Задачи, соответствующие выбранным фильтрам, не найдены.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDifficulty([]);
                    setSelectedTags([]);
                    setShowSolved(true);
                    setShowUnsolved(true);
                  }}
                >
                  Сбросить все фильтры
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemsPage;
