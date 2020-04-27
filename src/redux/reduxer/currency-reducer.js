import {CURRENCY} from "../../components/other/currency";

export const currencyInitializer = () => {
    return {currency: CURRENCY.dollar};
};

export const currencyActions = {
    update: 'UPDATE'
};

export const currencyReducer = (state, action) => {
    let newState = {};
    switch (action.type) {
        case currencyActions.update:
            newState = {currency: action.item};
            break;
        default:
            throw new Error('Not allowed action')
    }

    return newState;
};
