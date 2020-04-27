import React from 'react';
import 'bootswatch/dist/journal/bootstrap.min.css'
import './App.scss';
import {Menu} from "./components/menu";
import {Basket} from "./components/basket"
import {AppNavbar} from "./components/navigation";
import {Alert} from "./components/other/alert";
import {AppContext} from "./components/app-with-context";
import {Register, Login} from "./components/auth/";
import {InitApp} from "./components/init-app";
import {BrowserRouter} from "react-router-dom";
import {Redirect, Route} from "react-router";
import {CONFIG} from "./helpers/config";
import {Footer} from "./components/navigation/footer/footer";
import {Orders} from "./components/profile/orders";
import {Home} from "./components/home";

function App() {
    return (
        <BrowserRouter>
            <AppContext>
                <InitApp/>
                <AppNavbar/>
                <Route path={CONFIG.paths.home} component={Home}/>
                <Route path={CONFIG.paths.menu} component={Menu}/>
                <Route path={CONFIG.paths.login} component={Login}/>
                <Route path={CONFIG.paths.signup} component={Register}/>
                <Route path={CONFIG.paths.basket} component={Basket}/>
                <Route path={CONFIG.paths.orders} component={Orders}/>
                <Redirect to={'/home'} from={'/'}/>
                <Alert timeout={3000}/>
                <Footer/>
            </AppContext>
        </BrowserRouter>
    );
}

export default App;
