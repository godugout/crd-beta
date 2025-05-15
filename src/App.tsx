
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/Home';
import CardCreator from './pages/CardCreator';
import CardStudio from './pages/CardStudio'; // Add import for new CardStudio page
import Editor from './pages/Editor';
import Gallery from './pages/Gallery';
import CardView from './pages/CardView';
import Community from './pages/Community';

// Providers
import { CardProvider } from './context/CardContext';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Router>
      <CardProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CardCreator />} />
            <Route path="/studio" element={<CardStudio />} /> {/* Add new Studio route */}
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/card/:id" element={<CardView />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </div>
        <Toaster />
      </CardProvider>
    </Router>
  );
}

export default App;
