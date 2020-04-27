export class PizzaPromise {
    constructor(callback = () => {
    }, errorCallback = () => {
    }) {
        this.errorCallback = errorCallback;
        this.callback = callback;
        this.handle = this.handle.bind(this);
    }

    handle(response) {
        if (response.ok)
            response.json().then(this.callback);
        else {
            const code = response.status;
            let message = response.statusText;

            response.json().then((data) => {
                if (data?.errors) {
                    message = data.errors;
                }

                this.errorCallback({code: code, message: message});
            });
        }
    }
}
