# HƯỚNG DẪN SỬ DỤNG GIAO DIỆN CHI TIẾT ĐỚN HÀNG

## 📋 Tổng Quan

Giao diện chi tiết đơn hàng đã được xây dựng lại hoàn toàn theo API mới với các tính năng:

- ✅ Hiển thị trạng thái hiện tại với badge màu sắc
- ✅ Chỉ hiển thị các trạng thái có thể chuyển tiếp (từ `available_statuses`)
- ✅ Timeline tiến trình đơn hàng trực quan
- ✅ Tự động reload sau khi chuyển trạng thái
- ✅ Thiết kế hiện đại với gradient và animations
- ✅ Responsive layout cho mobile/tablet

## 🎨 Các Thành Phần Chính

### 1. Header Section (Gradient Banner)
Hiển thị thông tin tổng quan:
- Mã đơn hàng
- Ngày đặt
- Tổng tiền

### 2. Status Management Section
**Trạng thái hiện tại:**
- Badge màu sắc tương ứng với trạng thái
- Label từ `all_order_statuses`

**Các trạng thái có thể chuyển:**
- Chỉ hiển thị nếu `available_statuses.length > 0`
- Mỗi trạng thái là một button riêng biệt
- Disable khi đang cập nhật
- Tự động ẩn nếu đơn hàng đã ở trạng thái cuối

### 3. Timeline Section
Hiển thị tiến trình đơn hàng:
- Lọc bỏ trạng thái "cancelled" khỏi timeline
- Highlight trạng thái hiện tại
- Hiển thị các trạng thái đã qua với icon check
- Trạng thái chưa đến màu xám

### 4. Customer & Shipping Info
Grid 2 cột hiển thị:
- Thông tin khách hàng (tên, SĐT, email, ghi chú)
- Địa chỉ giao hàng

### 5. Payment & Shipping Method
Grid 2 cột hiển thị:
- Phương thức thanh toán và trạng thái
- Phương thức vận chuyển và trạng thái

### 6. Order Items Table
Bảng sản phẩm với:
- Tên sản phẩm và variant
- Số lượng (với badge)
- Đơn giá
- Thành tiền
- Footer với tổng tiền, giảm giá, phí ship

## 🔄 Luồng Hoạt Động

### Khi Mở Modal
```
1. Modal được mở với order từ danh sách
2. useEffect tự động gọi fetchOrderDetail()
3. API GET /api/admin/orders/{id} trả về:
   - order với available_statuses
   - all_order_statuses
   - all_payment_statuses
   - all_shipping_statuses
4. Component render với dữ liệu mới
```

### Khi Chuyển Trạng Thái
```
1. User click button chuyển trạng thái
2. handleStatusChange() được gọi
3. API PATCH /api/admin/orders/{id}/status
   Body: { status: "new_status", notes: "" }
4. Nếu thành công:
   - Hiển thị toast success
   - Gọi lại fetchOrderDetail()
   - available_statuses được cập nhật
   - UI tự động cập nhật
5. Nếu thất bại:
   - Hiển thị toast error
```

## 🎯 Các Trường Hợp Đặc Biệt

### Đơn hàng đã hoàn thành (delivered)
```typescript
available_statuses = []
→ Không hiển thị section "Chuyển sang trạng thái"
→ Hiển thị thông báo "Đơn hàng đã ở trạng thái cuối"
```

### Đơn hàng đã hủy (cancelled)
```typescript
available_statuses = []
→ Không hiển thị section "Chuyển sang trạng thái"
→ Badge màu đỏ
→ Không hiển thị trong timeline
```

### Đơn hàng đang xử lý
```typescript
available_statuses = [
  { value: "shipped", label: "Đã giao vận chuyển" },
  { value: "cancelled", label: "Đã hủy" }
]
→ Hiển thị 2 button để chuyển
```

## 🎨 Màu Sắc & Thiết Kế

### Gradient Colors
- Header: `from-indigo-500 via-purple-500 to-pink-500`
- Status section: `from-blue-50 via-indigo-50 to-purple-50`
- Order items header: `from-green-50 to-emerald-50`
- Total row: `from-indigo-50 to-purple-50`

### Status Badge Colors
Được định nghĩa trong `AdminOrders.tsx`:
```typescript
const statusEnums = [
  { value: "pending", label: "Chờ xử lý", class: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Đã xác nhận", class: "bg-blue-100 text-blue-800" },
  { value: "processing", label: "Đang xử lý", class: "bg-indigo-100 text-indigo-800" },
  { value: "shipped", label: "Đang giao hàng", class: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "Đã giao thành công", class: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Đã hủy", class: "bg-red-100 text-red-800" },
];
```

### Icons
Sử dụng Heroicons (SVG inline):
- ✓ Check circle: Trạng thái hiện tại
- → Arrow: Chuyển trạng thái
- 👤 User: Thông tin khách hàng
- 📍 Location: Địa chỉ
- 💳 Card: Thanh toán
- 🚚 Truck: Vận chuyển
- 🛍️ Shopping bag: Sản phẩm
- 🕐 Clock: Timeline

## 📝 Code Snippets Quan Trọng

### Lấy Thông Tin Trạng Thái Hiện Tại
```typescript
const getCurrentStatusInfo = () => {
    const statusInfo = order?.all_order_statuses?.find(
        (s: any) => s.value === order.status
    );
    if (statusInfo) {
        const classInfo = statusEnums.find(e => e.value === order.status);
        return {
            label: statusInfo.label,
            class: classInfo?.class || "bg-gray-100 text-gray-800"
        };
    }
    return {
        label: order?.status || "-",
        class: "bg-gray-100 text-gray-800"
    };
};
```

### Render Available Statuses
```typescript
{availableStatuses.map((status: any) => {
    const statusClass = statusEnums.find(e => e.value === status.value);
    return (
        <button
            key={status.value}
            onClick={() => handleStatusChange(status.value)}
            disabled={updating}
            className="group relative px-5 py-2.5 bg-white border-2 border-indigo-300..."
        >
            {status.label}
        </button>
    );
})}
```

### Timeline Rendering
```typescript
{order.all_order_statuses
    ?.filter((s: any) => s.value !== 'cancelled')
    .map((status: any, index: number, array: any[]) => {
        const isActive = status.value === order.status;
        const isPassed = array.findIndex(
            (s: any) => s.value === order.status
        ) >= index;
        
        return (
            <div key={status.value} className="flex items-start gap-4...">
                {/* Icon và content */}
            </div>
        );
    })}
```

## 🐛 Troubleshooting

### Lỗi: available_statuses undefined
**Nguyên nhân:** API chưa trả về đúng format
**Giải pháp:** Kiểm tra response từ `GET /api/admin/orders/{id}`

### Lỗi: Không thể chuyển trạng thái
**Nguyên nhân:** Backend chặn transition không hợp lệ
**Giải pháp:** Chỉ hiển thị các trạng thái trong `available_statuses`

### Lỗi: UI không cập nhật sau khi chuyển trạng thái
**Nguyên nhân:** Không gọi lại `fetchOrderDetail()`
**Giải pháp:** Đảm bảo `await fetchOrderDetail()` trong `handleStatusChange()`

## 🚀 Tối Ưu Hóa

### Performance
- ✅ Chỉ fetch detail khi modal mở
- ✅ Sử dụng loading state để tránh spam click
- ✅ Debounce cho các action button

### UX
- ✅ Hiển thị loading spinner khi đang cập nhật
- ✅ Toast notification cho mọi action
- ✅ Disable button khi đang xử lý
- ✅ Smooth transitions và animations

### Accessibility
- ✅ Semantic HTML
- ✅ ARIA labels cho buttons
- ✅ Keyboard navigation support
- ✅ Color contrast đạt chuẩn WCAG

## 📱 Responsive Design

### Mobile (< 768px)
- Grid 2 cột → 1 cột
- Button full width
- Table scroll horizontal

### Tablet (768px - 1024px)
- Grid 2 cột giữ nguyên
- Font size nhỏ hơn một chút

### Desktop (> 1024px)
- Full layout như thiết kế
- Hover effects đầy đủ

## 🔗 API Endpoints Sử dụng

### GET /api/admin/orders/{id}
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 30,
    "order_number": "ORD-20260130-001",
    "status": "pending",
    "available_statuses": [
      { "value": "confirmed", "label": "Đã xác nhận" },
      { "value": "cancelled", "label": "Đã hủy" }
    ],
    "all_order_statuses": [...],
    "all_payment_statuses": [...],
    "all_shipping_statuses": [...],
    ...
  }
}
```

### PATCH /api/admin/orders/{id}/status
**Request:**
```json
{
  "status": "confirmed",
  "notes": ""
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật trạng thái thành công",
  "data": { ... }
}
```

## ✅ Checklist Triển Khai

- [x] Tạo component OrderDetail.tsx mới
- [x] Tích hợp với API mới
- [x] Hiển thị available_statuses
- [x] Hiển thị timeline
- [x] Xử lý loading states
- [x] Xử lý error states
- [x] Toast notifications
- [x] Responsive design
- [x] Accessibility
- [ ] Testing trên production
- [ ] User feedback

## 📚 Tài Liệu Tham Khảo

- [API Documentation](./API_DOCUMENTATION.md)
- [Design System](./DESIGN_SYSTEM.md)
- [Component Library](./COMPONENT_LIBRARY.md)
