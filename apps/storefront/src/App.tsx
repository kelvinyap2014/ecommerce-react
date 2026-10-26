import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-emerald-100 text-center">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Grocer Store
        </span>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Hello World! 🛒</h1>
        <p className="text-gray-600 mt-2">
          Your manual React, TypeScript, Webpack, and Tailwind setup is up and running.
        </p>
        <button
          onClick={() => alert('Ready to hook up Redux Toolkit and DummyJSON API!')}
          className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors shadow-md cursor-pointer"
        >
          Test Interaction
        </button>
      </div>
    </div>
  );
};

export default App;
