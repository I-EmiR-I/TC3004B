'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-4 text-gray-600">
          Esta es una página protegida. Solo usuarios autenticados pueden verla.
        </p>
      </div>
    </ProtectedRoute>
  );
}