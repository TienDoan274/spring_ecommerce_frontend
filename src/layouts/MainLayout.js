// layouts/MainLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TokenDebug from '../components/TokenDebug'; // Remove this in production

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {/* Remove TokenDebug component in production */}
      {process.env.NODE_ENV === 'development' && <TokenDebug />}
    </div>
  );
};

export default MainLayout;