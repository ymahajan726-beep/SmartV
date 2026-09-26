"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/users", "GET");
      setUsers(Array.isArray(data) ? data : []);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await apiRequest(`/users/${id}`, "DELETE");
      fetchUsers();
    } catch (err: any) {
      alert("Failed to delete user: " + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <header className="pb-6 border-b border-white/10 flex justify-between items-center">
        <div>
          <span className="text-xs font-mono text-[#cbf000] uppercase tracking-widest">[ MODULE 1: USERS ]</span>
          <h1 className="text-3xl font-light tracking-tight mt-1">Users Database</h1>
        </div>
        <button onClick={fetchUsers} className="px-4 py-2.5 rounded-xl border border-current/20 text-xs uppercase font-mono">🔄 Refresh</button>
      </header>

      {errorMsg && <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-xs font-mono">⚠️ {errorMsg}</div>}

      <div className="rounded-[32px] border border-current/10 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
          <thead className="border-b border-current/10 bg-black/20 text-neutral-400">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-current/5">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-400">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-400">No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5">
                  <td className="p-4 text-neutral-400">#{u.id.slice(-6)}</td>
                  <td className="p-4 font-bold">{u.name || "N/A"}</td>
                  <td className="p-4 lowercase text-neutral-400">{u.email}</td>
                  <td className="p-4 text-[#cbf000]">{u.role}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}