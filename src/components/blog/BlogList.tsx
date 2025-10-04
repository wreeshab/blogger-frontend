import { useEffect, useState } from 'react';
import { apiClient, type Blog } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import BlogCardSkeleton from '../ui/skeletons/BlogCardSkeleton';

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await apiClient.listBlogs({ page: 1, limit: 10, sort: 'latest' });
        if (!ignore) setBlogs(res.data?.blogs ?? []);
      } catch (err: any) {
        if (!ignore) setError(err?.error ?? 'Failed to load blogs');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
  if (error) return <div className="text-red-600">{error}</div>;

  if (blogs.length === 0) return <div className='text-gray-600 text-center'>No blogs found.</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {blogs.map((b) => (
        <Card key={b.id} className="backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30 border border-white/20">
          <CardHeader>
            <CardTitle className="line-clamp-1">{b.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 text-sm text-muted-foreground">{b.body}</p>
            <div className="mt-4">
              <Button asChild variant="secondary" size="sm"><Link to={`/blogs/${b.id}`}>Read</Link></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
