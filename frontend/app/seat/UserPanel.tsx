import Button from "../../components/Buttons/Button";
import Card from "../../components/Card";

export default function UserPanel({
    username,
    adminButton,
}: {
    username: string;
    adminButton: boolean;
}) {
    return ( //TODO
        <Card className="flex flex-nowrap items-center !py-0">
            <p className="mr-2">User: {username}</p>
            {adminButton && <Button color="blue">Admin Dashboard</Button>}
            <Button color="primary">Settings</Button>
            <Button color="red">Logout</Button>
        </Card>
    );
}
