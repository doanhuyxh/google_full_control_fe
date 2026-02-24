"use client";
import { Modal } from "antd";
import { Grid } from "antd";
import { CustomModalProps } from "@/libs/hooks/useModal";

export const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onCancel,
  onOk,
  title,
  children,
  width = 520,
  centered = true,
  maskClosable = true,
  destroyOnHidden = true,
  loading = false,
  okText = "Xác nhận",
  cancelText = "Hủy",
  okButtonProps,
  cancelButtonProps,
  ...props
}) => {
  const screens = Grid.useBreakpoint();
  const modalWidth = screens.md ? width : "calc(100vw - 16px)";

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      title={title}
      width={modalWidth}
      centered={centered}
      maskClosable={maskClosable}
      destroyOnHidden={destroyOnHidden}
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
  destroyOnHidden = true,
  ...props
}) => {
  const screens = Grid.useBreakpoint();
  const modalWidth = screens.md ? width : "calc(100vw - 16px)";

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={title}
      width={modalWidth}
      centered={centered}
      maskClosable={maskClosable}
      destroyOnHidden={destroyOnHidden}
      footer={null}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;