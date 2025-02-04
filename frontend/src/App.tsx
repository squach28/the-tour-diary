import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/auth/AuthLayout";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index={true} element={<Home />}></Route>
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />}></Route>
        <Route path="signup" element={<SignupForm />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
