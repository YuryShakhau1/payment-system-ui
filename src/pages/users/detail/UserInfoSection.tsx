import React, {useEffect, useState} from 'react';
import {Pencil} from "lucide-react";
import {apiClient} from "../../../services/api_client";
import {userService} from "../../../services/user_service";
import {User} from "../UserTable";

export interface UserInfoSectionProps {
    isAdmin: boolean;
    userId: string | null;
    updateUserInfo: (user: User) => void;
}

export const UserInfoSection = ({
                                    isAdmin,
                                    userId,
                                    updateUserInfo
                                }: UserInfoSectionProps) => {
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [editProfile, setEditProfile] = useState<User | null>(null);

    const [user, setUser] = useState<User | null>(null);

    const isActive = user?.active ?? false;

    const fetchUserProfileData = async () => {
        const user = await userService.fetchUser(isAdmin, userId);
        setUser(user);
        updateUserInfo(user);
    };

    useEffect(() => {
        void fetchUserProfileData()
    }, [userId]);

    const startEditInfo = () => {
        if (user) {
            const d = new Date(user.birthDate);
            const dateStr = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
            setEditProfile({...user, birthDate: dateStr});
            setIsEditingInfo(true);
        }
    };

    const saveInfo = async (updatedProfile: User) => {
        try {
            const url = userId ? `/users/${userId}` : '/users/me';
            const profile = await apiClient.put(url, updatedProfile);
            const user: User = profile.data;
            setUser(user);
            updateUserInfo(user);
        } catch (err) {
            console.error("Failed to update user profile:", err);
            alert("Error saving profile info. Please try again.");
        }
    };

    const handleSaveInfo = async () => {
        if (editProfile) {
            await saveInfo(editProfile);
            setIsEditingInfo(false);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
                <h5 className="text-uppercase fw-bold text-dark small mb-0 font-monospace">
                    User Information
                </h5>
                {!isEditingInfo ? (
                    <button
                        onClick={startEditInfo}
                        className="btn btn-sm text-primary p-0 text-decoration-none"
                        title="Edit info"
                    >
                        <Pencil size={16}/>
                    </button>
                ) : (
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setIsEditingInfo(false)}
                    />
                )}
            </div>

            <div className="d-flex gap-3 align-items-start">
                {!isEditingInfo && (
                    <div className="position-relative flex-shrink-0 mt-1">
                        <div
                            className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle fw-bold h5 m-0"
                            style={{width: '52px', height: '52px'}}>
                            {user?.firstName?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span
                            className={`position-absolute bottom-0 end-0 p-1.5 border border-2 border-white rounded-circle ${isActive ? 'bg-success' : 'bg-secondary'}`}/>
                    </div>
                )}

                <div className="text-truncate w-100 mb-2">
                    {!isEditingInfo ? (
                        <>
                            <div className="d-flex align-items-center gap-2 mb-2 text-truncate">
                                <h2 className="h6 fw-bold mb-0 text-truncate">{user?.firstName || 'Unknown'} {user?.lastName || ''}</h2>
                                <span
                                    className={`badge rounded-pill small ${isActive ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
                            </div>
                            <div className="row g-1 small text-dark">
                                <div className="col-4 text-muted text-uppercase font-monospace">Email</div>
                                <div className="col-8 text-truncate fw-medium">{user?.email || '—'}</div>
                                <div className="col-4 text-muted text-uppercase font-monospace">User ID</div>
                                <div
                                    className="col-8 text-truncate fw-medium">{user?.id || '—'}</div>
                                <div className="col-4 text-muted text-uppercase font-monospace">Birthday</div>
                                <div
                                    className="col-8 text-truncate fw-medium">{user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : '—'}</div>
                            </div>
                        </>
                    ) : (
                        <div className="row g-2">
                            <div className="col-6">
                                <input type="text" className="form-control form-control-sm"
                                       value={editProfile?.firstName || ''}
                                       onChange={e => setEditProfile(p => p ? {
                                           ...p,
                                           firstName: e.target.value
                                       } : null)} placeholder="First Name"/>
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control form-control-sm"
                                       value={editProfile?.lastName || ''}
                                       onChange={e => setEditProfile(p => p ? {
                                           ...p,
                                           lastName: e.target.value
                                       } : null)} placeholder="Last Name"/>
                            </div>
                            <div className="col-12">
                                <input type="email" className="form-control form-control-sm"
                                       value={editProfile?.email || ''} onChange={e => setEditProfile(p => p ? {
                                    ...p,
                                    email: e.target.value
                                } : null)} placeholder="Email"/>
                            </div>
                            <div className="col-12">
                                <input type="date" className="form-control form-control-sm"
                                       value={String(editProfile?.birthDate || '')}
                                       onChange={e => setEditProfile(p => p ? {
                                           ...p,
                                           birthDate: e.target.value
                                       } : null)}/>
                            </div>
                            <div className="col-12 d-flex justify-content-between mb-2 mt-2">
                                <div className="d-flex form-check form-switch align-items-center gap-2 ps-0">
                                    <input type="checkbox" className="form-check-input m-0" id="activeSw"
                                           checked={editProfile?.active || false}
                                           onChange={e => setEditProfile(p => p ? {
                                               ...p,
                                               active: e.target.checked
                                           } : null)}/>
                                    <label
                                        className="form-check-label small text-muted font-monospace"
                                        htmlFor="activeSw"
                                    >
                                        ACTIVE STATUS
                                    </label>
                                </div>
                                <div className="d-flex gap-2">
                                    <button onClick={() => setIsEditingInfo(false)}
                                            className="btn btn-sm btn-light border py-1 px-2 small">Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveInfo}
                                        className="btn btn-sm btn-success py-1 px-2 small"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
