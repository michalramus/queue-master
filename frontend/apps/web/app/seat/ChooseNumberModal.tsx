import { useTranslations } from "next-intl";
import { Button, Modal } from "shared-components";

export default function ChooseNumberModal({
    number,
    chooseHandler,
    cancelHandler,
    hidden,
}: {
    number: string;
    chooseHandler: () => void;
    cancelHandler: () => void;
    hidden: boolean;
}) {
    const t = useTranslations();

    return (
        <Modal hidden={hidden}>
            <div className="mb-2 flex flex-col items-center justify-center">
                <p className="mb-1 text-lg">
                    {t.rich("do_you_want_to_choose_ticket", {
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
                <Button onClick={chooseHandler} color="green" className="flex items-center">
                    <span>{t("choose")}</span>
                </Button>
            </div>
        </Modal>
    );
}
