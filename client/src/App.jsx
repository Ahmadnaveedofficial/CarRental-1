import Navbar from "./components/Navbar.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CarDetails from "./pages/CarDetails.jsx";
import Cars from "./pages/Cars.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Footer from "./components/Footer.jsx";
import AddBlog from "./pages/owner/AddBlog.jsx";
import ManageBlogs from "./pages/owner/ManageBlogs.jsx";
import Layout from "./pages/owner/Layout.jsx";
import Dashboard from "./pages/owner/Dashboard.jsx";
import AddCar from "./pages/owner/AddCar.jsx";
import ManageBookings from "./pages/owner/ManageBookings.jsx";
import ManageCars from "./pages/owner/ManageCars.jsx";
import Login from "./components/Login.jsx";
import { Toaster } from "react-hot-toast";
import UserProfile from "./pages/UserProfile.jsx";
import Blogs from "./pages/Blogs.jsx";
import { useAppContext } from "./context/AppContext.jsx";
import ProtectedOwnerRoute from "./components/owner/ProtectedOwnerRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import BlogDetails from "./pages/BlogsDetails.jsx";

const App = () => {
  const { showLogin, setShowLogin } = useAppContext();
  const isOwnerPath = useLocation().pathname.startsWith("/owner");

  return (
    <>
      <Toaster />
      {showLogin && <Login />}
      {!isOwnerPath && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute> 
              <MyBookings />
            </ProtectedRoute>
          }
        />
        .
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
            <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetails/>} />
        <Route
          path="/owner"
          element={
            <ProtectedOwnerRoute>
              <Layout />
            </ProtectedOwnerRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
            <Route path="add-blog" element={<AddBlog />} />
          <Route path="manage-blogs" element={<ManageBlogs />} />
        </Route>
      </Routes>
      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;
