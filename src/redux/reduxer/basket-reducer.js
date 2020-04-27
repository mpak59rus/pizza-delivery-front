import {BASKET_KEY} from "../../components/basket/basket-browser";

export const basketInitializer = () => {
    let basket = JSON.parse(localStorage.getItem(BASKET_KEY));
    if (!basket) {
        basket = {basket: []}
    }

    return basket;
};

export const actions = {
    updateQuantity: 'UPDATE',
    remove: 'REMOVE',
    clean: 'CLEAN',
};

export const basketReducer = (state, action) => {
    const {basket} = state;

    let newState = [];
    switch (action.type) {
        case actions.updateQuantity:
            newState = genNewState({basket: addToBasket(action.item, basket)});
            break;
        case actions.remove:
            const id = action.item.id;
            newState = genNewState({basket: removeFromBasket(id, basket)});
            break;
        case actions.clean:
            newState = {basket: []};
            break;
        default:
            throw new Error('Not allowed action')
    }

    saveNewState(newState);
    return newState;

    function saveNewState(state){
        localStorage.setItem(BASKET_KEY, JSON.stringify(state))
    }

    function genNewState(obj) {
        const stateCopy = Object.assign({}, state);
        return Object.assign(stateCopy, obj);
    }
};

function removeFromBasket(id, basket) {
    return basket.filter((item) => item.id !== id);
}

function addToBasket(item, basket) {
    const {id, quantity} = item;

    const foundItemIndex = basket.findIndex((item) => item.id === id);

    if (foundItemIndex > -1) {
        if (quantity > 0){
            basket[foundItemIndex].quantity = quantity;
        }else{
            basket.splice(foundItemIndex, 1);
        }
    } else {
        basket.push(item)
    }

    return basket;
}
