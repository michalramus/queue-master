import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button, Card } from "shared-components";
import {
    callAgainForClient,
    ClientInterface,
    // removeClient,
    setClientAsInService,
} from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";

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
    const [isCallAgainLoading, setIsCallAgainLoading] = useState(false); //Loading state for call again button
    const [isCurrentTicketTextAnimating, setIsCurrentTicketTextAnimating] = useState(false);
    const [currentTicketText, setCurrentTicketText] = useState("");
    const t = useTranslations();
    const lockNextClientButtonDelay = 700;
    const currentTicketTransitionTime = 200;
    const callAgainButtonAnimationTime = 1000;

    // Fade effect when clientNumber changes
    useEffect(() => {
        if (clientNumber) {
            const newText = " " + clientNumber.category?.short_name + clientNumber.number;

            if (currentTicketText !== newText) {
                // Start fade out
                setIsCurrentTicketTextAnimating(true);

                // After fade out completes, update text and fade in
                setTimeout(() => {
                    setCurrentTicketText(newText);
                    setIsCurrentTicketTextAnimating(false);
                }, currentTicketTransitionTime); // Half of the total animation duration
            } else {
                setCurrentTicketText(newText);
            }
        } else {
            setCurrentTicketText("");
        }
    }, [clientNumber, currentTicketText]);

    //Handlers
    // function finishClientHandler() {
    //     if (clientNumber) {
    //         removeClient(clientNumber, axiosAuthInstance);
    //     }
    // }

    async function nextClientHandler() {
        setLockNextClientButton(true);
        if (nextClientNumber) {
            setClientAsInService(nextClientNumber, seat, axiosAuthInstance);
        }
        setTimeout(() => {
            setLockNextClientButton(false);
        }, lockNextClientButtonDelay);
    }

    async function callAgainHandler() {
        if (clientNumber && !isCallAgainLoading) {
            setIsCallAgainLoading(true);
            try {
                await callAgainForClient(clientNumber, axiosAuthInstance);
            } catch (error) {
                console.error("Error calling again:", error);
            } finally {
                setTimeout(() => {
                    setIsCallAgainLoading(false);
                }, callAgainButtonAnimationTime);
            }
        }
    }

    return (
        <div className="w-full lg:ml-2">
            <Card className="w-full">
                <h5 className="mb-2 text-center text-2xl tracking-tight">
                    <span>
                        {t("number")}:
                        <span
                            className={`text-3xl font-bold transition-opacity duration-300 ease-in-out ${
                                isCurrentTicketTextAnimating ? "opacity-0" : "opacity-100"
                            }`}
                        >
                            {currentTicketText}
                        </span>
                    </span>
                </h5>

                <div className="mt-4 flex flex-row justify-center">
                    {/* TODO: change from finighClient to waitingRoom */}
                    {/* <Button
                        onClick={finishClientHandler}
                        color="red"
                        disabled={clientNumber ? false : true}
                        className="h-28 w-1/3 text-2xl!"
                    >
                        {t("finish")}
                    </Button> */}

                    <Button
                        onClick={callAgainHandler}
                        color={clientNumber ? "blue" : "gray"}
                        disabled={!clientNumber || isCallAgainLoading}
                        className={`h-28 w-1/3 text-2xl! transition-all duration-200 ${
                            isCallAgainLoading ? "scale-95 animate-pulse" : "scale-100"
                        }`}
                    >
                        {isCallAgainLoading ? (
                            <div className="flex items-center justify-center gap-1 px-1">
                                <div className="h-3 w-3 flex-shrink-0 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                <span className="text-lg">{t("calling")}...</span>
                            </div>
                        ) : (
                            t("call_again")
                        )}
                    </Button>
                    <Button
                        onClick={nextClientHandler}
                        color={nextClientNumber ? "green" : "gray"}
                        disabled={nextClientNumber && !lockNextClientButton ? false : true}
                        className="h-28 w-1/3 text-2xl!"
                    >
                        {t("next")}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
