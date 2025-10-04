import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { ShardInfo, ShardDistribution, MigrateShardRequest, MigrateShardResponse } from "@/lib/api";

export default function ShardingDashboard() {
  const [shards, setShards] = useState<ShardInfo[]>([]);
  const [distribution, setDistribution] = useState<ShardDistribution>({});
  const [migrateInput, setMigrateInput] = useState<MigrateShardRequest>({ type: "user", id: 0, target: "" });
  const [migrateResult, setMigrateResult] = useState<MigrateShardResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminApi.getShards().then(setShards);
    adminApi.getShardDistribution().then(setDistribution);
  }, []);

  const handleMigrate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMigrateResult(null);
    try {
      const res = await adminApi.migrateShard(migrateInput);
      setMigrateResult(res);
      // Refresh data after migration
      adminApi.getShards().then(setShards);
      adminApi.getShardDistribution().then(setDistribution);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Sharding Admin Dashboard</h2>
      <h3>Shard Status</h3>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Name</th><th>Status</th><th>Users</th><th>Blogs</th><th>Host</th><th>Port</th>
          </tr>
        </thead>
        <tbody>
          {shards.map(s => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td>{s.status}</td>
              <td>{s.user_count}</td>
              <td>{s.blog_count}</td>
              <td>{s.host}</td>
              <td>{s.port}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Shard Distribution</h3>
      <ul>
        {Object.entries(distribution).map(([name, dist]) => (
          <li key={name}>{name}: Users={dist.user_count}, Blogs={dist.blog_count}</li>
        ))}
      </ul>

      <h3>Migrate User/Blog</h3>
      <form onSubmit={handleMigrate} style={{ marginBottom: 16 }}>
        <label>
          Type:
          <select value={migrateInput.type} onChange={e => setMigrateInput({ ...migrateInput, type: e.target.value as any })}>
            <option value="user">User</option>
            <option value="blog">Blog</option>
          </select>
        </label>
        <label>
          ID:
          <input type="number" value={migrateInput.id} onChange={e => setMigrateInput({ ...migrateInput, id: Number(e.target.value) })} />
        </label>
        <label>
          Target Shard:
          <input type="text" value={migrateInput.target} onChange={e => setMigrateInput({ ...migrateInput, target: e.target.value })} />
        </label>
        <button type="submit" disabled={loading}>Migrate</button>
      </form>
      {migrateResult && (
        <div>
          <strong>Migration Result:</strong> {migrateResult.status || migrateResult.error}
        </div>
      )}
    </div>
  );
}
