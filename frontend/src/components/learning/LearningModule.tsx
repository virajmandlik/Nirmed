import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import VideoModules from './VideoModules';
import PdfModules from './PdfModules';
import Quiz from './Quiz';
import Certificate from './Certificate';
import { useStore } from '../../contexts/StoreContext';

const LearningModule: React.FC = () => {
  const { getVideoProgress, getPdfProgress, getOverallProgress, quizScore } = useStore();

  const videoProgress = getVideoProgress();
  const pdfProgress = getPdfProgress();
  const overallProgress = getOverallProgress();

  const modules = [
    {
      title: '🎥 Video Modules',
      description: `Completed ${videoProgress.completed} of ${videoProgress.total} videos`,
      path: '/learning/videos',
    },
    {
      title: '📄 PDF Modules',
      description: `Completed ${pdfProgress.completed} of ${pdfProgress.total} PDFs`,
      path: '/learning/pdfs',
    },
  ];

  if (overallProgress.percentage >= 100) {
    modules.push({
      title: '📝 Quiz',
      description: 'Attempt the final quiz to test your knowledge',
      path: '/learning/quiz',
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={
          <div className="p-6">
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
              📚 Learning Dashboard
            </h1>

            <div className="max-w-5xl mx-auto mb-10 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Overall Progress</h2>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress.percentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Completed {overallProgress.completed} of {overallProgress.total} modules ({overallProgress.percentage}%)
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
              {modules.map((module, idx) => (
                <Link
                  key={idx}
                  to={module.path}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition cursor-pointer border hover:border-blue-400"
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{module.title}</h2>
                    <p className="text-gray-600 mt-1">{module.description}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-green-500'}`}
                      style={{ width: `${idx === 0 ? videoProgress.percentage : pdfProgress.percentage}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>

            {overallProgress.percentage >= 100 && (
              <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">📝 Final Quiz</h2>
                <p className="text-sm text-gray-600">
                  {quizScore >= 75
                    ? 'Congratulations! You can now download your certificate.'
                    : `You must score at least 75% in the final quiz to unlock the certificate (Your score: ${quizScore}%)`
                  }
                </p>
                <Link
                  to="/learning/quiz"
                  className="inline-block mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Start Quiz
                </Link>
              </div>
            )}
          </div>
        } />
        <Route path="/videos" element={<VideoModules />} />
        <Route path="/pdfs" element={<PdfModules />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/certificate" element={<Certificate />} />
      </Routes>
    </div>
  );
};

export default LearningModule; 