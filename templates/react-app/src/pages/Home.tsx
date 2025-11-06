import '../styles/Home.scss';

export default function Home() {
  const handleClick = () => {
    localStorage.setItem('isAuth', 'false');
    window.location.reload();
  };

  return (
    <div className="home">
      <h1>Home Page</h1>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}
