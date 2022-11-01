
import ProjectData from "./pages/ProjectData";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProjectReport from "./pages/ProjectReport";
import Stations from "./pages/Stations";

function App() {
  return (
    <Routes>
      <Route path="/data" element={<ProjectData />} />
      <Route path="/report" element={<ProjectReport />} />
      <Route path="/stations" element={<Stations />} />
      <Route path="*" element={<Navigate to="/data" replace />} />
    </Routes>
  );

}

export default App;
