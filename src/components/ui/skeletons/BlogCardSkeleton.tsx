import { Card, CardContent, CardHeader } from '../card';
import { Skeleton } from '../skeleton';

export default function BlogCardSkeleton() {
  return (
    <Card className="backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30 border border-white/20">
      <CardHeader>
        <Skeleton className="h-6 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-8 w-24 mt-4" />
      </CardContent>
    </Card>
  );
}


