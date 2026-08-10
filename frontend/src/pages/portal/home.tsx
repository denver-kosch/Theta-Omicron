import { useEffect, useState } from "react";
import api from "@/services/apiCall";
import type { PortalMemberInfo } from "@/types";

const PortalHome = () => {
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const getMember = async () => {
            const response = await api<{info: PortalMemberInfo}>("me", {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
            });
            if (!response.success) return;
            const title = response.info.status === "Pledge" ? "Mr." : "Brother";
            setGreeting(`${title} ${response.info.lastName}`);
        };

        void getMember();
    }, []);

    return greeting ? <h2>Welcome, {greeting}</h2> : <h2>Loading...</h2>;
};

export default PortalHome;
