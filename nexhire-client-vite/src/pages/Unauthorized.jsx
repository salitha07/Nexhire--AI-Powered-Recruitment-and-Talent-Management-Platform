import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Unauthorized() {
  const logout = () => {
  logoutFn();
  navigate('/login');
};
  const navigate = useNavigate();

  const goToDashboard = () => {
    if (!user) { navigate('/login'); return; }
    const role = user.role;
    if (role === 'candidate') navigate('/candidate/dashboard');
    else if (role === 'recruiter') navigate('/recruiter/dashboard');
    else if (role === 'hiring_manager') navigate('/hiring/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-10 text-center">

        <div className="text-6xl mb-4">🚫</div>

        <h1 className="text-2xl font-bold text-red-600 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          You don't have permission to view this page.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={goToDashboard}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white 
                       font-semibold py-2.5 rounded-lg transition duration-200 text-sm"
          >
            Go to My Dashboard
          </button>
          <button
            onClick={logout}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 
                       font-semibold py-2.5 rounded-lg transition duration-200 text-sm"
          >
            Logout
          </button>
          
        </div>

      </div>
    </div>
  );
}

export default Unauthorized;