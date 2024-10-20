/* eslint-disable */
import Sidebar from "./components/sidebar";
import Data from "./components/Data";
import "./App.css";
import "@fontsource/montserrat/200.css";
import "@fontsource/montserrat/700.css";
function App() {
  return (
    <div className="container">
      <Sidebar />
      <Data />
    </div>
  );
}

export default App;
