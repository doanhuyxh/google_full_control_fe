"use client";

import { Card } from "antd";
import { useState } from "react";
import { useGoogleAccount } from "@/libs/hooks/users/googleAccountHook";
import { useAntdApp } from "@/libs/hooks/useAntdApp";
import useLocalStorage from "@/libs/hooks/useLocalStorage";
import { GoogleAccount } from "@/libs/interfaces/googleData";
import GoogleAccountFilter from "./filter";
import GoogleAccountTable from "./table";
import GoogleFormModal from "./form";
import GoogleFormSendEmail from "./form-send-email";
import ViewHistoryEmailSent from "./view-history-email-sent";
import Update2FAModal from "./update-2fa-modal";
import ModalImportCookieStringForm from "./form-import-cookie-string";
import {
    COLUMN_OPTIONS,
    DEFAULT_VISIBLE_COLUMNS,
    FIXED_COLUMN_KEYS,
} from "./table/column-options";

export default function GoogleAccountComponent() {
    const {
        accountData,
        loadingGoogle,
        pageGoogle,
        setPageGoogle,
        limitGoogle,
        setLimitGoogle,
        statusGoogle,
        setStatusGoogle,
        searchGoogle,
        setSearchGoogle,
        totalItemsGoogle,
        updateGoogleField,
        deleteGoogleAccount,
        resourcesUsedGoogle,
        setResourcesUsedGoogle,
    } = useGoogleAccount();

    const [isShowModalHistoryEmail, setIsShowModalHistoryEmail] = useState<boolean>(false);
    const [emailShowHistory, setEmailShowHistory] = useState<{ emailName?: string; googleAccountId?: string }>({});
    const { notification } = useAntdApp();

    const [formDataModal, setFormDataModal] = useState<{
        isShowModal: boolean;
        _id?: string;
    }>({ isShowModal: false, _id: undefined });

    const [formModalUpdate2FA, setFormModalUpdate2FA] = useState<{
        isShowModal: boolean;
        _id?: string;
    }>({ isShowModal: false, _id: undefined });

    const [isShowModelSendEmail, setIsShowModelSendEmail] = useState<boolean>(false);
    const [cookieModal, setCookieModal] = useState<{ isShow: boolean; id?: string; cookies: string }>({
        isShow: false,
        id: undefined,
        cookies: "",
    });
    const [visibleColumns, setVisibleColumns] = useLocalStorage<string[]>(
        "google-account-visible-columns",
        DEFAULT_VISIBLE_COLUMNS,
    );

    const handleDownloadCookies = (record: GoogleAccount) => {
        if (!record.cookies) {
            notification.warning({
                message: "Không có cookies",
                description: "Tài khoản này chưa có dữ liệu cookies để tải.",
                placement: "topRight",
            });
            return;
        }

        const safeName = `${record.email || record._id}-cookies.txt`.replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = new Blob([record.cookies], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = safeName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    };

    const handleSaveCookies = async () => {
        const id = cookieModal.id || "";
        const cookieValue = cookieModal.cookies.trim();

        if (!id || !cookieValue) {
            notification.warning({
                message: "Thiếu dữ liệu",
                description: "Vui lòng nhập cookies trước khi lưu.",
                placement: "topRight",
            });
            return;
        }

        const response = await updateGoogleField(id, "cookies", cookieValue);
        if (response?.status) {
            setCookieModal({ isShow: false, id: undefined, cookies: "" });
        }
    };

    const handleUpdateData = async (id: string, field: string, value: unknown) => {
        await updateGoogleField(id, field, value);
    };

    const handleVisibleColumnsChange = (keys: string[]) => {
        const nextKeys = Array.from(new Set([...FIXED_COLUMN_KEYS, ...keys]));
        setVisibleColumns(nextKeys);
    };

    return (
        <Card className="w-full p-6 rounded-lg shadow-lg">
            <GoogleAccountFilter
                value={searchGoogle}
                onSearch={(value: string) => {
                    setSearchGoogle(value);
                }}
                status={statusGoogle}
                handleFormModal={() => setFormDataModal({ isShowModal: true, _id: undefined })}
                handleSendEmailModal={() => setIsShowModelSendEmail(true)}
                setStatus={setStatusGoogle}
                columnOptions={COLUMN_OPTIONS}
                visibleColumns={visibleColumns}
                onVisibleColumnsChange={handleVisibleColumnsChange}
                resources_used={resourcesUsedGoogle}
                setResourcesUsed={setResourcesUsedGoogle}
            />
            <GoogleAccountTable
                dataSource={accountData}
                loading={loadingGoogle}
                page={pageGoogle}
                pageSize={limitGoogle}
                total={totalItemsGoogle}
                visibleColumns={visibleColumns}
                onPageChange={(page, pageSize) => {
                    setPageGoogle(page);
                    setLimitGoogle(pageSize);
                }}
                onUpdate={handleUpdateData}
                onDelete={async (id) => {
                    await deleteGoogleAccount(id);
                }}
                onDownloadCookies={handleDownloadCookies}
                onImportCookies={(record) =>
                    setCookieModal({
                        isShow: true,
                        id: record._id,
                        cookies: record.cookies || "",
                    })
                }
                onUpdate2FA={(id) => setFormModalUpdate2FA({ isShowModal: true, _id: id })}
                onShowEmailHistory={(googleAccountId, emailName) => {
                    setEmailShowHistory({ googleAccountId, emailName });
                    setIsShowModalHistoryEmail(true);
                }}
            />
            <GoogleFormModal
                isShowModal={formDataModal.isShowModal}
                onCloseModal={() => setFormDataModal({ isShowModal: false })}
                accountId={formDataModal._id}
            />
            <GoogleFormSendEmail
                isShowModal={isShowModelSendEmail}
                onCloseModal={() => setIsShowModelSendEmail(false)}
            />
            <ViewHistoryEmailSent
                isShowModal={isShowModalHistoryEmail}
                onCloseModal={() => setIsShowModalHistoryEmail(false)}
                googleAccountId={emailShowHistory.googleAccountId || ""}
                emailName={emailShowHistory.emailName || ""}
            />
            <ModalImportCookieStringForm
                isShowModal={cookieModal.isShow}
                onCloseModal={() => setCookieModal({ isShow: false, id: undefined, cookies: "" })}
                onSuccess={handleSaveCookies}
                cookies={cookieModal.cookies}
                onChangeCookies={(cookies) => setCookieModal({ ...cookieModal, cookies })}
            />
            <Update2FAModal
                isShowModal={formModalUpdate2FA.isShowModal}
                accountId={formModalUpdate2FA._id}
                onClose={() => setFormModalUpdate2FA({ isShowModal: false })}
                onUpdate={handleUpdateData}
            />
        </Card>
    );
}
