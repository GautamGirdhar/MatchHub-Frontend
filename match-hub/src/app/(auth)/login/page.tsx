import { LoginForm } from "@/components/auth/login";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-purple-50 to-pink-50 p-4">
            <LoginForm />
        </div>
    );
}