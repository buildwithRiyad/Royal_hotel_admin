'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAdminResources } from '@/hooks/useAdminResources';

export default function SystemPage() {
  const { getLogs, backup, restore } = useAdminResources();
  const [logs, setLogs] = useState<any>(null);
  const [restoreBody, setRestoreBody] = useState(`{
  "data": {}
}`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogs = async () => {
    setLoading(true);
    try {
      const data = await getLogs();
      setLogs(data);
      setError(null);
      toast.success('Logs loaded');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('Admin access required to view logs.');
        return;
      }
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      const data = await backup();
      setLogs(data);
      setError(null);
      toast.success('Backup completed');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('Admin access required to run backups.');
        return;
      }
      toast.error('Failed to run backup');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const parsed = JSON.parse(restoreBody);
      const data = await restore(parsed);
      setLogs(data);
      setError(null);
      toast.success('Restore completed');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('Admin access required to restore data.');
        return;
      }
      toast.error('Restore failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-amber-800 mb-2">System Tools</h1>
        <p className="text-gray-500 mb-6">Logs, backup, and restore endpoints.</p>
        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <div className="flex flex-wrap gap-3">
          <button onClick={handleLogs} disabled={loading} className="bg-amber-700 text-white px-5 py-3 rounded-lg hover:bg-amber-800 transition">Load Logs</button>
          <button onClick={handleBackup} disabled={loading} className="border border-amber-700 text-amber-700 px-5 py-3 rounded-lg hover:bg-amber-50 transition">Run Backup</button>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Restore Payload</label>
          <textarea value={restoreBody} onChange={(e) => setRestoreBody(e.target.value)} className="w-full min-h-48 border border-gray-300 rounded-xl p-4 font-mono text-sm" />
          <button onClick={handleRestore} disabled={loading} className="mt-3 bg-slate-900 text-white px-5 py-3 rounded-lg hover:bg-slate-800 transition">Restore</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-amber-800 mb-4">Latest Response</h2>
        <pre className="whitespace-pre-wrap text-sm bg-slate-950 text-amber-50 rounded-xl p-4 overflow-auto min-h-96">{logs ? JSON.stringify(logs, null, 2) : 'No response loaded yet.'}</pre>
      </div>
    </div>
  );
}