import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Layout from "./layouts/Layout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index={true} element={<Home />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
