import './App.scss';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AboutUs from './pages/mainPages/about/about';
import Rush from "./pages/mainPages/about/rush";
import Directory from "./pages/mainPages/directory/dir";
import FamilyTree from "./pages/mainPages/directory/familyTrees";
import { PortalLogin } from "./pages/portal/authLogin";
import PortalHome from "./pages/portal/home";
import Home from "./pages/mainPages/home";
import Leadership from "./pages/mainPages/about/leadership";
import Alumni from "./pages/mainPages/directory/alumni";
import Event from './pages/mainPages/eventDetails';
import CreateEvent from './pages/portal/events/createEvent';
import PortalEvent from './pages/portal/events/portalEvent';
import EditEvent from './pages/portal/events/editEvent';
import { AllEvents } from './pages/portal/events/allEvents';
import { MainLayout, PortalLayout } from './layouts';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="directory">
            <Route index element={<Directory />} />
            <Route path="trees" element={<FamilyTree />} />
            <Route path="alumni" element={<Alumni />} />
          </Route>
          <Route path="about">
            <Route index element={<AboutUs />} />
            <Route path="leadership" element={<Leadership />} />
            <Route path="rush" element={<Rush />} />
          </Route>
          <Route path="event/:id" element={<Event />} />
          <Route path="portal/login" element={<PortalLogin />} />
        </Route>
        
        <Route path="portal" element={<PortalLayout />}>
          <Route index element={<PortalHome />} />
          <Route path="event">
            <Route index element={<AllEvents />} />
            <Route path="create" element={<CreateEvent />} />
            <Route path=":id">
              <Route index element={<PortalEvent />} />
              <Route path="edit" element={<EditEvent />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/portal/" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
