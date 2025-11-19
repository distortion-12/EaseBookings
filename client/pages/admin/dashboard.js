// distortion-12/easebookings/EaseBookings-2ccb84a3b45beba25b333745f5ab8d56d164e37d/client/pages/admin/dashboard.js

import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { CalendarIcon, CurrencyDollarIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import { format, isToday } from 'date-fns';

// Mock data for the dashboard
const stats = [
  { name: 'Today\'s Appointments', stat: '12', icon: CalendarIcon },
  { name: 'Pending Bookings', stat: '2', icon: ClockIcon },
  { name: 'This Week\'s Revenue', stat: '$3,450', icon: CurrencyDollarIcon },
];

const mockBookings = [
  { id: 1, date: new Date(), time: '10:00 AM', client: {name: 'Alice Smith'}, service: {name: 'Women\'s Haircut'}, staff: {name: 'Alex'}, status: 'Confirmed' },
  { id: 2, date: new Date(), time: '11:00 AM', client: {name: 'Bob Johnson'}, service: {name: 'Massage'}, staff: {name: 'Maria'}, status: 'Confirmed' },
  { id: 3, date: new Date(2025, 10, 20), time: '01:00 PM', client: {name: 'Charlie Brown'}, service: {name: 'Consultation'}, staff: {name: 'Alex'}, status: 'Pending' },
  { id: 4, date: new Date(2025, 10, 21), time: '02:00 PM', client: {name: 'Dana White'}, service: {name: 'Pedicure'}, staff: {name: 'Maria'}, status: 'Completed' },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  
  if (loading || !user) {
    return null; // Handled by AdminLayout
  }

  const todayBookings = mockBookings.filter(appt => isToday(appt.date)).slice(0, 5);
  const recentBookings = mockBookings.slice(0, 5); // Fallback for recent activity

  return (
    <AdminLayout title="Dashboard Home">
      {/* Welcome Message */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-8 max-sm:text-xl">
        Welcome, {user?.ownerName}! Here is a snapshot of {user?.businessName}.
      </h2>

      {/* Stats Cards - Matching the card style */}
      <div className='mb-10'>
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.name}
              className="overflow-hidden rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-5 shadow sm:p-6 border border-gray-200"
            >
              <dt className="truncate text-sm font-medium text-gray-700">
                <item.icon className="h-5 w-5 text-blue-600 inline-block mr-2" />
                {item.name}
              </dt>
              <dd className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                {item.stat}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Recent Activity Section (Table View) */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Appointments
        </h3>
        {/* Table structure mirroring ManageJobs.jsx */}
        <div className="overflow-x-auto">
          <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
              <thead>
                  <tr>
                      <th className='py-2 px-4 border-b border-gray-200 text-left max-sm:hidden'>Date</th>
                      <th className='py-2 px-4 border-b border-gray-200 text-left'>Client</th>
                      <th className='py-2 px-4 border-b border-gray-200 text-left max-sm:hidden'>Service</th>
                      <th className='py-2 px-4 border-b border-gray-200 text-left'>Staff</th>
                      <th className='py-2 px-4 border-b border-gray-200 text-center'>Status</th>
                  </tr>
              </thead>
              <tbody>
                  {recentBookings.map((appt) => (
                      <tr key={appt.id} className='text-gray-700'>
                          <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{format(appt.date, 'MMM dd, yyyy')}</td>
                          <td className='py-2 px-4 border-b border-gray-200 font-medium'>{appt.client.name}</td>
                          <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{appt.service.name}</td>
                          <td className='py-2 px-4 border-b border-gray-200'>{appt.staff.name}</td>
                          <td className='py-2 px-4 border-b border-gray-200 text-center'>
                              <span className={`px-4 py-1.5 rounded text-sm 
                                  ${appt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                                   appt.status === 'Pending' ? 'bg-blue-100 text-blue-700' : 
                                   'bg-gray-100 text-gray-700'}`
                              }>
                                  {appt.status}
                              </span>
                          </td>
                      </tr>
                  ))}
                  {recentBookings.length === 0 && (
                      <tr><td colSpan="5" className='py-4 text-center text-gray-500'>No recent appointments.</td></tr>
                  )}
              </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}