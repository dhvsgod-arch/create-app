import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Login.scss';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';
  const isAuth = localStorage.getItem('isAuth') === 'true';

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = () => {
    localStorage.setItem('isAuth', 'true');
    navigate(from, { replace: true });
  };

  return (
    <div className="container">
      <div className="welcome">
        <h1>Thanks for using @shark-pepper/create-app</h1>
        <h2>Let's start coding!</h2>
      </div>
      <button onClick={handleLogin}>Login Now</button>
    </div>
  );
}
