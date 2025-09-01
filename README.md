# PlanBook AI - Frontend

Hệ thống quản lý giáo dục thông minh, tích hợp AI để hỗ trợ giáo viên một cách hiệu quả.

## 🚀 Tính năng chính

- **Quản lý giáo án**: Tạo và quản lý giáo án với sự hỗ trợ của AI
- **Ngân hàng câu hỏi**: Xây dựng và quản lý ngân hàng câu hỏi đa dạng
- **Tạo đề thi**: Tự động tạo đề thi từ ngân hàng câu hỏi
- **Quản lý người dùng**: Hệ thống phân quyền Admin/Teacher
- **Giao diện hiện đại**: Thiết kế responsive và thân thiện người dùng

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **HTTP Client**: Axios

## 📁 Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout chính
│   ├── page.tsx           # Trang chủ
│   └── globals.css        # CSS toàn cục
├── components/             # React components
│   ├── ui/                # UI components cơ bản
│   ├── auth/              # Components xác thực
│   ├── layout/            # Components layout
│   └── common/            # Components chung
├── services/               # API services
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
├── types/                  # TypeScript types
├── utils/                  # Utility functions
└── styles/                 # CSS modules (nếu cần)
```

## 🚀 Khởi chạy dự án

### Yêu cầu hệ thống

- Node.js 18.17.0 hoặc cao hơn
- npm hoặc yarn

### Cài đặt

1. Clone repository:

```bash
git clone [<repository-url>](https://github.com/PlanBookAI/PlanBookAI-FE)
cd planbookai-fe
```

2. Cài đặt dependencies:

```bash
npm install
# hoặc
yarn install
```

3. Tạo file môi trường:

```bash
cp .env.example .env.local
```

4. Cập nhật biến môi trường trong `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

5. Khởi chạy dự án:

```bash
npm run dev
# hoặc
yarn dev
```

Dự án sẽ chạy tại [http://localhost:3000](http://localhost:3000)

**Lưu ý**: Để chạy production server, bạn cần build dự án trước:

```bash
npm run build
npm run start
```

## 📝 Scripts có sẵn

- `npm run dev` - Khởi chạy môi trường phát triển
- `npm run build` - Build dự án cho production
- `npm run start` - Khởi chạy production server
- `npm run lint` - Kiểm tra lỗi ESLint
- `npm run type-check` - Kiểm tra TypeScript

## 🔧 Cấu hình

### Tailwind CSS

Dự án sử dụng Tailwind CSS với cấu hình tùy chỉnh trong `tailwind.config.js`. Các component UI được xây dựng dựa trên design system của Shadcn/ui.

### TypeScript

Cấu hình TypeScript được tối ưu hóa cho Next.js với strict mode và path mapping cho các import.

### ESLint & Prettier

- ESLint với Next.js và TypeScript rules
- Prettier với Tailwind CSS plugin

## 📱 Responsive Design

Dự án được thiết kế theo nguyên tắc mobile-first, hỗ trợ đầy đủ các thiết bị từ mobile đến desktop.

## 🔐 Xác thực

Hệ thống xác thực sử dụng JWT tokens với các tính năng:

- Đăng nhập/Đăng ký
- Bảo vệ route
- Quản lý vai trò người dùng
- Tự động đăng xuất khi token hết hạn

## 🧪 Testing

- Jest + React Testing Library cho unit tests
- Playwright cho E2E tests
- Testing utilities và mocks

## 🚀 Deployment

Dự án được cấu hình để deploy trên Vercel với:

- Tối ưu hóa build
- CDN cho tài sản tĩnh
- Biến môi trường
- Headers bảo mật

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem `LICENSE` để biết thêm chi tiết.

## 🙏 Cảm ơn

Cảm ơn tất cả contributors đã đóng góp vào dự án này!
