import {Button, Col, Container, ListGroup, Row, Spinner, Table} from "react-bootstrap";
import React, {useContext, useEffect, useRef, useState} from "react";
import {Currency} from "../other";
import {Trash} from "bootstrap-icons-react";
import {AlertContext, BasketContext, CurrencyContext, ParamsContext} from "../../redux/context";
import {actions} from "../../redux/reduxer/basket-reducer";
import {Order} from "./order-modal";
import {BasketService} from "../../services/basket-service";
import {ParamsService} from "../../services/params-service";
import {PizzaPromise} from "../../helpers/promise";

export const BASKET_KEY = 'basket';
const PARAMS_KEY = 'params';

export const BasketPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [basketContext, basketDispatch] = useContext(BasketContext);
    const [currencyContext, currencyDispatch] = useContext(CurrencyContext);
    const [params, setParams] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const setAlert = useContext(AlertContext)[1];

    const currency = currencyContext.currency.name;

    var totalPrice = basketContext.basket.reduce((accum, val) => accum + ((currency === 'USD') ? val.price_usd : val.price_eur) * val.quantity, 0);

    const isSubscribed = useRef();
    useEffect(() => {
        isSubscribed.current = true;

        return () => {isSubscribed.current = false}
    }, []);

    const onSubmitClickHandler = e => {
        e.preventDefault();

        setIsLoading(true);
        setShowModal(true);
    };

    const onOrderCloseHandler = e => {
        if (!isSubscribed.current) return;

        let btnName;
        if (e) {
            e.persist();
            btnName = e.target.name;
        }

        const callback = data => {
            basketDispatch({type: actions.clean});
            setAlert({success: 'You order is cooking now...'});
            setIsLoading(false);
        };

        if (btnName === 'order') {
            BasketService.makeOrder(basketContext.basket, new PizzaPromise(callback));
        } else {
            setIsLoading(false);
        }

        setShowModal(false);
    };

    //Get params from localStorage if exist
    useEffect(() => {
        const params = JSON.parse(localStorage.getItem(PARAMS_KEY));

        if (params && Object.keys(params).length > 0) {
            setParams(params);
            setIsLoaded(true)
        }
    }, []);

    //Get params from server
    useEffect(() => {
        let isSubscribed = true;
        const callbackParams = (data) => {
            if (!isSubscribed) return;

            setParams(data);
            setIsLoaded(true);
            localStorage.setItem(PARAMS_KEY, JSON.stringify(data));
        };
        ParamsService.fetchParams(new PizzaPromise(callbackParams));

        return () => {isSubscribed = false};
    }, []);

    /*params
    deliveryEUR: "3"
    deliveryUSD: "4"
    minsumEUR: "15"
    minsumUSD: "17"*/
    var deliveryPrice = 0;
    if(currency === 'USD') {
        if (Object.keys(params).length !== 0 && totalPrice <= params.minsumUSD) {
            deliveryPrice = params.deliveryUSD;
        }
    } else {
        if (Object.keys(params).length !== 0 && totalPrice <= params.minsumEUR) {
            deliveryPrice = params.deliveryEUR;
        }
    }
    deliveryPrice = parseFloat(deliveryPrice);
    totalPrice = parseFloat(totalPrice);

    return <div>
        <BasketBrowser
            onSubmitClickHandler={onSubmitClickHandler}
            isLoading={isLoading}
            basketContext={basketContext}
            basketDispatch={basketDispatch}
            total={totalPrice}
            currency={currency}
            deliveryPrice={deliveryPrice}
        />

        <Order
            show={showModal}
            onClose={onOrderCloseHandler}
            totalPrice={totalPrice + deliveryPrice}
            currency={currency}
        />
    </div>
};

const BasketBrowser = (props) => {
    const {onSubmitClickHandler, isLoading, basketContext, basketDispatch, currency, total, deliveryPrice} = props;

    const onDeleteHandler = id => {
        basketDispatch({
            type: actions.remove,
            item: {id: id}
        });
    };

    const renderBasketTable = () =>
        <BasketTable items={basketContext.basket} currency={currency} onDelete={onDeleteHandler}/>;

    const renderBasketSummary = () =>
        <BasketSummary
            total={total}
            deliveryPrice={deliveryPrice}
            onClickHandler={onSubmitClickHandler}
            isLoading={isLoading}
        />;

    return <Container className={'my-3'}>
        {
            basketContext.basket.length > 0
                ? <div>
                    {renderBasketTable()}
                    {renderBasketSummary()}
                </div>
                : <h1 className={'display-4 text-center'}>There are no items in basket</h1>
        }
    </Container>
};

/*
* Render table with content
*
* PROPS:
*   items - items that are added to basket
*
* */
const BasketTable = (props) => {
    const {items, currency, onDelete} = props;

    const renderHeader = () =>
        <thead>
        <tr>
            <th scope="col" className="border-0 bg-light">
                <div className="p-2 px-3">Product</div>
            </th>
            <th scope="col" className="border-0 bg-light">
                <div className="py-2">Price</div>
            </th>
            <th scope="col" className="border-0 bg-light">
                <div className="py-2">Quantity</div>
            </th>
            <th scope="col" className="border-0 bg-light">
                <div className="py-2">Remove</div>
            </th>
        </tr>
        </thead>;

    /*
* Render table item
*
* PROPS:
*   image_url - image url
*   title - title of product
*   price_usd - price of item in usd
*   price_eur - price of item in euro
*   quantity - quantity of item
*   id - id of item
*   onDeleteHandler - on delete item handler
*
* */
const BasketTableItem = (props) => {
    const {image_url, title, price_usd, price_eur, currency, quantity, id, onDeleteHandler} = props;

    const price = ((currency === 'USD') ? price_usd : price_eur);

    return <tbody>
        <tr>
            <th scope="row" className="border-0">
                <div className="p-2">
                    <img src={image_url} alt="" width="70" className="img-fluid rounded shadow-sm"/>
                    <div className="ml-3 d-inline-block align-middle">
                        <h5 className="mb-0 text-dark d-inline-block align-middle">
                            {title}
                        </h5>
                    </div>
                </div>
            </th>
            <td className="border-0 align-middle"><strong>
                <Currency>{price}</Currency>
            </strong></td>
            <td className="border-0 align-middle"><strong>
                {quantity}
            </strong></td>
            <td className="border-0 align-middle">
                <button onClick={() => onDeleteHandler(id)} className={'icon-btn'}>
                    <Trash/>
                </button>
            </td>
        </tr>
        </tbody>
    };

    return <div className={'table-responsive'}>
        <Table>
            {renderHeader()}
            {items.map(item =>
                <BasketTableItem
                    image={item.image_url} title={item.title} price_usd={item.price_usd} price_eur={item.price_eur}
                    currency={currency} quantity={item.quantity} key={item.id} id={item.id} onDeleteHandler={onDelete} />
            )}
        </Table>
    </div>
};


/*
* Render summary
*
* PROPS:
*   total - total menu price
*   deliveryPrice - price of delievery
*   onClickHandler - handler for submit button
*   isLoading - loading state
*
* */
const BasketSummary = (props) => {
    const {total, deliveryPrice, onClickHandler, isLoading} = props;

    const renderBody = () =>
        <ListGroup className={'mb-4'}>
            <ListGroup.Item className="d-flex justify-content-between py-3 border-bottom">
                <strong className="text-muted">Order Subtotal</strong>
                <strong><Currency>{total}</Currency></strong>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between py-3 border-bottom">
                <strong className="text-muted">Delivery cost</strong>
                <strong><Currency>{deliveryPrice}</Currency></strong>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between py-3 border-bottom">
                <strong className="text-muted">Total</strong>
                <h5 className={'font-weight-bold'}><Currency>{total + deliveryPrice}</Currency></h5>
            </ListGroup.Item>
        </ListGroup>;

    return <Row className="py-5 p-4 bg-white rounded shadow-sm">
        <Col id="order-summary">
            <div className="p-4">
                {renderBody()}
                <Button onClick={onClickHandler} disabled={isLoading} block variant={"success"}>
                    {isLoading ? <Spinner animation={"grow"} variant={"success"}/> : 'Procceed to checkout'}
                </Button>
            </div>
        </Col>
    </Row>
};

