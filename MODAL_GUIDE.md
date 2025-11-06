# Hướng dẫn sử dụng Modal

Ứng dụng đã được cấu hình để hỗ trợ hiển thị modal với các tính năng sau:

## 1. Cấu hình Modal trong Theme

Modal đã được cấu hình trong `libs/constants/antd_config.ts` với:
- Màu nền và overlay tùy chỉnh
- Bo góc và padding phù hợp
- Shadow và style đẹp mắt
- Responsive design

## 2. Hook useModal

### Sử dụng cơ bản:
```tsx
import { useModal } from "@/libs/hooks/useModal";

const MyComponent = () => {
  const modal = useModal();

  const handleClick = () => {
    modal.showConfirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn?',
      onOk: () => console.log('OK'),
      onCancel: () => console.log('Cancel')
    });
  };

  return <Button onClick={handleClick}>Hiện Modal</Button>;
};
```

### Các phương thức có sẵn:
- `modal.showInfo()` - Modal thông tin
- `modal.showConfirm()` - Modal xác nhận (có nút OK/Cancel)
- `modal.showWarning()` - Modal cảnh báo
- `modal.showSuccess()` - Modal thành công
- `modal.showError()` - Modal lỗi

## 3. Custom Modal Components

### CustomModal - Modal đầy đủ tính năng:
```tsx
import { CustomModal } from "@/components/common/modal";

const [open, setOpen] = useState(false);

<CustomModal
  open={open}
  onCancel={() => setOpen(false)}
  title="Tiêu đề"
  onOk={() => setOpen(false)}
  width={600}
>
  <p>Nội dung modal</p>
</CustomModal>
```

### InfoModal - Modal chỉ hiển thị thông tin:
```tsx
import { InfoModal } from "@/components/common/modal";

<InfoModal
  open={open}
  onCancel={() => setOpen(false)}
  title="Thông tin"
>
  <p>Chỉ hiển thị thông tin, không có nút OK</p>
</InfoModal>
```

## 4. Props có sẵn

### CustomModal Props:
- `open: boolean` - Trạng thái hiển thị
- `onCancel: () => void` - Callback khi đóng modal
- `onOk?: () => void` - Callback khi click OK
- `title?: ReactNode` - Tiêu đề modal
- `children?: ReactNode` - Nội dung modal
- `width?: number | string` - Chiều rộng (mặc định: 520)
- `centered?: boolean` - Căn giữa màn hình (mặc định: true)
- `maskClosable?: boolean` - Đóng khi click ngoài (mặc định: true)
- `destroyOnClose?: boolean` - Xóa DOM khi đóng (mặc định: true)
- `loading?: boolean` - Trạng thái loading nút OK
- `okText?: string` - Text nút OK (mặc định: "Xác nhận")
- `cancelText?: string` - Text nút Cancel (mặc định: "Hủy")

## 5. Demo

Xem demo đầy đủ tại trang Dashboard: `/dashboard`

## 6. Lưu ý

- Modal cần được sử dụng bên trong `App` component của Ant Design
- Layout `Protected` đã được cấu hình sẵn để hỗ trợ modal
- Tất cả modal đều có theme nhất quán với ứng dụng
- Modal tự động responsive trên mobile