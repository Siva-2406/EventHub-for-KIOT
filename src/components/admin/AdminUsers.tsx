import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { Role } from '../../types';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  college: string;
  role: Role;
  status: 'active' | 'deactivated';
  joinedDate: string;
}

const INITIAL_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'u-1',
    name: 'Sivaperumal B',
    email: '2k25csbs47@kiot.ac.in',
    college: 'Knowledge Institute of Technology (KIOT)',
    role: 'student',
    status: 'active',
    joinedDate: '2026-08-01',
  },
  {
    id: 'u-2',
    name: 'Prof. Ramesh K.',
    email: 'ramesh.csbs@kiot.ac.in',
    college: 'Knowledge Institute of Technology (KIOT)',
    role: 'host',
    status: 'active',
    joinedDate: '2026-05-15',
  },
  {
    id: 'u-3',
    name: 'EventHub Admin',
    email: 'admin.eventhub@kiot.ac.in',
    college: 'Knowledge Institute of Technology (KIOT)',
    role: 'admin',
    status: 'active',
    joinedDate: '2026-01-10',
  },
  {
    id: 'u-4',
    name: 'Ananya Sharma',
    email: 'ananya@abcengg.edu',
    college: 'ABC Engineering College',
    role: 'student',
    status: 'active',
    joinedDate: '2026-08-20',
  },
  {
    id: 'u-5',
    name: 'Prof. K. Venkatesh',
    email: 'codecraft@abcengg.edu',
    college: 'ABC Engineering College',
    role: 'host',
    status: 'active',
    joinedDate: '2026-06-12',
  },
  {
    id: 'u-6',
    name: 'Karthik Raja',
    email: 'karthik@xyztech.ac.in',
    college: 'XYZ Institute of Technology',
    role: 'student',
    status: 'active',
    joinedDate: '2026-09-02',
  },
];

export const AdminUsers: React.FC = () => {
  const { addToast } = useApp();
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_MANAGED_USERS);
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
  const [search, setSearch] = useState('');

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === 'active' ? 'deactivated' : 'active';
          addToast(
            `User ${nextStatus === 'active' ? 'Activated' : 'Deactivated'}`,
            `${u.name}'s account status set to ${nextStatus}.`,
            nextStatus === 'active' ? 'success' : 'warning'
          );
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.college.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Campus User Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Directory of registered students, faculty coordinators, and administrative officers.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'student', 'host', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                roleFilter === r
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {u.college}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {u.joinedDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {u.status === 'active' ? '✓ Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        u.status === 'active'
                          ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                          : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      }`}
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
