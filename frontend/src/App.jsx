import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./auth";
import RedirectGoogleAuth from "./components/GoogleRedirectHandler";
import Dashboard from "./components/Dashboard";
import AdminProductList from "./components/AdminProductList";

function App() {

  const {isAuthorized} = useAuth();
  const ProtectedLogin= () => {
    return isAuthorized ? <Navigate to = '/dashboard' /> : <AuthPage initialMethod ='login'/>
  }
  const ProtectedRegister= () => {
    return isAuthorized ? <Navigate to = '/' /> : <AuthPage initialMethod ='register'/>
  }

  return (
    <div>
      <BrowserRouter>
        <Navbar />
          <Routes>
            <Route path="/login" element={<ProtectedLogin />} />
            <Route path="/login/callback" element={<RedirectGoogleAuth />} />
            <Route path="/register" element={<ProtectedRegister />} />
            <Route path="/dashboard" element = {isAuthorized ? <Dashboard /> : <Navigate to = "/login/" />} />
            <Route path="/api/products" element = {<AdminProductList />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
      </BrowserRouter>
    </div>
   
  )
}

export default App
