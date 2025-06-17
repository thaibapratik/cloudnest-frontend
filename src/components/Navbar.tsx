"use client";

import { Bell, Grid, List, Search, User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

const Navbar = () => {
	const { isSignedIn, isLoaded, user } = useUser();
	const [search, setSearch] = useState<string>("");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	if (!isLoaded || !isSignedIn) return null;

	return (
		<header className="flex items-center justify-between px-6 py-4 bg-[#222831] border-b border-[#dfd0b8]/10">
			<div className="flex-1 max-w-md">
				<div className="relative">
					<Search className="absolute left-3 top-2.5 h-4 w-4 text-[#dfd0b8]/50" />
					<Input
						type="text"
						placeholder="Search files and folders..."
						className="pl-10 bg-[#393e46] border-[#dfd0b8]/10 text-[#dfd0b8] placeholder:text-[#dfd0b8]/50 focus-visible:ring-[#948979]/30"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			<div className="flex items-center gap-2 ml-4">
				<div className="flex items-center bg-[#393e46] rounded-lg p-1">
					<Button
						variant="ghost"
						size="icon"
						className={`rounded-md ${
							viewMode === "grid"
								? "bg-[#948979]/20 text-[#dfd0b8]"
								: "text-[#dfd0b8]/50 hover:text-[#dfd0b8] hover:bg-[#948979]/10"
						}`}
						onClick={() => setViewMode("grid")}
					>
						<Grid className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className={`rounded-md ${
							viewMode === "list"
								? "bg-[#948979]/20 text-[#dfd0b8]"
								: "text-[#dfd0b8]/50 hover:text-[#dfd0b8] hover:bg-[#948979]/10"
						}`}
						onClick={() => setViewMode("list")}
					>
						<List className="h-4 w-4" />
					</Button>
				</div>

				<Button
					variant="ghost"
					size="icon"
					className="rounded-full text-[#dfd0b8]/70 hover:text-[#dfd0b8] hover:bg-[#393e46]"
				>
					<Bell className="h-5 w-5" />
				</Button>

				<div className="ml-2">
					{user ? (
						<div className="h-9 w-9 rounded-full border-2 border-[#948979] overflow-hidden">
							<img
								src={user.imageUrl}
								alt="Profile"
								className="h-full w-full object-cover"
							/>
						</div>
					) : (
						<Button
							variant="ghost"
							size="icon"
							className="rounded-full bg-[#393e46] text-[#dfd0b8]"
						>
							<User className="h-5 w-5" />
						</Button>
					)}
				</div>
			</div>
		</header>
	);
};

export default Navbar;
