import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "@/services/apiCall";
import type { AuthProps } from "@/types";

export const Auth = ({children}: AuthProps) => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            const result = await api<{token: string}>("auth", {
                method: "POST",
                headers: {Authorization: `Bearer ${token}`},
            });
            setIsAuthenticated(result.success);
            if (result.success) localStorage.setItem("token", result.token);
        };

        void checkAuth();
    }, [location]);

    if (isAuthenticated === null) return <div>Loading...</div>;
    if (!isAuthenticated) {
        localStorage.removeItem("token");
        return <Navigate to="/portal/login" state={{from: location}} replace/>;
    }

    return children;
};

export const PortalLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const rejectInput = (message: string) => {
        setErrorMessage(message);
        setPassword("");
    };

    const handleSubmit = async () => {
        if (!email || !password) {
            rejectInput("Please enter both email address and password.");
            return;
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            rejectInput("Please enter a valid email address.");
            return;
        }

        const result = await api<{token: string}>("login", {method: "POST", body: {email, password}});
        if (!result.success) {
            rejectInput(result.error);
            return;
        }

        localStorage.setItem("token", result.token);
        const from = location.state?.from?.pathname ?? "/portal";
        navigate(from, {replace: true});
    };

    return (
        <div className="loginContainer">
            {errorMessage && <h3 style={{color: "red"}}>{errorMessage}</h3>}
            <form className="loginForm" onSubmit={event => { event.preventDefault(); void handleSubmit(); }}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input id="username" type="email" placeholder="Username..." value={email} onChange={event => setEmail(event.target.value)}/>
                </div>
                <br/>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input id="password" type="password" placeholder="Password..." value={password} onChange={event => setPassword(event.target.value)}/>
                </div>
                <button type="submit" className="submit">Login</button>
            </form>
        </div>
    );
};
