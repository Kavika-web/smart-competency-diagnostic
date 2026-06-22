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

  // Resume states
  const [resumeFile, setResumeFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parseMsg, setParseMsg] = useState('');

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

  // Load existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile');
        setFormData(res.data);
      } catch (err) {
        // No profile yet
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEducationChange = (e) => {
    setFormData({
      ...formData,
      education: {
        ...formData.education,
        [e.target.name]: e.target.value
      }
    });
  };

  const toggleSkill = (skill) => {
    const current = formData.skills;

    if (current.includes(skill)) {
      setFormData({
        ...formData,
        skills: current.filter(s => s !== skill)
      });
    } else {
      setFormData({
        ...formData,
        skills: [...current, skill]
      });
    }
  };

  // Resume Upload Handler
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setResumeFile(file);
    setParsing(true);
    setParseMsg('');

    const data = new FormData();
    data.append('resume', file);

    try {
      const res = await API.post('/resume/parse', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const ext = res.data.extracted;

      setFormData(prev => ({
        ...prev,
        phone: ext.phone || prev.phone,
        location: ext.location || prev.location,
        targetRole: ext.targetRole || prev.targetRole,
        skills: ext.skills.length > 0 ? ext.skills : prev.skills,
        education: {
          degree: ext.education.degree || prev.education.degree,
          branch: ext.education.branch || prev.education.branch,
          college: ext.education.college || prev.education.college,
          graduationYear:
            ext.education.graduationYear ||
            prev.education.graduationYear
        }
      }));

      setParseMsg(
        '✅ Resume parsed! Fields auto-filled. Review and save.'
      );
    } catch (err) {
      setParseMsg(
        '❌ Could not parse resume. Fill manually.'
      );
    } finally {
      setParsing(false);
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

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to save profile'
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">
            My Profile
          </h1>

          <p className="text-gray-500 mt-1">
            Fill in your details to get accurate job matches
          </p>
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

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
            {/* Resume Upload */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-indigo-700 mb-1">
              📄 Upload Resume
            </h2>

            <p className="text-sm text-indigo-500 mb-4">
              Upload your PDF resume to auto-fill the form below
            </p>

            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center hover:border-indigo-500 transition">
                {resumeFile ? (
                  <p className="text-sm text-indigo-700 font-medium">
                    📎 {resumeFile.name}
                  </p>
                ) : (
                  <>
                    <p className="text-indigo-400 text-sm">
                      Click to upload PDF
                    </p>
                    <p className="text-indigo-300 text-xs mt-1">
                      Max size: 5MB
                    </p>
                  </>
                )}
              </div>

              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="hidden"
              />
            </label>

            {parsing && (
              <p className="text-sm text-indigo-500 mt-3 text-center animate-pulse">
                Parsing your resume...
              </p>
            )}

            {parseMsg && (
              <p className="text-sm mt-3 text-center font-medium text-indigo-700">
                {parseMsg}
              </p>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Basic Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Role
                </label>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>

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
            <h2 className="text-lg font-semibold text-gray-700">
              Education
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch
                </label>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College
                </label>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Year
                </label>

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
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Skills
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              Click to select your skills
            </p>

            <div className="flex flex-wrap gap-2">
              {SKILLS_OPTIONS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition
                    ${
                      formData.skills.includes(skill)
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