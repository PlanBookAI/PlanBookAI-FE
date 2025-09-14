export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Về PlanBook AI
            </h2>
            <p className="mt-6 text-lg text-gray-600 sm:text-xl">
              PlanBook AI được phát triển với mục tiêu hỗ trợ giáo viên tối ưu hóa công việc giảng dạy,
              giúp họ có thể tập trung vào việc truyền đạt kiến thức và tương tác với học sinh.
            </p>

            <dl className="mt-12 space-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg font-semibold text-gray-900">
                    Hiệu quả cao
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-600">
                  Tiết kiệm thời gian và công sức cho các công việc hành chính,
                  giúp giáo viên tập trung vào việc giảng dạy.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg font-semibold text-gray-900">
                    Bảo mật tuyệt đối
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-600">
                  Thông tin học sinh được bảo vệ nghiêm ngặt, chỉ giáo viên phụ trách
                  mới có quyền truy cập.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg font-semibold text-gray-900">
                    Công nghệ AI tiên tiến
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-600">
                  Sử dụng các mô hình AI hiện đại nhất để hỗ trợ công việc giảng dạy
                  một cách thông minh và hiệu quả.
                </dd>
              </div>
            </dl>
          </div>

          {/* Image */}
          <div className="mt-12 lg:mt-0">
            <div className="relative">
              <img
                src="/about-image.png"
                alt="PlanBook AI Interface"
                className="rounded-xl shadow-xl"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
