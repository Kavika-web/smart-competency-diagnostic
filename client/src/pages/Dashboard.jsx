import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 mb-1">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 text-sm">Role: {user?.role}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link
            to="/profile"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition text-center"
          >
            <div className="text-3xl mb-2">👤</div>
            <p className="font-semibold text-gray-700">My Profile</p>
            <p className="text-xs text-gray-400 mt-1">Fill your details</p>
          </Link>

          <div className="bg-white rounded-2xl shadow-sm p-6 text-center opacity-50">
            <div className="text-3xl mb-2">📝</div>
            <p className="font-semibold text-gray-700">Take Assessment</p>
            <p className="text-xs text-gray-400 mt-1">Coming Day 7</p>
          </div>
        </div>

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