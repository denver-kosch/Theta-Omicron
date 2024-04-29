import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/home';
import Navbar from './components/navbar';
import Rush from "./pages/rush";
import Directory from "./pages/dir";
import FamilyTree from "./pages/familyTrees";


function App() {
  return (
    <>
      <Router>
        <Navbar/>

        <Routes>
          <Route index element={<Home/>}/>
          <Route path='rush' element={<Rush/>}/>
          <Route path='/directory' element={<Directory/>}/>
          <Route path='/directory/trees' element={<FamilyTree/>}/>
          <Route path='portal'>
            <Route index element={<RequireAuth><PortalHome/></RequireAuth>} />
            <Route path='login' element={<PortalLogin/>} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
