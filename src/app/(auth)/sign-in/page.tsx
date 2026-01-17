import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Link href="/" className="absolute top-8 left-8 text-slate-500 hover:text-primary flex items-center gap-2 font-bold">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <Card className="w-full max-w-md shadow-clay">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">👋</span>
                    </div>
                    <CardTitle className="text-3xl font-heading text-primary">Welcome Back!</CardTitle>
                    <CardDescription className="text-lg">Log in to continue your adventure.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div className="text-center p-4">Loading login form...</div>}>
                        <AuthForm type="login" />
                    </Suspense>

                    <div className="mt-6 text-center text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="text-primary font-bold hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
