import {ApiService} from "./api";

const paramsPath = '/params';

export class ParamsService extends ApiService{
    static fetchParams(promiseClass){
        this.getApiRequest(paramsPath, null, promiseClass);
    }
}
