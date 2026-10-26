import React from 'react';
import { Navbar } from './components/Navbar';
import { ProductGrid } from './components/ProductGrid';
import { CartDrawer } from './components/CartDrawer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Top Navigation & Category Bar */}
      <Navbar />

      {/* Main Product Catalog Grid */}
      <div className="flex-1">
        <ProductGrid />
      </div>

      {/* Sliding Cart Drawer & Autodeliver Hub */}
      <CartDrawer />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <p>
          © 2026 GrocerStore E-Commerce SPA. Built with React 18, Redux Toolkit, TypeScript, and
          Tailwind CSS.
        </p>
      </footer>
    </div>
  );
};

export default App;
