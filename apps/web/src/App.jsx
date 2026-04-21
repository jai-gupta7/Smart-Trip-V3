
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import FirstMilePage from './pages/FirstMilePage';
import LastMilePage from './pages/LastMilePage';
import SmartTripCreationPage from './pages/SmartTripCreationPage';
import { Toaster } from 'sonner';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/first-mile" element={<FirstMilePage />} />
                        <Route path="/last-mile" element={<LastMilePage />} />
                        <Route path="/smart-trip-creation" element={<SmartTripCreationPage />} />
                        <Route path="/smart-trip-creation/:routeId" element={<SmartTripCreationPage />} />
                        <Route path="*" element={
                            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                                <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                                <p className="text-muted-foreground mb-8">The page you are looking for doesn't exist or has been moved.</p>
                                <a href="/" className="text-primary hover:underline">Return to Home</a>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
            <Toaster position="top-right" />
        </Router>
    );
}

export default App;
