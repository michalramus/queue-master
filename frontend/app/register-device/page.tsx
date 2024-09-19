import Header from "@/components/Header";
import RegisterDeviceForm from "./RegisterDeviceForm";

export default function RegisterDevice() {
    return (
        <main className="flex min-h-screen flex-col items-center p-16">
            <Header className="mb-10"/>
            <RegisterDeviceForm />
        </main>
    );
}
