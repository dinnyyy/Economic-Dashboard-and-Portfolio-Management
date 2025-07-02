import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MySidebar from './components/Navbar';
import TopBar from './components/Topbar';

export default function App() {
  return (
    <div>
      <MySidebar />
      <main>
        <p>
          welcome
        </p>
      </main>
    </div>
  );
}

