import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { notify } from '../../lib/notify';

export default function UserSettings() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) return <div>Please login.</div>;

  async function onUpdate(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await apiClient.updateUser({ username, name, email, password: password || undefined });
      setMessage('Profile updated');
      notify.success('Profile updated');
    } catch (err: any) {
      setError(err?.error ?? 'Update failed');
      notify.error(err?.error ?? 'Update failed');
    }
  }

  async function onDelete() {
    setMessage(null);
    setError(null);
    try {
      await apiClient.deleteUser(deletePassword);
      logout();
      navigate('/');
      notify.success('Account deleted');
    } catch (err: any) {
      setError(err?.error ?? 'Delete failed');
      notify.error(err?.error ?? 'Delete failed');
    }
  }

  return (
    <Card className="max-w-2xl mx-auto backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30 border border-white/20">
      <CardHeader>
        <CardTitle>User Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onUpdate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Username</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm">New Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit">Update</Button>
        </form>
        <div className="mt-6 space-y-3">
          <h2 className="font-medium">Delete Account</h2>
          <div className="flex gap-2">
            <Input type="password" placeholder="Confirm password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
            <Button variant="destructive" onClick={onDelete}>Delete Account</Button>
          </div>
        </div>
        {message && <p className="text-green-600 text-sm mt-4">{message}</p>}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}
