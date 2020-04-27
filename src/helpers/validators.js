export class Validators {
    static address(val) {
        return val.length > 3;
    }

    static phone(val) {
        const regExp = /^[\s()+-]*?([0-9][\s()+-]*){6,20}$/;
        return !!val.match(regExp) || val.length !== 0;
    }
}
