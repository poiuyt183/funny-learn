'use server'

import { auth } from "@/lib/auth";

export async function signUpParent(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || !name) {
        return { error: "Missing fields" };
    }

    try {
        const user = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
                role: "PARENT",
            },
        });

        if (!user) {
            return { error: "Failed to create user" };
        }

        return { success: true };
    } catch {
        return { error: "An unexpected error occurred" };
    }
}
