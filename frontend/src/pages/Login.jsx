import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import PageWrapper from '../components/PageWrapper';

const Login = () => {
    const auth = useAuth();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    useEffect(() => {
        if (auth?.isLoggedIn && auth.user) {
            navigate("/chat");
        }
    }, [auth, navigate]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prevState => ({
                ...prevState,
                [name]: ''
            }));
        }
        setApiError('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setIsLoading(true);
                setApiError('');
                await login(formData.email, formData.password);
            } catch (error) {
                setApiError(error.message || 'An error occurred during login');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <PageWrapper>
            <div className="login-container">
                <div className="login-box">
                    <h1>Welcome Back</h1>
                    <p className="subtitle">Please sign in to your account</p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                                placeholder="Enter your email"
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'error' : ''}
                                placeholder="Enter your password"
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        {apiError && <div className="api-error">{apiError}</div>}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>

                        <p className="signup-link">
                            Don&apos;t have an account? <a href="/signup">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Login;
