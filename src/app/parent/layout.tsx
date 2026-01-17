import { ParentSidebar } from "@/components/parent/sidebar";

export default function ParentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-white">
            <ParentSidebar />
            <main className="flex-1 overflow-y-auto bg-sky-50 p-8">
                {children}
            </main>
        </div>
    );
}
