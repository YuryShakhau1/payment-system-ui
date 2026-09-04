import React, {useEffect, useState} from 'react';
import { Layers, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { apiClient } from "../services/api_client";
import {authService} from "../services/auth_service";

interface AdminHeaderProps {
    panelName: string;
}

interface UserData {
    firstName: string;
    lastName: string;
}

export const Header = ({ panelName }: AdminHeaderProps) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData>();

    const loadUserData = async () => {
        const user = await apiClient.get('/auth/users/me');
        setUserData(user.data)
    };

    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (err) {
            console.error('Logout error', err);
        } finally {
            authService.removeToken();
            navigate('/login');
        }
    };

    const handleLogoutAll = async () => {
        const confirmLogout = window.confirm('Are you sure you want to logout of all devices?');
        if (!confirmLogout) return;
        try {
            await apiClient.post('/auth/logout/all');
        } catch (err) {
            console.error('Logout error', err);
        } finally {
            authService.removeToken();
            navigate('/login');
        }
    };

    useEffect(() => {
        void loadUserData();
    }, []);

    return (
        <header className="w-100 bg-white shadow-sm px-3 px-sm-4 d-flex align-items-center justify-content-between border-b border-secondary-subtle flex-shrink-0" style={{ height: '64px' }}>
            <div className="d-flex align-items-center gap-2">
                <div className="text-primary d-flex align-items-center justify-content-center">
                    <Layers size={22} />
                </div>
                <span className="fs-5 fw-bold tracking-tight">{panelName}</span>
            </div>

            <div className="d-flex align-items-center gap-2">
                <span className="fw-semibold text-secondary-emphasis me-2">{userData?.firstName}</span>
                <span className="fw-semibold text-secondary-emphasis me-2">{userData?.lastName}</span>
                <button
                    onClick={handleLogout}
                    className="btn btn-link btn-sm text-danger text-decoration-none d-flex align-items-center gap-2"
                >
                    <LogOut size={16} />
                    Log out
                </button>
                <button
                    onClick={handleLogoutAll}
                    className="btn btn-outline-danger btn-sm"
                >
                    Log out all
                </button>
            </div>
        </header>
    );
}
