import React, { useState } from 'react';

interface CreateUserModalProps {
    onClose: () => void;
    isSaving: boolean;
    modalError: string | null;
    onUserCreated: (newUser: any) => void;
    apiClient: any;
}

export const CreateUserComponent = ({ onClose, isSaving, modalError, onUserCreated, apiClient }: CreateUserModalProps) => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', birthDate: '', role: 'ROLE_USER' });
    const [localError, setLocalError] = useState<string | null>(null);
    const [localSaving, setLocalSaving] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleCreateUser = async (e: any) => {
        e.preventDefault();
        try {
            setLocalSaving(true);
            setLocalError(null);
            const response = await apiClient.post(`/users?role=${formData.role}`, formData);
            onUserCreated(response.data);
            if (response.data?.tempPassword) setGeneratedPassword(response.data.tempPassword);
            else onClose();
        } catch (err: any) {
            setLocalError(err.response?.data?.message || 'Failed to create user.');
        } finally { setLocalSaving(false); }
    };

    const handleCopyPassword = () => {
        if (generatedPassword) {
            navigator.clipboard.writeText(generatedPassword);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const activeSaving = isSaving || localSaving;
    const activeError = modalError || localError;

    return (
        <div className="w-100 bg-white p-3 border rounded shadow-sm" style={{ maxWidth: '500px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <h5 className="m-0 h6 fw-bold">Create New Account</h5>
                <button type="button" className="btn-close" onClick={onClose} disabled={activeSaving}></button>
            </div>

            {activeError && <div className="alert alert-danger py-2 small mb-3">{activeError}</div>}

            {generatedPassword ? (
                <div className="text-center py-2">
                    <div className="alert alert-success p-2 small mb-3">Account Created Successfully!</div>
                    <div className="mb-3 text-start">
                        <label className="form-label small mb-1">Temporary Password</label>
                        <div className="d-flex gap-2">
                            <input type="text" readOnly value={generatedPassword} className="form-control form-control-sm bg-light" />
                            <button type="button" onClick={handleCopyPassword} className="btn btn-sm btn-outline-secondary">
                                {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <button type="button" className="btn btn-sm btn-primary w-100" onClick={onClose}>Done</button>
                </div>
            ) : (
                <form onSubmit={handleCreateUser}>
                    <div className="row g-2 mb-2">
                        <div className="col">
                            <label className="form-label small mb-1">First Name</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                                placeholder="First Name"
                                className="form-control form-control-sm"
                                disabled={activeSaving}
                            />
                        </div>
                        <div className="col">
                            <label className="form-label small mb-1">Last Name</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                                placeholder="Last Name"
                                className="form-control form-control-sm"
                                disabled={activeSaving}
                            />
                        </div>
                    </div>

                    <div className="mb-2">
                        <label className="form-label small mb-1">Email Address</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="Email Address" className="form-control form-control-sm" disabled={activeSaving} />
                    </div>

                    <div className="row g-2 mb-3">
                        <div className="col">
                            <label className="form-label small mb-1">Birth Date</label>
                            <input type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} required className="form-control form-control-sm" disabled={activeSaving} />
                        </div>
                        <div className="col">
                            <label className="form-label small mb-1">System Role Access</label>
                            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="form-select form-select-sm" disabled={activeSaving}>
                                <option value="ROLE_USER">User Account</option>
                                <option value="ROLE_ADMIN">Administrator</option>
                            </select>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose} disabled={activeSaving}>Cancel</button>
                        <button type="submit" className="btn btn-sm btn-primary" style={{ minWidth: '100px' }} disabled={activeSaving}>
                            {activeSaving ? 'Creating...' : 'Register User'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
