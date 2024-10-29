import Button from "@/components/Buttons/Button";
import Modal from "@/components/Modal";

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
    return (
        <Modal hidden={hidden}>
            <div className="mb-2 flex flex-col items-center justify-center">
                <p className="mb-1 text-lg">
                    Do you want to <span className="underline decoration-2">choose</span> ticket{" "}
                </p>
                <p className="text-2xl font-bold">{number}</p>
            </div>
            <div className="flex justify-center">
                <Button onClick={cancelHandler} color="gray" className="flex items-center">
                    <span>Cancel</span>
                </Button>
                <Button onClick={chooseHandler} color="green" className="flex items-center">
                    <span>Choose</span>
                </Button>
            </div>
        </Modal>
    );
}
