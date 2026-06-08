import Modal from "./Modal";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: "danger" | "warning" | "info" | "primary";
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    type = "primary",
}: ConfirmModalProps) {
    const getTypeStyles = () => {
        switch (type) {
            case "danger":
                return "bg-red-1 hover:bg-red-2";
            case "warning":
                return "bg-yellow-1 hover:bg-yellow-2";
            case "info":
                return "bg-blue-1 hover:bg-blue-2";
            case "primary":
                return "bg-primary-1 hover:bg-primary-2";
            default:
                return "bg-primary-1 hover:bg-primary-2";
        }
    };

    return (
        <Modal hidden={!isOpen} color="background">
            <div className="w-full max-w-md p-6">
                <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">{title}</h2>
                <p className="mb-6 text-gray-700">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="hover:bg-gray-2 bg-gray-1 rounded border border-gray-300 px-4 py-2 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`rounded px-4 py-2 text-white transition-colors ${getTypeStyles()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
