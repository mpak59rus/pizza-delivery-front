import {AlertContext, BasketContext, CurrencyContext, UserContext} from "../redux/context";
import React, {useReducer, useState} from "react";
import {basketInitializer, basketReducer} from "../redux/reduxer/basket-reducer";
import {currencyInitializer, currencyReducer} from "../redux/reduxer/currency-reducer";

export const AppContext = (props) => {
    const alertContext = useState({success: '', error: ''});
    const basketContext = useReducer(basketReducer, undefined, basketInitializer);
    const userContext = useState({});
    const currencyContext = useReducer(currencyReducer, undefined, currencyInitializer);

    return <BasketContext.Provider value={basketContext}>
            <AlertContext.Provider value={alertContext}>
                <UserContext.Provider value={userContext}>
                    <CurrencyContext.Provider value={currencyContext}>
                        {props.children}
                    </CurrencyContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        </BasketContext.Provider>;
};


