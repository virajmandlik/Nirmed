import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { VideoModule } from '../../types/learning';

const VideoModules: React.FC = () => {
  const { 
    videoModules,
    completeVideo,
    getVideoProgress,
    initializeVideoModules
  } = useStore();

  useEffect(() => {
    const videos: VideoModule[] = [
      { id: 'N1FeTxiXcgI', title: 'Introduction to Healthcare Waste Management' },
      { id: 'ywqMGf_9irI', title: 'Types of Healthcare Waste' },
      { id: 'VGYCNG-vanE', title: 'Segregation of Waste at Source' },
      { id: 'o8apda1gZOI', title: 'Storage and Transportation' },
      { id: 'j8Jc0WUHfrU', title: 'Waste Treatment Techniques' },
      { id: '1-GPE0kOqH4', title: 'Training & Awareness Summary' },
    ];
    initializeVideoModules(videos);
  }, [initializeVideoModules]);

  const { completed, total, percentage } = getVideoProgress();

  const handleVideoClick = (index: number) => {
    window.open(`https://www.youtube.com/watch?v=${videoModules.videos[index].id}`, '_blank');
    completeVideo(index);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-2">
          🏥 Healthcare Waste Management Training
        </h1>
        <p className="text-gray-600 text-lg">
          Enhance your understanding through this step-by-step video course.
        </p>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-700">
          <span>Completed: {completed} of {total}</span>
          <span>{percentage}% Completed</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-400 to-green-600 h-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videoModules.videos.map((video, index) => {
          const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
          const isCompleted = !!videoModules.completed[index];

          return (
            <div
              key={video.id}
              onClick={() => handleVideoClick(index)}
              className={`relative group rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-transform transform hover:scale-[1.02] cursor-pointer border ${
                isCompleted ? 'border-green-400' : 'border-transparent'
              }`}
            >
              <img
                src={thumbnailUrl}
                alt={video.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
                  {video.title}
                </h3>
              </div>

              {isCompleted && (
                <div className="absolute top-3 left-3 bg-green-100 border border-green-400 text-green-700 text-xs font-semibold rounded-full px-2 py-1 shadow flex items-center gap-1">
                  <CheckCircle size={14} /> Completed
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoModules; 