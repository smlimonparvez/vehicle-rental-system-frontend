'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUsersApi, updateUserApi, deleteUserApi } from '@/lib/api';
import { User } from '@/types';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const {token}=useAuth();
  const [users,setUsers]=useState<User[]>([]);
  const [loading,setLoading]=useState(true);
  const [editUser,setEditUser]=useState<User|null>(null);
  const [form,setForm]=useState({name:'',email:'',phone:'',role:'customer'});
  const [submitting,setSubmitting]=useState(false);

  const fetchUsers=async()=>{if(!token)return;const r=await getUsersApi(token);if(r.success)setUsers(r.data||[]);setLoading(false);};
  useEffect(()=>{fetchUsers();},[token]);

  const openEdit=(u:User)=>{setEditUser(u);setForm({name:u.name,email:u.email,phone:u.phone,role:u.role});};

  const handleUpdate=async(e:React.FormEvent)=>{
    e.preventDefault();if(!editUser)return;setSubmitting(true);
    try{
      const r=await updateUserApi(editUser.id,form,token!);
      if(r.success){toast.success('User updated!');setEditUser(null);fetchUsers();}
      else toast.error(r.message||'Update failed');
    }catch{toast.error('Something went wrong');}
    finally{setSubmitting(false);}
  };

  const handleDelete=async(id:number)=>{
    if(!confirm('Delete this user?'))return;
    if(!token)return;

    try {
      const r=await deleteUserApi(id,token);
      if(r.success){
        toast.success('User deleted');
        fetchUsers();
      } else {
        const message = (r.message || '').toLowerCase();
        const friendlyMessage = message.includes('booking') || message.includes('foreign key') || message.includes('constraint') || message.includes('violat')
          ? 'Cannot delete this user because they still have bookings linked to their account.'
          : r.message || 'Failed to delete user';

        toast.error(friendlyMessage);
      }
    } catch {
      toast.error('Something went wrong while deleting this user');
    }
  };

  const inp='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700';

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Users</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Manage customer and admin accounts</p>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading?<div className="py-20 text-center text-gray-400">Loading users...</div>:users.length===0?<div className="py-20 text-center text-gray-400">No users found</div>:(
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50"><tr>{['#','Name','Email','Phone','Role','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {users.map(u=>(
                <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-400">#{u.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.phone}</td>
                  <td className="px-4 py-3"><Badge status={u.role}/></td>
                  <td className="px-4 py-3"><div className="flex gap-2">
                    <button onClick={()=>openEdit(u)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Pencil size={15}/></button>
                    <button onClick={()=>handleDelete(u.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
      <Modal isOpen={!!editUser} onClose={()=>setEditUser(null)} title="Edit User">
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className={inp}/></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required className={inp}/></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required className={inp}/></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label><select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className={inp}><option value="customer">Customer</option><option value="admin">Admin</option></select></div>
          <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 mt-1">{submitting?'Updating...':'Update User'}</button>
        </form>
      </Modal>
    </div>
  );
}