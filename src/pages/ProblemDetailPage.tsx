
import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Clock, 
  Tag, 
  ThumbsUp, 
  Award, 
  CheckCircle, 
  Play, 
  ChevronDown, 
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dummy problem data
const problem = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy",
  tags: ["Arrays", "Hash Table"],
  acceptance: "67%",
  description: `<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
                <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
                <p>You can return the answer in any order.</p>`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
      explanation: ""
    }
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists."
  ],
  hints: [
    "Try using a hash map to store the elements you've processed so far.",
    "For each element, check if its complement (target - element) exists in the hash map."
  ],
  solutions: [
    {
      language: "JavaScript",
      code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [-1, -1]; // No solution found
};`
    },
    {
      language: "Python",
      code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        numMap = {}
        
        for i, num in enumerate(nums):
            complement = target - num
            
            if complement in numMap:
                return [numMap[complement], i]
            
            numMap[num] = i
        
        return [-1, -1]  # No solution found`
    },
    {
      language: "Java",
      code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            
            map.put(nums[i], i);
        }
        
        return new int[] { -1, -1 }; // No solution found
    }
}`
    },
    {
      language: "C++",
      code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            
            map[nums[i]] = i;
        }
        
        return {-1, -1}; // No solution found
    }
};`
    }
  ]
};

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" }
];

const difficultyColors = {
  Easy: "text-green-500",
  Medium: "text-yellow-500",
  Hard: "text-red-500"
};

const ProblemDetailPage = () => {
  const { id } = useParams();
  const [language, setLanguage] = useState("javascript");
  const [showHints, setShowHints] = useState(false);
  const [currentTab, setCurrentTab] = useState("problem");
  
  // In a real application, we would fetch the problem based on the ID
  // const problem = fetchProblem(id);
  
  if (!problem) {
    return <div className="container mx-auto px-4 py-8">Problem not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Problem header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="mr-2">{problem.id}.</span>
            {problem.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className={`font-medium ${difficultyColors[problem.difficulty as keyof typeof difficultyColors]}`}>
              {problem.difficulty}
            </span>
            
            <div className="flex items-center text-gray-500">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{problem.acceptance}</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {problem.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="problem">Problem</TabsTrigger>
            <TabsTrigger value="solution">Solution</TabsTrigger>
          </TabsList>
          
          {/* Problem Description Tab */}
          <TabsContent value="problem" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: problem.description }} />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Examples:</h3>
                    
                    {problem.examples.map((example, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-md">
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Input:</span> {example.input}
                          </div>
                          <div>
                            <span className="font-medium">Output:</span> {example.output}
                          </div>
                          {example.explanation && (
                            <div>
                              <span className="font-medium">Explanation:</span> {example.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Constraints:</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {problem.constraints.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {problem.hints && problem.hints.length > 0 && (
                    <div>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowHints(!showHints)}
                        className="flex items-center"
                      >
                        {showHints ? "Hide Hints" : "Show Hints"}
                        {showHints ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                      
                      {showHints && (
                        <div className="mt-4 space-y-2">
                          {problem.hints.map((hint, index) => (
                            <div key={index} className="bg-yellow-50 p-3 rounded-md">
                              <p className="text-sm">
                                <span className="font-medium">Hint {index + 1}:</span> {hint}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Code Editor</h3>
                <div className="flex items-center space-x-2">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Card className="bg-gray-900 text-gray-100">
                <CardContent className="p-0">
                  <pre className="p-4 overflow-x-auto">
                    <code>{`// Your ${languages.find(l => l.value === language)?.label} solution here...`}</code>
                  </pre>
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline">Reset</Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Play className="mr-2 h-4 w-4" />
                  Run Code
                </Button>
                <Button>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Solution Tab */}
          <TabsContent value="solution" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Solution Approach</h3>
                  <div className="prose max-w-none">
                    <p>
                      We can use a hash map to solve this problem with O(n) time complexity:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Create an empty hash map to store elements and their indices.</li>
                      <li>Iterate through the array.</li>
                      <li>For each element, calculate the complement (target - current element).</li>
                      <li>If the complement exists in the hash map, we've found our solution.</li>
                      <li>Otherwise, add the current element and its index to the hash map.</li>
                    </ol>
                    <p className="mt-4">
                      This approach is efficient because hash map lookups are O(1) on average, 
                      making the overall time complexity O(n) where n is the number of elements in the array.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Code Solutions</h3>
                    
                    <div className="flex justify-end">
                      <Select 
                        value={language} 
                        onValueChange={setLanguage}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          {problem.solutions.map(sol => (
                            <SelectItem key={sol.language.toLowerCase()} value={sol.language.toLowerCase()}>
                              {sol.language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Card className="bg-gray-900 text-gray-100">
                      <CardContent className="p-0">
                        <pre className="p-4 overflow-x-auto">
                          <code>
                            {problem.solutions.find(
                              sol => sol.language.toLowerCase() === language
                            )?.code || 
                            problem.solutions[0].code}
                          </code>
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Complexity Analysis</h3>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="font-medium">Time Complexity:</span> O(n) - We iterate through the array once.
                      </div>
                      <div>
                        <span className="font-medium">Space Complexity:</span> O(n) - In the worst case, we might store all elements in the hash map.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
