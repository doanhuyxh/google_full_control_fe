import { useState } from "react";
import { Alert, Input, Modal, Typography } from "antd";

import { useAntdApp } from "@/libs/hooks/useAntdApp";
import { createRevapiData } from "@/libs/network/revapi.api";

interface RevidApiImportModalProps {
    isShowModal: boolean;
    onCloseModal: () => void;
    onSuccess?: () => void;
}

interface ParsedRow {
    email: string;
    password: string;
    raw: string;
}

export default function RevidApiImportModal({
    isShowModal,
    onCloseModal,
    onSuccess,
}: RevidApiImportModalProps) {
    const [rawText, setRawText] = useState<string>("");
    const [loadingImport, setLoadingImport] = useState<boolean>(false);
    const { notification } = useAntdApp();

    const parseRows = (text: string) => {
        const lines = text
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        const validRows: ParsedRow[] = [];
        const invalidRows: string[] = [];

        lines.forEach((line) => {
            const [email, password, ...rest] = line.split("|").map((part) => part.trim());
            if (!email || !password || rest.length > 0) {
                invalidRows.push(line);
                return;
            }
            validRows.push({ email, password, raw: line });
        });

        return { validRows, invalidRows };
    };

    const handleImport = async () => {
        const { validRows, invalidRows } = parseRows(rawText);

        if (!validRows.length) {
            notification.error({
                message: "Không có dữ liệu hợp lệ",
                description: "Vui lòng nhập đúng định dạng: email|password",
            });
            return;
        }

        setLoadingImport(true);
        const results = await Promise.all(
            validRows.map((row) => createRevapiData({ email: row.email, password: row.password }))
        );
        setLoadingImport(false);

        const successCount = results.filter((result) => result.status).length;
        const failedRows = validRows
            .map((row, index) => ({ row, result: results[index] }))
            .filter((item) => !item.result.status);

        if (successCount > 0) {
            notification.success({
                message: "Import thành công",
                description: `Đã import ${successCount}/${validRows.length} dòng hợp lệ.`,
            });
            onSuccess?.();
        }

        if (failedRows.length > 0 || invalidRows.length > 0) {
            const failPreview = failedRows.slice(0, 3).map((item) => item.row.raw).join("; ");
            const invalidPreview = invalidRows.slice(0, 3).join("; ");
            notification.warning({
                message: "Import chưa hoàn tất 100%",
                description:
                    `Thất bại: ${failedRows.length}. Sai định dạng: ${invalidRows.length}.` +
                    (failPreview ? ` Ví dụ lỗi tạo: ${failPreview}.` : "") +
                    (invalidPreview ? ` Ví dụ sai định dạng: ${invalidPreview}.` : ""),
            });
        }

        if (successCount > 0) {
            setRawText("");
            onCloseModal();
        }
    };

    const handleClose = () => {
        setRawText("");
        onCloseModal();
    };

    return (
        <Modal
            title="Import dữ liệu RevidAPI"
            open={isShowModal}
            onCancel={handleClose}
            onOk={handleImport}
            okText="Import"
            cancelText="Hủy"
            confirmLoading={loadingImport}
            width={780}
        >
            <div className="flex flex-col gap-3">
                <Alert
                    type="info"
                    showIcon
                    message="Định dạng mỗi dòng"
                    description="email|password"
                />
                <Typography.Text type="secondary">
                    Ví dụ:
                    <br />
                    user1@gmail.com|123456
                    <br />
                    user2@gmail.com|abc@123
                </Typography.Text>
                <Input.TextArea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Dán danh sách vào đây, mỗi dòng: email|password"
                    rows={12}
                />
            </div>
        </Modal>
    );
}