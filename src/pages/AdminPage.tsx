import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingCart, Package, CreditCard } from 'lucide-react';
import { Header } from '../components/Header';
import { UsersTab } from './users/UsersTab';
import { authService } from "../services/auth_service";
import ProductsTab from "./products/ProductsTab";
import OrdersTab from "./orders/OrdersTab";
import PaymentsTab from "./payments/PaymentsTab";

type TabType = 'users' | 'orders' | 'products' | 'payments';

export const AdminPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('users');

    useEffect(() => {
        const token = authService.getToken() || '';
        const roles = authService.getRolesFromToken(token);
        if (roles.length === 0) {
            navigate('/login');
        } else if (!roles.includes('ROLE_ADMIN')) {
            navigate('/user');
        }
    }, [navigate]);

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <UsersTab isAdmin={true} updateCart={() => {}} />;
            case 'orders':
                return <OrdersTab
                    isAdmin={true}
                    userId={null}
                    updateCart={() => {}}
                />;
            case 'products':
                return <ProductsTab
                    isAdmin={true}
                    editingOrderId={null}
                    setEditingOrderId={() => {}}
                />;
            case 'payments':
                return <PaymentsTab isAdmin={true} userId={null} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-vh-100 w-100 bg-light d-flex flex-column m-0 p-0 text-dark">
            <Header panelName={'Admin Panel'} />

            <main className="flex-grow-1 p-3 p-sm-4 w-100 mx-auto" style={{ maxWidth: '1280px' }}>
                <ul className="nav nav-tabs mb-0 border-bottom-0">
                    <li className="nav-item">
                        <button
                            className={`nav-link py-2 px-3 d-flex align-items-center gap-2 ${activeTab === 'users' ? 'active fw-semibold' : 'text-secondary'}`}
                            onClick={() => setActiveTab('users')}
                            type="button"
                        >
                            <Users size={18} />
                            <span>Users</span>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link py-2 px-3 d-flex align-items-center gap-2 ${activeTab === 'orders' ? 'active fw-semibold' : 'text-secondary'}`}
                            onClick={() => setActiveTab('orders')}
                            type="button"
                        >
                            <ShoppingCart size={18} />
                            <span>Orders</span>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link py-2 px-3 d-flex align-items-center gap-2 ${activeTab === 'products' ? 'active fw-semibold' : 'text-secondary'}`}
                            onClick={() => setActiveTab('products')}
                            type="button"
                        >
                            <Package size={18} />
                            <span>Products</span>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link py-2 px-3 d-flex align-items-center gap-2 ${activeTab === 'payments' ? 'active fw-semibold' : 'text-secondary'}`}
                            onClick={() => setActiveTab('payments')}
                            type="button"
                        >
                            <CreditCard size={18} />
                            <span>Payments</span>
                        </button>
                    </li>
                </ul>

                <div
                    className="bg-white rounded-bottom border border-secondary-subtle p-4 shadow-sm"
                    style={{ minHeight: '400px', borderTopRightRadius: '0.375rem' }}
                >
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};
