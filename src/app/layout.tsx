import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PlanBook AI - Hệ thống quản lý giáo dục thông minh',
  description: 'Nền tảng quản lý giáo dục tích hợp AI, hỗ trợ giáo viên và quản lý trường học',
  keywords: 'giáo dục, AI, quản lý trường học, giáo án, đề thi',
  authors: [{ name: 'PlanBook AI Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
