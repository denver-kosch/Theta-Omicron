import { useForm } from "react-hook-form";
import api from "@/services/apiCall";

type RushLinkForm = {link: string};

const Chairman = () => {
    const {register, handleSubmit, reset} = useForm<RushLinkForm>();

    const onSubmit = async (data: RushLinkForm) => {
        const response = await api("committees/Rush", {method: "PUT", body: data});
        if (response.success) reset();
        else console.error(response.error);
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

export default Chairman;
