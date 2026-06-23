import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from '../data/questions';
import API from '../api/axios';

const DOMAINS = ['technical', 'aptitude', 'communication', 'domainKnowledge', 'softSkills'];

const DOMAIN_LABELS = {
  technical: '💻 Technical',
  aptitude: '🧮 Aptitude',
  communication: '💬 Communication',
  domainKnowledge: '📚 Domain Knowledge',
  softSkills: '🤝 Soft Skills'
};

const DIFFICULTY_WEIGHT = { easy: 1, medium: 2, hard: 3 };

const Assessment = () => {
  const navigate = useNavigate();
  const [currentDomain, setCurrentDomain] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [submitting, setSubmitting] = useState(false);

  const domainQuestions = questions.filter(
    q => q.domain === DOMAINS[currentDomain]
  );

  const question = domainQuestions[currentQuestion];
  const totalAnswered = Object.keys(responses).length;
  const progress = Math.round((totalAnswered / 25) * 100);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load saved answer when navigating back
  useEffect(() => {
    const saved = responses[question?.id];
    setSelected(saved || null);
  }, [currentDomain, currentQuestion]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelect = (option) => {
    setSelected(option);
    setResponses(prev => ({ ...prev, [question.id]: option }));
  };

  const handleNext = () => {
    if (currentQuestion < domainQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentDomain < DOMAINS.length - 1) {
      setCurrentDomain(prev => prev + 1);
      setCurrentQuestion(0);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentDomain > 0) {
      setCurrentDomain(prev => prev - 1);
      setCurrentQuestion(4);
    }
  };

  const isLastQuestion =
    currentDomain === DOMAINS.length - 1 &&
    currentQuestion === domainQuestions.length - 1;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Build responses array
      const responsesArray = questions.map(q => ({
        questionId: q.id,
        domain: q.domain,
        selectedOption: responses[q.id] || '',
        isCorrect: responses[q.id] === q.answer,
        difficulty: q.difficulty
      }));

      await API.post('/assessment/submit', {
        responses: responsesArray,
        timeTaken: 25 * 60 - timeLeft
      });

      navigate('/results');
    } catch (err) {
      console.error('Submit failed:', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-indigo-600">Competency Assessment</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Question {totalAnswered}/{25} answered
            </p>
          </div>
          <div className={`text-lg font-bold px-4 py-2 rounded-xl ${
            timeLeft < 300 ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
          }`}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Domain Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {DOMAINS.map((d, i) => (
            <button
              key={d}
              onClick={() => { setCurrentDomain(i); setCurrentQuestion(0); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition
                ${currentDomain === i
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300'
                }`}
            >
              {DOMAIN_LABELS[d]}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
              {DOMAIN_LABELS[DOMAINS[currentDomain]]}
            </span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full
              ${question.difficulty === 'easy' ? 'bg-green-50 text-green-600' :
                question.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                'bg-red-50 text-red-600'}`}>
              {question.difficulty} • {DIFFICULTY_WEIGHT[question.difficulty]}pt
            </span>
          </div>

          <p className="text-gray-800 font-medium text-base mb-6 leading-relaxed">
            Q{currentQuestion + 1}. {question.question}
          </p>

          <div className="space-y-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition
                  ${selected === option
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                    : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                  }`}
              >
                <span className="font-medium mr-2 text-gray-400">
                  {['A', 'B', 'C', 'D'][i]}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentDomain === 0 && currentQuestion === 0}
            className="px-5 py-2 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition"
          >
            ← Previous
          </button>

          <span className="text-xs text-gray-400">
            {currentQuestion + 1} / {domainQuestions.length}
          </span>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition"
            >
              {submitting ? 'Submitting...' : '✅ Submit'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
            >
              Next →
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Assessment;