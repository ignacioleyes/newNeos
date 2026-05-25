import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Topbar } from "./components/layout/Topbar";
import { Footer } from "./components/layout/Footer";
import { ScrollManager } from "./components/layout/ScrollManager";
import { NeoLauncher } from "./components/chatbot/NeoLauncher";
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
          <NeoLauncher />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
