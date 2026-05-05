// import Navbar from "./components/Navbar.jsx";
// import { Route, Routes, useLocation } from "react-router-dom";
// import Home from "./pages/Home.jsx";
// import CarDetails from "./pages/CarDetails.jsx";
// import Cars from "./pages/Cars.jsx";
// import MyBookings from "./pages/MyBookings.jsx";
// import Footer from "./components/Footer.jsx";
// import AddBlog from "./pages/owner/AddBlog.jsx";
// import ManageBlogs from "./pages/owner/ManageBlogs.jsx";
// import Layout from "./pages/owner/Layout.jsx";
// import Dashboard from "./pages/owner/Dashboard.jsx";
// import AddCar from "./pages/owner/AddCar.jsx";
// import ManageBookings from "./pages/owner/ManageBookings.jsx";
// import ManageCars from "./pages/owner/ManageCars.jsx";
// import Login from "./components/Login.jsx";
// import { Toaster } from "react-hot-toast";
// import UserProfile from "./pages/UserProfile.jsx";
// import Blogs from "./pages/Blogs.jsx";
// import { useAppContext } from "./context/AppContext.jsx";
// import ProtectedOwnerRoute from "./components/owner/ProtectedOwnerRoute.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import BlogDetails from "./pages/BlogsDetails.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

// const App = () => {
//   const { showLogin, setShowLogin } = useAppContext();
//   const isOwnerPath = useLocation().pathname.startsWith("/owner");

//   return (
//     <>
//       <Toaster />
//       {showLogin && <Login />}
//       {!isOwnerPath && <Navbar />}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/car-details/:id" element={<CarDetails />} />
//         <Route path="/cars" element={<Cars />} />
//         <Route
//           path="/my-bookings"
//           element={
//             <ProtectedRoute>
              
//               <MyBookings />
//             </ProtectedRoute>
         
//           }
//         />
//         .
//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>

//               <UserProfile />
//             </ProtectedRoute>
           
//           }
//         />
//             <Route path="/blogs" element={<Blogs />} />
//         <Route path="/blogs/:slug" element={<BlogDetails/>} />
//         <Route
//           path="/owner"
//           element={
//             <ProtectedOwnerRoute>
//               <Layout />
//             </ProtectedOwnerRoute>
//           }
//         >
//           <Route index element={<Dashboard />} />
//           <Route path="add-car" element={<AddCar />} />
//           <Route path="manage-cars" element={<ManageCars />} />
//           <Route path="manage-bookings" element={<ManageBookings />} />
//             <Route path="add-blog" element={<AddBlog />} />
//           <Route path="manage-blogs" element={<ManageBlogs />} />
//         </Route>
//       </Routes>
//       {!isOwnerPath && <Footer />}
//     </>
//   );
// };

// export default App;


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

// ── Admin imports ──
import { AdminProvider } from "./context/AdminContext.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/Layout.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import ManageOwners from "./pages/admin/ManageOwners.jsx";
import AdminManageCars from "./pages/admin/ManageCars.jsx";
import AdminManageBookings from "./pages/admin/ManageBookings.jsx";
import ProtectedAdminRoute from "./pages/admin/ProtectedAdminRoute.jsx";

const App = () => {
  const { showLogin } = useAppContext();
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith("/owner");
  const isAdminPath = location.pathname.startsWith("/admin"); // ← admin path check

  return (
    <>
      <Toaster />
      {showLogin && <Login />}
      {!isOwnerPath && !isAdminPath && <Navbar />}  {/* admin pe bhi Navbar nahi */}

      <Routes>
        {/* ── Public Routes ── */}
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetails />} />

        {/* ── Protected User Routes ── */}
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        {/* ── Owner Routes ── */}
        <Route path="/owner" element={<ProtectedOwnerRoute><Layout /></ProtectedOwnerRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="manage-blogs" element={<ManageBlogs />} />
        </Route>

        {/* ── Admin Routes ── */}
        <Route path="/admin/login" element={<AdminProvider><AdminLogin /></AdminProvider>} />
        <Route path="/admin" element={
          <AdminProvider>
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          </AdminProvider>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="owners" element={<ManageOwners />} />
          <Route path="cars" element={<AdminManageCars />} />
          <Route path="bookings" element={<AdminManageBookings />} />
        </Route>

      </Routes>

      {!isOwnerPath && !isAdminPath && <Footer />} {/* admin pe Footer nahi */}
    </>
  );
};

export default App;