import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const DOMAIN_LABELS = {
  technical: 'Technical',
  aptitude: 'Aptitude',
  communication: 'Communication',
  domainKnowledge: 'Domain Knowledge',
  softSkills: 'Soft Skills'
};

const TYPE_COLORS = {
  Course:        'bg-blue-50 text-blue-600',
  Video:         'bg-red-50 text-red-500',
  Tutorial:      'bg-green-50 text-green-600',
  Documentation: 'bg-purple-50 text-purple-600',
  Interactive:   'bg-yellow-50 text-yellow-600'
};

const SkillGap = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/skillgap');
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load skill gap data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Analyzing your skill gaps...</p>
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
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl"
          >
            Take Assessment First
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">Skill Gap Analysis</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {data.missingSkillsCount} skills to learn for better job matches
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-50 transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* Skills you have */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            ✅ Skills You Have
          </h2>
          {data.candidateSkills.length === 0 ? (
            <p className="text-sm text-gray-400">
              No skills added yet.{' '}
              <span
                onClick={() => navigate('/profile')}
                className="text-indigo-500 cursor-pointer underline"
              >
                Update your profile
              </span>
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.candidateSkills.map(skill => (
                <span
                  key={skill}
                  className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Weak Domains */}
        {data.weakDomains.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              📉 Weak Domain Areas
            </h2>
            <div className="space-y-3">
              {data.weakDomains.map(({ domain, score }) => (
                <div key={domain}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      {DOMAIN_LABELS[domain]}
                    </span>
                    <span className="text-red-500 font-medium">{score}/100</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-red-400 h-2 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Roadmap */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            🗺️ Your Learning Roadmap
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Click any skill to see free learning resources
          </p>

          {data.roadmap.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-green-600 font-medium">
                You have all the required skills!
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Focus on improving your assessment scores.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.roadmap.map((item, i) => (
                <div key={item.skill} className="border border-gray-100 rounded-xl overflow-hidden">

                  {/* Skill Header */}
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div className="text-left">
                        <p className="font-medium text-gray-800 text-sm">
                          {item.skill}
                        </p>
                        {item.priority > 0 && (
                          <p className="text-xs text-orange-400">
                            Needed in {item.priority} job{item.priority > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {item.resources.length} resources
                      </span>
                      <span className="text-gray-400">
                        {expanded === i ? '▲' : '▼'}
                      </span>
                    </div>
                  </button>

                  {/* Resources */}
                  {expanded === i && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50">
                      {item.resources.map((res, j) => (
                        <a
                          key={j}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between px-4 py-3 hover:bg-indigo-50 transition group"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[res.type] || 'bg-gray-100 text-gray-500'}`}>
                              {res.type}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                                {res.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {res.platform} • {res.duration}
                              </p>
                            </div>
                          </div>
                          <span className="text-indigo-400 text-sm">→</span>
                        </a>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pb-6">
          <button
            onClick={() => navigate('/jobs')}
            className="flex-1 border border-indigo-300 text-indigo-600 py-3 rounded-xl font-medium hover:bg-indigo-50 transition text-sm"
          >
            💼 View Job Matches
          </button>
          <button
            onClick={() => navigate('/results')}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition text-sm"
          >
            📊 View My Scores
          </button>
        </div>

      </div>
    </div>
  );
};

export default SkillGap;