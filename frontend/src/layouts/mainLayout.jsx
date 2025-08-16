import Navbar from "@/components/mainNav";
import { Outlet } from "react-router-dom";

const MainLayout = () => (<Navbar><Outlet /></Navbar>);

export default MainLayout;