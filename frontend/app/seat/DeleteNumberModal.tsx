import Button from "@/components/Buttons/Button";
import Modal from "@/components/Modal";

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
    return (
        <Modal hidden={hidden}>
            <div className="mb-2 flex flex-col items-center justify-center">
                <p className="mb-1 text-lg">
                    Do you really want to <span className="underline decoration-2">delete</span>{" "}
                    ticket{" "}
                </p>
                <p className="text-2xl font-bold">{number}</p>
            </div>
            <div className="flex justify-center">
                <Button onClick={cancelHandler} color="gray" className="flex items-center">
                    <span>Cancel</span>
                </Button>
                <Button onClick={deleteHandler} color="red" className="flex items-center">
                    <span>Delete</span>
                </Button>
            </div>
        </Modal>
    );
}
