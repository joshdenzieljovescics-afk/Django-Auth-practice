import React from "react";
import { useEffect, useState } from "react";
import api from "../api";
import "../styles/Dashboard.css";
import { ACCESS_TOKEN, GOOGLE_ACCESS_TOKEN } from "../token";
import { useAuth } from "../auth"; // to access logout function

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const {logout} = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        const googleAccessToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);

        const token = accessToken || googleAccessToken;
        if (!token) {
          throw new Error("No access token found");
        }
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        //Fetch user Data
        const userResponse = await api.get("/dashboard/", {
          headers,
        });
        const user = userResponse.data;
        setUserData(user);
        setIsAdmin(user.is_staff);
      } catch (error) {
          // If token is invalid or expired
  if (error.response && error.response.status === 401) {
    logout();
    return;
  }
        console.error("Error fetching user data:", error);
        const errorMessage = error.response
          ? error.response.data.detail || "An error occured while fetching data"
          : "An Error occured" + error.message;

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [logout]);

  // set loading or error handling

  if (loading) return <p>Loading......</p>;
  if (error) return <p className="'error-message">{error}</p>;

  // set up function to render user data

  const renderUserData = () => (
    <div>
      <h2>Welcome, {userData.username}!</h2>
      {isAdmin && <p>You are an admin.</p>}
      <p>Status: {userData.is_active ? "Active" : "Inactive"}</p>
    </div>
  );

  const renderAdminFeatures = () => (
    <div>
      <h3>Admin Features</h3>
      <div className="admin-actions">
        <button onClick={()=> window.location.href = "/api/products" }>Manage Products</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {renderUserData()}
      {isAdmin && renderAdminFeatures()}
    </div>
  );
};

export default Dashboard;
