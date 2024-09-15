import Button from "@/components/Buttons/Button";
import {
    ClientNumber,
    callAgainForClient,
    removeClient,
    setClientAsInService,
} from "../../utils/api/clients";
import Card from "@/components/Card";

export default function InServicePanel({
    clientNumber,
    nextClientNumber,
    seat,
}: {
    clientNumber?: ClientNumber;
    nextClientNumber?: ClientNumber;
    seat: number;
}) {
    //Handlers
    function finishClientHandler() {
        if (clientNumber) {
            removeClient(clientNumber);
        }
    }

    function nextClientHandler() {
        if (nextClientNumber) {
            setClientAsInService(nextClientNumber, seat);
        }
    }

    function callAgainHandler() {
        if (clientNumber) {
            callAgainForClient(clientNumber);
        }
    }

    return (
        <div className="w-full lg:ml-2">
            <Card className="w-full">
                <h5 className="mb-2 text-center text-2xl tracking-tight text-white">
                    <span className={clientNumber ? "" : "visibility: hidden"}>
                        Number:
                        <span className="text-3xl font-bold">{" " + clientNumber?.number}</span>
                    </span>
                </h5>

                <div className="mt-4 flex flex-row justify-center">
                    <Button
                        onClick={nextClientHandler}
                        color="green"
                        disabled={nextClientNumber ? false : true}
                        className="h-28 w-1/3 text-lg"
                    >
                        Next
                    </Button>
                    <Button
                        onClick={callAgainHandler}
                        color="blue"
                        disabled={clientNumber ? false : true}
                        className="h-28 w-1/3 text-lg"
                    >
                        Call again
                    </Button>
                    <Button
                        onClick={finishClientHandler}
                        color="red"
                        disabled={clientNumber ? false : true}
                        className="h-28 w-1/3 text-lg"
                    >
                        Finish
                    </Button>
                </div>
            </Card>
        </div>
    );
}
