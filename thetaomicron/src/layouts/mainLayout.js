import { Navbar } from "../components/components";
import { Outlet } from "react-router-dom";

const MainLayout = () => (<Navbar><Outlet /></Navbar>);

export default MainLayout;