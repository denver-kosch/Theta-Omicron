import { Navbar, PortalNav } from "./components";
import { Auth } from "./pages/portal/authLogin";
import { Outlet } from "react-router-dom";

export const MainLayout = () => (<Navbar><Outlet /></Navbar>);
export const PortalLayout = () => (<Auth><PortalNav><Outlet /></PortalNav></Auth>);