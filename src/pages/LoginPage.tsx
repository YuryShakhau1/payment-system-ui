import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from "../services/api_client";
import { authService } from "../services/auth_service";

export const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('Please fill all fields');
            return;
        }

        try {
            setIsLoading(true);

            const response = await apiClient.post('/auth/login', {
                email: email,
                password: password,
            });

            const { accessToken } = response.data;
            authService.setToken(accessToken);
            const userRoles = authService.getRolesFromToken(accessToken);
            const redirectPath = authService.getRedirectPath(userRoles);

            if (redirectPath) {
                navigate(redirectPath);
            } else {
                setError('No credentials found.');
                authService.removeToken();
            }
        } catch (err: any) {
            if (err.response) {
                if (err.response.status === 403) {
                    navigate('/change-password');
                    return;
                }

                if (err.response.status === 401) {
                    const message = err.response.data?.message || 'Wrong email or password. Please try again';
                    setError(message);
                } else {
                    setError('An unexpected error occurred. Please try again later.');
                }
            } else if (err.request) {
                setError('Server is not responding. Please check your internet connection.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="vh-100 w-100 d-flex align-items-center justify-content-center bg-light p-3">
            <div className="card w-100 shadow-sm border border-secondary-subtle p-4" style={{ maxWidth: '420px' }}>
                <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-3 p-3 mb-3">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="h4 font-weight-bold tracking-tight text-dark m-0">Payment System</h1>
                    <p className="small text-muted mt-1">Log in to your account</p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && (
                        <div className="alert alert-danger py-2 px-3 small font-weight-medium rounded-3 mb-3" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label small font-weight-medium text-secondary mb-1">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted">
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="form-control text-sm border-start-0 ps-1"
                                style={{ zIndex: 0 }}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small font-weight-medium text-secondary mb-1">Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted">
                                <Lock size={18} />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="form-control text-sm border-start-0 border-end-0 ps-1"
                                style={{ zIndex: 0 }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="btn btn-outline-secondary border-start-0 bg-white text-muted opacity-70"
                                style={{ border: '1px solid #dee2e6', zIndex: 3 }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full py-2 font-weight-bold"
                    >
                        {isLoading ? (
                            <span className="d-flex align-items-center justify-content-center gap-2">
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Checking...
                            </span>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
