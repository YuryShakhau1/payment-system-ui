import React from 'react';
import OrderTab, {Order} from "../../orders/OrdersTab";

interface OrderProps {
    isAdmin: boolean;
    userId: string | null;
    updateCart: (orderId: string) => void;
}

export const OrdersSection = ({
                                  isAdmin,
                                  userId,
                                  updateCart
                              }: OrderProps) => {
    return <OrderTab
        isAdmin={isAdmin}
        userId={userId}
        updateCart={updateCart}
    />;
};
