"use client";

import Button from "@/components/Buttons/Button";
import Card from "@/components/Card";
import { getInfo, registerDevice } from "@/utils/api/CSR/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function RegisterDeviceForm() {
    const t = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();

    const { data: info, isLoading: isLoadingInfo } = useQuery({
        queryKey: ["info"],
        queryFn: getInfo,
    });

    async function registerDeviceHandler() {
        await registerDevice();
        queryClient.invalidateQueries({ queryKey: ["info"] });
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

    const redirect = searchParams.get("redirect");
    if (redirect) {
        router.push(redirect);
    } else {
        router.push("/");
    }
}
