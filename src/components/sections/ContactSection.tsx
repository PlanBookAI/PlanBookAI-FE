import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

export function ContactSection() {
  return (
    <section id="contact" className="relative py-24 bg-blue-600">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-repeat" 
          style={{ 
            backgroundImage: 'url(/grid.svg)',
            opacity: 0.1,
            maskImage: 'linear-gradient(to bottom, white, transparent)'
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 to-blue-600/0" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Sẵn sàng nâng cao hiệu quả giảng dạy?
          </h2>
          <p className="mt-4 text-lg text-blue-100 sm:text-xl">
            Đăng ký dùng thử miễn phí ngay hôm nay và trải nghiệm sức mạnh của AI trong giáo dục.
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto">
          <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              type="text"
              placeholder="Họ và tên"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Input
              type="email"
              placeholder="Email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Input
              type="tel"
              placeholder="Số điện thoại"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Input
              type="text"
              placeholder="Tên trường"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <div className="sm:col-span-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Bắt đầu dùng thử miễn phí
              </Button>
            </div>
          </form>

          <p className="mt-4 text-sm text-blue-100 text-center">
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <a href="#" className="font-medium text-white hover:text-blue-100">
              Điều khoản sử dụng
            </a>{' '}
            và{' '}
            <a href="#" className="font-medium text-white hover:text-blue-100">
              Chính sách bảo mật
            </a>{' '}
            của chúng tôi.
          </p>
        </div>
      </div>
    </section>
  );
}