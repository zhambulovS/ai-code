
import { useState } from "react";
import { 
  Activity, 
  Award, 
  BarChart, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Code, 
  FileText, 
  LayoutGrid, 
  ListFilter,
  MoreHorizontal, 
  Settings,
  Trophy, 
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

// Dummy user data
const user = {
  id: 1,
  name: "Alex Johnson",
  username: "alexj",
  role: "Student",
  email: "alex.johnson@example.com",
  profileImage: "",
  joinDate: "January 2023",
  bio: "Computer Science student passionate about competitive programming and algorithms.",
  institution: "University of Technology",
  country: "United States",
  totalSolved: 127,
  rank: 342,
  level: "Intermediate",
  streak: 12,
  skills: [
    { name: "Arrays", score: 85 },
    { name: "Dynamic Programming", score: 72 },
    { name: "Graph Algorithms", score: 64 },
    { name: "String Manipulation", score: 78 },
    { name: "Tree Algorithms", score: 60 },
    { name: "Greedy Algorithms", score: 82 }
  ],
  recentProblems: [
    { id: 101, title: "Valid Parentheses", difficulty: "Easy", status: "Solved", date: "2 days ago" },
    { id: 102, title: "Maximum Subarray", difficulty: "Medium", status: "Solved", date: "3 days ago" },
    { id: 103, title: "Longest Palindromic Substring", difficulty: "Medium", status: "Failed", date: "5 days ago" },
    { id: 104, title: "Merge K Sorted Lists", difficulty: "Hard", status: "Attempted", date: "1 week ago" },
    { id: 105, title: "Two Sum", difficulty: "Easy", status: "Solved", date: "1 week ago" }
  ],
  achievements: [
    { id: 1, title: "100 Problems Solved", description: "Solved 100 problems", icon: "Trophy", date: "2 weeks ago" },
    { id: 2, title: "10-Day Streak", description: "Solved at least one problem every day for 10 days", icon: "Calendar", date: "3 weeks ago" },
    { id: 3, title: "DP Master", description: "Solved 20 dynamic programming problems", icon: "Award", date: "1 month ago" }
  ],
  weeklyActivity: [
    { day: "Mon", problems: 3 },
    { day: "Tue", problems: 2 },
    { day: "Wed", problems: 4 },
    { day: "Thu", problems: 1 },
    { day: "Fri", problems: 2 },
    { day: "Sat", problems: 5 },
    { day: "Sun", problems: 0 }
  ],
  recommendedTopics: [
    { name: "Binary Search", importance: "High", problems: 12 },
    { name: "Bit Manipulation", importance: "Medium", problems: 8 },
    { name: "Heap", importance: "Medium", problems: 10 }
  ]
};

// Difficulty color mapping
const difficultyColors = {
  Easy: "text-green-500",
  Medium: "text-yellow-500",
  Hard: "text-red-500"
};

// Status color mapping
const statusColors = {
  Solved: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-800",
  Attempted: "bg-yellow-100 text-yellow-800"
};

// Importance color mapping
const importanceColors = {
  High: "text-red-500",
  Medium: "text-yellow-500",
  Low: "text-green-500"
};

const ProfilePage = () => {
  const [currentTab, setCurrentTab] = useState("overview");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>@{user.username}</span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {user.role}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {user.joinDate}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Download Progress Report</DropdownMenuItem>
                <DropdownMenuItem>Share Profile</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Profile Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Problems Solved</p>
                <h3 className="text-2xl font-bold">{user.totalSolved}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Global Rank</p>
                <h3 className="text-2xl font-bold">#{user.rank}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Level</p>
                <h3 className="text-2xl font-bold">{user.level}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Award className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Streak</p>
                <h3 className="text-2xl font-bold">{user.streak} days</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Profile Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="w-full justify-start border-b rounded-none p-0">
          <TabsTrigger 
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="problems"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <Code className="h-4 w-4 mr-2" />
            Problems
          </TabsTrigger>
          <TabsTrigger 
            value="skills"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Skills
          </TabsTrigger>
          <TabsTrigger 
            value="achievements"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* About */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{user.bio}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Institution</p>
                    <p>{user.institution}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Country</p>
                    <p>{user.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Weekly Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-36">
                  {user.weeklyActivity.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-8 bg-primary/20 rounded-t-sm" 
                        style={{ 
                          height: `${day.problems * 15}px`,
                          backgroundColor: day.problems > 0 ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--muted))'
                        }}
                      ></div>
                      <span className="text-xs mt-2">{day.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recommended Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Topics</CardTitle>
                <CardDescription>
                  Based on your performance and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {user.recommendedTopics.map((topic, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span>{topic.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xs ${importanceColors[topic.importance as keyof typeof importanceColors]} mr-2`}>
                          {topic.importance}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {topic.problems} problems
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button variant="link" className="w-full mt-4">
                  View all recommendations
                </Button>
              </CardContent>
            </Card>
            
            {/* Recent Problems */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Problems</CardTitle>
                <Button variant="ghost" className="h-8 w-8 p-0" size="sm">
                  <ListFilter className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.recentProblems.map((problem, index) => (
                    <Link to={`/problems/${problem.id}`} key={index}>
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <span className="font-medium">{problem.title}</span>
                            <span className={`ml-2 text-sm ${difficultyColors[problem.difficulty as keyof typeof difficultyColors]}`}>
                              {problem.difficulty}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {problem.date}
                          </div>
                        </div>
                        <Badge className={statusColors[problem.status as keyof typeof statusColors]}>
                          {problem.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-4">
                  View all solved problems
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Proficiency</CardTitle>
              <CardDescription>
                Analysis of your strengths and areas for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {user.skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span>{skill.score}%</span>
                    </div>
                    <Progress value={skill.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Badges and milestones you've earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.achievements.map((achievement, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          {achievement.icon === "Trophy" && <Trophy className="h-5 w-5 text-primary" />}
                          {achievement.icon === "Calendar" && <Calendar className="h-5 w-5 text-primary" />}
                          {achievement.icon === "Award" && <Award className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Earned {achievement.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Problems Tab */}
        <TabsContent value="problems" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Solved Problems</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <ListFilter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  You have solved {user.totalSolved} problems in total.
                </p>
                
                {/* This would be a more comprehensive list in the real application */}
                <div className="space-y-2">
                  {user.recentProblems.map((problem, index) => (
                    <Link to={`/problems/${problem.id}`} key={index}>
                      <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
                        <div className="space-y-1">
                          <span className="font-medium">{problem.title}</span>
                          <div className="flex items-center text-sm">
                            <span className={`mr-2 ${difficultyColors[problem.difficulty as keyof typeof difficultyColors]}`}>
                              {problem.difficulty}
                            </span>
                            <span className="text-gray-500">
                              {problem.date}
                            </span>
                          </div>
                        </div>
                        <Badge className={statusColors[problem.status as keyof typeof statusColors]}>
                          {problem.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline">Load More</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
