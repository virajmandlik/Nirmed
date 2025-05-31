import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { CheckCircle, XCircle } from 'lucide-react';
import { QuizQuestion } from '../../types/learning';
import { useNavigate } from 'react-router-dom';

const Quiz: React.FC = () => {
  const dummyQuestions: QuizQuestion[] = [
    {
      question: "What does BMW Rules 2016 stand for in India?",
      options: [
        "Biohazardous Material Waste Rules",
        "Biomedical Waste Management Rules",
        "Business Medical Waste Rules",
        "Basic Medical Waste Regulations"
      ],
      answer: "Biomedical Waste Management Rules",
    },
    {
      question: "Which of the following is a key component of national HCWM planning?",
      options: ["IT infrastructure", "Public transport", "Waste categorization", "Film certification"],
      answer: "Waste categorization",
    },
    {
      question: "What is the first step in developing a national HCWM plan?",
      options: ["Waste disposal", "Policy evaluation", "Situation analysis", "Site cleaning"],
      answer: "Situation analysis",
    },
    {
      question: "Which waste category includes body parts and organs?",
      options: ["Sharps Waste", "Pharmaceutical Waste", "Pathological Waste", "Non-Hazardous Waste"],
      answer: "Pathological Waste",
    },
    {
      question: "Which of the following is an impact of improper healthcare waste disposal?",
      options: ["Improved air quality", "Increased biodiversity", "Disease transmission", "Economic growth"],
      answer: "Disease transmission",
    },
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { updateQuizScore } = useStore();
  const navigate = useNavigate();

  const question = dummyQuestions[currentQ];

  const handleOptionClick = (option: string) => {
    if (!submitted) setSelected(option);
  };

  const handleNext = () => {
    if (submitted) {
      if (currentQ + 1 < dummyQuestions.length) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
        setSubmitted(false);
      } else {
        const percentage = Math.round((score / dummyQuestions.length) * 100);
        updateQuizScore(percentage);
        alert(`Quiz Completed! Your score: ${percentage}%`);
        navigate('/learning/certificate');
      }
    } else {
      setSubmitted(true);
      if (selected === question.answer) {
        setScore(score + 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">📝 Quiz</h2>
        <p className="text-gray-600 mb-2 font-medium">
          Question {currentQ + 1} of {dummyQuestions.length}
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            {question.question}
          </h3>
          <div className="grid gap-3">
            {question.options.map((option, idx) => {
              const isCorrect = submitted && option === question.answer;
              const isWrong = submitted && selected === option && option !== question.answer;

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full text-left px-4 py-2 border rounded-lg transition 
                    ${selected === option ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}
                    ${isCorrect ? 'bg-green-100 border-green-400 text-green-800' : ''}
                    ${isWrong ? 'bg-red-100 border-red-400 text-red-800' : ''}
                  `}
                  disabled={submitted}
                >
                  {option}
                  {isCorrect && <CheckCircle className="inline ml-2 w-5 h-5 text-green-600" />}
                  {isWrong && <XCircle className="inline ml-2 w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={selected === null && !submitted}
            className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            {submitted
              ? currentQ + 1 < dummyQuestions.length
                ? "Next"
                : "Finish"
              : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz; 