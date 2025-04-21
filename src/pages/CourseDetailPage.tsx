
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, CheckCircle, Clock, Star, ArrowLeft, List, Award, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCourseById, fetchCourseProgress, enrollInCourse } from "@/services/coursesService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch course details
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourseById(id || ''),
    enabled: !!id,
  });

  // Fetch user's progress if logged in
  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['courseProgress', id, user?.id],
    queryFn: () => fetchCourseProgress(id || '', user?.id || ''),
    enabled: !!id && !!user,
  });

  // Handle enrollment
  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to enroll in this course",
        variant: "destructive"
      });
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }

    try {
      await enrollInCourse(id || '', user.id);
      toast({
        title: "Successfully enrolled",
        description: "You can now start learning this course",
      });
      // Refresh progress data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Enrollment failed",
        description: "There was an error enrolling in this course",
        variant: "destructive"
      });
    }
  };

  // Start or continue learning
  const handleStartLearning = () => {
    // If there's progress and lessons completed, navigate to the next incomplete lesson
    if (progress?.completedLessons?.length && course?.lessons?.length) {
      const nextLessonIndex = course.lessons.findIndex(
        lesson => !progress.completedLessons.includes(lesson.id)
      );
      
      if (nextLessonIndex !== -1) {
        navigate(`/courses/${id}/lessons/${course.lessons[nextLessonIndex].id}`);
      } else {
        // All lessons completed, go to the first lesson
        navigate(`/courses/${id}/lessons/${course.lessons[0].id}`);
      }
    } else if (course?.lessons?.length) {
      // No progress, start with the first lesson
      navigate(`/courses/${id}/lessons/${course.lessons[0].id}`);
    }
  };

  if (isLoadingCourse) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full my-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/courses")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>
      </div>
    );
  }

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!progress || !course.lessons || course.lessons.length === 0) return 0;
    return Math.round((progress.completedLessons.length / course.lessons.length) * 100);
  };

  const progressPercentage = calculateProgress();
  const isEnrolled = !!progress;

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/courses")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-primary/10">
              {course.difficulty}
            </Badge>
            {course.tags?.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="tests">Tests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-2">About this course</h3>
                <p className="text-gray-700">{course.description}</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-2">What you'll learn</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Understand core concepts and principles</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Apply techniques to solve real problems</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Build practical skills through hands-on exercises</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Course Content</h3>
              {course.lessons && course.lessons.length > 0 ? (
                <div className="space-y-2">
                  {course.lessons.map((lesson, index) => (
                    <Card key={lesson.id} className="overflow-hidden">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <File className="h-3 w-3 mr-1" />
                              <span>Lesson</span>
                            </div>
                          </div>
                        </div>
                        {progress?.completedLessons?.includes(lesson.id) ? (
                          <div className="flex items-center text-green-500">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span>Completed</span>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant={isEnrolled ? "default" : "outline"} 
                            disabled={!isEnrolled}
                            onClick={() => navigate(`/courses/${id}/lessons/${lesson.id}`)}
                          >
                            {isEnrolled ? "Start" : "Enroll to access"}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No lessons available for this course yet.</p>
              )}
            </TabsContent>
            
            <TabsContent value="tests" className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Tests & Assessments</h3>
              {course.tests && course.tests.length > 0 ? (
                <div className="space-y-3">
                  {course.tests.map((test) => (
                    <Card key={test.id} className="overflow-hidden">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-blue-100 text-blue-600 rounded-full h-8 w-8 flex items-center justify-center mr-3">
                            <Award className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{test.title}</h4>
                            <p className="text-sm text-gray-500">
                              Passing score: {test.passing_score}%
                            </p>
                          </div>
                        </div>
                        {progress?.completedTests?.includes(test.id) ? (
                          <div className="flex items-center text-green-500">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span>Passed</span>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant={isEnrolled ? "default" : "outline"} 
                            disabled={!isEnrolled}
                            onClick={() => navigate(`/courses/${id}/tests/${test.id}`)}
                          >
                            {isEnrolled ? "Take Test" : "Enroll to access"}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tests available for this course yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              {course.image_url ? (
                <img 
                  src={course.image_url} 
                  alt={course.title} 
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-primary/10 rounded-md mb-4">
                  <BookOpen className="h-16 w-16 text-primary/40" />
                </div>
              )}
              
              {isEnrolled && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm font-medium">{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <List className="h-5 w-5 text-gray-500 mr-2" />
                  <span>
                    {course.lessons?.length || 0} Lessons
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-gray-500 mr-2" />
                  <span>
                    {course.tests?.length || 0} Tests
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Estimated time: 3-5 hours</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  <span>{course.rating?.toFixed(1) || "New"}</span>
                </div>
              </div>
              
              {isEnrolled ? (
                <Button className="w-full mb-3" onClick={handleStartLearning}>
                  {progressPercentage > 0 ? "Continue Learning" : "Start Learning"}
                </Button>
              ) : (
                <Button className="w-full mb-3" onClick={handleEnroll}>
                  Enroll in Course
                </Button>
              )}
              
              {!user && (
                <p className="text-xs text-center text-gray-500">
                  <Link to="/login" className="text-primary hover:underline">
                    Log in
                  </Link> to track your progress
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
