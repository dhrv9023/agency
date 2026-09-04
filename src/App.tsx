import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LeadProvider } from './context/LeadContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { Solutions } from './pages/Solutions';
import { SolutionDetail } from './pages/SolutionDetail';
import { Industries } from './pages/Industries';
import { IndustryDetail } from './pages/IndustryDetail';
import { CaseStudies } from './pages/CaseStudies';
import { CaseStudyDetail } from './pages/CaseStudyDetail';
import { Process } from './pages/Process';
import { About } from './pages/About';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { Book } from './pages/Book';
import { Admin } from './pages/Admin';
import { Blueprint } from './pages/Blueprint';

// Auto scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LeadProvider>
        <Router>
          <ScrollToTop />
          <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/solutions/:slug" element={<SolutionDetail />} />
                <Route path="/industries" element={<Industries />} />
                <Route path="/industries/:slug" element={<IndustryDetail />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
                <Route path="/process" element={<Process />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/book" element={<Book />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/blueprint" element={<Blueprint />} />
                {/* Fallback route */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </LeadProvider>
    </ThemeProvider>
  );
};

export default App;
