import { Modal, Input } from "antd";

interface ImportCookieStringFormProps {
    isShowModal?: boolean;
    onCloseModal?: () => void;
    onSuccess?: () => void;
    accountId?: string;
    cookies?: string;
    email?: string;
    onChangeCookies?: (cookies: string) => void;
}

export default function ModalImportCookieStringForm({ isShowModal, onCloseModal, onSuccess, accountId, cookies, email, onChangeCookies }: ImportCookieStringFormProps) {
    return <Modal
        title="Nhập cookies"
        className="text-center"
        open={isShowModal}
        onCancel={onCloseModal}
        onOk={onSuccess}
        okText="Lưu"
        cancelText="Hủy"
    >
        <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-500">Dán chuỗi cookies vào ô bên dưới.</p>
            <Input.TextArea
                value={cookies}
                onChange={(e) => onChangeCookies && onChangeCookies(e.target.value)}
                rows={8}
                placeholder="Nhập cookies..."
            />
        </div>
    </Modal>

}