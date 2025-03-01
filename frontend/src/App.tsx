import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/auth/AuthLayout";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import ResetPassword from "./components/auth/ResetPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Search from "./pages/Search";
import ArtistDetails from "./pages/ArtistDetails";
import Concerts from "./pages/Concerts";
import Profile from "./pages/Profile";
import Artists from "./pages/Artists";

const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />}></Route>
        <Route path="signup" element={<SignupForm />}></Route>
        <Route path="resetPassword" element={<ResetPassword />}></Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/artists">
            <Route index={true} element={<Artists />} />
            <Route path=":id" element={<ArtistDetails />}></Route>
            <Route path=":id">
              <Route path="concerts" element={<Concerts />}></Route>
            </Route>
          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/" element={<Layout />}>
        <Route index={true} element={<Home />}></Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
