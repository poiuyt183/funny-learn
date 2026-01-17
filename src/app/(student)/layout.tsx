export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen font-sans antialiased">
            {children}
        </div>
    );
}
