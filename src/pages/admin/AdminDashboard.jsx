import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/wines" className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-stone-900">Manage Wines</h2>
          <p className="text-stone-500 text-sm mt-1">Add, edit, or remove wines</p>
        </Link>
        <Link to="/admin/producers" className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-stone-900">Manage Producers</h2>
          <p className="text-stone-500 text-sm mt-1">Add, edit, or remove producers</p>
        </Link>
        <Link to="/admin/orders" className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-stone-900">Manage Orders</h2>
          <p className="text-stone-500 text-sm mt-1">View and update order status</p>
        </Link>
        <Link to="/admin/tags" className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-stone-900">Manage Tags</h2>
          <p className="text-stone-500 text-sm mt-1">Add regions, varietals, colours</p>
        </Link>
        <Link to="/admin/users" className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-stone-900">Manage Users</h2>
          <p className="text-stone-500 text-sm mt-1">Create, view or remove users</p>
        </Link>
      </div>
    </div>
  )
}
