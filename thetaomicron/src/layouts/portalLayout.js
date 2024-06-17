import { PortalNav } from "../components/components";
import { Auth } from "../pages/portal/authLogin";
import { Outlet } from "react-router-dom";

const PortalLayout = () => (<Auth><PortalNav><Outlet /></PortalNav></Auth>);

export default PortalLayout;