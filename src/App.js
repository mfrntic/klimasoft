
import ProjectData from "./pages/ProjectData";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProjectReport from "./pages/ProjectReport";
import Stations from "./pages/Stations";

function App() {

  //file open dialog handler (učitavnje projekta iz datoteke)
  window.api.openFileDialogHandler((e, res) => {
    if (!res.canceled) {
      const file = res.filePaths[0];
      console.log("open-dialog", file);
    }
  });

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
