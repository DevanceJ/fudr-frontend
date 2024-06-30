import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Menu from "./components/menu";
import AddMenuItem from "./components/addItem";
import Welcome from "./components/welcome";
import ManageMenuItems from "./components/admin";
import OrderList from "./components/orders";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/add" element={<AddMenuItem />} />
        <Route path="/admin" element={<ManageMenuItems />} />
        <Route path="/orders" element={<OrderList />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
