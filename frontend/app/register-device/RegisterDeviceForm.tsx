"use client";

import Button from "@/components/Buttons/Button";
import { getInfo, registerDevice } from "@/utils/api/CSR/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterDeviceForm() {
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
        return <p>Loading...</p>;
    }

    if (info?.status == 401) {
        return (
            <Button
                onClick={registerDeviceHandler}
                color="green"
            >
                Register Device
            </Button>
        );
    }

    if (info?.status == 403) {
        return <p>Accept device inside admin panel and refresh this site</p>;
    }


    const redirect = searchParams.get("redirect");
    if (redirect) {
        router.push(redirect);
    } else {
        router.push("/");
    }
}
