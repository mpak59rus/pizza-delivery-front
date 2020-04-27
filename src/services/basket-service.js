import {ApiService} from "./api";
import {AuthService} from "./auth-service";

export class BasketService extends ApiService {
    static makeOrder(items, promiseClass) {
        const path = '/orders/create';
        this.postApiRequest(path, items, promiseClass, AuthService.getToken());
    }

    static getOrders(promiseClass) {
        const path = '/orders';
        this.getApiRequest(path, null, promiseClass, AuthService.getToken());
    }
}
