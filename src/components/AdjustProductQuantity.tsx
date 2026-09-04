import React from "react";
import {Cart, CartActions, ProductData} from '../pages/products/ProductsTab'

interface AdjustProductQuantityProps {
    product: ProductData | null;
    cart: Cart;
    cartActions: CartActions;
}

export const AdjustProductQuantity = ({
                                          product,
                                          cart,
                                          cartActions
                                      }: AdjustProductQuantityProps) => {

    const productId = product ? product.id : '';

    return product && (
        <div className="input-group" style={{width: '120px'}}>
            <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={(e) => cartActions.addToCard(e, product, -1)}
            >
                −
            </button>

            <input
                type="number"
                className="form-control form-control-sm text-center bg-light"
                value={cart.items[productId] ? cart.items[productId].quantity : 0}
                readOnly
                style={{pointerEvents: 'none'}}
            />

            <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={(e) => cartActions.addToCard(e, product, 1)}
            >
                +
            </button>

            {cart.items[productId] && (
                <button
                    type="button"
                    title="Remove cart item"
                    className="btn-close text-center"
                    onClick={(e) => cartActions.deleteItem(e, productId)}
                />
            )}
        </div>
    );
}