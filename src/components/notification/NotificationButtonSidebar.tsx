import Link from 'next/link';
import { Bell } from 'lucide-react';

export function NotificationButtonSidebar() {
  return (
    <Link href="/notifications" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors">
      <Bell className="w-5 h-5 text-yellow-300" />
      <span className="font-medium text-white">Thông báo</span>
    </Link>
  );
}
