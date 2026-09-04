import React, {useEffect, useState} from 'react';
import {apiClient} from "../../../services/api_client";
import {dateService} from "../../../services/date_service";
import {cardService} from "../../../services/card_service";
import {userService} from "../../../services/user_service";

export interface PaymentCard {
    id: string;
    number: string;
    holder: string;
    expirationDate: string;
    active: boolean;
}

export interface SaveCardState {
    cardId: string | null;
    create: boolean;
    edit: boolean;
}

interface SaveCardModalProps {
    saveCardState: SaveCardState;
    isAdmin: boolean;
    userId: string | null;
    initialCard: PaymentCard | null;
    onClose: any;
    updateCards: (card: PaymentCard) => void;
}

export const SaveCardModal = ({
                                  saveCardState,
                                  isAdmin,
                                  userId,
                                  initialCard,
                                  onClose,
                                  updateCards
                              }: SaveCardModalProps) => {
    const [card, setCard] = useState<PaymentCard>(() => {
        return cardService.createNewCard();
    });

    useEffect(() => {
        const fetchUser = async () => {
            const user = await userService.fetchUser(isAdmin, userId);
            setCard({
                ...card,
                holder: `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`
            })
        }

        if (!initialCard) {
            try {
                void fetchUser();
            } catch (err) {
                setCard(cardService.createNewCard());
            }
        } else {
            setCard({
                ...initialCard,
                expirationDate: dateService.convertDisplayDate(initialCard.expirationDate)
            });
        }
    }, [isAdmin, userId]);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const convertCardDate = (date: string) => {
        if (!date || !date.includes('/')) return '';
        const [month, year] = date.split('/');
        const fullYear = year.length === 2 ? `20${year}` : year;
        return `${fullYear}-${month.padStart(2, '0')}-01`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        if (name === 'expirationDate') {
            setCard((prev: PaymentCard) => ({...prev, [name]: dateService.convertDisplayDate(value)}));
            return;
        }

        setCard((prev: PaymentCard) => ({...prev, [name]: value}));
    };

    const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target;
        setCard((prev: PaymentCard) => ({...prev, [name]: checked}));
    };

    const handleCloseForm = () => {
        onClose();
    };

    const handleAddCard = async (paymentCard: PaymentCard) => {
        try {
            const cardToSend = {
                ...paymentCard,
                expirationDate: convertCardDate(paymentCard.expirationDate)
            };

            const url = isAdmin
                ? `/users/payment-cards?userId=${userId}`
                : `/users/payment-cards/me`;
            const cardRes = await apiClient.post(url, cardToSend);
            updateCards(cardRes.data);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error saving card info. Please try again.');
        }
    };

    const handleEditCard = async (paymentCard: PaymentCard) => {
        try {
            const cardToSend = {
                ...paymentCard,
                expirationDate: paymentCard.expirationDate.includes('/')
                    ? convertCardDate(paymentCard.expirationDate)
                    : paymentCard.expirationDate
            };

            const url = isAdmin
                ? `/users/payment-cards/${paymentCard.id}?userId=${userId}`
                : `/users/payment-cards/${paymentCard.id}/me`;
            const cardRes = await apiClient.put(url, cardToSend);

            updateCards(cardRes.data);
        } catch (err) {
            console.error("Failed to edit payment card:", err);
            alert("Error updating card info. Please try again.");
        }
    };

    const handleSaveCard = async (e: any) => {
        e.preventDefault();

        if (!card.number.trim() || !card.holder.trim() || !card.expirationDate.trim()) {
            alert('Please fill in all fields');
            return;
        }

        const dateRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
        if (!dateRegex.test(card.expirationDate)) {
            alert('Please enter a valid expiry date in MM/YY format.');
            return;
        }

        try {
            setIsSubmitting(true);
            if (saveCardState.create) {
                await handleAddCard(card);
            } else if (saveCardState.edit) {
                await handleEditCard(card);
            }
            handleCloseForm();
        } catch (err) {
            console.error(`Failed to save card:`, err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="col">
            <form onSubmit={handleSaveCard} className="border bg-light p-3 rounded mb-3 fs-6">
                <h6 className="fw-bold mb-3 fs-5">
                    {saveCardState.create ? 'Add New Card' : 'Edit Card'}
                </h6>
                <div className="row g-3 align-items-end">
                    <div className="col-12 col-md-4">
                        <label className="form-label mb-1 fw-semibold text-secondary">Card Number</label>
                        <input
                            type="text"
                            name="number"
                            className="form-control font-monospace"
                            placeholder="1234 5678 9876 5432"
                            value={card.number}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <label className="form-label mb-1 fw-semibold text-secondary">Cardholder Name</label>
                        <input
                            type="text"
                            name="holder"
                            className="form-control"
                            placeholder="CARD HOLDER"
                            value={card.holder}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="col-6 col-sm-3 col-md-2">
                        <label className="form-label mb-1 fw-semibold text-secondary">Expiry (MM/YY)</label>
                        <input
                            type="text"
                            name="expirationDate"
                            className="form-control text-center"
                            placeholder="MM/YY"
                            value={card.expirationDate}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="col-6 col-sm-3 col-md-3">
                        <div className="form-check form-switch pb-2">
                            <input
                                type="checkbox"
                                id="cardActiveCheckbox"
                                name="active"
                                className="form-check-input"
                                checked={card.active}
                                onChange={handleActiveChange}
                                disabled={isSubmitting}
                            />
                            <label htmlFor="cardActiveCheckbox" className="form-check-label fw-semibold text-secondary">
                                Active Card
                            </label>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={handleCloseForm}
                        className="btn btn-outline-secondary px-3"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success px-4"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}
