import {ApiService} from "./api";

const categoriesPath = '/categories';
const productsPath = '/products';

export class MenuService extends ApiService{
    static fetchCategories(promiseClass){
        this.getApiRequest(categoriesPath, null, promiseClass);
    }

    static fetchProducts(id, promiseClass){
        this.getApiRequest(categoriesPath + '/' + id, null, promiseClass);
    }
}
