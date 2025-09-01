# PlanBook AI - Frontend

Hệ thống quản lý giáo dục thông minh, tích hợp AI để hỗ trợ giáo viên một cách hiệu quả.

## 🚀 Tính năng chính

- **Landing Page**: Giao diện giới thiệu hiện đại với Hero, Features, About, Contact sections
- **Authentication**: Hệ thống đăng nhập/đăng ký với Turnstile CAPTCHA bảo mật
- **Smart CAPTCHA**: Cloudflare Turnstile với session management thông minh
- **Responsive Design**: Thiết kế mobile-first, tương thích mọi thiết bị
- **Admin Dashboard**: Quản lý người dùng, giáo án, đề thi, câu hỏi (đang phát triển)

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + class-variance-authority (cva)
- **CAPTCHA**: Cloudflare Turnstile
- **State Management**: React hooks (useState, useEffect, useCallback)
- **Form Handling**: Native HTML forms với validation
- **HTTP Client**: Fetch API
- **Utilities**: clsx, twMerge

## 📁 Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route group cho authentication
│   │   ├── login/         # Trang đăng nhập
│   │   ├── register/      # Trang đăng ký
│   │   └── layout.tsx     # Layout chung cho auth pages
│   ├── (root)/            # Route group cho public pages
│   │   ├── page.tsx        # Landing page
│   │   └── layout.tsx     # Layout chung cho public pages
│   ├── api/               # API routes
│   │   └── verify-turnstile/ # Turnstile verification API
│   ├── layout.tsx         # Root layout
│   └── globals.css        # CSS toàn cục
├── components/             # React components
│   ├── ui/                # UI components cơ bản
│   │   ├── Button.tsx     # Button component với variants
│   │   ├── Input.tsx      # Input component
│   │   ├── Turnstile.tsx  # Cloudflare Turnstile widget
│   │   └── GlobalTurnstile.tsx # Global CAPTCHA modal
│   ├── layout/            # Layout components
│   │   ├── Navbar.tsx     # Navigation bar
│   │   └── Footer.tsx     # Footer component
│   ├── sections/          # Landing page sections
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── AboutSection.tsx
│   │   └── ContactSection.tsx
│   └── providers/          # Context providers
│       └── TurnstileProvider.tsx # Global Turnstile script loader
├── hooks/                  # Custom React hooks
│   ├── useTurnstile.ts    # Turnstile state management
│   └── useTurnstileVerification.ts # Turnstile verification
├── lib/                    # Utility libraries
│   ├── utils.ts           # Utility functions (cn, etc.)
│   └── turnstile-session.ts # Session management
└── types/                  # TypeScript types
    └── index.ts           # Global type definitions
```

## 🚀 Khởi chạy dự án

### Yêu cầu hệ thống

- Node.js 18.17.0 hoặc cao hơn
- npm hoặc yarn

### Cài đặt

1. Clone repository:

```bash
git clone https://github.com/PlanBookAI/PlanBookAI-FE
cd PlanBookAI-FE
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file môi trường:

```bash
cp env.example .env
```

4. Cập nhật biến môi trường trong `.env`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key_here
NEXT_PUBLIC_TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here
```

5. Khởi chạy dự án:

```bash
npm run dev
```

Dự án sẽ chạy tại [http://localhost:3000](http://localhost:3000)

## 📝 Scripts có sẵn

- `npm run dev` - Khởi chạy môi trường phát triển
- `npm run build` - Build dự án cho production
- `npm run start` - Khởi chạy production server
- `npm run lint` - Kiểm tra lỗi ESLint
- `npm run type-check` - Kiểm tra TypeScript

## 🔧 Cấu hình

### Tailwind CSS

Dự án sử dụng Tailwind CSS với cấu hình tùy chỉnh trong `tailwind.config.js`. Design system tuân thủ nguyên tắc:
- **Minimalism**: Giảm thiểu, tập trung vào chức năng chính
- **Gestalt**: Nhóm các thành phần liên quan
- **Spacing**: Hệ thống chia bội số của 4
- **Hierarchy**: Phân cấp rõ ràng

### TypeScript

Cấu hình TypeScript được tối ưu hóa cho Next.js với:
- Strict mode
- Path mapping cho imports
- JSX support
- React types

### Cloudflare Turnstile

Hệ thống CAPTCHA thông minh với:
- **Smart Session**: Verify một lần, sử dụng nhiều lần
- **Force Verify**: Bắt buộc verify cho login/register
- **Global Modal**: Hiển thị khi cần thiết
- **Server-side Verification**: API route `/api/verify-turnstile`

## 🔐 Xác thực & Bảo mật

### Turnstile CAPTCHA
- **Cloudflare Turnstile**: Bảo vệ khỏi bot và tấn công tự động
- **Session Management**: Lưu trữ verification status trong sessionStorage
- **Smart Verification**: Chỉ verify khi cần thiết
- **API Integration**: Server-side verification với Cloudflare

### Authentication Flow
1. **Landing Page**: Global Turnstile modal nếu chưa verify
2. **Login/Register**: Force verify Turnstile trước khi submit
3. **Session**: Lưu verification status trong 30 phút
4. **Security**: Bảo vệ khỏi spam và tấn công tự động

## 📱 Responsive Design

Dự án được thiết kế theo nguyên tắc mobile-first:
- **Breakpoints**: sm, md, lg, xl
- **Flexible Layout**: Grid và Flexbox
- **Touch-friendly**: Buttons và inputs tối ưu cho mobile
- **Performance**: Lazy loading và optimization

## 🎨 Design System

### Components
- **Button**: Variants (primary, secondary, white, ghost)
- **Input**: Consistent styling với validation states
- **Layout**: Navbar, Footer, AuthLayout
- **Sections**: Hero, Features, About, Contact

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Indigo (#6366F1)
- **Success**: Green (#10B981)
- **Background**: Gradient blue to indigo

## 🚀 Deployment

Dự án được cấu hình để deploy trên Vercel:
- **Build Optimization**: Next.js 15 optimizations
- **Static Assets**: CDN cho images và fonts
- **Environment Variables**: Secure configuration
- **Performance**: Core Web Vitals optimization

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem `LICENSE` để biết thêm chi tiết.

## 🙏 Cảm ơn

Cảm ơn tất cả contributors đã đóng góp vào dự án PlanBookAI!

---

**PlanBookAI Team** - Hệ thống quản lý giáo dục thông minh với AI
