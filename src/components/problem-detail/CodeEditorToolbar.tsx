
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, BookOpen, Code, Settings } from "lucide-react";
import { HintButton } from "@/components/problem-detail/HintButton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getLearningRecommendations } from "@/services/recommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { Course } from "@/services/recommendations/types";

interface CodeEditorToolbarProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onReset: () => void;
  problemId: number;
  code: string;
  testResults: any[];
  isLoggedIn: boolean;
  problemDifficulty?: string;
}

export function CodeEditorToolbar({
  language,
  onLanguageChange,
  onReset,
  problemId,
  code,
  testResults,
  isLoggedIn,
  problemDifficulty = "medium"
}: CodeEditorToolbarProps) {
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState<Course[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  const loadRecommendations = async () => {
    setIsLoadingRecs(true);
    try {
      const recs = await getLearningRecommendations(problemId.toString());
      setRecommendations(recs);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center justify-between py-2">
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('problem.selectLanguage')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          size="icon" 
          onClick={onReset}
          title={t('problem.resetCode')}
        >
          <Trash2 size={16} />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="flex gap-1 items-center"
              onClick={loadRecommendations}
            >
              <BookOpen size={16} className="mr-1" />
              {t('problem.learningResources')}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t('problem.learningResources')}</SheetTitle>
              <SheetDescription>
                {t('problem.resourcesDescription')}
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6 space-y-4">
              {isLoadingRecs ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <BookOpen className="h-4 w-4 text-primary mr-2" />
                        {t('problem.recommendedStudy')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {recommendations.map((rec, index) => (
                          <li key={index}>
                            <div className="font-medium">{rec.title}</div>
                            <div className="text-sm text-gray-600">{rec.description}</div>
                            {rec.tags && rec.tags.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                {rec.tags.join(', ')}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Code className="h-4 w-4 text-primary mr-2" />
                        {t('problem.codingTips')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>{t('problem.tip1')}</li>
                        <li>{t('problem.tip2')}</li>
                        <li>{t('problem.tip3')}</li>
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
        
        <HintButton 
          problemId={problemId}
          code={code}
          language={language}
          testResults={testResults}
          isLoggedIn={isLoggedIn}
          problemDifficulty={problemDifficulty}
        />
      </div>
    </div>
  );
}
