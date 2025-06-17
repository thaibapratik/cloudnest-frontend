"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Folder, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { useFolderStore } from "@/stores/folderStore";
import CreateRenameBox from "@/components/CreateRenameBox";

interface FolderItem {
	id: string | number;
	name: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

const AllFolders = () => {
	const { getToken } = useAuth();
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [newFolderName, setNewFolderName] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const { getFolders, folders, createFolder } = useFolderStore();

	useEffect(() => {
		const fetchFolders = async () => {
			setLoading(true);
			try {
				const token = await getToken();
				await getFolders(token);
			} catch (error) {
				console.error("Error fetching folders:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchFolders();
	}, [getToken]);

	const handleCreateFolder = async () => {
		setIsCreating(true);
		try {
			const token = await getToken();
			await createFolder(newFolderName, token);
			setNewFolderName("");
			setIsCreateDialogOpen(false);
		} catch (error) {
			console.error("Error creating folder:", error);
		} finally {
			setIsCreating(false);
		}
	};

	const handleFolderClick = (folderId: string | number) => {
		router.push(`/dashboard/folders/${folderId}`);
	};

	const filteredFolders = folders.filter((folder: any) =>
		folder.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-[#222831] p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
					<h1 className="text-2xl font-bold text-[#dfd0b8]">Root</h1>

					<div className="flex items-center gap-4">
						<div className="relative max-w-xs">
							<Search className="absolute left-3 top-2.5 h-4 w-4 text-[#dfd0b8]/50" />
							<Input
								type="text"
								placeholder="Search folders..."
								className="pl-10 bg-[#393e46] border-[#dfd0b8]/10 text-[#dfd0b8] placeholder:text-[#dfd0b8]/50 focus-visible:ring-[#948979]/30"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<Button
							onClick={() => setIsCreateDialogOpen(true)}
							className="bg-[#948979] text-[#222831] hover:bg-[#948979]/90 whitespace-nowrap"
						>
							<Plus className="h-4 w-4 mr-2" /> New Folder
						</Button>
					</div>
				</div>

				{/* Content */}
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<div className="flex flex-col items-center gap-4">
							<Loader2 className="h-12 w-12 text-[#948979] animate-spin" />
							<p className="text-[#dfd0b8]">Loading folders...</p>
						</div>
					</div>
				) : filteredFolders.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<div className="bg-[#393e46] p-6 rounded-full mb-4">
							<Folder className="h-12 w-12 text-[#948979]" />
						</div>
						{searchQuery ? (
							<>
								<h3 className="text-xl font-medium text-[#dfd0b8] mb-2">
									No folders found
								</h3>
								<p className="text-[#dfd0b8]/60 mb-6">
									Try a different search term
								</p>
							</>
						) : (
							<>
								<h3 className="text-xl font-medium text-[#dfd0b8] mb-2">
									No folders yet
								</h3>
								<p className="text-[#dfd0b8]/60 mb-6">
									Create your first folder to get started
								</p>
								<Button
									onClick={() => setIsCreateDialogOpen(true)}
									className="bg-[#948979] text-[#222831] hover:bg-[#948979]/90"
								>
									<Plus className="h-4 w-4 mr-2" /> New Folder
								</Button>
							</>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{filteredFolders.map((folder: any) => (
							<div
								key={folder.id}
								onClick={() => handleFolderClick(folder.id)}
								className="bg-[#393e46] rounded-lg p-5 border border-[#dfd0b8]/10 hover:border-[#948979]/30 hover:shadow-md transition-all cursor-pointer group"
							>
								<div className="flex items-start gap-4">
									<div className="p-3 bg-[#222831] rounded-lg text-[#948979] group-hover:bg-[#948979]/20 transition-colors">
										<Folder className="h-6 w-6" />
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-medium text-[#dfd0b8] truncate group-hover:text-white transition-colors">
											{folder.name}
										</h3>
										<p className="text-xs text-[#dfd0b8]/60 mt-1">
											Created:{" "}
											{new Date(
												folder.createdAt
											).toLocaleDateString()}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Create Folder Dialog */}
			<CreateRenameBox
				isDialogOpen={isCreateDialogOpen}
				setIsDialogOpen={setIsCreateDialogOpen}
				handleBoxClick={handleCreateFolder}
				isLoading={isCreating}
				newFolderName={newFolderName}
				setNewFolderName={setNewFolderName}
			>
				Create
			</CreateRenameBox>
		</div>
	);
};

export default AllFolders;
