type BadgeProps = { status: string };
const cfg: Record<string, string> = {
  available: 'bg-green-100 text-green-700', booked: 'bg-red-100 text-red-700',
  active: 'bg-blue-100 text-blue-700', cancelled: 'bg-gray-100 text-gray-600',
  returned: 'bg-purple-100 text-purple-700', admin: 'bg-orange-100 text-orange-700',
  customer: 'bg-teal-100 text-teal-700',
};
export default function Badge({ status }: BadgeProps) {
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cfg[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}