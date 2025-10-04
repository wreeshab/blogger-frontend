import { Link, NavLink } from 'react-router-dom';
import { Button } from './ui/button';
import { Toaster } from './ui/sonner';
import { useAuth } from '../lib/auth';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  return (
    <div className="min-h-dvh bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),rgba(0,0,0,0))]">
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold tracking-tight">Blogger</Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/blogs" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-secondary' : 'hover:bg-secondary'}`}>Blogs</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/blogs/new" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-secondary' : 'hover:bg-secondary'}`}>New</NavLink>
                <NavLink to="/user/settings" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-secondary' : 'hover:bg-secondary'}`}>Settings</NavLink>
                <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-secondary' : 'hover:bg-secondary'}`}>Login</NavLink>
                <Button asChild size="sm"><Link to="/register">Sign up</Link></Button>
              </>
            )}
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </main>
      <Toaster />
    </div>
  );
}


