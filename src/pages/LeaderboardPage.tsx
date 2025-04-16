
import { useState, useEffect } from "react";
import { 
  Trophy, 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ListFilter,
  Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
import { fetchLeaderboard, LeaderboardEntry } from "@/services/leaderboardService";

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
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['leaderboard', timeRange, selectedRegion, currentPage, searchTerm],
    queryFn: () => fetchLeaderboard(timeRange, selectedRegion, currentPage, 10, searchTerm),
  });

  const leaderboardData = data?.data || [];
  const totalEntries = data?.total || 0;
  const totalPages = Math.ceil(totalEntries / 10);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, refetch]);
  
  // Reset page when changing filters
  useEffect(() => {
    setCurrentPage(1);
  }, [timeRange, selectedRegion, searchTerm]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-gray-600">
            Top competitive programmers ranked by their performance
          </p>
        </div>
        
        {!isLoading && leaderboardData.length >= 3 ? (
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 my-8">
            {/* Second Place */}
            <div className="flex flex-col items-center order-2 md:order-1">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-gray-300">
                  <AvatarImage src={leaderboardData[1].avatar_url || ""} alt={leaderboardData[1].full_name || ""} />
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-xl">
                    {leaderboardData[1].full_name?.split(' ').map(n => n[0]).join('') || "2"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="font-bold text-gray-700">2</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <h3 className="font-semibold">{leaderboardData[1].full_name}</h3>
                <p className="text-sm text-gray-600">{leaderboardData[1].problems_solved} problems</p>
              </div>
              <div className="h-20 w-16 bg-gray-200 mt-2 rounded-t-lg"></div>
            </div>
            
            {/* First Place */}
            <div className="flex flex-col items-center order-1 md:order-2">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-yellow-400">
                  <AvatarImage src={leaderboardData[0].avatar_url || ""} alt={leaderboardData[0].full_name || ""} />
                  <AvatarFallback className="bg-yellow-50 text-yellow-700 text-2xl">
                    {leaderboardData[0].full_name?.split(' ').map(n => n[0]).join('') || "1"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-3 text-center">
                <h3 className="font-semibold">{leaderboardData[0].full_name}</h3>
                <p className="text-sm text-gray-600">{leaderboardData[0].problems_solved} problems</p>
              </div>
              <div className="h-28 w-16 bg-yellow-300 mt-2 rounded-t-lg"></div>
            </div>
            
            {/* Third Place */}
            <div className="flex flex-col items-center order-3">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-amber-700">
                  <AvatarImage src={leaderboardData[2].avatar_url || ""} alt={leaderboardData[2].full_name || ""} />
                  <AvatarFallback className="bg-amber-50 text-amber-800 text-xl">
                    {leaderboardData[2].full_name?.split(' ').map(n => n[0]).join('') || "3"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-amber-700 flex items-center justify-center">
                  <span className="font-bold text-white">3</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <h3 className="font-semibold">{leaderboardData[2].full_name}</h3>
                <p className="text-sm text-gray-600">{leaderboardData[2].problems_solved} problems</p>
              </div>
              <div className="h-16 w-16 bg-amber-600 mt-2 rounded-t-lg"></div>
            </div>
          </div>
        ) : null}
        
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
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Europe">Europe</SelectItem>
                    <SelectItem value="Asia">Asia</SelectItem>
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
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left pl-4">Rank</th>
                      <th className="py-3 text-left">User</th>
                      <th className="py-3 text-center">Problems</th>
                      <th className="py-3 text-center hidden md:table-cell">Country</th>
                      <th className="py-3 text-left hidden md:table-cell">Institution</th>
                      <th className="py-3 text-center">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.length > 0 ? (
                      leaderboardData.map((user, index) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 pl-4">
                            <div className="flex items-center">
                              <span className="font-semibold">{(currentPage - 1) * 10 + index + 1}</span>
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
                                <AvatarImage src={user.avatar_url || ""} alt={user.full_name || ""} />
                                <AvatarFallback className="text-xs">
                                  {user.full_name?.split(' ').map(n => n[0]).join('') || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.full_name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-center font-semibold">{user.problems_solved}</td>
                          <td className="py-4 text-center hidden md:table-cell">{user.country || "-"}</td>
                          <td className="py-4 hidden md:table-cell text-gray-600">
                            <div className="truncate max-w-[150px]">{user.institution || "-"}</div>
                          </td>
                          <td className="py-4 text-center">
                            <Badge className={levelColors[user.level as keyof typeof levelColors] || "bg-gray-100"}>
                              {user.level || "Beginner"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          No users found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {!isLoading && totalPages > 0 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalEntries)} of {totalEntries} entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button 
                        key={i} 
                        variant="outline" 
                        size="sm" 
                        className={currentPage === pageNum ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="text-gray-500">...</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardPage;
