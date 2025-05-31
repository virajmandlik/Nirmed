export interface VideoModule {
  id: string;
  title: string;
}

export interface PdfModule {
  moduleNumber: number;
  title: string;
  pdfUrl: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface ModuleProgress {
  completed: number;
  total: number;
  percentage: number;
}

export interface StoreState {
  pdfModules: {
    completed: Record<number, boolean>;
    total: number;
    modules: PdfModule[];
  };
  videoModules: {
    completed: Record<number, boolean>;
    total: number;
    videos: VideoModule[];
  };
  quizScore: number;
} 