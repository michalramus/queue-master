import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { type LogoID } from "shared-utils";
import { Button, InfoTooltip, Spinner } from "shared-components";

interface LogoCardProps {
    logoId: LogoID;
    isAvailable: boolean;
    isUploading: boolean;
    onUpload: (logoId: LogoID, file: File) => void;
    onDelete: (logoId: LogoID) => void;
}

export default function LogoCard({
    logoId,
    isAvailable,
    isUploading,
    onUpload,
    onDelete,
}: LogoCardProps) {
    const t = useTranslations();
    const logoHint = t(`logo_hint_${logoId}`);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(logoId, file);
            e.target.value = "";
        }
    }

    return (
        <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center justify-between">
                {/* /_/g — matches every underscore, e.g. "main_logo" → "MAIN LOGO" */}
                <h3 className="font-medium text-gray-800">
                    {logoId.replace(/_/g, " ").toUpperCase()}
                </h3>
                <InfoTooltip text={logoHint} size="sm" icon="i" width="w-56" />
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/svg+xml,image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
            />
            {isAvailable ? (
                <div className="space-y-3">
                    <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded bg-gray-100">
                        <Image
                            src={`/api/file/logo/${logoId}`}
                            alt={logoId}
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                    <div className="flex">
                        <Button
                            color="primary"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Spinner size="sm" className="mr-2 text-white" />
                                    {t("uploading")}
                                </>
                            ) : (
                                t("replace_logo")
                            )}
                        </Button>
                        <Button color="red" onClick={() => onDelete(logoId)} disabled={isUploading}>
                            {t("delete_logo")}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex h-40 w-full items-center justify-center rounded bg-gray-100">
                        <span className="text-sm text-gray-400">{t("no_logo_uploaded")}</span>
                    </div>
                    <Button
                        color="primary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Spinner size="sm" className="mr-2 text-white" />
                                {t("uploading")}
                            </>
                        ) : (
                            t("upload_logo")
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
