
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Check,
  CheckCircle2, 
  Clock,
  Tag
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

// Dummy data for problems
const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Arrays", "Hash Table"],
    solved: true,
    acceptance: "67%",
    description: "Find two numbers in an array that add up to a specific target."
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    solved: false,
    acceptance: "62%",
    description: "Determine if the input string has valid parentheses ordering."
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hash Table"],
    solved: false,
    acceptance: "54%",
    description: "Find the length of the longest substring without repeating characters."
  },
  {
    id: 4,
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    tags: ["Linked List", "Divide and Conquer", "Heap"],
    solved: false,
    acceptance: "45%",
    description: "Merge k sorted linked lists into one sorted linked list."
  },
  {
    id: 5,
    title: "Maximum Subarray",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
    solved: true,
    acceptance: "58%",
    description: "Find the contiguous subarray which has the largest sum."
  },
  {
    id: 6,
    title: "LRU Cache",
    difficulty: "Medium",
    tags: ["Hash Table", "Linked List", "Design"],
    solved: false,
    acceptance: "40%",
    description: "Design and implement a data structure for Least Recently Used (LRU) cache."
  },
  {
    id: 7,
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    tags: ["Heap", "Design"],
    solved: false,
    acceptance: "38%",
    description: "Design a data structure that supports finding the median of a stream of numbers."
  },
  {
    id: 8,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    solved: false,
    acceptance: "35%",
    description: "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining."
  }
];

// All available tags from problems
const allTags = Array.from(
  new Set(problems.flatMap(problem => problem.tags))
).sort();

const difficultyColors = {
  Easy: "text-green-500",
  Medium: "text-yellow-500",
  Hard: "text-red-500"
};

const ProblemsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSolved, setShowSolved] = useState<boolean>(true);
  const [showUnsolved, setShowUnsolved] = useState<boolean>(true);

  // Filter problems based on search term, difficulty, and tags
  const filteredProblems = problems.filter(problem => {
    // Filter by search term
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by difficulty
    const matchesDifficulty = selectedDifficulty.length === 0 || 
      selectedDifficulty.includes(problem.difficulty);
    
    // Filter by tags
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => problem.tags.includes(tag));
    
    // Filter by solved status
    const matchesSolved = 
      (showSolved && problem.solved) || 
      (showUnsolved && !problem.solved);
    
    return matchesSearch && matchesDifficulty && matchesTags && matchesSolved;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Problem Catalog</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search problems..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            {/* Difficulty filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Difficulty
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

            {/* Tags filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  Tags
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

            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Status
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={showSolved}
                  onCheckedChange={(checked) => setShowSolved(!!checked)}
                >
                  Solved
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showUnsolved}
                  onCheckedChange={(checked) => setShowUnsolved(!!checked)}
                >
                  Unsolved
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Problem list */}
        <div className="space-y-4">
          {filteredProblems.length > 0 ? (
            filteredProblems.map(problem => (
              <Link to={`/problems/${problem.id}`} key={problem.id}>
                <Card className="hover:border-primary hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          {problem.solved && (
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                          )}
                          <h3 className="font-semibold">{problem.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {problem.description}
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
                          <span>{problem.acceptance}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No problems found matching your filters.</p>
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
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
