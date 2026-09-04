import React from 'react';

import {UserAndRolesSection} from "./UserAndRolesSection";
import {PaymentsSection} from "./PaymentsSection";
import {CardsSection} from "./CardsSection";
import {OrdersSection} from "./OrdersSection";
import {User} from "../UserTable.tsx";

interface UserDetailProps {
    isAdmin: boolean;
    userId: string | null;
    onBack: () => void;
    setError: (error: string) => void;
    updateCart: (orderId: string) => void;
    updateUserInfo: (user: User) => void;
}

export const UserDetail = ({
                               isAdmin,
                               userId,
                               onBack,
                               setError,
                               updateCart,
                               updateUserInfo
                           }: UserDetailProps) => {
    return (
        <div className="w-100 d-flex flex-column gap-3 p-2">
            {userId && (
                <div>
                    <button onClick={onBack} className="btn btn-sm btn-outline-secondary">← Back</button>
                </div>
            )}

            <UserAndRolesSection
                isAdmin={isAdmin}
                userId={userId}
                updateUserInfo={updateUserInfo}
            />
            <CardsSection isAdmin={isAdmin} userId={userId} setError={setError}/>
            <OrdersSection isAdmin={isAdmin} userId={userId} updateCart={updateCart}/>
            <PaymentsSection isAdmin={isAdmin} userId={userId}/>
        </div>
    );
};
