"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button, Card } from "shared-components";
import { axiosPureInstance } from "@/utils/axiosInstances/axiosPureInstance";
import { getInfo, registerDevice } from "shared-utils";
import { axiosAuthInstance } from "@/utils/axiosInstances/axiosAuthInstance";

export default function RegisterDeviceForm() {
    const t = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();

    const { data: info, isLoading: isLoadingInfo } = useQuery({
        queryKey: ["info"],
        queryFn: () => getInfo(axiosAuthInstance),
    });

    async function registerDeviceHandler() {
        await registerDevice(axiosPureInstance);
        queryClient.invalidateQueries({ queryKey: ["info"] });
    }

    // Redirect after registration
    const [canRedirect, setCanRedirect] = useState(false);

    useEffect(() => {
        if (canRedirect) {
            const redirect = searchParams.get("redirect");
            if (redirect) {
                router.push(redirect);
            } else {
                router.push("/");
            }
        }
    }, [searchParams, router, canRedirect]);

    if (canRedirect) {
        return t("redirecting");
    }

    if (isLoadingInfo) {
        return <p>{t("loading")}</p>;
    }

    if (info?.status == 401) {
        return (
            <Card className="flex flex-col items-center">
                <p className="text-center text-lg">
                    {t("register_device_instruction_before_registration")}
                </p>
                <Button onClick={registerDeviceHandler} color="green">
                    {t("register_new_device")}
                </Button>
            </Card>
        );
    }

    if (info?.status == 403) {
        return (
            <Card className="flex flex-col items-center">
                <p className="text-center text-lg">
                    {t("register_device_instruction_after_registration")}
                </p>
                <Button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["info"] })}
                    color="primary"
                >
                    {t("refresh_this_site")}
                </Button>
            </Card>
        );
    }

    setCanRedirect(true);
    return t("error_occurred");
}
