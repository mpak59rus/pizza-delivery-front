import {Button, Container, Form, FormGroup, Modal, NavDropdown, Spinner} from "react-bootstrap";
import React, {useContext, useState} from "react";
import {Currency} from "../other";
import {BasketContext, CurrencyContext} from "../../redux/context";
import {PizzaPromise} from "../../helpers/promise";
import {useForm} from "../../hooks/useForm";
import {BasketService} from "../../services/basket-service";
import OrderValidator from "../../validators/order-validator";


export const Order = props => {
    const {show, onClose, totalPrice, paid_delivery} = props;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(false);
    const [basketContext, basketDispatch] = useContext(BasketContext);
    const [currencyContext, currencyDispatch] = useContext(CurrencyContext);

    const currency = currencyContext.currency.name;

    const sendOrder = (values) => {
        /*{
            "email": "alfredo6@modulr.io",
            "name": "alfredo6",
            "address": "alfredo address 1",
            "comment": "1jkfsd hj",
            "currency": "USD",
            "paid_delivery": 0,
            "items": [
            {
                "product_id": 3,
                "quantity": 4
            },
        ]
        }*/

        let items = basketContext.basket.map(val => ({ product_id: val.id, quantity: val.quantity }) );

        const data = {
            email: values.email,
            name: values.name,
            address: values.address,
            comment: values.comment,
            currency: currency,
            paid_delivery: paid_delivery > 0 ? 1 : 0,
            items: items
        };

        setLoading(true);

        const callback = (data) => {
            setLoading(false);

            if (data?.message) {
                basketContext.basket.length = 0;
                setMessage('Your order is accepted');
            } else {
                setMessage('Data is incorrect');
            }
        };

        const error = () => {
            setMessage('Data is incorrect');

            setLoading(false);
        };

        BasketService.makeOrder(data, new PizzaPromise(callback, error));
    };

    return <OrderBrowser handleSendOrder={sendOrder} loading={loading} totalPrice={totalPrice} onClose={onClose} message={message} show={show}/>;
};
const OrderBrowser = (props) => {
    const {handleSendOrder, message, loading, totalPrice, onClose, show} = props;
    const {values, handleChange, handleSubmit} = useForm(handleSendOrder, OrderValidator);
    const [validated, setValidated] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity()) {
            handleSubmit(e);
        }

        setValidated(true);
    };

    const renderBody = () => <Form validated={validated} method="post" onSubmit={onSubmit}>
        <Container fluid>
            <Form.Group>
                <Form.Control required name="name" type={'text'} placeholder='Name' onChange={handleChange}/>
            </Form.Group>
            <Form.Group>
                <Form.Control required name="email" placeholder='Email' type="email" onChange={handleChange}/>
            </Form.Group>
            <Form.Group>
                <Form.Control required name="address" type={'text'} placeholder='Enter your delivery address' onChange={handleChange}/>
            </Form.Group>
            <Form.Group>
                <Form.Control required name="phone" type={'text'} placeholder='Enter your phone number' onChange={handleChange}/>
                <Form.Text>We will contact you when the order is completed</Form.Text>
            </Form.Group>
            <Form.Group>
                <Form.Control required name="comment" type={'text'} placeholder='Comment' onChange={handleChange}/>
            </Form.Group>
            <div className={'d-flex justify-content-between py-3'}>
                <strong className="text-muted">Total</strong>
                <h5 className={'font-weight-bold'}><Currency>{totalPrice}</Currency></h5>
            </div>
        </Container>
        <FormGroup>
            <Button block disabled={loading} type="submit" variant="success">Make an order</Button>
        </FormGroup>
    </Form>;

    const renderMessage = () =><div className="alert-warning">{message}</div>;

    return <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title className={'text-center'}>Order details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {message ? renderMessage() : renderBody()}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="outline-secondary" onClick={onClose} name={'cancel'} className={''}>Close</Button>
        </Modal.Footer>
    </Modal>
};