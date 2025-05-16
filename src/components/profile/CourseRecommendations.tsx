
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, ArrowRight, Award } from "lucide-react";
import { Course } from "@/services/recommendations";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CourseRecommendationsProps {
  courses: Course[];
}

export function CourseRecommendations({ courses }: CourseRecommendationsProps) {
  const { t } = useTranslation();
  
  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>{t('profile.recommendedCourses')}</CardTitle>
        <CardDescription>
          {t('profile.coursesDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="flex flex-col md:flex-row justify-between border rounded-md p-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium text-lg">{course.title}</h3>
                  {course.completed && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Award className="h-3 w-3 mr-1" />
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {course.tags.map((tag) => (
                    <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{course.difficulty}</span>
                  <div className="flex items-center ml-4">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span className="text-xs">{course.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <Button size="sm" className="w-full md:w-auto" asChild>
                  <Link to={`/courses/${course.id}`}>
                    View Course <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
