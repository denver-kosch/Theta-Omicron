import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AboutUs from './pages/mainPages/about/home';
import Navbar from './components/navbar';
import Rush from "./pages/mainPages/about/rush";
import Directory from "./pages/mainPages/directory/dir";
import FamilyTree from "./pages/mainPages/directory/familyTrees";
import { Auth, PortalLogin } from "./pages/portal/authLogin";
import PortalHome from "./pages/portal/home";
import {NavBar as PortalNav} from "./pages/portal/navbar";
import Home from "./pages/mainPages/home";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index element={<Navbar> <Home/> </Navbar>}/>
          <Route path='directory'>
            <Route index element={<Navbar> <Directory/> </Navbar>}/>
            <Route path='trees' element={<Navbar> <FamilyTree/> </Navbar>}/>
          </Route>
          <Route path='about'>
          <Route index element={<Navbar> <AboutUs/> </Navbar>}/>
            <Route path='rush' element={<Navbar> <Rush/> </Navbar>}/>
          </Route>
          <Route path='portal'>
            <Route index element={<Auth> <PortalNav> <PortalHome/> </PortalNav> </Auth>}/>
            <Route path='login' element={<Navbar> <PortalLogin/> </Navbar>}/>
            <Route path='position'>
              <Route path='redirect' element={<PortalNav> </PortalNav>}/>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
