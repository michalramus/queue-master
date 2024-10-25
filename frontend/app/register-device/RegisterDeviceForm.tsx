"use client";

import Button from "@/components/Buttons/Button";
import Card from "@/components/Card";
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
            <Card className="flex flex-col items-center">
                <p className="text-center text-lg">
                    After registering new device, <br />
                    it is necessary to accept it in the admin panel.
                </p>
                <Button onClick={registerDeviceHandler} color="green">
                    Register New Device
                </Button>
            </Card>
        );
    }

    if (info?.status == 403) {
        return <Card>Accept device inside the admin panel and refresh this site</Card>;
    }

    const redirect = searchParams.get("redirect");
    if (redirect) {
        router.push(redirect);
    } else {
        router.push("/");
    }
}
