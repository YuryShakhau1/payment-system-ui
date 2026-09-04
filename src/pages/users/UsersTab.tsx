import React, {useCallback, useEffect, useState} from 'react';
import {User as UserIcon, UserPlus} from 'lucide-react';
import {apiClient} from "../../services/api_client";

import {UserFilters} from './UserFilters';
import {User, UserTable} from './UserTable';

import {Pagination} from '../../components/Pagination';
import {EditUserModal} from './EditUserModal';
import {UserDetail} from './detail/UserDetail';
import {CreateUserComponent} from '../../components/CreateUserComponent';
import {LoadingSpinner} from "../../components/LoadingSpinner";
import {ErrorModal} from "../../components/ErrorModal";

interface UsersTabProps {
    isAdmin: boolean;
    updateCart: (orderId: string) => void;
}

export const UsersTab = ({
                             isAdmin,
                             updateCart
                         }: UsersTabProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const [searchFirstName, setSearchFirstName] = useState<string>('');
    const [searchLastName, setSearchLastName] = useState<string>('');

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [modalError, setModalError] = useState<string | null>(null);

    const [activeDetailUserId, setActiveDetailUserId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const fetchUsers = useCallback(async (fName = searchFirstName, lName = searchLastName) => {
        try {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: String(currentPage),
                size: '10'
            });

            if (fName.trim()) params.append('firstName', fName.trim());
            if (lName.trim()) params.append('lastName', lName.trim());

            const response = await apiClient.get(`/users?${params.toString()}`);

            const content = response.data?.content || [];
            const totalPagesCount = response.data?.totalPages || 0;
            const totalElementsCount = response.data?.totalElements || 0;

            setUsers(content);
            setTotalPages(totalPagesCount);
            setTotalElements(totalElementsCount);
        } catch (err: any) {
            console.error('Failed to load user management:', err);
            const message = err.response?.data?.message || 'Could not load users list. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        void fetchUsers();
    }, [currentPage, fetchUsers]);

    const handleResetFilters = () => {
        setSearchFirstName('');
        setSearchLastName('');
        if (currentPage === 0) {
            void fetchUsers('', '');
        } else {
            setCurrentPage(0);
        }
    };

    const handleSearch = () => {
        if (currentPage === 0) {
            void fetchUsers(searchFirstName, searchLastName);
        } else {
            setCurrentPage(0);
        }
    };

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFirstName(e.target.value);
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchLastName(e.target.value);
    };

    const handleUserCreated = () => {
        if (currentPage === 0) {
            void fetchUsers();
        } else {
            setCurrentPage(0);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(prev => prev - 1);
    };
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
    };

    const handleOpenEditModal = (user: User) => {
        let normalizedDate = '';
        if (user.birthDate) {
            const dateObj = new Date(user.birthDate);
            if (!isNaN(dateObj.getTime())) {
                normalizedDate = dateObj.toISOString().split('T')[0];
            }
        }
        setSelectedUser({...user, birthDate: normalizedDate});
        setModalError(null);
    };

    const handleSaveChanges = async (e: any) => {
        e.preventDefault();
        if (!selectedUser) return;
        try {
            setIsSaving(true);
            setModalError(null);
            const response = await apiClient.put(`/users/${selectedUser.id}`, {
                firstName: selectedUser.firstName,
                lastName: selectedUser.lastName,
                email: selectedUser.email,
                birthDate: selectedUser.birthDate,
                active: selectedUser.active
            });
            const updatedUser = response.data || selectedUser;
            setUsers(prevUsers => prevUsers.map(u => u.id === selectedUser.id ? {...u, ...updatedUser} : u));
            setSelectedUser(null);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to update user profile. Please try again.';
            setModalError(message);
        } finally {
            setIsSaving(false);
        }
    };

    const updateUserInfo = (user: User) => {
        setUsers(prevUsers => prevUsers.map(u => u.id !== user.id ? u : user));
    }

    if (activeDetailUserId) {
        return <UserDetail
            isAdmin={isAdmin}
            userId={activeDetailUserId}
            onBack={() => setActiveDetailUserId(null)}
            setError={setError}
            updateCart={updateCart}
            updateUserInfo={updateUserInfo}
        />;
    }

    return (
        <div className="w-100 d-flex flex-column gap-4 p-2">

            <div className="d-flex align-items-start gap-3 border-secondary-subtle">
                <div className="border-bottom">
                    <h2 className="h3 fw-bold tracking-tight text-dark mb-0">User Accounts</h2>
                </div>
            </div>

            <button
                className="btn btn-primary d-flex align-self-start gap-2 shadow-sm"
                onClick={() => setIsCreateModalOpen(!isCreateModalOpen)}
            >
                <UserPlus size={16}/>
                {isCreateModalOpen ? 'Hide Form' : 'Add User'}
            </button>

            {isCreateModalOpen && (
                <div className="d-flex justify-content-start w-100">
                    <CreateUserComponent
                        onClose={() => setIsCreateModalOpen(false)}
                        isSaving={isSaving}
                        modalError={modalError}
                        onUserCreated={handleUserCreated}
                        apiClient={apiClient}
                    />
                </div>
            )}

            <UserFilters
                searchFirstName={searchFirstName}
                searchLastName={searchLastName}
                onFirstNameChange={handleFirstNameChange}
                onLastNameChange={handleLastNameChange}
                onReset={handleResetFilters}
                onSearch={handleSearch}
            />

            <LoadingSpinner isLoading={isLoading}/>
            <ErrorModal error={error}/>

            {users.length === 0 ? (
                <div
                    className="d-flex flex-column align-items-center justify-content-center text-center p-5 border border-dashed border-secondary-subtle rounded-3 bg-light"
                    style={{minHeight: '300px'}}>
                    <UserIcon size={48} className="text-muted opacity-50 mb-3"/>
                    <h3 className="h5 fw-bold text-dark mb-1">No users found.</h3>
                    <p className="text-muted small max-w-sm mb-0">No system identities match your current search
                        filters.</p>
                </div>
            ) : (
                <>
                    <UserTable
                        users={users}
                        onEdit={handleOpenEditModal}
                        onRowClick={(id) => setActiveDetailUserId(id)}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        isSaving={isSaving}
                        modalError={modalError}
                        onSaveChanges={handleSaveChanges}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalElements={totalElements}
                        onPrevPage={handlePrevPage}
                        onNextPage={handleNextPage}
                    />
                </>
            )}

            <EditUserModal
                user={selectedUser}
                setUser={setSelectedUser}
                isSaving={isSaving}
                modalError={modalError}
                onClose={() => setSelectedUser(null)}
                onSave={handleSaveChanges}
            />

        </div>
    );
};
