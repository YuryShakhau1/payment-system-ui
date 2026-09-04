import {PaymentCard} from "../pages/users/detail/SaveCardModal";

export const cardService = {

    createNewCard: (): PaymentCard => {
        return {
            id: '',
            number: '',
            holder: '',
            expirationDate: '',
            active: true
        }
    }
}