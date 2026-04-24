import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Sidebar } from './components/layout/Sidebar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { MockInterview } from './pages/MockInterview';
import { Roadmap } from './pages/Roadmap';
import { Profile } from './pages/Profile';
import { AnimatePresence, motion } from 'motion/react';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen atmosphere-bg flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/" />;
}

function Layout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen atmosphere-bg text-slate-300">
      {user && <Sidebar />}
      <main className="flex-1 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/resume" element={<PrivateRoute><ResumeAnalyzer /></PrivateRoute>} />
          <Route path="/interview" element={<PrivateRoute><MockInterview /></PrivateRoute>} />
          <Route path="/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}
