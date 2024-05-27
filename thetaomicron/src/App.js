import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AboutUs from './pages/mainPages/about/about';
import { Navbar } from './components';
import Rush from "./pages/mainPages/about/rush";
import Directory from "./pages/mainPages/directory/dir";
import FamilyTree from "./pages/mainPages/directory/familyTrees";
import { Auth, PortalLogin } from "./pages/portal/authLogin";
import PortalHome from "./pages/portal/home";
import {NavBar as PortalNav} from "./pages/portal/navbar";
import Home from "./pages/mainPages/home";
import Leadership from "./pages/mainPages/about/leadership";
import Alumni from "./pages/mainPages/directory/alumni";
import Event from './pages/mainPages/eventDetails';
import CreateEvent from './pages/portal/events/createEvent';
import PortalEvent from './pages/portal/events/portalEvent';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index element={<Navbar> <Home/> </Navbar>}/>
          <Route path='directory'>
            <Route index element={<Navbar> <Directory/> </Navbar>}/>
            <Route path='trees' element={<Navbar> <FamilyTree/> </Navbar>}/>
            <Route path='alumni' element={<Navbar> <Alumni/> </Navbar>}/>
          </Route>
          <Route path='about'>
            <Route index element={<Navbar> <AboutUs/> </Navbar>}/>
            <Route path='leadership' element={<Navbar> <Leadership/> </Navbar>}/>
            <Route path='rush' element={<Navbar> <Rush/> </Navbar>}/>
          </Route>
          <Route path='portal'>
            <Route index element={<Auth> <PortalNav> <PortalHome/> </PortalNav> </Auth>}/>
            <Route path='login' element={<Navbar> <PortalLogin/> </Navbar>}/>
            <Route path='position'>
              <Route path='redirect' element={<PortalNav> </PortalNav>}/>
            </Route>
            <Route path='event'>
              <Route path="create" element={<Auth><PortalNav> <CreateEvent/> </PortalNav></Auth>}/>
              <Route path=":id" element={<Auth><PortalNav> <PortalEvent/> </PortalNav></Auth>}/>
            </Route>
          </Route>
          <Route path='event'>
            <Route path=':id' element={<Navbar> <Event/> </Navbar>}/>
          </Route>
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
