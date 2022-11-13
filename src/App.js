
import ProjectData from "./pages/ProjectData";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProjectReport from "./pages/ProjectReport";
import StationsDialog from "./pages/StationsDialog";
import NewProjectDialog from "./pages/NewProjectDialog";
import { stationsActions } from "./store/stationsSlice";
import { projectActions } from "./store/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ImportFileDialog from "./pages/ImportFileDialog";

function App() {

  const activeProjectData = useSelector(a => a.project);

  //load data
  const dispatch = useDispatch();

  useEffect(() => {
    // window.api.initStations(); //postavljanje svega na defaultne vrijednost
    const stations = window.api.getStations();
    // const stations = [];
    // console.log("TU SAM!");
    dispatch(stationsActions.init(stations));

    //load active project
    const active = window.api.getActiveProject();
    // console.log("active", active);
    if (active) {
      dispatch(projectActions.setHeader(active.header));
      dispatch(projectActions.setData(active.data));
    }

  }, [dispatch]);


  //file open dialog handler (učitavnje projekta iz datoteke)
  window.api.openFileDialogHandler((e, res) => {
    dispatch(projectActions.setHeader(res.project.header));
    dispatch(projectActions.setData(res.project.data));
    // console.log("open-dialog", res);

  });

  //file open dialog handler (učitavnje projekta iz datoteke)
  window.api.confirmNewProjectHandler((e, res) => {
    console.log("confirmNewProject", res);
    if (!res.loadedActive) {
      dispatch(projectActions.reset());
    }
    dispatch(projectActions.setHeader(res.project));
  });

  //save file dialog
  window.api.saveFileDialog((e, force) => {
    console.log("saveFileDialog", force);
    window.api.saveFileData({ data: JSON.stringify(activeProjectData, null, 2), forceDialog: force });
  });

  //project deactivated
  window.api.deactivateProjectHandler((e, res) => {
    // console.log("deactivate project");
    dispatch(projectActions.reset());
  });


  return (
    <Routes>
      <Route path="/data" element={<ProjectData />} />
      <Route path="/report" element={<ProjectReport />} />
      <Route path="/stations" element={<StationsDialog />} />
      {/* <Route path="/stations/:id" element={<StationForm />} /> */}
      <Route path="/newproject" element={<NewProjectDialog />} />
      <Route path="/import" element={<ImportFileDialog />} />
      <Route path="*" element={<Navigate to="/data" replace />} />
    </Routes>
  );

}

export default App;
