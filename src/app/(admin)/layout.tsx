export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900">
            Admin Dashboard
          </h1>
        </div>
      </header>
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li><a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a></li>
              <li><a href="/users" className="text-gray-700 hover:text-blue-600">Users</a></li>
              <li><a href="/questions" className="text-gray-700 hover:text-blue-600">Questions</a></li>
              <li><a href="/exams" className="text-gray-700 hover:text-blue-600">Exams</a></li>
              <li><a href="/lesson-plans" className="text-gray-700 hover:text-blue-600">Lesson Plans</a></li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
