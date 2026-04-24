import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { MockInterview } from './pages/MockInterview';
import { Roadmap } from './pages/Roadmap';
import { Profile } from './pages/Profile';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen atmosphere-bg flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen atmosphere-bg text-slate-200">
          <Navbar />
          <main className="pt-16 pb-12">
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
      </Router>
    </AuthProvider>
  );
}
