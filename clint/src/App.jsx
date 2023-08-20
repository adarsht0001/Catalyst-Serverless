import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminHome from "./pages/admin/AdminHome";
import AdminTicket from "./pages/admin/AdminTickets";
import UserLogin from "./pages/user/UserLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLogin />} path="/app/admin-login" />
        <Route element={<AdminHome />} path="/app/admin-dashboard" />
        <Route element={<AdminTicket />} path="/app/admin-ticket" />
        <Route element={<UserLogin />} path="/app/login" />
      </Routes>
    </BrowserRouter>
  )

}

export default App;
