import React, { useEffect } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import certificateBg from '../../../public/certificate.jpg';

const Certificate: React.FC = () => {
  const { getVideoProgress, getPdfProgress, getOverallProgress, quizScore } = useStore();

  const videoProgress = getVideoProgress();
  const pdfProgress = getPdfProgress();
  const overallProgress = getOverallProgress();

  // Add state to track if download has been attempted
  const [downloadAttempted, setDownloadAttempted] = React.useState(false);

  const handleDownloadCertificate = () => {
    const userName = "Rohan Wagh"; // This should come from your user context/state
    const imgUrl = certificateBg;

    const img = new Image();
    img.src = imgUrl;

    img.onload = () => {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [img.width, img.height],
      });

      doc.addImage(img, "JPEG", 0, 0, img.width, img.height);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(32);
      doc.setTextColor("#4a2f1f");

      doc.text(userName, img.width / 2, 440, { align: "center" });

      doc.save("certificate.pdf");
      console.log('Downloading certificate...');
    };
  };

  // Automatically download certificate when criteria met and not already attempted
  useEffect(() => {
    if (overallProgress.percentage >= 100 && quizScore >= 75 && !downloadAttempted) {
      handleDownloadCertificate();
      setDownloadAttempted(true); // Prevent repeated downloads
    }
  }, [overallProgress.percentage, quizScore, downloadAttempted, handleDownloadCertificate]); // Dependencies

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
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
        <p className="text-sm text-gray-600 mb-6">
          Completed {overallProgress.completed} of {overallProgress.total} modules ({overallProgress.percentage}%)
        </p>

        <div className={`border rounded-lg p-4 transition-all ${
          overallProgress.percentage >= 100
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${
                overallProgress.percentage >= 100
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                <Download size={24} />
              </div>
              <div>
                <h3 className="font-medium">Course Completion Certificate</h3>
                <p className="text-sm text-gray-600">
                  {overallProgress.percentage >= 100
                    ? 'Congratulations! You have completed all modules.'
                    : `Complete all modules to unlock (${overallProgress.percentage}%)`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadCertificate}
              disabled={overallProgress.percentage < 100 || quizScore < 75}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                overallProgress.percentage >= 100 && quizScore >= 75
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate; 