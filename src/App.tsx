import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Topbar } from "./components/layout/Topbar";
import { Footer } from "./components/layout/Footer";
import { WhatsAppFab } from "./components/layout/WhatsAppFab";
import { ScrollManager } from "./components/layout/ScrollManager";
import { Home } from "./pages/Home";
import { ProjectDetail } from "./pages/ProjectDetail";
import { LanguageProvider } from "./i18n/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollManager />
        <div className="min-h-screen bg-base-100 text-base-content">
          <Topbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/proyectos/:slug" element={<ProjectDetail />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppFab phone="+5493872233240" />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
