"use client";
import { logout } from "@/utils/api/CSR/auth";
import Button from "../../components/Buttons/Button";
import Card from "../../components/Card";
import { useRouter } from "next/navigation";

export default function UserPanel({
    username,
    adminButton,
}: {
    username: string;
    adminButton: boolean;
}) {
    const router = useRouter();

    function logoutHandler() {
        logout();
        router.replace("/login");
    }
    return (
        //TODO
        <Card className="flex flex-nowrap items-center !py-0">
            <p className="mr-2">User: {username}</p>
            {adminButton && <Button color="blue">Admin Dashboard</Button>}
            <Button color="primary">Settings</Button>
            <Button
                color="red"
                onClick={() => {
                    logoutHandler();
                }}
            >
                Logout
            </Button>
        </Card>
    );
}
