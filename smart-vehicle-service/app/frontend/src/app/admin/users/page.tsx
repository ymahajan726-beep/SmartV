"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminUsersPage() {
  const { isLightMode } = useTheme();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STAFF");

  // Edit User States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState("STAFF");

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

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

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/users/staff", "POST", { name, email, phone, password, role });
      setShowModal(false);
      setName(""); setEmail(""); setPhone(""); setPassword(""); setRole("STAFF");
      showToast("Staff member registered successfully in Database!");
      fetchUsers();
    } catch (err: any) {
      alert("Failed to register staff: " + err.message);
    }
  };

  const handleOpenEdit = (u: any) => {
    setEditingUserId(u.id);
    setEditName(u.name || "");
    setEditEmail(u.email || "");
    setEditPhone(u.phone || "");
    setEditRole(u.role || "STAFF");
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;
    try {
      await apiRequest(`/users/${editingUserId}`, "PATCH", {
        name: editName,
        email: editEmail,
        phone: editPhone,
        role: editRole,
      });
      setShowEditModal(false);
      setEditingUserId(null);
      showToast("User updated successfully!");
      fetchUsers();
    } catch (err: any) {
      alert("Failed to update user: " + err.message);
    }
  };

  const handleDelete = async (u: any) => {
    if (String(u.role) === 'SUPER_ADMIN' || u.email === 'admin@autocare.com') {
      alert("Action Denied: Super Admin cannot be deleted.");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${u.name || u.email}?`)) return;
    try {
      await apiRequest(`/users/${u.id}`, "DELETE");
      showToast("User deleted from database successfully!");
      fetchUsers();
    } catch (err: any) {
      alert("Failed to delete user: " + err.message);
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-6 py-3 rounded-2xl bg-[#cbf000] text-black font-mono text-xs font-bold uppercase shadow-2xl animate-bounce">
          ✨ {toastMsg}
        </div>
      )}

      <header className={`pb-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          
          <h1 className={`text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Staff & Admin Directory</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowModal(true)} className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer transition-all ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
            + Register Staff
          </button>
          <button onClick={fetchUsers} className={`px-4 py-2.5 rounded-xl border text-xs uppercase font-mono cursor-pointer transition-all ${isLightMode ? "border-gray-300 hover:border-black text-gray-800 bg-gray-50" : "border-white/20 hover:border-[#cbf000] text-white"}`}>🔄 Refresh</button>
        </div>
      </header>

      {errorMsg && <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-xs font-mono border border-red-500/20">⚠️ {errorMsg}</div>}

      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
          <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email / Phone</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-400">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-400">No users found.</td></tr>
            ) : (
              users.map((u) => {
                const isSuperAdmin = String(u.role) === 'SUPER_ADMIN' || u.email === 'admin@autocare.com';
                return (
                  <tr key={u.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    <td className="p-4 text-neutral-400">#{u.id.slice(-6)}</td>
                    <td className={`p-4 font-bold ${isLightMode ? "text-gray-900" : "text-white"}`}>{u.name || "N/A"}</td>
                    <td className="p-4 lowercase text-neutral-400">
                      <div>{u.email}</div>
                      <span className="text-[10px] text-[#cbf000]">{u.phone || "No Phone"}</span>
                    </td>
                    <td className="p-4 text-[#cbf000]">{u.role}</td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => handleOpenEdit(u)} className="text-blue-400 hover:text-blue-300 cursor-pointer">Edit</button>
                      {isSuperAdmin ? (
                        <span className="text-neutral-500 italic font-mono text-[10px]">Protected 🛡️</span>
                      ) : (
                        <button onClick={() => handleDelete(u)} className="text-red-400 hover:text-red-300 cursor-pointer">Delete</button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#cbf000] mb-6">Register New Staff</h3>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name (e.g. John Mechanic)" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile Number (e.g. 9876543210)" className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Temporary Password" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <select value={role} onChange={(e) => setRole(e.target.value)} className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}>
                <option value="STAFF">Staff / Mechanic</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
              
              <div className="flex gap-4 pt-4">
                <button type="submit" className={`flex-1 py-3.5 rounded-2xl font-bold uppercase text-xs cursor-pointer ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>Register Staff</button>
                <button type="button" onClick={() => setShowModal(false)} className={`px-6 py-3.5 rounded-2xl border text-xs uppercase font-mono cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#cbf000] mb-6">Edit User Details</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Full Name" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email Address" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Mobile Number" className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}>
                <option value="STAFF">Staff / Mechanic</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
                <option value="CUSTOMER">Customer</option>
              </select>
              
              <div className="flex gap-4 pt-4">
                <button type="submit" className={`flex-1 py-3.5 rounded-2xl font-bold uppercase text-xs cursor-pointer ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>Save Changes</button>
                <button type="button" onClick={() => setShowEditModal(false)} className={`px-6 py-3.5 rounded-2xl border text-xs uppercase font-mono cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}