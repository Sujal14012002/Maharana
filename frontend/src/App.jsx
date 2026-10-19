import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudioProvider } from "./context/StudioContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Photos from "./pages/Photos";
import Videos from "./pages/Videos";
import Frames from "./pages/Frames";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagePhotos from "./pages/admin/ManagePhotos";
import ManageVideos from "./pages/admin/ManageVideos";
import ManageFrames from "./pages/admin/ManageFrames";
import ManageEnquiries from "./pages/admin/ManageEnquiries";
import ManageSettings from "./pages/admin/ManageSettings";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <StudioProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/photos" element={<Photos />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/frames" element={<Frames />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="photos" element={<ManagePhotos />} />
            <Route path="videos" element={<ManageVideos />} />
            <Route path="frames" element={<ManageFrames />} />
            <Route path="enquiries" element={<ManageEnquiries />} />
            <Route path="settings" element={<ManageSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </StudioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
