"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Folder, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFolderStore } from "@/stores/folderStore";
import CreateRenameBox from "@/components/CreateRenameBox";
import { useFileStore } from "@/stores/fileStore";
import getFileIcon from "@/lib/getFileIcon";
import { useDropzone } from "react-dropzone";

const AllFolders = () => {
	const { getToken } = useAuth();
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [newFolderName, setNewFolderName] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const { getFolders, folders, createFolder } = useFolderStore();
	const { getFilesByFolderId, files, createFile } = useFileStore();
	const [isDragging, setIsDragging] = useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const token = await getToken();
				await getFolders(token);
				await getFilesByFolderId(null, token);
			} catch (error) {
				console.error("Error fetching folders:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
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

	const onDrop = async (files: File[]) => {
		setIsDragging(false);
		const token = await getToken();
		for (const file of files) await createFile(token, file);
	};

	const handleFolderClick = (folderId: string | number) => {
		router.push(`/dashboard/root/${folderId}`);
	};

	const filteredFolders = folders.filter((folder: any) =>
		folder.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const { getInputProps, getRootProps } = useDropzone({
		onDrop,
		onDragEnter: () => setIsDragging(true),
		onDragLeave: () => setIsDragging(false),
		noClick: false,
		noKeyboard: true,
	});

	return (
		<div className="min-h-screen bg-background p-6" {...getRootProps()}>
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
					<h1 className="text-2xl font-bold text-foreground">Root</h1>

					<div className="flex items-center gap-4">
						<div className="relative max-w-xs">
							<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search folders..."
								className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<Button onClick={() => setIsCreateDialogOpen(true)}>
							<Plus className="h-4 w-4 mr-2" /> New Folder
						</Button>
					</div>
				</div>

				{/* Content */}
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<div className="flex flex-col items-center gap-4">
							<Loader2 className="h-12 w-12 text-primary animate-spin" />
							<p className="text-muted-foreground">
								Loading content...
							</p>
						</div>
					</div>
				) : filteredFolders.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<div className="bg-card p-6 rounded-full mb-4">
							<Folder className="h-12 w-12 text-primary" />
						</div>
						{searchQuery ? (
							<>
								<h3 className="text-xl font-medium text-foreground mb-2">
									No folders found
								</h3>
								<p className="text-muted-foreground mb-6">
									Try a different search term
								</p>
							</>
						) : (
							<>
								<h3 className="text-xl font-medium text-foreground mb-2">
									No folders yet
								</h3>
								<p className="text-muted-foreground mb-6">
									Create your first folder to get started
								</p>
								<Button
									onClick={() => setIsCreateDialogOpen(true)}
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
								className="bg-card rounded-lg p-5 border border-border hover:shadow-md transition-all cursor-pointer group"
							>
								<div className="flex items-start gap-4">
									<div className="p-3 bg-white/70 rounded-lg text-primary group-hover:bg-white/50 transition-colors">
										<Folder className="h-6 w-6" />
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-medium text-foreground truncate transition-colors">
											{folder.name}
										</h3>
										<p className="text-xs text-muted-foreground mt-1">
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

				{/* Files Section */}
				{files.length > 0 && (
					<div className="mt-10">
						<h2 className="text-xl font-semibold text-foreground mb-4">
							Files
						</h2>
						<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
							{!loading &&
								files.map((file: any) => (
									<div
										key={file.id}
										className="group bg-card rounded-xl p-4 border border-border hover:shadow-lg transition-all cursor-pointer flex flex-col gap-4"
									>
										<a
											className="h-24 w-full rounded-lg flex items-center justify-center overflow-hidden relative transition-colors"
											href={file.fileUrl}
											target="_blank"
										>
											{file.thumbnailUrl ? (
												<img
													src={file.thumbnailUrl}
													alt={file.name}
													className="object-cover w-full h-full"
												/>
											) : (
												<span className="text-primary text-4xl">
													{getFileIcon(file.type)}
												</span>
											)}
										</a>
										<div className="flex-1">
											<h3 className="font-medium text-foreground truncate transition-colors">
												{file.name}
											</h3>
											<p className="text-xs text-muted-foreground mt-1">
												Uploaded:{" "}
												{new Date(
													file.createdAt
												).toLocaleDateString()}
											</p>
										</div>
									</div>
								))}
						</div>
					</div>
				)}
			</div>

			{isDragging && (
				<div className="absolute inset-0 bg-black/50 flex justify-center items-center z-40">
					<input {...getInputProps()} />
					<div className="text-2xl text-white">
						Drop to upload the file
					</div>
				</div>
			)}

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
