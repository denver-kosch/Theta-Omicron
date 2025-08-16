import { useForm } from "react-hook-form";
import api from "@/services/apiCall"

const chairman = () => {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        api("committees/Rush", {method: "PUT", body: data}).then((response) => {
            if (response.status === 200) reset();
        });
    };

    return (
        <div>
            <h1>Rush Chairman</h1>
            <form className="urlChangeForm" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="url">Rush Interest Form URL:</label>
                <input type="text" id="url" {...register("link", { required: true })} />
                <button type="submit">Update URL</button>
            </form>
        </div>
    );
};

export default chairman;