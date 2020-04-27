import React, {useContext} from "react";
import {CurrencyContext} from "../../redux/context";

export const CURRENCY = {
    dollar: {name: 'USD', prefix: true},
    euro: {name: 'EUR', suffix: true}
};

export const Currency = (props) => {
    const curCurrency = useContext(CurrencyContext)[0];
    const {children} = props;

    const currency = curCurrency.currency;

    if (isNaN(children)) {
        return <div>NaN</div>
    }

    let val = children;

    val += ' ' + currency.name;

    return <span>{val}</span>;
};

