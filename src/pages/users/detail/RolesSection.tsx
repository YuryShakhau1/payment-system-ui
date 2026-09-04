import React, {useEffect, useState} from "react";
import {Pencil} from "lucide-react";
import {apiClient} from "../../../services/api_client";

interface Roles {
    roleNames: string[];
}

interface RolesSectionProps {
    userId: string | null;
}

export const RolesSection = ({ userId }: RolesSectionProps) => {
    const [isEditingRoles, setIsEditingRoles] = useState(false);
    const [editRoles, setEditRoles] = useState<string[]>([]);
    const [allAvailableRoles, setAllAvailableRoles] = useState<string[]>([]);

    const [userRoles, setUserRoles] = useState<string[]>([]);

    const fetchRolesData = async () => {
        const results = await Promise.allSettled([
            apiClient.get<Roles>(userId ? `/auth/users/roles?userId=${userId}` : `/auth/users/roles/me`),
            apiClient.get<Roles>(`/auth/roles`)
        ]);

        const profileRes = results[0];

        if (profileRes.status === 'rejected') {
            throw new Error("No profile found");
        }

        const rolesRes = results[0];
        const availableRolesRes = results[1];

        setUserRoles(rolesRes.status === 'fulfilled' ? rolesRes.value.data.roleNames : []);
        setAllAvailableRoles(availableRolesRes.status === 'fulfilled' ? availableRolesRes.value.data.roleNames : []);
    };

    useEffect(() => {
        void fetchRolesData()
    }, [userId]);

    const startEditRoles = () => {
        setEditRoles([...userRoles]);
        setIsEditingRoles(true);
    };

    const saveRoles = async (updatedRoleNames: string[]) => {
        try {
            await apiClient.patch(`/auth/users/roles?userId=${userId}`, {roleNames: updatedRoleNames});
            setUserRoles(updatedRoleNames);
        } catch (err) {
            console.error("Failed to update user roles:", err);
            alert("Error saving user roles. Please try again.");
        }
    };

    const handleSaveRoles = async () => {
        await saveRoles(editRoles);
        setIsEditingRoles(false);
    };

    return (
        <div className="col-12 col-md-5 ps-md-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="text-uppercase fw-bold text-dark small mb-0 font-monospace">
                    User Roles
                </h5>

                {userId && (
                    !isEditingRoles ? (
                        <button
                        onClick={startEditRoles}
                        className="btn btn-sm btn-link text-primary p-0 text-decoration-none"
                        title="Edit roles"
                    >
                        <Pencil size={16}/>
                    </button>
                    ) : (
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setIsEditingRoles(false)}
                        />
                    )
                )}
            </div>

            {!isEditingRoles ? (
                <div className="d-flex flex-wrap gap-1">
                    {userRoles.length === 0 ? <span className="text-muted small fst-italic">No roles.</span> :
                        userRoles.map(r => <span key={r}
                                                 className="badge bg-light text-dark border font-monospace py-1.5 px-2">{r}</span>)
                    }
                </div>
            ) : (
                <>
                    <div className="d-flex flex-column gap-1 bg-light p-2 rounded border">
                        {allAvailableRoles?.map(r => (
                            <div key={r} className="form-check m-0 px-2 py-0.5">
                                <input type="checkbox" className="form-check-input" id={`r-${r}`}
                                       checked={editRoles.includes(r)}
                                       onChange={() => setEditRoles(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])}/>
                                <label className="form-check-label small font-monospace text-dark ms-2"
                                       htmlFor={`r-${r}`}>{r}</label>
                            </div>
                        ))}
                    </div>
                    <div className="d-flex gap-2 justify-content-end mt-2">
                        <button onClick={() => setIsEditingRoles(false)}
                                className="btn btn-sm btn-light border py-1 px-2 small">Cancel
                        </button>
                        <button onClick={handleSaveRoles}
                                className="btn btn-sm btn-success py-1 px-2 small">Save
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};