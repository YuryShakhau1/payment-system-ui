import {Cart, CartItem} from "../pages/products/ProductsTab";
import {Order, OrderItem} from "../pages/orders/OrdersTab";
import {apiClient} from "./api_client";

export const orderService = {

    getStatusBadgeClass: (status: string): string => {
        switch (status?.toUpperCase()) {
            case 'CREATED':
                return 'bg-primary text-white';
            case 'PAID':
            case 'IN_DELIVERY':
            case 'COMPLETED':
            case 'SUCCESS':
                return 'bg-success text-white';
            case 'PENDING_PAYMENT':
                return 'bg-primary text-white';
            case 'PAYMENT_FAILED':
            case 'FAILED':
                return 'bg-danger text-white';
            case 'CANCELLED':
            case 'REFUNDED':
                return 'bg-secondary text-white';
            default:
                return 'bg-secondary text-white';
        }
    },

    getStatusTextClass: (status: string): string => {
        switch (status?.toUpperCase()) {
            case 'CREATED':
                return 'text-primary';
            case 'PAID':
            case 'IN_DELIVERY':
            case 'COMPLETED':
                return 'text-success';
            case 'PENDING_PAYMENT':
                return 'text-primary';
            case 'PAYMENT_FAILED':
                return 'text-danger';
            case 'CANCELLED':
            case 'REFUNDED':
                return 'text-secondary';
            default:
                return 'text-secondary';
        }
    },

    getActiveTextClass: (active: boolean): string => {
        return (active) ? 'text-success' : 'text-secondary';
    },

    getTotalPrice: (items: Record<string, CartItem>, ids: string[], orderItems: OrderItem[]): number => {
        const price = ids.reduce((sum, id) => {
            const item = items[id];
            return sum + item.product.price * item.quantity;
        }, 0);

        const orderPrice = orderItems.reduce((sum, item) => {
            return sum + item.itemPrice * item.quantity;
        }, 0);

        return price + orderPrice;
    },

    createNewCart: (): Cart => {
        return {
            name: 'Cart',
            orderId: null,
            orderItems: [],
            items: {},
            totalPrice: 0,
            ids: [],
            isEmpty: true,
            status: ''
        };
    },

    loadOrder: async (orderId: string, userId: string | null, isAdmin: boolean): Promise<Order> => {
        const url = isAdmin
            ? `/orders/${orderId}?userId=${userId}`
            : `orders/${orderId}/me`;

        const orderRes = await apiClient.get(url);
        return orderRes.data;
    },

    changeOrderStatus: async (orderId: string, userId: string | null, isAdmin: boolean, status: string): Promise<Order> => {
        const url = isAdmin
            ? `/orders/${orderId}?userId=${userId}&status=${status}`
            : `orders/${orderId}/me?status=${status}`;

        const orderRes = await apiClient.patch(url);
        return orderRes.data;
    },

    cancelOrder: async (orderId: string, userId: string | null, isAdmin: boolean): Promise<Order> => {
        return orderService.changeOrderStatus(orderId, userId, isAdmin, 'CANCELLED');
    },

    deleteOrder: async (orderId: string, userId: string | null, isAdmin: boolean): Promise<Order> => {
        return orderService.changeOrderStatus(orderId, userId, isAdmin, 'DELETED');
    },

    isStatusCreated: (status: string): boolean => {
        return status === 'CREATED' || status === 'PAYMENT_FAILED';
    },

    isCreated: (order: Order): boolean => {
        const status = order.status;
        return orderService.isStatusCreated(status);
    }
};