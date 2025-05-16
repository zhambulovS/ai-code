
// Common types for recommendation services

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  rating: number; // Changed from optional to required
  isCompleted?: boolean; // Added to match the interface used in CourseRecommendations
}

export interface TagStats {
  tag: string;
  count: number;
}

export interface AIRecommendation {
  type: "problem" | "course" | "tip" | "continue";
  title: string;
  description: string;
  difficulty?: string;
  link?: string;
  progress?: number;
}

export interface CourseProgress {
  id: string;
  title: string;
  progress: number;
}
