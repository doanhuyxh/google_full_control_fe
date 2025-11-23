"use client";
import { App } from "antd";
import { ReactNode } from "react";
import { ModalFuncProps } from "antd/lib/modal/interface";

export interface UseModalReturn {
  showInfo: (config: ModalFuncProps) => void;
  showConfirm: (config: ModalFuncProps) => void;
  showWarning: (config: ModalFuncProps) => void;
  showSuccess: (config: ModalFuncProps) => void;
  showError: (config: ModalFuncProps) => void;
  destroyAll: () => void;
}

export const useModal = (): UseModalReturn => {
  const { modal } = App.useApp();

  return {
    showInfo: (config: ModalFuncProps) => {
      modal.info({
        centered: true,
        maskClosable: true,
        destroyOnClose: true,
        ...config,
      });
    },

    showConfirm: (config: ModalFuncProps) => {
      modal.confirm({
        centered: true,
        maskClosable: true,
        destroyOnClose: true,
        okText: "Xác nhận",
        cancelText: "Hủy",
        ...config,
      });
    },

    showWarning: (config: ModalFuncProps) => {
      modal.warning({
        centered: true,
        maskClosable: true,
        destroyOnClose: true,
        okText: "Đóng",
        ...config,
      });
    },

    showSuccess: (config: ModalFuncProps) => {
      modal.success({
        centered: true,
        maskClosable: true,
        destroyOnClose: true,
        okText: "Đóng",
        ...config,
      });
    },

    showError: (config: ModalFuncProps) => {
      modal.error({
        centered: true,
        maskClosable: true,
        destroyOnClose: true,
        okText: "Đóng",
        ...config,
      });
    },

    destroyAll: () => {
      // Ant Design's modal API doesn't have destroyAll in hook version
      // This functionality is available in the static Modal methods
      console.log("Modal destroy all called");
    },
  };
};

/**
 * Interface cho custom modal component props
 */
export interface CustomModalProps {
  open: boolean;
  onCancel: () => void;
  onOk?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  width?: number | string;
  centered?: boolean;
  maskClosable?: boolean;
  destroyOnHidden?: boolean;
  loading?: boolean;
  okText?: string;
  cancelText?: string;
  okButtonProps?: any;
  cancelButtonProps?: any;
}