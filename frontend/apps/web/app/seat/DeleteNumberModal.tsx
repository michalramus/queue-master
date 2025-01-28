import Button from "@/components/Buttons/Button";
import Modal from "@/components/Modal";
import { useTranslations } from "next-intl";

export default function DeleteNumberModal({
    number,
    deleteHandler,
    cancelHandler,
    hidden,
}: {
    number: string;
    deleteHandler: () => void;
    cancelHandler: () => void;
    hidden: boolean;
}) {
    const t = useTranslations();

    return (
        <Modal hidden={hidden}>
            <div className="mb-2 flex flex-col items-center justify-center">
                <p className="mb-1 text-lg">
                    {t.rich("do_you_want_to_delete_ticket", {
                        underline: (chunks) => (
                            <span className="underline decoration-2">{chunks}</span>
                        ),
                    })}
                </p>
                <p className="text-2xl font-bold">{number}</p>
            </div>
            <div className="flex justify-center">
                <Button onClick={cancelHandler} color="gray" className="flex items-center">
                    <span>{t("cancel")}</span>
                </Button>
                <Button onClick={deleteHandler} color="red" className="flex items-center">
                    <span>{t("delete")}</span>
                </Button>
            </div>
        </Modal>
    );
}
