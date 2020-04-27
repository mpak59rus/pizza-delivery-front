import React, {useContext} from "react";
import {Badge, Button, Nav, Navbar, NavDropdown} from "react-bootstrap";
import "./navbar.scss";
import {CONFIG} from "../../helpers/config"

import $ from 'jquery';
import {AuthService} from "../../services/auth-service";
import {BasketContext, CurrencyContext, UserContext} from "../../redux/context";
import {NavLink} from "react-router-dom";
import {CURRENCY} from "../other/currency";
import {currencyActions} from "../../redux/reduxer/currency-reducer";
import {UserService} from "../../services/user-service";

export const AppNavbar = () => {
    const [user, setUser] = useContext(UserContext);
    const basketContext = useContext(BasketContext)[0];
    const [currencyContext, currencyDispatch] = useContext(CurrencyContext);
    const token = AuthService.getToken();

    const config = {
        brand: {
            name: CONFIG.title
        },
        nav: {
            menu: {name: 'Menu', href: CONFIG.paths.menu},
            home: {name: 'Home', href: CONFIG.paths.home},
            basket: {name: 'Basket', href: CONFIG.paths.basket},
            login: {name: 'Log in', href: CONFIG.paths.login},
            signup: {name: 'Sign Up', href: CONFIG.paths.signup},
            logout: {name: 'Logout'},
            orders: {name: 'History', href: CONFIG.paths.orders},
            currency: {name: 'Currency', values: [CURRENCY.euro, CURRENCY.dollar]}
        },
    };

    const handleLogout = () => {
        setUser({});
        UserService.logout(AuthService.getToken());
    };

    const handleCurrencyChange = (key, event) => {
        if (event) event.persist();
        const choose = event.target.name;
        Object.keys(CURRENCY).forEach(value => {
            if (CURRENCY[value].name === choose) currencyDispatch({
                type: currencyActions.update, item: CURRENCY[value]
            });
        })
    };

    const renderCollapsibleNavbar = () => {
        const renderBrand = () =>
            <Navbar.Brand href={config.nav.home.href}>
                {config.brand.name}
            </Navbar.Brand>;

        const renderLeftNav = () => {
            return <Nav className={'mr-auto '}>
                <NavLink className={'nav-link'} to={config.nav.menu.href}> {config.nav.menu.name}</NavLink>
            </Nav>;
        };

        const renderRightNav = () => {
            const basketCount = basketContext.basket.length;
            return <Nav>
                <NavDropdown onSelect={handleCurrencyChange} title={currencyContext.currency.name}
                             id={'currency-dropdown'}>
                    {config.nav.currency.values.map((val, index) =>
                        <NavDropdown.Item key={index}
                                          name={val.name}>{val.name}</NavDropdown.Item>
                    )}
                </NavDropdown>
                <NavLink className={'nav-link'}
                         to={config.nav.basket.href}>
                    {config.nav.basket.name}
                    {basketCount > 0 ? <Badge variant={"success"} pill>{basketContext.basket.length}</Badge> : null}
                </NavLink>
                {user.token || token
                    ? <>
                        <NavLink to={config.nav.orders.href}
                                 className={'nav-link mr-3'}>{config.nav.orders.name}</NavLink>
                        <Button className={'logout'}
                                onClick={handleLogout}>{config.nav.logout.name}</Button>
                    </>

                    : <>
                        <NavLink to={config.nav.login.href}
                                 className={'login nav-link'}>{config.nav.login.name}</NavLink>
                        <NavLink to={config.nav.signup.href}
                                 className={'nav-link'}>{config.nav.signup.name}</NavLink>
                    </>
                }
            </Nav>;
        };


        return <Navbar expand={"md"} className={'navbar-main'}>
            {renderBrand()}
            <Navbar.Toggle ariac-controls={'navbar-nav'}/>
            <Navbar.Collapse id={'navbar-nav'}>
                {renderLeftNav()}
                {renderRightNav()}
            </Navbar.Collapse>
        </Navbar>;
    };

    return renderCollapsibleNavbar();
};

$(document).ready(function () {
    const homePath = CONFIG.paths.home;

    $(window).scroll(function () {
        const path = window.location.pathname;
        const scroll = $(window).scrollTop();
        const width = $(window).width();
        if (path === homePath && width >= 768) {
            if (scroll < 420) {
                $('.navbar-tiny').removeClass('navbar-tiny');
                $('.navbar-main').addClass('navbar-transporent');
            } else {
                $('.navbar-main').removeClass('navbar-transporent');
                $('.navbar-main').addClass('navbar-tiny');
            }
        } else {
            $('.navbar-main').removeClass('navbar-transporent');
            $('.navbar-main').addClass('navbar-tiny');
        }

    });
})
;
