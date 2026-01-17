import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const fredoka = Fredoka({
	subsets: ["latin"],
	variable: "--font-fredoka",
	display: "swap",
});

const nunito = Nunito({
	subsets: ["latin"],
	variable: "--font-nunito",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Funny Learn - AI for Kids",
	description: "Interactive learning adventure powered by AI",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${fredoka.variable} ${nunito.variable} font-sans antialiased bg-slate-50`}
			>
				<main className="flex-1">
					{children}
				</main>
				<Toaster />
			</body>
		</html>
	);
}
