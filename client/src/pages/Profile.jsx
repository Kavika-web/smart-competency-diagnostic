import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const SKILLS_OPTIONS = [
  'JavaScript', 'React', 'Node.js', 'MongoDB', 'Express',
  'Python', 'Java', 'C++', 'SQL', 'HTML/CSS',
  'TypeScript', 'Git', 'Docker', 'AWS', 'Machine Learning'
];

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    targetRole: '',
    experienceLevel: 'fresher',
    skills: [],
    education: {
      degree: '',
      branch: '',
      college: '',
      graduationYear: ''
    }
  });

  // Load existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile');
        setFormData(res.data);
      } catch (err) {
        // No profile yet — that's fine
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEducationChange = (e) => {
    setFormData({
      ...formData,
      education: { ...formData.education, [e.target.name]: e.target.value }
    });
  };

  const toggleSkill = (skill) => {
    const current = formData.skills;
    if (current.includes(skill)) {
      setFormData({ ...formData, skills: current.filter(s => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...current, skill] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await API.post('/profile', formData);
      setSuccess('Profile saved successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">My Profile</h1>
          <p className="text-gray-500 mt-1">Fill in your details to get accurate job matches</p>
        </div>

        {success && (
          <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Basic Information</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                <input
                  type="text"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="fresher">Fresher</option>
                  <option value="junior">Junior (0–2 yrs)</option>
                  <option value="mid">Mid (2–5 yrs)</option>
                  <option value="senior">Senior (5+ yrs)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Education</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.education.degree}
                  onChange={handleEducationChange}
                  placeholder="e.g. B.Tech"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.education.branch}
                  onChange={handleEducationChange}
                  placeholder="e.g. Computer Science"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                <input
                  type="text"
                  name="college"
                  value={formData.education.college}
                  onChange={handleEducationChange}
                  placeholder="College name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                <input
                  type="text"
                  name="graduationYear"
                  value={formData.education.graduationYear}
                  onChange={handleEducationChange}
                  placeholder="e.g. 2026"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Skills</h2>
            <p className="text-sm text-gray-400 mb-4">Click to select your skills</p>
            <div className="flex flex-wrap gap-2">
              {SKILLS_OPTIONS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition
                    ${formData.skills.includes(skill)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                    }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {formData.skills.length > 0 && (
              <p className="text-sm text-indigo-500 mt-3">
                Selected: {formData.skills.join(', ')}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Profile;