import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { notify } from '../../lib/notify';

export default function BlogEditor() {
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    if (isEdit && id) {
      (async () => {
        try {
          const res = await apiClient.getBlog(Number(id));
          if (!ignore) {
            setTitle(res.data?.title ?? '');
            setBody(res.data?.body ?? '');
          }
        } catch (err: any) {
          if (!ignore) setError(err?.error ?? 'Failed to load blog');
        }
      })();
    }
    return () => {
      ignore = true;
    };
  }, [isEdit, id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('You must be logged in.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (isEdit && id) {
        await apiClient.updateBlog(Number(id), { title, body });
        notify.success('Blog updated');
        navigate(`/blogs/${id}`);
      } else {
        const res = await apiClient.createBlog({ title, body });
        notify.success('Blog created');
        // If backend does not return id, just go back to list
        navigate('/blogs');
      }
    } catch (err: any) {
      setError(err?.error ?? 'Save failed');
      notify.error(err?.error ?? 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-3xl mx-auto backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30 border border-white/20">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Blog' : 'New Blog'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Body</label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={12} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button disabled={loading} type="submit">{loading ? 'Saving...' : 'Save'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}


