import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="not-found-box">
                <div className="error-code">404</div>
                <h1>Page Not Found</h1>
                <p className="error-message">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <button
                    className="home-button"
                    onClick={() => navigate('/')}
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;
