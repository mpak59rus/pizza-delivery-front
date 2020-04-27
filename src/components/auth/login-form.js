import React, {useContext, useState} from "react";
import {Lock} from "bootstrap-icons-react";

import './login.scss';
import {Button, Form, FormGroup, Spinner} from "react-bootstrap";
import {useForm} from "../../hooks/useForm";
import LoginValidator from "../../validators/login-validator";
import {AuthService} from "../../services/auth-service";
import {AlertContext, UserContext} from "../../redux/context";
import {PizzaPromise} from "../../helpers/promise";
import {Redirect} from "react-router";

const LOGIN = 'Log in';

export const LoginPage = () => {
    const setAlert = useContext(AlertContext)[1];
    const [user, setUser] = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    if (user.token) {
        return <Redirect to='/menu'/>;
    }

    const login = (values) => {
        const data = {
            email: values.email,
            password: values.password,
        };

        setLoading(true);

        const callback = (data) => {
            setLoading(false);

            if (data?.token) {
                AuthService.saveToken(data.token);
                setAlert({'success': 'Successfully logged in'});
                return <Redirect to='/menu'/>;
            } else {
                setAlert({'error': 'Bad credentials'});
            }
        };

        const error = () => {
            setAlert({error: 'Unknown error'});

            setLoading(false);
        };

        AuthService.authenticate(data, new PizzaPromise(callback, error));
    };

    return <LoginBrowser handleLogin={login} loading={loading}/>;
};

const LoginBrowser = (props) => {
    const {handleLogin, loading} = props;
    const {values, handleChange, handleSubmit} = useForm(handleLogin, LoginValidator);
    const [validated, setValidated] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity()) {
            handleSubmit(e);
        }

        setValidated(true);
    };

    return <div className="login-form-container">
        <Form noValidate validated={validated} method="post" onSubmit={onSubmit}>
            <div className="illustration"><Lock/></div>
            <FormGroup>
                <Form.Control required onChange={handleChange} value={values.email || ''} type="email" name="email"
                              placeholder="Email"/>
            </FormGroup>
            <FormGroup>
                <Form.Control required onChange={handleChange} value={values.password || ''} type="password"
                              name="password" placeholder="Password"/>
            </FormGroup>
            <FormGroup>
                <Button block disabled={loading} type="submit" variant="success">{loading ?
                    <Spinner animation={"grow"} variant={'warning'}/> : LOGIN}</Button>
            </FormGroup>
        </Form>
    </div>
};
