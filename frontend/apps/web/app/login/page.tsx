import Header from "@/components/Header";
import LoginForm from "./LoginForm";

export default function LoginPage() {
    return (
        <main className="flex h-screen flex-col p-16">
            <Header className="mb-10" />
            <LoginForm />
        </main>
    );
}
