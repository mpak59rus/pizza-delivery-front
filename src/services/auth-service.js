import {ApiService} from "./api";

export class AuthService extends ApiService {
    static register(data, promiseClass) {
        const path = '/register';

        this.postApiRequest(path, data, promiseClass);
    }

    static authenticate(data, promiseClass){
        const path = '/login';

        this.postApiRequest(path, data, promiseClass);
    }

    static saveToken(token) {
        localStorage.setItem('token', token);
    }

    static getToken() {
        return localStorage.getItem('token');
    }
}
