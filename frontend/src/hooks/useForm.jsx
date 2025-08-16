import { useState } from 'react';

const useForm = (initialValues) => {
    const [values, setValues] = useState(initialValues);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const reset = () => setValues(initialValues);

    return {
        values,
        handleChange,
        reset
    };
};

export default useForm;