import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const MATCH_COLOR = (pct) => {
  if (pct >= 75) return { bar: 'bg-green-500', badge: 'bg-green-100 text-green-700' };
  if (pct >= 50) return { bar: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700' };
  return { bar: 'bg-red-400', badge: 'bg-red-100 text-red-600' };
};

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalMatched, setTotalMatched] = useState(0);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get('/jobs/recommendations');
        setJobs(res.data.recommendations);
        setTotalMatched(res.data.totalMatched);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter(job => {
    if (filter === 'high') return job.matchPercentage >= 75;
    if (filter === 'medium') return job.matchPercentage >= 50 && job.matchPercentage < 75;
    if (filter === 'internship') return job.jobType === 'Internship';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Finding your best job matches...</p>
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
            <h1 className="text-2xl font-bold text-indigo-600">Job Matches</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {totalMatched} jobs match your profile (50%+)
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-50 transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'All' },
            { key: 'high', label: '🟢 High Match (75%+)' },
            { key: 'medium', label: '🟡 Medium (50–74%)' },
            { key: 'internship', label: '🎓 Internships' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                ${filter === f.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
              No jobs found for this filter.
            </div>
          ) : (
            filtered.map((job, i) => {
              const colors = MATCH_COLOR(job.matchPercentage);
              return (
                <div
                  key={job.id || i}
                  className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base">
                        {job.jobTitle}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {job.company} • {job.location}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ml-3 ${colors.badge}`}>
                      {job.matchPercentage}% Match
                    </span>
                  </div>

                  {/* Match bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                    <div
                      className={`h-1.5 rounded-full transition-all ${colors.bar}`}
                      style={{ width: `${job.matchPercentage}%` }}
                    />
                  </div>

                  {/* Job type badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                      {job.jobType}
                    </span>
                    <span className="text-xs text-gray-400">
                      Min Score: {job.minScore}/100
                    </span>
                  </div>

                  {/* Required Skills */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills.map(skill => (
                        <span
                          key={skill}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium
                            ${job.missingSkills?.includes(skill)
                              ? 'bg-red-50 text-red-500'
                              : 'bg-green-50 text-green-600'
                            }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  {job.missingSkills?.length > 0 && (
                    <div className="bg-red-50 rounded-xl px-4 py-3">
                      <p className="text-xs font-medium text-red-500 mb-1">
                        ⚠️ Missing Skills
                      </p>
                      <p className="text-xs text-red-400">
                        {job.missingSkills.join(', ')}
                      </p>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default Jobs;