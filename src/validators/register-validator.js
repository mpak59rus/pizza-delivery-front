

export default class RegisterValidator {
    static validate(values) {
        let errors = {};

        if (values.password !== values.rePassword) {
            errors.rePassword = 'Password mismatch';
        }

        return errors;
    }
}
