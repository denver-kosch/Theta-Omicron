import { useState } from 'react';

const useForm = (initialValues: any) => {
	const [values, setValues] = useState(initialValues);

	const handleChange = (event: { target: { name: any; value: any; }; }) => {
		const { name, value } = event.target;
		setValues((prevValues: any) => ({ ...prevValues, [name]: value }));
	};

	const reset = () => setValues(initialValues);

	return { values, handleChange, reset };
};

export default useForm;