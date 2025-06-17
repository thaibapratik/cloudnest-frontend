"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MoreVertical, Loader2, RefreshCw, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatFileSize } from "@/lib/formatFileSize";
import { useFileStore } from "@/stores/fileStore";
import getFileIcon from "@/lib/getFileIcon";
import { useDropzone } from "react-dropzone";

const FolderView = () => {
	const { getToken } = useAuth();
	const params = useParams();
	const folderId = params.folderId;

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { getFilesByFolderId, files, createFile } = useFileStore();

	const [isDragging, setIsDragging] = useState<boolean>(false);
	const onDrop = async (acceptedFiles: File[]) => {
		setIsDragging(false);
		const token = await getToken();

		for (const file of acceptedFiles)
			await createFile(token, file, String(folderId));
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		onDragEnter: () => setIsDragging(true),
		onDragLeave: () => setIsDragging(false),
		noClick: true,
		noKeyboard: true,
	});

	useEffect(() => {
		const fetchFolder = async () => {
			setIsLoading(true);
			try {
				const token = await getToken();
				await getFilesByFolderId(Number(folderId), token);
			} catch (err: any) {
				setError(err?.message || "Error fetching files");
				console.log(err);
			} finally {
				setIsLoading(false);
			}
		};
		fetchFolder();
	}, [getToken, folderId]);

	return (
		<div className="min-h-screen bg-background p-6" {...getRootProps()}>
			<div className="min-h-screen bg-background">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="flex items-center justify-between mb-8">
						<div className="flex items-center gap-4">
							<h1 className="text-2xl font-bold text-foreground">
								Content
							</h1>
						</div>

						<Button variant="outline">
							<RefreshCw className="h-4 w-4 mr-2" /> Refresh
						</Button>
					</div>

					{/* Error message */}
					{error && (
						<div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-md mb-6">
							{error}
						</div>
					)}

					{/* Content */}
					{isLoading ? (
						<div className="flex items-center justify-center py-20">
							<div className="flex flex-col items-center gap-4">
								<Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
								<p className="text-foreground">Loading...</p>
							</div>
						</div>
					) : files.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20">
							<div className="bg-muted p-6 rounded-full mb-4">
								<Folder className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="text-xl font-medium text-foreground mb-2">
								No files yet
							</h3>
							<p className="text-muted-foreground">
								Drag and drop to upload files
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{files.map((file: any) => (
								<a
									href={file.fileUrl}
									target="_blank"
									key={file.id}
									className="bg-card text-foreground rounded-lg overflow-hidden border border-foreground/10 hover:border-foreground/30 transition-all group"
								>
									<div className="relative">
										{file.thumbnailUrl ? (
											<img
												src={file.thumbnailUrl}
												alt={file.name}
												className="w-full h-40 object-cover"
											/>
										) : (
											<div className="w-full h-40 flex items-center justify-center bg-muted">
												<span className="text-4xl">
													{getFileIcon(file.type)}
												</span>
											</div>
										)}

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="absolute top-2 right-2 rounded-full bg-background/50 text-foreground hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent className="bg-card border-foreground/10 text-foreground">
												<DropdownMenuItem className="hover:bg-muted cursor-pointer">
													<a
														href={file.fileUrl}
														download
														className="h-full w-full"
													>
														Download
													</a>
												</DropdownMenuItem>
												<DropdownMenuItem className="hover:bg-muted cursor-pointer">
													Remove from favorites
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>

									<div className="p-4">
										<h3 className="font-medium text-foreground truncate mb-1">
											{file.name}
										</h3>
										<div className="flex justify-between items-center text-xs text-muted-foreground">
											<span>
												{formatFileSize(file.size)}
											</span>
											<span>
												{new Date(
													file.createdAt
												).toLocaleDateString()}
											</span>
										</div>
									</div>
								</a>
							))}
						</div>
					)}
				</div>
			</div>
			{isDragging && (
				<div className="inset-0 z-50 bg-black/50 flex justify-center items-center absolute">
					<input {...getInputProps()} />
					<p className="text-3xl text-center text-white">
						Drop to upload
					</p>
				</div>
			)}
		</div>
	);
};

export default FolderView;
