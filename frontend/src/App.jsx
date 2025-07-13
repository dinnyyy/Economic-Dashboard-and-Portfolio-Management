import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MySidebar from './components/Navbar';
import TopBar from './components/Topbar';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <TopBar />
      <MySidebar />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="content-wrapper">
          <h1>Welcome to Your Dashboard</h1>
          <p>This is your main content area. The sidebar can be toggled to show/hide navigation items.</p>
        </div>
      </main>
    </div>
  );
}

