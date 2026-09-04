import React, {useEffect, useState} from 'react';
import {apiClient} from "../../../services/api_client";
import {Pencil} from "lucide-react";
import {PaymentCard, SaveCardModal, SaveCardState} from "./SaveCardModal";
import {userService} from "../../../services/user_service.ts";

interface CardsSectionProps {
    isAdmin: boolean;
    userId: string | null;
    setError: (error: string) => void;
}

const initialCardState: SaveCardState = {cardId: null, create: false, edit: false};

const maskCardNumber = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    if (cleaned.length < 4) return cardNumber;
    return `•••• ${cleaned.slice(-4)}`;
};

const formatServerDateToInput = (dateStr: string): string => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const [year, month] = dateStr.split('-');
    const shortYear = year.slice(-2);
    return `${month}/${shortYear}`;
};

export const CardsSection = ({
                                 isAdmin,
                                 userId,
                                 setError
                             }: CardsSectionProps) => {
    const [cards, setCards] = useState<PaymentCard[]>([]);
    const [saveCardState, setSaveCardState] = useState<SaveCardState>(initialCardState);

    const fetchCards = async () => {
        try {
            const url = isAdmin
                ? `/users/payment-cards?userId=${userId}`
                : '/users/payment-cards/me';
            const cardsRes = await apiClient.get(url);
            setCards(cardsRes.data);
        } catch (err) {
            setError('Failed loading fetch cards.');
        }
    };

    const updateCards = (card: PaymentCard) => {
        if (cards.filter(c => c.id === card.id).length === 0) {
            setCards([...cards, card]);
        } else {
            setCards((prevCards) =>
                prevCards.map((c) =>
                    c.id === card.id ? card : c
                )
            );
        }
    }

    const updateCardActive = async (card: PaymentCard, active: boolean) => {
        const cardId = card.id;
        const url = userId
            ? `/users/payment-cards/${cardId}?active=${active}`
            : `/users/payment-cards/${cardId}/me?active=${active}`;
        await apiClient.patch(url);

        updateCards({
            ...card,
            active: active
        });
    };

    useEffect(() => {
        void fetchCards();
    }, [userId]);

    const handleOpenAddMode = async () => {
        const userProfile = await userService.fetchUser(isAdmin, userId);
        setSaveCardState({cardId: null, create: true, edit: false});
    };

    const handleCloseForm = () => {
        setSaveCardState({cardId: null, create: false, edit: false});
    };

    const handleOpenEditMode = (card: PaymentCard) => {
        setSaveCardState({cardId: card.id, create: false, edit: true});
    };

    const handleDeleteCard = async (card: PaymentCard) => {
        try {
            const deleteUrl = isAdmin
                ? `/users/payment-cards/${card.id}?userId=${userId}`
                : `/users/payment-cards/${card.id}/me`;
            await apiClient.delete(deleteUrl);

            setCards(prevCards => prevCards.filter(c => c.id !== card.id));
        } catch (err) {
            setError('Failed to delete card.');
        }
    };

    const handleActiveChange = (e: any, card: PaymentCard) => {
        const {checked} = e.target;
        void updateCardActive(card, checked);
    };

    return (
        <div className="bg-white p-3 border rounded shadow-sm">
            <div className="d-flex align-items-center mb-3">
                <h5 className="fw-bold mb-0 text-dark">Linked Cards</h5>
            </div>

            {saveCardState.create ? (
                <SaveCardModal
                    saveCardState={saveCardState}
                    isAdmin={isAdmin}
                    userId={userId}
                    initialCard={null}
                    onClose={handleCloseForm}
                    updateCards={updateCards}
                />
            ) : (
                <div className="mb-3">
                    <button onClick={handleOpenAddMode} className="btn btn-primary px-3">
                        + Add Card
                    </button>
                </div>
            )}

            {cards.length === 0 ? (
                <div className="text-muted fst-italic mb-2 fs-6">No cards linked.</div>
            ) : (
                <div className="row row-cols-1 g-2 mb-3">
                    {cards.map((card) => (
                        <React.Fragment key={card.id}>
                            <div className="col">
                                <div
                                    className="d-flex justify-content-between align-items-center border bg-light p-3 rounded font-monospace fs-5">
                                    <div className="text-truncate me-2">
                                        <div className="fw-bold text-truncate text-dark">
                                            {maskCardNumber(card.number)}
                                        </div>
                                        <div className="text-muted text-truncate fw-normal mt-1 fs-6">
                                            {card.holder.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 flex-shrink-0">
                                        <span
                                            className={`badge rounded-pill fw-semibold py-2 px-3 fs-6 fw-normal ${card.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                            {card.active ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className="form-check form-switch">
                                            <input
                                                type="checkbox"
                                                id="productActiveStatus"
                                                checked={card.active}
                                                onChange={(e) => handleActiveChange(e, card)}
                                                className="form-check-input cursor-pointer"
                                            />
                                        </span>
                                        <span className="badge bg-white text-dark border p-2 px-3 fs-6 fw-normal">
                                            {formatServerDateToInput(card.expirationDate)}
                                        </span>
                                        <span className="badge bg-white p-2 px-3">
                                            <button
                                                onClick={() => handleDeleteCard(card)}
                                                className="btn btn-danger"
                                                title="Edit"
                                            >
                                                Delete
                                            </button>
                                        </span>
                                        <button
                                            onClick={() => handleOpenEditMode(card)}
                                            className="btn btn-outline-primary px-3 btn-sm fs-6"
                                            title="Edit"
                                        >
                                            <Pencil size={16}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {saveCardState.edit && saveCardState.cardId === card.id && (
                                <SaveCardModal
                                    saveCardState={saveCardState}
                                    userId={userId}
                                    isAdmin={isAdmin}
                                    initialCard={card}
                                    onClose={handleCloseForm}
                                    updateCards={updateCards}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};
