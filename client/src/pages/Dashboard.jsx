import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hasScore, setHasScore] = useState(false);

  useEffect(() => {
    const checkScore = async () => {
      try {
        await API.get('/assessment/score');
        setHasScore(true);
      } catch {
        setHasScore(false);
      }
    };
    checkScore();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">

        {/* Welcome */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 mb-1">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-400 text-sm">
            Your smart competency dashboard
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link
            to="/profile"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition text-center"
          >
            <div className="text-3xl mb-2">👤</div>
            <p className="font-semibold text-gray-700">My Profile</p>
            <p className="text-xs text-gray-400 mt-1">Fill your details</p>
          </Link>

          <Link
            to="/assessment"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition text-center"
          >
            <div className="text-3xl mb-2">📝</div>
            <p className="font-semibold text-gray-700">Take Assessment</p>
            <p className="text-xs text-gray-400 mt-1">25 questions • 5 domains</p>
          </Link>

          {hasScore && (
            <Link
              to="/results"
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition text-center"
            >
              <div className="text-3xl mb-2">📊</div>
              <p className="font-semibold text-gray-700">My Results</p>
              <p className="text-xs text-gray-400 mt-1">View your scores</p>
            </Link>
          )}

          <Link
            to="/jobs"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition text-center"
          >
            <div className="text-3xl mb-2">💼</div>
            <p className="font-semibold text-gray-700">Job Matches</p>
            <p className="text-xs text-gray-400 mt-1">See your top matches</p>
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition text-sm"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Dashboard;