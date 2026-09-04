import React, {useEffect, useState} from "react";
import {Cart, CartActions} from "../pages/products/ProductsTab";
import {AdjustProductQuantity} from "./AdjustProductQuantity";
import {apiClient} from "../services/api_client";
import {orderService} from "../services/order_service";
import {LoadingSpinner} from "./LoadingSpinner";
import {PaymentCard} from "../pages/users/detail/SaveCardModal";
import {dateService} from "../services/date_service";
import {cardService} from "../services/card_service";
import {RefreshCw} from "lucide-react";

interface CartComponentProps {
    cart: Cart;
    cartActions: CartActions;
}

export const CartComponent = ({
                                  cart,
                                  cartActions,
                              }: CartComponentProps) => {
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [selectedCardId, setSelectedCardId] = useState<string>('');
    const [activeCards, setActiveCards] = useState<PaymentCard[]>([]);
    const [cvv, setCvv] = useState<string>('');
    const [externalCard, setExternalCard] = useState<PaymentCard>(cardService.createNewCard());
    const [isExternalCard, setIsExternalCard] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    cartActions.setIsSaving = setIsSaving;

    const fetchCards = async () => {
        const cardsRes = apiClient.get('/users/payment-cards/me?active=true');
        setActiveCards((await cardsRes).data);
    }

    const payOrder = async () => {
        setError(null);

        try {
            if (!isExternalCard && !selectedCardId) {
                setError("Please select a card.");
                return;
            }

            if (cvv.length === 0) {
                setError("Please fill CVV.")
                return;
            }

            setIsSaving(true);

            const orderRes = (isExternalCard)
                ? await apiClient.post(
                    `/orders/${cart.orderId}/pay/external-card?cvv=${cvv}`, {
                        ...externalCard,
                        expirationDate: dateService.formatDateForInput(externalCard.expirationDate)
                    })
                : await apiClient.post(
                    `/orders/${cart.orderId}/pay?cardId=${selectedCardId}&cvv=${cvv}`);

            cartActions.updateOrder(orderRes.data);
        } catch (err: any) {
            if (err.request) {
                setError('Server is not responding. Please check your internet connection.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setIsSaving(false);
            setExternalCard(cardService.createNewCard());
            setCvv('');
        }
    }

    useEffect(() => {
        void fetchCards();
    }, []);

    const handleIsExternalCard = (e: any) => {
        const {checked} = e.target;
        setIsExternalCard(checked);
        setError(null);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        if (name === 'expirationDate') {
            setExternalCard((prev: PaymentCard) => ({...prev, [name]: dateService.convertDisplayDate(value)}));
            return;
        }

        setExternalCard((prev: PaymentCard) => ({...prev, [name]: value}));
    };

    if (isSaving) {
        return <LoadingSpinner isLoading={isSaving}/>;
    }

    return (
        !cart.isEmpty && (
            <div className="col-lg-4 col-md-5 d-flex flex-column gap-3">
                {error && (
                    <div className="alert alert-danger py-2 px-3 small font-weight-medium rounded-3 mb-3" role="alert">
                        {error}
                    </div>
                )}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="h4 fw-bold tracking-tight text-dark mb-0">{cart.name}</h4>
                    <div className="justify-content-end d-flex">
                        {cart.orderId && (
                            <button
                                type="button"
                                className="btn btn-sm border-0 p-0 d-flex me-2 align-items-center justify-content-end"
                                onClick={(e) => cartActions.updateCartOrder(e, cart.orderId ? cart.orderId : '')}
                            >
                                <RefreshCw size={18}/>
                            </button>
                        )}
                        <button
                            type="button"
                            className="btn-close text-center"
                            onClick={(e) => cartActions.closeForm(e)}
                        />
                    </div>
                </div>
                {cart.orderId && (
                    <div className="mt-2">ID: {cart.orderId}</div>
                )}
                {cart.orderItems.map((orderItem) => {
                    return (
                        <div key={orderItem.id}
                             className="d-flex align-items-center justify-content-between bg-success-subtle rounded-2 p-2 border-bottom">
                            <div className="fw-semibold text-truncate me-2" style={{maxWidth: '33%'}}>
                                {orderItem.productSnapshot.name}
                            </div>

                            <div className="fw-semibold text-truncate me-2">
                                {orderItem.itemPrice}
                            </div>

                            <div className="fw-semibold text-truncate me-2">
                                {orderItem.quantity}
                            </div>

                            {orderService.isStatusCreated(cart.status) && (
                                <button
                                    type="button"
                                    title="Remove cart item"
                                    className="btn-close text-center"
                                    onClick={(e) => cartActions.deleteOrderItem(e, orderItem.id)}
                                />
                            )}
                        </div>
                    );
                })}
                {cart.ids.map((productId) => {
                    const item = cart.items[productId];
                    return (
                        <div key={productId}
                             className="d-flex align-items-center justify-content-between p-2 border-bottom">
                            <div className="fw-semibold text-truncate me-2" style={{maxWidth: '33%'}}>
                                {item.product.name}
                            </div>
                            <div className="fw-semibold text-truncate me-2" style={{maxWidth: '33%'}}>
                                {item.product.price}
                            </div>

                            <AdjustProductQuantity
                                product={item.product}
                                cart={cart}
                                cartActions={cartActions}
                            />
                        </div>
                    );
                })}

                <div className="d-flex align-items-center justify-content-between p-2 border-bottom fw-bold">
                    <div className="text-truncate me-2" style={{maxWidth: '50%'}}>
                        Total sum
                    </div>
                    <div className="text-success text-end" style={{maxWidth: '50%'}}>
                        {cart.totalPrice}
                    </div>
                </div>

                {cart.status && (
                    <div className="d-flex align-items-center justify-content-between p-2 border-bottom fw-bold">
                        <div className={`text-truncate me-2 ${orderService.getStatusTextClass(cart.status)}`}
                             style={{maxWidth: '50%'}}>
                            {cart.status}
                        </div>
                    </div>
                )}

                <div className="d-flex align-items-center justify-content-center gap-2 mt-2 w-100">
                    {orderService.isStatusCreated(cart.status) && (
                        <button
                            type="button"
                            className="btn btn-secondary py-2 fw-medium shadow-sm w-100"
                            onClick={cartActions.cancelOrder}
                        >
                            Cancel Order
                        </button>
                    )}
                    {(!cart.orderId || orderService.isStatusCreated(cart.status)) && (
                        <button
                            type="button"
                            className="btn btn-primary py-2 fw-medium shadow-sm w-100"
                            onClick={cartActions.saveOrder}
                        >
                            {cart.orderId ? 'Update Order' : 'Create Order'}
                        </button>
                    )}
                </div>

                {orderService.isStatusCreated(cart.status) && (
                    <>
                        <div className="mt-2">
                            <label htmlFor="paymentCardSelect" className="form-label small fw-semibold mb-1">
                                Select Payment Method
                            </label>
                            <div className="mt-2">
                                <label htmlFor="pay-external-card" className="form-check form-switch mb-3">
                                    <span className="me-2">Pay by External Card</span>
                                    <input
                                        className="form-check-input"
                                        id="pay-external-card"
                                        type="checkbox"
                                        checked={isExternalCard}
                                        onChange={handleIsExternalCard}
                                        placeholder="CVV"
                                        disabled={isSaving}
                                    />
                                </label>
                            </div>
                            {isExternalCard ? (
                                <>
                                    <div className="mt-4">
                                        <label className="form-label mb-1 fw-semibold text-secondary">Card Number</label>
                                        <input
                                            type="text"
                                            name="number"
                                            className="form-control font-monospace"
                                            placeholder="1234 5678 9876 5432"
                                            value={externalCard.number}
                                            onChange={handleInputChange}
                                            disabled={isSaving}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label className="form-label mb-1 fw-semibold text-secondary">Cardholder
                                            Name</label>
                                        <input
                                            type="text"
                                            name="holder"
                                            className="form-control"
                                            placeholder="CARD HOLDER"
                                            value={externalCard.holder}
                                            onChange={handleInputChange}
                                            disabled={isSaving}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label className="form-label mb-1 fw-semibold text-secondary">Expiry (MM/YY)</label>
                                        <input
                                            type="text"
                                            name="expirationDate"
                                            className="form-control text-center"
                                            placeholder="MM/YY"
                                            value={externalCard.expirationDate}
                                            onChange={handleInputChange}
                                            disabled={isSaving}
                                        />
                                    </div>
                                </>
                            ) : (
                                <select
                                    className="form-select form-select-md shadow-sm cursor-pointer"
                                    value={selectedCardId}
                                    onChange={(e) => setSelectedCardId(e.target.value)}
                                >
                                    <option key="" value="">-- Choose a card --</option>
                                    {activeCards.map((card) => (
                                        <option key={card.id} value={card.id}>
                                            {card.holder} •••• {card.number.slice(-4)}
                                        </option>
                                    ))}
                                    {activeCards.length === 0 && (
                                        <option value="" disabled>No active cards available</option>
                                    )}
                                </select>
                            )}

                        </div>

                        {(isExternalCard || selectedCardId.length !== 0) && (
                            <div className="mt-2">
                                <label className="form-label small mb-1">CVV</label>
                                <input
                                    type="number"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    placeholder="CVV"
                                    required
                                    className="form-control form-control-sm"
                                    disabled={isSaving}
                                />
                            </div>
                        )}

                        <div className="mt-2">
                            <button
                                type="button"
                                className="btn btn-primary w-100 py-2 fw-medium shadow-sm"
                                onClick={payOrder}
                            >
                                Pay
                            </button>
                        </div>
                    </>
                )}
            </div>
        ));
};
