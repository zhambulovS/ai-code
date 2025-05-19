
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchAllCourses } from "@/services/coursesService";
import { SeedDatabaseButton } from "@/components/admin/SeedDatabaseButton";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  image_url: string | null;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error loading courses:", error);
        toast({
          title: t("common.error"),
          description: t("courses.loadError", "Failed to load courses. Please try again."),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [toast, t]);

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return t("courses.difficulty.beginner");
      case "intermediate":
        return t("courses.difficulty.intermediate");
      case "advanced":
        return t("courses.difficulty.advanced");
      default:
        return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t("courses.title")}</CardTitle>
            <SeedDatabaseButton />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 border border-gray-200 border-t-0 rounded-b-lg">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6 mb-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                {t("courses.noCourses")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: course.image_url
                        ? `url(${course.image_url})`
                        : "url(/placeholder.svg)",
                    }}
                  ></div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                    <div 
                      className="text-sm text-gray-600 mb-3"
                      dangerouslySetInnerHTML={{ 
                        __html: course.description.length > 100
                          ? course.description.substring(0, 100) + "..."
                          : course.description
                      }}
                    />
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                          course.difficulty
                        )}`}
                      >
                        {getDifficultyLabel(course.difficulty)}
                      </span>
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {course.tags.length > 3 && (
                        <span className="text-xs px-2 py-1">+{course.tags.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
