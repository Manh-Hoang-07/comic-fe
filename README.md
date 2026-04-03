# Next.js Project

Dự án được chuyển đổi từ Nuxt.js sang Next.js 13+ với App Router, tuân thủ nguyên tắc: giao diện được xử lý trong components, app chỉ đóng vai trò là route.

## Bắt đầu

### Yêu cầu

- Node.js 18.0 hoặc cao hơn
- npm, yarn, pnpm hoặc bun

### Cài đặt

1. Clone repository:
```bash
git clone [repository-url]
cd nextjs
```

2. Cài đặt dependencies:
```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
# hoặc
bun install
```

3. Tạo file .env từ .env.example:
```bash
cp .env.example .env.local
```

4. Cấu hình biến môi trường trong file .env.local

### Chạy ứng dụng

Khởi động server phát triển:
```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
# hoặc
bun dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt để xem kết quả.

## Cấu trúc dự án

Xem [ARCHITECTURE.md](./ARCHITECTURE.md) để hiểu rõ về cấu trúc và nguyên tắc thiết kế.

## Scripts

- `npm run dev` - Khởi động server phát triển
- `npm run build` - Build cho production
- `npm run start` - Khởi động server production
- `npm run lint` - Chạy ESLint
- `npm run type-check` - Kiểm tra TypeScript

## Công nghệ sử dụng

- **Next.js 13+** - React framework với App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icons

## Tính năng

- Authentication (Login, Register)
- Admin Dashboard
- User Profile
- Public Pages (Home, About, Contact, Projects, Services, Gallery, Posts, Staff, Certificates, FAQs)
- Responsive Design
- SEO Optimization
- Type Safety

## Deployment

### Vercel (Khuyến nghị)

1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Cấu hình biến môi trường trong Vercel dashboard
4. Deploy

### Docker

1. Build image:
```bash
docker build -t nextjs-app .
```

2. Run container:
```bash
docker run -p 3000:3000 nextjs-app
```

### Static Export

1. Cấu hình trong next.config.js:
```javascript
output: 'export'
```

2. Build:
```bash
npm run build
```

3. Deploy folder `out` đến hosting provider

## Môi trường

Biến môi trường cần cấu hình trong .env.local:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push đến branch
5. Tạo Pull Request

## License

MIT License
