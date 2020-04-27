import {ApiService} from "./api";
import {Redirect} from "react-router";
import React from "react";

export class UserService {
    static getUserBytToken(token, promiseClass) {
        const path = '/user';

        ApiService.getApiRequest(path, null, promiseClass, token);
    }

    static fetchOrders(token, promiseClass){
        const path = '/orders';

        ApiService.postApiRequest(path, null, promiseClass, token);
    }

    static logout(token, promiseClass = undefined) {
        const path = '/logout';

        ApiService.getApiRequest(path, null, promiseClass, token);

        localStorage.removeItem('token');

        return <Redirect to={'menu'}/>;
    }
}
