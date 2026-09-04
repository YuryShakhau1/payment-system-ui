import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from "../services/api_client";

export const ChangePasswordPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async (e: any) => {
        e.preventDefault();
        setError(null);

        if (!password || !newPassword || !repeatNewPassword) {
            setError('Please fill all fields');
            return;
        }

        if (newPassword !== repeatNewPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);

            await apiClient.patch('/auth/users/change-password', {
                email: email,
                password: password,
                newPassword: newPassword,
                repeatNewPassword: repeatNewPassword
            }, {});

            navigate('/login');
        } catch (err: any) {
            if (err.response) {
                const message = err.response.data?.message || 'Failed to change password. Please try again.';
                setError(message);
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
        <div className="min-vh-100 w-100 d-flex align-items-center justify-content-center bg-light p-4">
            <div className="card w-100 shadow border-secondary-subtle p-4" style={{ maxWidth: '448px' }}>
                <div className="card-body p-0">
                    <div className="d-flex flex-column align-items-center text-center mb-4">
                        <div className="d-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning rounded-3 p-3 mb-3">
                            <ShieldAlert size={32} />
                        </div>
                        <h1 className="h3 fw-bold mb-1">Change password</h1>
                        <p className="text-muted small mb-0">Change password required according security reason</p>
                    </div>

                    <form onSubmit={handleChangePassword}>
                        {error && (
                            <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label fw-medium small mb-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="Email"
                                disabled={isLoading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control form-control-sm"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-medium small mb-1">Password</label>
                            <div className="position-relative d-flex align-items-center">
                                <Lock
                                    className="position-absolute start-0 ms-3 text-muted opacity-50 z-3"
                                    size={18}
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Minimum 7 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="form-control form-control-sm ps-5 pe-5"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="position-absolute end-0 me-3 btn p-0 border-0 text-muted opacity-50 z-3"
                                    style={{ background: 'none' }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-medium small mb-1">New password</label>
                            <div className="position-relative d-flex align-items-center">
                                <Lock
                                    className="position-absolute start-0 ms-3 text-muted opacity-50 z-3"
                                    size={18}
                                />
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="Minimum 7 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="form-control form-control-sm ps-5 pe-5"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="position-absolute end-0 me-3 btn p-0 border-0 text-muted opacity-50 z-3"
                                    style={{ background: 'none' }}
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium small mb-1">Repeat new password</label>
                            <div className="position-relative d-flex align-items-center">
                                <Lock
                                    className="position-absolute start-0 ms-3 text-muted opacity-50 z-3"
                                    size={18}
                                />
                                <input
                                    type={showRepeatNewPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={repeatNewPassword}
                                    onChange={(e) => setRepeatNewPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="form-control form-control-sm ps-5 pe-5"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowRepeatNewPassword(!showRepeatNewPassword)}
                                    className="position-absolute end-0 me-3 btn p-0 border-0 text-muted opacity-50 z-3"
                                    style={{ background: 'none' }}
                                >
                                    {showRepeatNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-100 mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Password changing...
                                </>
                            ) : (
                                'Change password'
                            )}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};
