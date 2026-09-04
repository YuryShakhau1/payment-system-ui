import React, {useEffect, useState} from 'react';
import {CreditCard, Package, ShoppingCart, Users} from 'lucide-react';
import {Header} from '../components/Header';
import {UserDetail} from "./users/detail/UserDetail";
import ProductsTab from "./products/ProductsTab";
import OrdersTab from "./orders/OrdersTab";
import {authService} from "../services/auth_service";
import {useNavigate} from "react-router-dom";
import PaymentsTab from "./payments/PaymentsTab";
import {ErrorModal} from "../components/ErrorModal";

export type TabType = 'products' | 'orders' | 'payments' | 'me';

export const UserPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('products');
    const [error, setError] = useState<string | null>(null);

    const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

    useEffect(() => {
        const token = authService.getToken() || '';
        const roles = authService.getRolesFromToken(token);
        if (roles.length === 0) {
            navigate('/login');
        }
    }, [navigate]);

    const updateCart = (orderId: string) => {
        setEditingOrderId(orderId)
        setActiveTab('products');
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return <ProductsTab
                    isAdmin={false}
                    editingOrderId={editingOrderId}
                    setEditingOrderId={setEditingOrderId}
                />;
            case 'orders':
                return <OrdersTab
                    isAdmin={false}
                    userId={null}
                    updateCart={updateCart}
                />;
            case 'payments':
                return <PaymentsTab isAdmin={false} userId={null} />;
            case 'me':
                return <UserDetail
                    isAdmin={false}
                    userId={null}
                    onBack={() => null}
                    setError={setError}
                    updateCart={updateCart}
                    updateUserInfo={() => {}}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="min-vh-100 w-100 bg-light d-flex flex-column m-0 p-0 text-dark">
            <Header panelName={'User Panel'} />

            <ErrorModal error={error}/>

            <main className="flex-grow-1 p-3 p-sm-4 w-100 mx-auto" style={{ maxWidth: '1280px' }}>
                <ul className="nav nav-tabs mb-0 border-bottom-0">
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
                            className={`nav-link py-2 px-3 d-flex align-items-center gap-2 ${activeTab === 'payments' ? 'active fw-semibold' : 'text-secondary'}`}
                            onClick={() => setActiveTab('payments')}
                            type="button"
                        >
                            <CreditCard size={18} />
                            <span>Payments</span>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link py-2 px-3 d-flex align-items-center gap-2 ${activeTab === 'me' ? 'active fw-semibold' : 'text-secondary'}`}
                            onClick={() => setActiveTab('me')}
                            type="button"
                        >
                            <Users size={18} />
                            <span>Me</span>
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
