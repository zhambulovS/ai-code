
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Menu, CheckCircle, BookOpen, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchCourseById,
  fetchLessonById,
  markLessonAsCompleted,
  fetchCourseProgress
} from "@/services/coursesService";
import { checkCourseCompletion, createCourseCompletionAchievement } from "@/services/achievementsService";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view lessons",
        variant: "destructive"
      });
      navigate("/login", { state: { from: `/courses/${courseId}/lessons/${lessonId}` } });
    }
  }, [user, courseId, lessonId, navigate, toast]);

  // Fetch course data
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId || ''),
    enabled: !!courseId && !!user,
  });

  // Fetch lesson data
  const { data: lesson, isLoading: isLoadingLesson } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => fetchLessonById(lessonId || ''),
    enabled: !!lessonId && !!user,
  });

  // Fetch progress data
  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['courseProgress', courseId, user?.id],
    queryFn: () => fetchCourseProgress(courseId || '', user?.id || ''),
    enabled: !!courseId && !!user?.id,
  });

  // Extract YouTube video ID if present in lesson content
  const extractYouTubeVideoId = (content: string): string | null => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = content?.match(youtubeRegex);
    return match ? match[1] : null;
  };

  const youtubeVideoId = lesson?.content ? extractYouTubeVideoId(lesson.content) : null;

  // Mark lesson as completed
  const { mutate: completeLesson, isPending: isCompletingLesson } = useMutation({
    mutationFn: () => markLessonAsCompleted(courseId || '', lessonId || '', user?.id || ''),
    onSuccess: async () => {
      toast({
        title: "Lesson completed!",
        description: "Your progress has been saved"
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['courseProgress', courseId, user?.id] });
      
      // Check if course is now complete
      const isCompleted = await checkCourseCompletion(user?.id || '', courseId || '');
      
      if (isCompleted && course) {
        // Grant achievement for course completion
        const achievement = await createCourseCompletionAchievement(
          user?.id || '',
          courseId || '',
          course.title
        );
        
        if (achievement) {
          toast({
            title: "Achievement Unlocked!",
            description: achievement.title,
            variant: "default"
          });
          
          // Invalidate achievements query
          queryClient.invalidateQueries({ queryKey: ['achievements', user?.id] });
        }
      }
      
      // Navigate to next lesson if available
      if (course?.lessons) {
        const currentIndex = course.lessons.findIndex(l => l.id === lessonId);
        if (currentIndex < course.lessons.length - 1) {
          navigate(`/courses/${courseId}/lessons/${course.lessons[currentIndex + 1].id}`);
        } else {
          // If tests are available, suggest taking a test
          if (course.tests && course.tests.length > 0) {
            navigate(`/courses/${courseId}/tests/${course.tests[0].id}`);
          } else {
            navigate(`/courses/${courseId}`);
          }
        }
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark lesson as completed",
        variant: "destructive"
      });
    }
  });

  const isLoading = isLoadingCourse || isLoadingLesson || isLoadingProgress;
  const lessonCompleted = progress?.completedLessons?.includes(lessonId || '');

  // Calculate current lesson index and total for navigation
  const currentLessonIndex = course?.lessons?.findIndex(l => l.id === lessonId) ?? 0;
  const totalLessons = course?.lessons?.length ?? 0;
  const prevLesson = currentLessonIndex > 0 ? course?.lessons?.[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < totalLessons - 1 ? course?.lessons?.[currentLessonIndex + 1] : null;

  // Calculate course progress
  const progressPercentage = progress && course?.lessons 
    ? Math.round((progress.completedLessons.length / course.lessons.length) * 100)
    : 0;

  // Function to clean lesson content - remove YouTube links if they're displayed separately
  const cleanLessonContent = (content: string): string => {
    if (!content || !youtubeVideoId) return content;
    // Replace YouTube links with a placeholder
    return content.replace(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g, 
      '<em>[Video embedded below]</em>');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
        <p className="mb-6">The lesson you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate(`/courses/${courseId}`)}>
          Back to Course
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation bar */}
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="py-4">
                  <h3 className="font-medium mb-1">{course.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Progress value={progressPercentage} className="h-2 w-32 mr-2" />
                    <span>{progressPercentage}% complete</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-1">
                    {course.lessons.map((l, index) => (
                      <Button
                        key={l.id}
                        variant={l.id === lessonId ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          navigate(`/courses/${courseId}/lessons/${l.id}`);
                          setOpenSidebar(false);
                        }}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-8 text-center mr-2">{index + 1}</div>
                          <div className="truncate">{l.title}</div>
                          {progress?.completedLessons?.includes(l.id) && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={() => navigate(`/courses/${courseId}`)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Course
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!prevLesson}
              onClick={() => prevLesson && navigate(`/courses/${courseId}/lessons/${prevLesson.id}`)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={!nextLesson}
              onClick={() => nextLesson && navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8 flex">
          {/* Sidebar for desktop */}
          <div className="hidden md:block w-72 mr-8 sticky top-20 self-start max-h-[calc(100vh-80px)] overflow-y-auto">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">{course.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Progress value={progressPercentage} className="h-2 w-32 mr-2" />
                  <span>{progressPercentage}% complete</span>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-1">
                  {course.lessons.map((l, index) => (
                    <Button
                      key={l.id}
                      variant={l.id === lessonId ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => navigate(`/courses/${courseId}/lessons/${l.id}`)}
                    >
                      <div className="flex items-center w-full">
                        <div className="w-8 text-center mr-2">{index + 1}</div>
                        <div className="truncate">{l.title}</div>
                        {progress?.completedLessons?.includes(l.id) && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Lesson content */}
          <div className="flex-grow">
            <div className="mb-6 flex items-center">
              <BookOpen className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {totalLessons}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
            
            <div className="prose max-w-none mb-6">
              <div dangerouslySetInnerHTML={{ __html: cleanLessonContent(lesson.content) }} />
            </div>
            
            {youtubeVideoId && (
              <div className="mb-12">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Youtube className="h-5 w-5 text-red-500 mr-2" />
                  Video Content
                </h3>
                <Card>
                  <CardContent className="p-0 overflow-hidden rounded-lg">
                    <AspectRatio ratio={16 / 9}>
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </AspectRatio>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div className="flex justify-between items-center border-t pt-6">
              <Button
                variant="outline"
                disabled={!prevLesson}
                onClick={() => prevLesson && navigate(`/courses/${courseId}/lessons/${prevLesson.id}`)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Lesson
              </Button>
              
              {lessonCompleted ? (
                <div className="flex items-center text-green-500">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Completed</span>
                </div>
              ) : (
                <Button 
                  onClick={() => completeLesson()} 
                  disabled={isCompletingLesson}
                >
                  {isCompletingLesson ? "Saving..." : "Mark as Completed"}
                </Button>
              )}
              
              <Button
                variant="outline"
                disabled={!nextLesson}
                onClick={() => nextLesson && navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)}
              >
                Next Lesson
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
