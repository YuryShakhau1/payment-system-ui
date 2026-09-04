import React from 'react';
import {UserRow} from './UserRow';
import {EditUserModal} from './EditUserModal';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: Date | string;
    active: boolean;
}

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onRowClick: (id: string) => void;
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;
    isSaving: boolean;
    modalError: string | null;
    onSaveChanges: (e: any) => Promise<void>;
}

export const UserTable = ({
                              users,
                              onEdit,
                              onRowClick,
                              selectedUser,
                              setSelectedUser,
                              isSaving,
                              modalError,
                              onSaveChanges
                          }: UserTableProps) => {
    return (
        <div className="table-responsive w-100 border rounded shadow-sm bg-white">
            <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light text-secondary">
                <tr>
                    <th className="py-3 text-start">User Identity</th>
                    <th className="py-3 text-start">First Name</th>
                    <th className="py-3 text-start">Last Name</th>
                    <th className="py-3 text-start">Email Address</th>
                    <th className="py-3 text-start">Birth Date</th>
                    <th className="py-3 text-center">System Status</th>
                    <th className="py-3 text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <React.Fragment key={user.id}>
                        <UserRow
                            user={user}
                            onEdit={onEdit}
                            onRowClick={onRowClick}
                        />
                        {selectedUser && selectedUser.id === user.id && (
                            <EditUserModal
                                user={selectedUser}
                                setUser={setSelectedUser}
                                isSaving={isSaving}
                                modalError={modalError}
                                onSave={onSaveChanges}
                                onClose={() => setSelectedUser(null)}
                            />
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
};
