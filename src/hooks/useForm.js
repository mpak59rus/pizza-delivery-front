import {useEffect, useState} from 'react';

export const useForm = (callback, validatorClass) =>{
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmited, setIsSubmited] = useState(false);

    const handleSubmit = e => {
        if (e) e.preventDefault();
        setErrors(validatorClass.validate(values));
        setIsSubmited(true);
    };

    const handleChange = e => {
        e.persist();
        setValues(values => ({ ...values, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSubmited){
            callback(values);
        }
    }, [errors]);

    return {
        handleChange,
        handleSubmit,
        values,
        errors,
    }
};
