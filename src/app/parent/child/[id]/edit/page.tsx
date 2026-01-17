import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { getChildProfile } from "@/actions/parent";
import { redirect } from "next/navigation";

export default async function EditChildPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const child = await getChildProfile(id);

    if (!child) {
        redirect("/parent/dashboard");
    }

    return (
        <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-4">
            <OnboardingWizard
                initialData={{
                    name: child.name,
                    age: child.age,
                    personality: child.personality,
                    interests: child.interests,
                    mascotId: child.mascotId || "",
                }}
                isEditMode={true}
                childId={id}
            />
        </div>
    );
}
