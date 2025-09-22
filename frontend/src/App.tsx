import React from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import Generator from './components/Generator.tsx';
import Footer from './components/Footer.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="bg-black">
        <Navbar />
        <main>
          <Hero />
          <Generator />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;

