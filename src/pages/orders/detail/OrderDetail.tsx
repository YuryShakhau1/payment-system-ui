import React, {useState} from 'react';
import {OrderSection} from "./OrderSection";
import {Order} from "../OrdersTab";
import {UserInfoSection} from "../../users/detail/UserInfoSection";
import {User} from "../../users/UserTable.tsx";

interface OrderDetailProps {
    isAdmin: boolean;
    order: Order;
    onSaveOrder: (order: Order) => void;
    onBack: (order: Order) => void;
    updateCart: (orderId: string) => void;
    updateUserInfo: (user: User) => void;
}

export const OrderDetail = ({
                                isAdmin,
                                order,
                                onSaveOrder,
                                onBack,
                                updateCart,
                                updateUserInfo
                            }: OrderDetailProps) => {
    const [error] = useState<string | null>(null);

    if (error) {
        return (
            <div className="alert alert-danger m-3 d-flex flex-column align-items-start gap-2" role="alert">
                <span>{error}</span>
                <button onClick={() => onBack(order)} className="btn btn-sm btn-outline-danger">← Back</button>
            </div>
        );
    }

    return (
        <div className="w-100 d-flex flex-column gap-3 p-2">
            <div>
                <button onClick={() => onBack(order)} className="btn btn-sm btn-outline-secondary">← Back</button>
            </div>

            {isAdmin && (
                <div className="bg-white p-3">
                    <div className="row g-4">
                        <div className="col-12 col-md-7 border shadow-sm rounded pe-md-4">
                            <UserInfoSection
                                isAdmin={isAdmin}
                                userId={order.userId}
                                updateUserInfo={updateUserInfo}
                            />
                        </div>
                    </div>
                </div>
            )}

            <OrderSection
                isAdmin={isAdmin}
                orderId={order.id}
                onSaveOrder={onSaveOrder}
                onBackClick={onBack}
                updateCart={updateCart}
            />
        </div>
    );
};
