import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/home';
import Navbar from './components/navbar';
import Rush from "./pages/rush";
import Directory from "./pages/dir";
import FamilyTree from "./pages/familyTrees";
import { Auth, PortalLogin } from "./pages/portal/authLogin";
import PortalHome from "./pages/portal/home";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index element={<Navbar><Home/></Navbar>}/>
          <Route path='rush' element={<Navbar><Rush/></Navbar>}/>
          <Route path='directory'>
            <Route index element={<Navbar><Directory/></Navbar>}/>
            <Route path='trees' element={<Navbar><FamilyTree/></Navbar>}/>
          </Route>
          <Route path='portal'>
            <Route index element={<Auth><PortalHome/></Auth>}/>
            <Route path='login' element={<Navbar><PortalLogin/></Navbar>}/>
          </Route>
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
