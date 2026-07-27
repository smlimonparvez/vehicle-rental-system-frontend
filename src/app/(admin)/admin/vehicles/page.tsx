'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getVehiclesApi, createVehicleApi, updateVehicleApi, deleteVehicleApi } from '@/lib/api';
import { Vehicle } from '@/types';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { vehicleEmoji, vehicleGradient, toCurrency } from '@/lib/utils';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, Image } from 'lucide-react';

const empty = {
  vehicle_name: '', type: 'car', registration_number: '',
  daily_rent_price: '', availability_status: 'available', image_url: '',
};

function PreviewImage({ url, type }: { url: string; type: string }) {
  const [err, setErr] = useState(false);
  if (!url || err) return (
    <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${vehicleGradient(type)} flex items-center justify-center text-2xl flex-shrink-0`}>
      {vehicleEmoji(type)}
    </div>
  );
  return <img src={url} alt="preview" className="h-16 w-16 rounded-xl object-cover flex-shrink-0" onError={() => setErr(true)} />;
}

export default function AdminVehiclesPage() {
  const { token }                     = useAuth();
  const [vehicles, setVehicles]       = useState<Vehicle[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [form, setForm]               = useState(empty);
  const [submitting, setSubmitting]   = useState(false);

  const fetchVehicles = async () => {
    const r = await getVehiclesApi();
    if (r.success) setVehicles(r.data || []);
    setLoading(false);
  };
  useEffect(() => { fetchVehicles(); }, []);

  const filtered = vehicles.filter(v =>
    v.vehicle_name.toLowerCase().includes(search.toLowerCase()) ||
    v.registration_number.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setEditVehicle(null); setForm(empty); setModalOpen(true); };
  const openEdit = (v: Vehicle) => {
    setEditVehicle(v);
    setForm({
      vehicle_name: v.vehicle_name, type: v.type,
      registration_number: v.registration_number,
      daily_rent_price: String(v.daily_rent_price),
      availability_status: v.availability_status,
      image_url: v.image_url || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const payload = { ...form, daily_rent_price: parseFloat(form.daily_rent_price), image_url: form.image_url || null };
      const r = editVehicle
        ? await updateVehicleApi(editVehicle.id, payload, token!)
        : await createVehicleApi(payload, token!);
      if (r.success) {
        toast.success(editVehicle ? 'Vehicle updated!' : 'Vehicle added!');
        setModalOpen(false); fetchVehicles();
      } else { toast.error(r.message || 'Failed'); }
    } catch { toast.error('Something went wrong'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this vehicle?')) return;
    const r = await deleteVehicleApi(id, token!);
    if (r.success) { toast.success('Deleted'); fetchVehicles(); }
    else toast.error(r.message || 'Cannot delete — active bookings exist');
  };

  const inp = 'w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Vehicles</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {loading ? '...' : `${vehicles.length} total vehicles`}
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg">
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or registration..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white max-w-sm" />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {['Vehicle', 'Type', 'Reg. No.', 'Price/Day', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-gray-400">No vehicles found</td></tr>
              ) : (
                filtered.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <PreviewImage url={v.image_url || ''} type={v.type} />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{v.vehicle_name}</p>
                          <p className="text-xs text-gray-400">#{v.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 capitalize">{vehicleEmoji(v.type)} {v.type}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">{v.registration_number}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white">{toCurrency(v.daily_rent_price)}</td>
                    <td className="px-4 py-3"><Badge status={v.availability_status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(v)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit"><Pencil size={15} /></button>
                        <button onClick={() => handleDelete(v.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <span className="flex items-center gap-1.5"><Image size={14} /> Image URL <span className="text-gray-400 font-normal">(optional)</span></span>
            </label>
            <input value={form.image_url}
              onChange={e => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://example.com/car.jpg" className={inp} />
            {/* Live preview */}
            {form.image_url && (
              <div className="mt-2 flex items-center gap-3">
                <PreviewImage url={form.image_url} type={form.type} />
                <p className="text-xs text-gray-400">Image preview</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Vehicle Name</label>
            <input value={form.vehicle_name} onChange={e => setForm({ ...form, vehicle_name: e.target.value })}
              placeholder="Toyota Camry 2024" required className={inp} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inp}>
                {['car','bike','van','SUV'].map(t => <option key={t} value={t}>{vehicleEmoji(t)} {t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
              <select value={form.availability_status} onChange={e => setForm({ ...form, availability_status: e.target.value })} className={inp}>
                <option value="available">✓ Available</option>
                <option value="booked">✗ Booked</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Registration Number</label>
            <input value={form.registration_number} onChange={e => setForm({ ...form, registration_number: e.target.value })}
              placeholder="ABC-1234" required className={inp} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Daily Rent Price ($)</label>
            <input type="number" min="1" value={form.daily_rent_price}
              onChange={e => setForm({ ...form, daily_rent_price: e.target.value })}
              placeholder="50" required className={inp} />
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 mt-1">
            {submitting ? 'Saving...' : editVehicle ? 'Update Vehicle' : 'Create Vehicle'}
          </button>
        </form>
      </Modal>
    </div>
  );
}