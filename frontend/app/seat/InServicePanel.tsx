import Button from "@/components/Buttons/Button";
import {
    ClientInterface,
    callAgainForClient,
    removeClient,
    setClientAsInService,
} from "../../utils/api/CSR/clients";
import Card from "@/components/Card";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function InServicePanel({
    clientNumber,
    nextClientNumber,
    seat,
}: {
    clientNumber?: ClientInterface;
    nextClientNumber?: ClientInterface;
    seat: number;
}) {
    const [lockNextClientButton, setLockNextClientButton] = useState(false); //Lock the next button to avoid miss clicks
    const t = useTranslations();

    //Handlers
    function finishClientHandler() {
        if (clientNumber) {
            removeClient(clientNumber);
        }
    }

    async function nextClientHandler() {
        setLockNextClientButton(true);
        if (nextClientNumber) {
            setClientAsInService(nextClientNumber, seat);
        }
        setTimeout(() => {
            setLockNextClientButton(false);
        }, 500);
    }

    function callAgainHandler() {
        if (clientNumber) {
            callAgainForClient(clientNumber);
        }
    }

    return (
        <div className="w-full lg:ml-2">
            <Card className="w-full">
                <h5 className="mb-2 text-center text-2xl tracking-tight">
                    <span className={clientNumber ? "" : "visibility: hidden"}>
                        {t("number")}:
                        <span className="text-3xl font-bold">
                            {" " + clientNumber?.category?.short_name + clientNumber?.number}
                        </span>
                    </span>
                </h5>

                <div className="mt-4 flex flex-row justify-center">
                    <Button
                        onClick={finishClientHandler}
                        color="red"
                        disabled={clientNumber ? false : true}
                        className="h-28 w-1/3 !text-2xl"
                    >
                        {t("finish")}
                    </Button>

                    <Button
                        onClick={callAgainHandler}
                        color="blue"
                        disabled={clientNumber ? false : true}
                        className="h-28 w-1/3 !text-2xl"
                    >
                        {t("call_again")}
                    </Button>
                    <Button
                        onClick={nextClientHandler}
                        color="green"
                        disabled={nextClientNumber && !lockNextClientButton ? false : true}
                        className="h-28 w-1/3 !text-2xl"
                    >
                        {t("next")}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
