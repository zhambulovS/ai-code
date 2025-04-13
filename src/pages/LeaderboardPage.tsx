
import { useState } from "react";
import { 
  Trophy, 
  ChevronUp, 
  ChevronDown, 
  User, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ListFilter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dummy leaderboard data
const users = [
  { 
    id: 1, 
    name: "Wei Zhang", 
    username: "weizhang", 
    rank: 1, 
    score: 9840, 
    problems: 342, 
    country: "China",
    institution: "Tsinghua University",
    change: 0,
    level: "Grandmaster"
  },
  { 
    id: 2, 
    name: "Sophia Johnson", 
    username: "sophiaj", 
    rank: 2, 
    score: 9720, 
    problems: 328, 
    country: "United States",
    institution: "MIT",
    change: 1,
    level: "Grandmaster"
  },
  { 
    id: 3, 
    name: "Raj Patel", 
    username: "rajp", 
    rank: 3, 
    score: 9615, 
    problems: 315, 
    country: "India",
    institution: "IIT Bombay",
    change: -1,
    level: "Grandmaster"
  },
  { 
    id: 4, 
    name: "Yuki Tanaka", 
    username: "yukit", 
    rank: 4, 
    score: 9540, 
    problems: 310, 
    country: "Japan",
    institution: "University of Tokyo",
    change: 0,
    level: "Master"
  },
  { 
    id: 5, 
    name: "Maria Garcia", 
    username: "mariag", 
    rank: 5, 
    score: 9480, 
    problems: 305, 
    country: "Spain",
    institution: "Universidad Politécnica de Madrid",
    change: 2,
    level: "Master"
  },
  { 
    id: 6, 
    name: "Alex Kim", 
    username: "alexk", 
    rank: 6, 
    score: 9350, 
    problems: 298, 
    country: "South Korea",
    institution: "Seoul National University",
    change: -1,
    level: "Master"
  },
  { 
    id: 7, 
    name: "Lucas Mueller", 
    username: "lucasm", 
    rank: 7, 
    score: 9280, 
    problems: 290, 
    country: "Germany",
    institution: "Technical University of Munich",
    change: 0,
    level: "Master"
  },
  { 
    id: 8, 
    name: "Emma Wilson", 
    username: "emmaw", 
    rank: 8, 
    score: 9150, 
    problems: 283, 
    country: "United Kingdom",
    institution: "University of Cambridge",
    change: 3,
    level: "Expert"
  },
  { 
    id: 9, 
    name: "Oleksandr Petrov", 
    username: "olekp", 
    rank: 9, 
    score: 9080, 
    problems: 275, 
    country: "Ukraine",
    institution: "Kyiv Polytechnic Institute",
    change: -1,
    level: "Expert"
  },
  { 
    id: 10, 
    name: "Aisha Rahman", 
    username: "aishar", 
    rank: 10, 
    score: 8950, 
    problems: 268, 
    country: "Bangladesh",
    institution: "Bangladesh University of Engineering and Technology",
    change: 1,
    level: "Expert"
  }
];

// User levels with colors
const levelColors = {
  "Newbie": "bg-gray-100 text-gray-800",
  "Beginner": "bg-green-100 text-green-800",
  "Intermediate": "bg-blue-100 text-blue-800",
  "Advanced": "bg-purple-100 text-purple-800",
  "Expert": "bg-yellow-100 text-yellow-800",
  "Master": "bg-orange-100 text-orange-800",
  "Grandmaster": "bg-red-100 text-red-800"
};

const LeaderboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("all-time");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState("global");
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-gray-600">
            Top competitive programmers ranked by their performance
          </p>
        </div>
        
        {/* Top 3 Podium */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 my-8">
          {/* Second Place */}
          <div className="flex flex-col items-center order-2 md:order-1">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-gray-300">
                <AvatarImage src="" alt={users[1].name} />
                <AvatarFallback className="bg-gray-200 text-gray-700 text-xl">
                  {users[1].name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="font-bold text-gray-700">2</span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <h3 className="font-semibold">{users[1].name}</h3>
              <p className="text-sm text-gray-600">{users[1].score} pts</p>
            </div>
            <div className="h-20 w-16 bg-gray-200 mt-2 rounded-t-lg"></div>
          </div>
          
          {/* First Place */}
          <div className="flex flex-col items-center order-1 md:order-2">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-yellow-400">
                <AvatarImage src="" alt={users[0].name} />
                <AvatarFallback className="bg-yellow-50 text-yellow-700 text-2xl">
                  {users[0].name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-3 text-center">
              <h3 className="font-semibold">{users[0].name}</h3>
              <p className="text-sm text-gray-600">{users[0].score} pts</p>
            </div>
            <div className="h-28 w-16 bg-yellow-300 mt-2 rounded-t-lg"></div>
          </div>
          
          {/* Third Place */}
          <div className="flex flex-col items-center order-3">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-amber-700">
                <AvatarImage src="" alt={users[2].name} />
                <AvatarFallback className="bg-amber-50 text-amber-800 text-xl">
                  {users[2].name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-amber-700 flex items-center justify-center">
                <span className="font-bold text-white">3</span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <h3 className="font-semibold">{users[2].name}</h3>
              <p className="text-sm text-gray-600">{users[2].score} pts</p>
            </div>
            <div className="h-16 w-16 bg-amber-600 mt-2 rounded-t-lg"></div>
          </div>
        </div>
        
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-start md:items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 min-w-[300px]">
                <Select
                  value={timeRange}
                  onValueChange={setTimeRange}
                >
                  <SelectTrigger className="w-full md:w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">This Week</SelectItem>
                    <SelectItem value="monthly">This Month</SelectItem>
                    <SelectItem value="yearly">This Year</SelectItem>
                    <SelectItem value="all-time">All Time</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={selectedRegion}
                  onValueChange={setSelectedRegion}
                >
                  <SelectTrigger className="w-full md:w-[140px]">
                    <ListFilter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="americas">Americas</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia-Pacific</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for different leaderboards */}
        <Tabs defaultValue="overall" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Contest</TabsTrigger>
            <TabsTrigger value="institutions">Institutions</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Leaderboard Table */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left pl-4">Rank</th>
                    <th className="py-3 text-left">User</th>
                    <th className="py-3 text-left">Score</th>
                    <th className="py-3 text-center hidden md:table-cell">Problems</th>
                    <th className="py-3 text-left hidden md:table-cell">Country</th>
                    <th className="py-3 text-left hidden md:table-cell">Institution</th>
                    <th className="py-3 text-center">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 pl-4">
                        <div className="flex items-center">
                          <span className="font-semibold">{user.rank}</span>
                          {user.change > 0 && (
                            <ChevronUp className="ml-1 text-green-500 h-4 w-4" />
                          )}
                          {user.change < 0 && (
                            <ChevronDown className="ml-1 text-red-500 h-4 w-4" />
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt={user.name} />
                            <AvatarFallback className="text-xs">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-semibold">{user.score}</td>
                      <td className="py-4 text-center hidden md:table-cell">{user.problems}</td>
                      <td className="py-4 hidden md:table-cell">{user.country}</td>
                      <td className="py-4 hidden md:table-cell text-gray-600">
                        <div className="truncate max-w-[150px]">{user.institution}</div>
                      </td>
                      <td className="py-4 text-center">
                        <Badge className={levelColors[user.level as keyof typeof levelColors]}>
                          {user.level}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing 1 to 10 of 250 entries
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <span className="text-gray-500">...</span>
                <Button variant="outline" size="sm">
                  25
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardPage;
