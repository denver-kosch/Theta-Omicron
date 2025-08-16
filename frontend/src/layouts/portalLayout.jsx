import PortalNav from "@/components/portalNav";
import { Auth } from "@/pages/portal/authLogin";
import { Outlet } from "react-router-dom";

const PortalLayout = () => (<Auth><PortalNav><Outlet /></PortalNav></Auth>);

export default PortalLayout;