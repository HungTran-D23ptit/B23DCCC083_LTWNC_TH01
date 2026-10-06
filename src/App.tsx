import { useState, useEffect } from 'react';
import { AssignmentsTab } from './features/assignments';
import {
  GraduationCap,
  Sun,
  Moon,
  Code2,
  Cpu,
  Layers,
} from 'lucide-react';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-container">
      <header className="app-header glass-panel">
        <div className="brand-wrap">
          <div className="brand-logo">
            <GraduationCap size={28} />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">STUDENT DEADLINE TRACKER</h1>
            <div className="brand-meta">
              <span className="brand-badge">PTIT ACADEMIC MANAGER</span>
              <span className="student-badge">B23DCCC083 — TRẦN DUY HƯNG</span>
            </div>
          </div>
        </div>

        <div className="header-controls">
          <button
            type="button"
            className="btn-theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={16} className="sun-icon" /> Giao diện sáng
              </>
            ) : (
              <>
                <Moon size={16} className="moon-icon" /> Giao diện tối
              </>
            )}
          </button>
        </div>
      </header>

      <main className="app-main-content">
        <AssignmentsTab />
      </main>

      <footer className="app-footer glass-panel">
        <div className="tech-stack-pills">
          <span className="tech-pill">
            <Code2 size={13} /> Buổi 1: TypeScript Nâng cao (Generics, Type Guards, Discriminated Unions)
          </span>
          <span className="tech-pill">
            <Layers size={13} /> Buổi 2: React Design Patterns (Custom Hook useDeadlineCalculator & Compound Component)
          </span>
          <span className="tech-pill">
            <Cpu size={13} /> Buổi 3: Redux Toolkit + TypeScript (Feature Slice, Typed Hooks, createAsyncThunk Mock API)
          </span>
        </div>
        <p className="footer-copyright">
          © 2026 Student Deadline Tracker • Học viện Công nghệ Bưu chính Viễn thông (PTIT)
        </p>
      </footer>
    </div>
  );
}

export default App;
