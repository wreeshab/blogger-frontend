import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { apiClient, type User } from '../../lib/api';

export default function UserProfile() {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchUser() {
    setLoading(true);
    setError(null);
    setUser(null);
    try {
      const res = await apiClient.getUser(Number(userId));
      setUser(res.data as unknown as User);
    } catch (err: any) {
      setError(err?.error ?? 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-xl mx-auto backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30 border border-white/20">
      <CardHeader>
        <CardTitle>Find User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input placeholder="Enter user ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <Button onClick={fetchUser} disabled={!userId || loading}>{loading ? 'Loading...' : 'Fetch'}</Button>
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        {user && (
          <div className="mt-4 space-y-1 text-sm">
            <div><span className="text-muted-foreground">ID:</span> {user.id}</div>
            <div><span className="text-muted-foreground">Username:</span> {user.username}</div>
            <div><span className="text-muted-foreground">Name:</span> {user.name}</div>
            <div><span className="text-muted-foreground">Email:</span> {user.email}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
