import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { StoreState, ModuleProgress, PdfModule, VideoModule } from '../types/learning';

interface StoreContextType extends StoreState {
  initializePdfModules: (modules: PdfModule[]) => void;
  initializeVideoModules: (videos: VideoModule[]) => void;
  togglePdfCompletion: (index: number) => void;
  completeVideo: (index: number) => void;
  getPdfProgress: () => ModuleProgress;
  getVideoProgress: () => ModuleProgress;
  getOverallProgress: () => ModuleProgress;
  updateQuizScore: (score: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [pdfModules, setPdfModules] = useState<StoreState['pdfModules']>({
    completed: {},
    total: 0,
    modules: []
  });

  const [videoModules, setVideoModules] = useState<StoreState['videoModules']>({
    completed: {},
    total: 0,
    videos: []
  });

  const [quizScore, setQuizScore] = useState(0);

  const initializePdfModules = useCallback((modules: PdfModule[]) => {
    setPdfModules(prev => ({
      ...prev,
      modules,
      total: modules.length
    }));
  }, []);

  const initializeVideoModules = useCallback((videos: VideoModule[]) => {
    setVideoModules(prev => ({
      ...prev,
      videos,
      total: videos.length
    }));
  }, []);

  const togglePdfCompletion = useCallback((index: number) => {
    setPdfModules(prev => {
      const updatedCompleted = { ...prev.completed, [index]: !prev.completed[index] };
      return {
        ...prev,
        completed: updatedCompleted
      };
    });
  }, []);

  const completeVideo = useCallback((index: number) => {
    setVideoModules(prev => ({
      ...prev,
      completed: { ...prev.completed, [index]: true }
    }));
  }, []);

  const getPdfProgress = useCallback((): ModuleProgress => {
    const completedCount = Object.values(pdfModules.completed).filter(Boolean).length;
    return {
      completed: completedCount,
      total: pdfModules.total,
      percentage: Math.round((completedCount / pdfModules.total) * 100) || 0
    };
  }, [pdfModules]);

  const getVideoProgress = useCallback((): ModuleProgress => {
    const completedCount = Object.values(videoModules.completed).filter(Boolean).length;
    return {
      completed: completedCount,
      total: videoModules.total,
      percentage: Math.round((completedCount / videoModules.total) * 100) || 0
    };
  }, [videoModules]);

  const getOverallProgress = useCallback((): ModuleProgress => {
    const pdfProgress = getPdfProgress();
    const videoProgress = getVideoProgress();
    
    const totalCompleted = pdfProgress.completed + videoProgress.completed;
    const totalModules = pdfProgress.total + videoProgress.total;
    
    return {
      completed: totalCompleted,
      total: totalModules,
      percentage: Math.round((totalCompleted / totalModules) * 100) || 0
    };
  }, [getPdfProgress, getVideoProgress]);

  const updateQuizScore = useCallback((score: number) => {
    setQuizScore(score);
  }, []);

  const value: StoreContextType = {
    pdfModules,
    videoModules,
    quizScore,
    initializePdfModules,
    initializeVideoModules,
    togglePdfCompletion,
    completeVideo,
    getPdfProgress,
    getVideoProgress,
    getOverallProgress,
    updateQuizScore,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}; 