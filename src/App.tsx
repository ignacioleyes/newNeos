import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Topbar } from "./components/layout/Topbar";
import { Footer } from "./components/layout/Footer";
import { ScrollManager } from "./components/layout/ScrollManager";
import { NeoLauncher } from "./components/chatbot/NeoLauncher";
import { Home } from "./pages/Home";
import { ProjectDetail } from "./pages/ProjectDetail";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminHome } from "./pages/admin/AdminHome";
import { LanguageProvider } from "./i18n/LanguageContext";
import { AuthProvider } from "./auth/AuthContext";

/** Layout público: topbar, footer y el chatbot. El panel no lleva nada de esto. */
function PublicLayout() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Topbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <NeoLauncher />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollManager />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/proyectos/:slug" element={<ProjectDetail />} />
            </Route>

            {/* El panel no está linkeado desde la landing: se entra por URL.
                No es una medida de seguridad — de eso se ocupa la RLS — sino
                para no meterle ruido a una página cuyo trabajo es convertir. */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHome />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
