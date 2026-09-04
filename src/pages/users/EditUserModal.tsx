import React from 'react';
import {User} from "./UserTable";

interface EditUserModalProps {
    user: User | null;
    setUser: (user: User | null) => void;
    isSaving: boolean;
    modalError: string | null;
    onSave: (e: any) => Promise<void>;
    onClose: () => void;
}

export const EditUserModal = ({
                                  user,
                                  setUser,
                                  isSaving,
                                  modalError,
                                  onSave,
                                  onClose,
                              }: EditUserModalProps) => {
    if (!user) return null;

    return (
        <tr className="table-light">
            <td colSpan={7} className="p-3">
                <div className="bg-white p-3 border rounded shadow-sm" style={{maxWidth: '500px'}}>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="m-0 h6 fw-bold">Edit User</h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={isSaving}></button>
                    </div>

                    <form onSubmit={onSave}>
                        {modalError && (
                            <div className="alert alert-danger py-2 small mb-3">{modalError}</div>
                        )}

                        <div className="row g-2 mb-2">
                            <div className="col">
                                <label className="form-label small mb-1">First Name</label>
                                <input
                                    type="text"
                                    value={user.firstName}
                                    onChange={(e) => setUser({...user, firstName: e.target.value})}
                                    required
                                    className="form-control form-control-sm"
                                    disabled={isSaving}
                                />
                            </div>
                            <div className="col">
                                <label className="form-label small mb-1">Last Name</label>
                                <input
                                    type="text"
                                    value={user.lastName}
                                    onChange={(e) => setUser({...user, lastName: e.target.value})}
                                    required
                                    className="form-control form-control-sm"
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        <div className="mb-2">
                            <label className="form-label small mb-1">Email Address</label>
                            <input
                                type="email"
                                value={user.email}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                                required
                                className="form-control form-control-sm"
                                disabled={isSaving}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small mb-1">Birth Date</label>
                            <input
                                type="date"
                                value={typeof user.birthDate === 'string' ? user.birthDate : ''}
                                onChange={(e) => setUser({...user, birthDate: e.target.value})}
                                required
                                className="form-control form-control-sm"
                                disabled={isSaving}
                            />
                        </div>

                        <div className="form-check form-switch mb-3">
                            <input
                                type="checkbox"
                                id="accountActiveStatus"
                                checked={user.active !== false}
                                onChange={(e) => setUser({...user, active: e.target.checked})}
                                className="form-check-input cursor-pointer"
                                disabled={isSaving}
                            />
                            <label htmlFor="accountActiveStatus" className="form-check-label small cursor-pointer">
                                Active Account
                            </label>
                        </div>

                        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={onClose}
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-sm btn-primary"
                                style={{minWidth: '90px'}}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </td>
        </tr>
    );
};
