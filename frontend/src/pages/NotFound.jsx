import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-secondary py-12 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200 mb-4 font-heading">404</h1>
        <h2 className="text-3xl font-bold text-dark mb-4">Page Not Found</h2>
        <p className="text-muted mb-8 max-w-md mx-auto">Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <Link to="/" className="btn btn-primary px-8">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
