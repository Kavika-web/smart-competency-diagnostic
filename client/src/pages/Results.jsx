import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import API from '../api/axios';

const DOMAIN_LABELS = {
  technical: 'Technical',
  aptitude: 'Aptitude',
  communication: 'Communication',
  domainKnowledge: 'Domain Knowledge',
  softSkills: 'Soft Skills'
};

const LABEL_COLORS = {
  Expert:     { bg: 'bg-purple-100', text: 'text-purple-700' },
  Proficient: { bg: 'bg-blue-100',   text: 'text-blue-700' },
  Competent:  { bg: 'bg-green-100',  text: 'text-green-700' },
  Developing: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  Beginner:   { bg: 'bg-red-100',    text: 'text-red-600' }
};

const Results = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await API.get('/assessment/score');
        setScore(res.data);
      } catch (err) {
        setError('No results found. Please take the assessment first.');
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading your results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/assessment')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }

  // Prepare radar chart data
  const radarData = Object.entries(score.domainScores).map(([key, value]) => ({
    domain: DOMAIN_LABELS[key],
    score: value,
    fullMark: 100
  }));

  const labelStyle = LABEL_COLORS[score.profileLabel] || LABEL_COLORS['Beginner'];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">Your Results</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Generated on {new Date(score.generatedAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-50 transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* Overall Score + Label */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-8">
          <div className="w-32 h-32 flex-shrink-0">
            <CircularProgressbar
              value={score.overallScore}
              text={`${score.overallScore}%`}
              styles={buildStyles({
                textSize: '18px',
                pathColor: '#6366f1',
                textColor: '#6366f1',
                trailColor: '#e0e7ff'
              })}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-800">Overall Score</h2>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${labelStyle.bg} ${labelStyle.text}`}>
                {score.profileLabel}
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {score.aiAnalysis?.summary || 'Assessment completed successfully.'}
            </p>
            <div className="mt-3">
              <div className="text-xs text-gray-400 mb-1">
                Profile Completeness: {score.profileCompleteness}%
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-indigo-400 h-1.5 rounded-full"
                  style={{ width: `${score.profileCompleteness}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Domain-wise Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="domain"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: '#9ca3af', fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.25}
              />
              <Tooltip
                formatter={(value) => [`${value}/100`, 'Score']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Domain Score Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Object.entries(score.domainScores).map(([key, value]) => (
            <div key={key} className="bg-white rounded-2xl shadow-sm p-4">
              <p className="text-xs text-gray-400 mb-2">{DOMAIN_LABELS[key]}</p>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-indigo-600">{value}</span>
                <span className="text-gray-400 text-sm mb-0.5">/100</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                <div
                  className={`h-1.5 rounded-full ${
                    value >= 75 ? 'bg-green-500' :
                    value >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Strengths */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              💪 Strengths
            </h2>
            <ul className="space-y-3">
              {score.aiAnalysis?.strengths?.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              📈 Areas to Improve
            </h2>
            <ul className="space-y-3">
              {score.aiAnalysis?.weaknesses?.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            🎯 AI Recommendations
          </h2>
          <div className="space-y-3">
            {score.aiAnalysis?.recommendations?.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl"
              >
                <span className="bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-indigo-800">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pb-6">
          <button
            onClick={() => navigate('/assessment')}
            className="flex-1 border border-indigo-300 text-indigo-600 py-3 rounded-xl font-medium hover:bg-indigo-50 transition text-sm"
          >
            🔁 Retake Assessment
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition text-sm"
          >
            🏠 Go to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default Results;