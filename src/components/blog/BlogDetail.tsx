import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiClient, type Blog } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { notify } from '../../lib/notify';
import { useAuth } from '../../lib/auth';

export default function BlogDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    if (!id) return;
    (async () => {
      try {
        const res = await apiClient.getBlog(Number(id));
        if (!ignore) setBlog(res.data ?? null);
      } catch (err: any) {
        if (!ignore) setError(err?.error ?? 'Failed to load blog');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <div>Loading blog...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <Card className="max-w-3xl mx-auto backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30 border border-white/20">
      <CardHeader>
        <CardTitle>{blog.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="leading-7 whitespace-pre-wrap">{blog.body}</p>
        {isAuthenticated && id && (
          <div className="mt-6 flex gap-3">
            <Button asChild variant="secondary"><Link to={`/blogs/${id}/edit`}>Edit</Link></Button>
            <Button variant="destructive" onClick={async () => {
              try {
                await apiClient.deleteBlog(Number(id));
                notify.success('Blog deleted');
                navigate('/blogs');
              } catch (err: any) {
                setError(err?.error ?? 'Delete failed');
                notify.error(err?.error ?? 'Delete failed');
              }
            }}>Delete</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
