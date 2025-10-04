import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi } from "@/lib/api";
import type { ShardInfo, ShardDistribution, MigrateShardRequest, MigrateShardResponse } from "@/lib/api";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function ShardingDashboard() {
  const [shards, setShards] = useState<ShardInfo[]>([]);
  const [distribution, setDistribution] = useState<ShardDistribution>({});
  const [migrateInput, setMigrateInput] = useState<MigrateShardRequest>({ type: "user", id: 0, target: "" });
  const [migrateResult, setMigrateResult] = useState<MigrateShardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingShards, setLoadingShards] = useState(true);
  const [loadingDist, setLoadingDist] = useState(true);

  useEffect(() => {
    setLoadingShards(true);
    setLoadingDist(true);
    adminApi.getShards().then(data => { setShards(data); setLoadingShards(false); });
    adminApi.getShardDistribution().then(data => { setDistribution(data); setLoadingDist(false); });
  }, []);

  const handleMigrate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMigrateResult(null);
    try {
      const res = await adminApi.migrateShard(migrateInput);
      setMigrateResult(res);
      // Refresh data after migration
      setLoadingShards(true);
      setLoadingDist(true);
      adminApi.getShards().then(data => { setShards(data); setLoadingShards(false); });
      adminApi.getShardDistribution().then(data => { setDistribution(data); setLoadingDist(false); });
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for Recharts
  const chartData = Object.entries(distribution).map(([name, dist]) => ({
    name,
    Users: dist.user_count,
    Blogs: dist.blog_count,
  }));

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Sharding Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Shard Status</h3>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Blogs</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Port</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingShards ? (
                    <TableRow>
                      <TableCell colSpan={6}><Skeleton className="h-6 w-full" /></TableCell>
                    </TableRow>
                  ) : (
                    shards.map(s => (
                      <TableRow key={s.name}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.status}</TableCell>
                        <TableCell>{s.user_count}</TableCell>
                        <TableCell>{s.blog_count}</TableCell>
                        <TableCell>{s.host}</TableCell>
                        <TableCell>{s.port}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Shard Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {loadingDist ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                Object.entries(distribution).map(([name, dist]) => (
                  <Card key={name} className="p-4">
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-muted-foreground">Users: {dist.user_count}</div>
                    <div className="text-sm text-muted-foreground">Blogs: {dist.blog_count}</div>
                  </Card>
                ))
              )}
            </div>
            {!loadingDist && chartData.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Users" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Blogs" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Migrate User/Blog</h3>
            <form onSubmit={handleMigrate} className="flex flex-col md:flex-row gap-4 items-end mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Type</label>
                <Select value={migrateInput.type} onValueChange={v => setMigrateInput({ ...migrateInput, type: v as any })}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">ID</label>
                <Input type="number" value={migrateInput.id} onChange={e => setMigrateInput({ ...migrateInput, id: Number(e.target.value) })} className="w-32" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Target Shard</label>
                <Input type="text" value={migrateInput.target} onChange={e => setMigrateInput({ ...migrateInput, target: e.target.value })} className="w-32" />
              </div>
              <Button type="submit" disabled={loading} className="w-32">{loading ? "Migrating..." : "Migrate"}</Button>
            </form>
            {migrateResult && (
              <Card className="p-4 mt-2">
                <div className="font-semibold">Migration Result:</div>
                <div className={migrateResult.status === "success" ? "text-green-600" : "text-red-600"}>
                  {migrateResult.status || migrateResult.error}
                </div>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
