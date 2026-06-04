import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { RoleBasedRender } from '../components/RoleBasedRender';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.username}!</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-content">
        <div className="user-info-card">
          <h2>User Information</h2>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> <span className={`role-badge role-${user?.role}`}>{user?.role}</span></p>
        </div>

        <RoleBasedRender allowedRoles={['admin']}>
          <div className="admin-section card">
            <h3>Admin Panel</h3>
            <p>You have admin access to all system features.</p>
            <button>Manage Users</button>
            <button>View Analytics</button>
            <button>System Settings</button>
          </div>
        </RoleBasedRender>

        <RoleBasedRender allowedRoles={['mechanic']}>
          <div className="mechanic-section card">
            <h3>Mechanic Dashboard</h3>
            <p>Manage your work and services.</p>
            <button>View Assigned Jobs</button>
            <button>Update Work Status</button>
            <button>My Services</button>
          </div>
        </RoleBasedRender>

        <RoleBasedRender allowedRoles={['shop_owner']}>
          <div className="shop-section card">
            <h3>Shop Management</h3>
            <p>Manage your shop and inventory.</p>
            <button>Shop Profile</button>
            <button>Inventory</button>
            <button>Orders</button>
          </div>
        </RoleBasedRender>

        <RoleBasedRender allowedRoles={['user', 'mechanic', 'shop_owner']}>
          <div className="user-section card">
            <h3>User Services</h3>
            <p>Access general user features.</p>
            <button>Find Mechanics</button>
            <button>Browse Shops</button>
            <button>My Bookings</button>
          </div>
        </RoleBasedRender>
      </div>
    </div>
  );
};

export default Dashboard;
