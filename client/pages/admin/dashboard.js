import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { CalendarIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// Mock data for the dashboard
const stats = [
  { name: 'Today\'s Appointments', stat: '12', icon: CalendarIcon },
  { name: 'Pending Bookings', stat: '2', icon: UserGroupIcon },
  { name: 'Today\'s Revenue', stat: '$1,450', icon: CurrencyDollarIcon },
];

const mockAppointments = [
  { id: 1, time: '10:00 AM', client: 'Alice Smith', service: 'Women\'s Haircut', staff: 'Alex' },
  { id: 2, time: '11:00 AM', client: 'Bob Johnson', service: 'Massage', staff: 'Maria' },
  { id: 3, time: '01:00 PM', client: 'Charlie Brown', service: 'Consultation', staff: 'Alex' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AdminLayout title="Dashboard">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Welcome, {user?.ownerName}!
      </h2>

      {/* Stats Cards */}
      <div>
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.name}
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">
                {item.name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {item.stat}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Today's Appointments List */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Today's Schedule
        </h3>
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {mockAppointments.map((appt) => (
              <li key={appt.id}>
                <a href="#" className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-md font-medium text-blue-600">
                        {appt.time} - {appt.client}
                      </p>
                      <div className="ml-2 flex flex-shrink-0">
                        <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Confirmed
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {appt.service}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Staff: {appt.staff}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}