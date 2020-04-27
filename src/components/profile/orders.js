import React, {useContext, useEffect, useState} from 'react';
import {Container, Spinner, Table} from "react-bootstrap";
import {Currency} from "../other";
import {UserService} from "../../services/user-service";
import {AlertContext, UserContext} from "../../redux/context";
import {PizzaPromise} from "../../helpers/promise";
import {AuthService} from "../../services/auth-service";
import {Redirect} from "react-router";
import {CONFIG} from "../../helpers/config";
import {BasketService} from "../../services/basket-service";

export const Orders = () => {
    const [items, setItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useContext(UserContext);
    const setAlert = useContext(AlertContext)[1];

    //Get data from server
    useEffect(() => {
        let isSubscribed = true;
        const callbackOrders = (data) => {
            if (!isSubscribed) return;

            setItems(data);
            setIsLoaded(true);
        };
        BasketService.getOrders(new PizzaPromise(callbackOrders));

        return () => {isSubscribed = false};
    }, []);

    //Spinner
    const renderLoading = () => <Spinner className={'m-auto mt-5'} animation={"border"} variant={"warning"}/>;

    /*
    {
        "email": "alfredo6@modulr.io",
        "name": "alfredo6",
        "address": "alfredo address 1",
        "comment": "1jkfsd hj",
        "sum": "51.60",
        "currency": "USD",
        "paid_delivery": 0,
        "items": [
            {
                "product_title": "Mexican",
                "product_id": 1,
                "quantity": 4
            }
        ]
    },
    * */

    const renderOrders = () => {
        return isLoaded ? (items ? items.map(item =>
            <Order key={item.id} id={item.id} address={item.address} sum={item.sum} currency={item.currency}
                   paid_delivery={item.paid_delivery} items={item.items}/>
        ): <h1 className={'display-1'}>You don\'t have any orders</h1>) : renderLoading();
    };

    return renderOrders();
};

const Order = (props) => {
    const {id, address, sum, currency, paid_delivery, items} = props;

    const OrderRow = (props) => {
        const {product_title, quantity} = props;

        return <tr>
            <td className="text-center">{product_title}</td>
            <td className="text-center">{quantity}</td>
        </tr>
    };

    return <div className="order-history-block"><h2>{id}</h2>
        <p>{'Address - ' + address}</p>
    <p>{'Order Sum - ' + sum + ' ' + currency}</p>
    <p><span>{paid_delivery === 1 ? 'With paid delivery' : 'Free delivery'}</span></p>
    <h4>Order Items</h4>
    <Table responsive size={'sm'}>
        <tbody>
            {items.map((item) => <OrderRow key={item.product_id} product_title={item.product_title} quantity={item.quantity}/>)}
        </tbody>
    </Table>
    </div>;
};

