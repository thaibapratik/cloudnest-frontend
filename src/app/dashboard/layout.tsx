"use client";

import SideBar from "@/components/SideBar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isLoaded, isSignedIn } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			router.push("/");
		}
	}, [isLoaded, isSignedIn, router]);

	if (!isLoaded || !isSignedIn) {
		return null;
	}

	return (
		<main className="flex h-screen">
			<SideBar />
			<div className="flex-1 p-5 overflow-y-auto">
				<div className="container mx-auto py-4">{children}</div>
			</div>
		</main>
	);
}
