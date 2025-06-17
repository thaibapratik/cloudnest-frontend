"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Cloud, Heart, Home, Trash, LogOut, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
	const pathname = usePathname();

	const MenuOptions = [
		{
			Icon: Home,
			label: "My Cloud",
			href: "/dashboard",
		},
		{
			Icon: Folder,
			label: "Root",
			href: "/dashboard/root",
		},
		{
			Icon: Heart,
			label: "Favorites",
			href: "/dashboard/favorites",
		},
		{
			Icon: Trash,
			label: "Recycle Bin",
			href: "/dashboard/trash",
		},
	];

	return (
		<aside className="w-24 md:w-64 h-screen bg-card text-foreground border-r border-[#dfd0b8]/10 flex flex-col">
			{/* Logo section */}
			<div className="flex items-center gap-3 py-6 px-6 border-b border-[#dfd0b8]/10">
				<div className="p-2 bg-[#948979] rounded-md text-foreground">
					<Cloud size={22} />
				</div>
				<h3 className="text-foreground text-xl font-bold max-md:hidden">
					CloudNest
				</h3>
			</div>

			{/* Navigation section */}
			<div className="flex-1 overflow-y-auto py-6 px-3">
				<nav>
					<ul className="space-y-1.5">
						{MenuOptions.map((option) => (
							<MenuItem
								key={option.label}
								label={option.label}
								Icon={option.Icon}
								href={option.href}
								isActive={pathname === option.href}
							/>
						))}
					</ul>
				</nav>
			</div>

			{/* Bottom section */}
			<div className="border-t border-[#dfd0b8]/10 p-3">
				<div className="space-y-1.5">
					<SignOutButton>
						<div className="flex items-center gap-3 py-2.5 px-4 rounded-lg text-[#dfd0b8] cursor-pointer font-medium transition-all hover:bg-[#222831]/80 group">
							<div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#222831]/20 group-hover:bg-[#948979]/20 transition-colors">
								<LogOut size={16} />
							</div>
							<p>Sign Out</p>
						</div>
					</SignOutButton>
				</div>
			</div>
		</aside>
	);
};

export default SideBar;

interface MenuItemProps {
	label: string;
	Icon: any;
	href: string;
	isActive?: boolean;
}

const MenuItem = ({ label, Icon, href, isActive = false }: MenuItemProps) => {
	return (
		<li>
			<Link
				href={href}
				className={cn(
					"flex items-center gap-3 py-2.5 px-4 rounded-lg font-medium transition-all group",
					isActive
						? "bg-foreground/20 text-foreground"
						: "text-foreground/70 hover:bg-foreground/20"
				)}
			>
				<div
					className={cn(
						"flex items-center justify-center w-8 h-8 rounded-md transition-colors",
						isActive
							? "bg-[#948979]/30"
							: "bg-[#222831]/20 group-hover:bg-[#948979]/20"
					)}
				>
					<Icon size={16} />
				</div>
				<p className="hidden md:inline-block">{label}</p>
			</Link>
		</li>
	);
};
