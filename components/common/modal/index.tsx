"use client";
import { Modal } from "antd";
import { CustomModalProps } from "@/libs/hooks/useModal";

/**
 * Component Modal tùy chỉnh với cấu hình mặc định
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * return (
 *   <>
 *     <Button onClick={() => setIsOpen(true)}>Mở Modal</Button>
 *     <CustomModal
 *       open={isOpen}
 *       onCancel={() => setIsOpen(false)}
 *       title="Tiêu đề Modal"
 *       onOk={() => {
 *         // Xử lý logic
 *         setIsOpen(false);
 *       }}
 *     >
 *       <p>Nội dung modal ở đây</p>
 *     </CustomModal>
 *   </>
 * );
 * ```
 */
export const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onCancel,
  onOk,
  title,
  children,
  width = 520,
  centered = true,
  maskClosable = true,
  destroyOnClose = true,
  loading = false,
  okText = "Xác nhận",
  cancelText = "Hủy",
  okButtonProps,
  cancelButtonProps,
  ...props
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      title={title}
      width={width}
      centered={centered}
      maskClosable={maskClosable}
      destroyOnClose={destroyOnClose}
      confirmLoading={loading}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{
        type: "primary",
        ...okButtonProps,
      }}
      cancelButtonProps={{
        ...cancelButtonProps,
      }}
      {...props}
    >
      {children}
    </Modal>
  );
};

/**
 * Component Modal đơn giản chỉ có nút đóng
 */
export const InfoModal: React.FC<Omit<CustomModalProps, 'onOk' | 'okText' | 'cancelText'>> = ({
  open,
  onCancel,
  title,
  children,
  width = 520,
  centered = true,
  maskClosable = true,
  destroyOnClose = true,
  ...props
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={title}
      width={width}
      centered={centered}
      maskClosable={maskClosable}
      destroyOnClose={destroyOnClose}
      footer={null}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;