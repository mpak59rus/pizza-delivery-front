import {Card, Col, ProgressBar, Row, Spinner} from "react-bootstrap";
import React, {useState, useEffect, useContext} from "react";
import {PlusSquare, PlusSquareFill} from "bootstrap-icons-react";

import './menu.scss';
import {MenuService} from "../../services/menu-service";
import {BasketContext, CurrencyContext} from "../../redux/context";
import {actions} from "../../redux/reduxer/basket-reducer";
import {PizzaPromise} from "../../helpers/promise";
import {Currency} from "../other/currency";

const CATEGORIES_KEY = 'categories';
const PRODUCTS_KEY = 'products';

/*
*   Render all categories
*
* */
export const MenuBrowser = () => {
    const [items, setItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currencyContext, currencyDispatch] = useContext(CurrencyContext);

    const currency = currencyContext.currency.name;

    //Get items from localStorage if exist
    useEffect(() => {
        const items = JSON.parse(localStorage.getItem(CATEGORIES_KEY));

        if (items && Object.keys(items).length > 0) {
            setItems(items);
            setIsLoaded(true)
        }
    }, []);

    //Get data from server
    useEffect(() => {
        let isSubscribed = true;
        const callbackCategories = (data) => {
            if (!isSubscribed) return;

            setItems(data);
            setIsLoaded(true);
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data));
        };
        MenuService.fetchCategories(new PizzaPromise(callbackCategories));

        return () => {isSubscribed = false};
    }, []);

    //Spinner
    const renderLoading = () => <Spinner className={'m-auto mt-5'} animation={"border"} variant={"warning"}/>;

    const renderCategories = () => {
        return isLoaded ? (items ? items.map(item =>
            <Category key={item.id} id={item.id} title={item.title} slug={item.slug} description={item.description} currency={currency}/>
        ): null) : renderLoading();
    };

    return renderCategories();
};


/*
*   Render whole category with title and items.
*
*  PROPS:
*   id - id of category got from server
*   title - category title
*   slug - category system name
*   description - category description
*
* */
const Category = (props) => {
    const {id, slug, title, description, currency} = props;
    const [items, setItems] = useState([]);
    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem(PRODUCTS_KEY + '_' + id));

        if (items && Object.keys(items).length > 0) {
            setItems(items);
            setIsloading(false)
        }
    }, [id]);

    useEffect(() => {
        let isSubscribed = true;

        const callback = (data) => {
            if (!isSubscribed) return;

            setIsloading(false);
            setItems(data);
            localStorage.setItem(PRODUCTS_KEY + '_' + id, JSON.stringify(data))
        };

        MenuService.fetchProducts(id, new PizzaPromise(callback));

        return () => {isSubscribed = false}
    }, [id]);

    const renderLoading = () => <ProgressBar variant={"warning"} animated now={100}/>;

    return <div className={'d-flex flex-column'}>
        <Col>
            <CategoryHeader title={title} description={description}/>
        </Col>
        <Col>
            {isLoading ? renderLoading() : (items ? <CategoryBody currency={currency} category={title} items={items}/> : null)}
        </Col>
    </div>
};


/*
*   Render header of category
*
*  PROPS:
*   title - category title
*   description - category description
*
* */
const CategoryHeader = (props) => {
    const {title, description} = props;

    return <Row>
        <Col className={'menu-category-container text-center'}>
            <h1>{title}</h1>
            <p>{description}</p>
        </Col>
    </Row>;
};


/*
*   Render body of category with products
*
*  PROPS:
*   items - Products array
*
* */
const CategoryBody = (props) => {
    const {currency, items, category} = props;

    return items ? <Row>
        {items.map((item) =>
            <Col className={'menu-item-container'} key={item.id}>
                <MenuItem image_url={item.image_url} category_id={item.category_id} id={item.id} title={item.title}
                    price_usd={item.price_usd} price_eur={item.price_eur} slug={item.slug} description={item.description} currency={currency}/>
            </Col>
        )}
    </Row> : null;
};


/*
*   Render one product
*
*  PROPS:
*   id - product id
*   category_id - product category_id
*   title - product title
*   slug - product system name
*   description - product description
*   price_eur - product price in euro
*   price_usd - product price in usd
*   image_url - product image url
* @todo: добавить вывод обозначения валюты и выбор цены в зависимости от валюты
* */
const MenuItem = (props) => {
    const {id, category_id, title, slug, description, price_eur, price_usd, image_url, currency} = props;
    const imgWidth = '300px';

    const [quantity, setQuantity] = useState(0);
    const [isInBasket, setIsInBasket] = useState(false);

    const [basketContext, basketDispatch] = useContext(BasketContext);

    useEffect(() => {
        const basket = basketContext.basket;

        if (basket) {
            const item = basket.find(el => el.id === id);

            if (item) {
                const newQuantity = item.quantity;
                setQuantity(newQuantity);
                if (newQuantity > 0) setIsInBasket(true);
            }
        }
    }, []);

    const updateContext = (newQuantity) => {
        basketDispatch({
            type: actions.updateQuantity,
            item: {id: id, title: title, price_usd: price_usd, price_eur: price_eur, quantity: newQuantity, category: category_id}
        });
    };

    const onAddClick = (e) => {
        e.preventDefault();
        const newState = !isInBasket;
        setIsInBasket(newState);

        const newQuantity = newState ? 1 : 0;
        setQuantity(newQuantity);
        updateContext(newQuantity);
    };

    const onQuantityChanged = (e) => {
        e.preventDefault();
        const val = e.target.value;
        const newQuantity = val ? val : 0;

        if (newQuantity > 0) {
            setIsInBasket(true);
        } else {
            setIsInBasket(false);
        }

        setQuantity(newQuantity);
        updateContext(newQuantity);
    };

    const price = ((currency == 'USD') ? price_usd : price_eur);

    const renderAddBtn = () =>
        <button className={'add-btn text-center text-success icon-btn'} onClick={onAddClick}>
            {isInBasket ? <PlusSquareFill/> : <PlusSquare/>}
        </button>;

    return <Card className={'menu-item d-flex flex-column align-items-center'}>
        <Card.Img loading={"lazy"} src={image_url} width={imgWidth}/>
        <Card.Body className={'w-100'}>

            <Row className={'d-flex align-items-end'}>
                <Col
                    className={'text-left px-0'}>
                    <h5>{title}</h5>
                    <p>{description}</p>
                </Col>

                <Row className={'d-flex align-items-baseline'}>
                    <Col className={'text-center text-dark price-container'}>
                        <Currency>{price}</Currency>
                    </Col>

                    <Col className={'text-right d-flex flex-row align-items-end'}>
                        {renderAddBtn()}
                        <input className={'product-quantity text-center'} type={'number'} min={0}
                               onChange={onQuantityChanged} value={quantity}/>
                    </Col>
                </Row>
            </Row>
        </Card.Body>
    </Card>
};
