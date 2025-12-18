import { Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from "./NavigationBar";

export default function App() {
  return (
      <>
          <NavigationBar/>
          <Outlet />
      </>
  );
}
