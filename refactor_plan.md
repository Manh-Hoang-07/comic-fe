# Kế hoạch Refactor `useListPage.ts` và Cải thiện Quản lý Dữ liệu

Dựa trên yêu cầu làm gọn nhẹ `useListPage` và chú trọng đặc biệt vào tính linh hoạt: **Quản lý đa dạng tham số định danh định danh (Code, Type, UUID...) và tự do gọi bất kỳ API nào rẽ nhánh cho từng Modal**, dưới đây là cấu trúc kiến trúc tái cấu trúc toàn diện.

## 1. Điểm yếu của hệ thống cũ
- **Trói buộc API (Rigid Endpoints):** Object tham số của `useListPage` bắt khai báo 1 cục `endpoints: { list, create, update, delete, show }`. Chuyện gì xảy ra nếu List hiển thị một API, nhưng ta có Modal A (Update profile) gọi api `A`, Modal B (Gán quyền) gọi api `B`? Cách cũ bắt toàn bộ gom chung vào một cấu trúc, gây ra các `customModals` chắp vá. 
- **Stale Data (Dữ liệu cũ):** Khi đẩy object danh sách `{ item }` vào modal thông qua `modal.open("edit", item)`, thì sau nửa tiếng treo màn hình dữ liệu đó biến thành phế liệu.
- **Tính cứng nhắc của Tham Số:** API không chốt cứng luôn dùng `id`. Có hệ thống xài `code`, `slug` hay phối kết hợp nhiều khóa.

---

## 2. Giải pháp và Nguyên tắc Refactor Mới

### A. Nguyên lý "Chẻ đôi trách nhiệm API - Decoupled Endpoints"
Lý do quan trọng nhất tại sao **không** nhét Data hay thông tin Endpoint vào `useListPage`: Tại vì **Modal phải là một thế giới độc lập!**

Khi bấm mở một cái Modal:
- Component **Danh Sách** chả cần biết Modal đó gọi chuẩn API gì hay cần lưu dữ liệu ra sao. Nó chỉ cần Hét lên: *"Ê Modal Edit, mở lên và lấy cái `target={code}` này đi lo việc của mày đi!"*
- Còn **Component Modal** nhận được dòng lệnh, nó chủ động import thẳng chính xác Endpoint đặc thù của riêng nó, gọi API Detail độc lập và tự submit đi. Nhờ thế, cùng 1 list nhưng Modal A gọi endpoint 1, Modal B gọi endpoint 2 hoàn toàn bình thường.

### B. "Modal Payload mang theo tham số và API Endpoints"
1. **Trang List đưa trực tiếp API & Thông tin định danh vào Modal:**
   Trang List sẽ định đoạt Modal gọi vào Endpoint nào bằng cách đẩy xuống payload.
   ```tsx
   <Actions
     onEdit={() => editModal.open({ 
        code: context.code, 
        fetchApi: `/api/v1/contexts/${context.code}`,
        updateApi: `/api/v1/contexts/${context.code}`
     })}
   />
   ```

2. **Modal tự lo việc Lấy DATA MỚI NHẤT:**
   Modal sẽ nhận lấy payload chứa API URL, chủ động gọi Endpoint này để fetch dữ liệu mới nhất (Hiển thị form Loading trong lúc đợi) rồi submit.

---

## 3. Kiến trúc Đề xuất (Mã mẫu)

### Viết 1 Hook `useModal` linh hoạt (Nên đặt ở `ui-ux/useModal.ts`)
```tsx
import { useState } from 'react';

// Dùng Generic Type để tương thích với MỌI dạng Param API
export function useModal<T = any>() {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<T | null>(null);

  const open = (data?: T) => {
    setPayload(data || null);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setPayload(null);
  };

  return { isOpen, payload, open, close };
}
```

### Ở Component Main (`AdminContexts.tsx`)
```tsx
export default function AdminContexts() {
  // 1. Hook List giờ đây MỎNG NHƯ TỜ GIẤY, Tách bạch không còn vướng bận API Modal
  const { data, refresh } = useListPage({ url: adminEndpoints.contexts.list });

  // 2. Định nghĩa các Modal và Payload linh hoạt tùy ý (truyền theo cả API endpoints):
  const editModal = useModal<{ fetchApi: string; updateApi: string }>();
  
  return (
    <>
      <Table>
         {data.items.map(item => (
            <Actions 
               // Truyền URL API cụ thể thẳng vào Modal Payload
               onEdit={() => editModal.open({ 
                  fetchApi: `/api/contexts/${item.code}`, 
                  updateApi: `/api/contexts/${item.code}` 
               })}
            />
         ))}
      </Table>

      {/* 3. Truyền trọn Payload xuống Modal TƯƠNG ỨNG */ }
      {editModal.isOpen && editModal.payload && (
        <EditContext 
           target={editModal.payload} 
           onClose={editModal.close} 
           onSuccess={() => {
              editModal.close(); // Đóng Modal
              refresh();         // Tải lại list cho người dùng
           }}
        />
      )}
    </>
  )
}
```

### Ở Component Modal (Ví dụ `EditContext.tsx` hoặc `GenericEditModal.tsx`)
Điểm ăn tiền nằm ở đây: **Trang List đưa đường dẫn, Modal làm phần việc còn lại**. Modal có thể tái sử dụng cho nhiều trang khác nhau vì nó không hardcode URL!

```tsx
interface EditContextProps {
  target: { fetchApi: string; updateApi: string };
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditContext({ target, onClose, onSuccess }: EditContextProps) {
  // 1. Tự fetch API CHI TIẾT từ URL mà trang List truyền vào!
  const { data: latestData, isLoading } = useFetchDetail(target.fetchApi);

  if (isLoading) return <Modal><SkeletonLoader /></Modal>;

  // 2. Tự Submit vào API CẬP NHẬT mà trang List yêu cầu
  const handleSubmit = async (values) => {
    try {
       await apiClient.put(target.updateApi, values);
       toast.success("Cập nhật thành công");
       onSuccess();
    } catch(e) {
       toast.error("Lỗi cập nhật");
    }
  }

  return (
     <Modal onClose={onClose}>
        <Form initialValues={latestData} onSubmit={handleSubmit} />
     </Modal>
  )
}
```

## Kết Luận
Sự thay đổi này dứt điểm toàn bộ các nhược điểm của hệ thống cũ:
1. **Chống Data Ổi (Stale Data):** Luôn có dữ liệu real-time.
2. **Siêu Linh Hoạt API:** Modal nào tự định nghĩa API của Modul đó, `useListPage` không ôm một cục JSON "endpoints" gò bó nữa.
3. **Thoải mái Tham số (Payload Driven):** Không ai giới hạn phải dùng `id` cả, bạn có thể truyền thẳng một tổ hợp API Query Strings cho form nó lo.
