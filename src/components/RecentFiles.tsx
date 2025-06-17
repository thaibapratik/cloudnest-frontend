"use client";

import { formatFileSize } from "@/lib/formatFileSize";
import getFileIcon from "@/lib/getFileIcon";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { EllipsisVertical, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MenuPopup from "./MenuPopup";
import { useFileStore } from "@/stores/fileStore";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";

interface FileItem {
	id: string | number;
	name: string;
	thumbnailUrl: string;
	fileUrl: string;
	path: string;
	size: number;
	createdAt: Date;
	updatedAt: Date;
	folderId: string | null;
	userId: string;
	type: string;
}

const RecentFiles = () => {
	const { userId, isLoaded } = useAuth();
	const { getFiles, files } = useFileStore();

	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { getToken } = useAuth();
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const [activeFileId, setActiveFileId] = useState<string | number | null>(
		null
	);
	const [showUploader, setShowUploader] = useState<boolean>(false);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const { createFile } = useFileStore();

	const onDrop = async (files: File[]) => {
		setIsDragging(false);
		setShowUploader(false);
		const token = await getToken();
		for (const file of files) await createFile(token, file);
	};

	const { getInputProps, getRootProps } = useDropzone({
		onDrop,
		onDragEnter: () => setIsDragging(true),
		onDragLeave: () => setIsDragging(false),
		noClick: false,
		noKeyboard: true,
	});

	useEffect(() => {
		if (isLoaded && !userId) {
			router.push("/sign-in");
			return;
		}

		const fetchFiles = async () => {
			try {
				const token = await getToken();
				getFiles(token);
			} catch (err: any) {
				setError(err.message || "Failed to fetch files");
				toast.error(error);
				console.log(err);
			} finally {
				setLoading(false);
			}
		};
		fetchFiles();
	}, [userId, isLoaded, router]);

	return (
		<section className="mt-8">
			<div className="w-full flex justify-between relative">
				<h3 className="font-semibold text-xl mb-6 text-primary">
					Recent uploads
				</h3>
				<Button onClick={() => setShowUploader((s) => !s)}>
					Upload
				</Button>
				{showUploader && (
					<div
						className="absolute right-0 top-10 bg-black/80 p-20 border-2 border-white border-dashed"
						{...getRootProps()}
					>
						<input {...getInputProps()} />
						<p className="text-xl text-white/80">
							Upload file here
						</p>
					</div>
				)}
			</div>

			<div className="bg-card rounded-xl shadow-md border border-border">
				<table className="w-full table-fixed">
					<thead>
						<tr className="border-b border-border text-sm text-muted-foreground">
							<th className="px-6 py-4 text-left font-medium w-[50%]">
								Name
							</th>
							<th className="px-6 py-4 text-left font-medium w-[10%]">
								Owner
							</th>
							<th className="px-6 py-4 text-left font-medium w-[15%]">
								Date
							</th>
							<th className="px-6 py-4 text-left font-medium w-[10%]">
								Size
							</th>
							<th className="px-6 py-4 text-left font-medium w-[5%]"></th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
								<td
									colSpan={10}
									className="px-6 py-4 text-center"
								>
									<Loader2 className="animate-spin text-primary h-8 w-8" />
								</td>
							</tr>
						) : files.length === 0 ? (
							<tr>
								<td
									colSpan={5}
									className="px-6 py-4 text-center text-muted-foreground"
								>
									No files found
								</td>
							</tr>
						) : (
							files &&
							files.map((file: any) => (
								<tr
									key={file.id}
									className="border-b border-border hover:bg-accent/30 transition-colors cursor-pointer"
								>
									<td className="px-6 py-4">
										<a
											className="flex items-center gap-3"
											href={file.fileUrl}
											target="_blank"
										>
											<span className="text-xl flex-shrink-0 bg-accent/20 p-2 rounded-md">
												{file.thumbnailUrl ? (
													<img
														src={file.thumbnailUrl}
														alt={file.name}
														className="w-8 h-8 rounded"
													/>
												) : (
													getFileIcon(file.type)
												)}
											</span>
											<span
												className="font-medium truncate"
												title={file.name}
											>
												{file.name}
											</span>
										</a>
									</td>
									<td className="px-6 py-4 text-muted-foreground">
										You
									</td>
									<td className="px-6 py-4 text-muted-foreground">
										{new Date(
											file.createdAt
										).toLocaleDateString("en-US", {
											day: "numeric",
											month: "short",
											year: "numeric",
										})}
									</td>
									<td className="px-6 py-4 text-muted-foreground">
										{formatFileSize(file.size)}
									</td>
									<td className="px-6 py-4 text-right relative">
										<button
											className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-accent/50 cursor-pointer hover:scale-105 duration-150"
											onClick={(e) => {
												e.stopPropagation();
												setActiveFileId(file.id);
												setShowMenu((state) => !state);
											}}
										>
											<EllipsisVertical size={20} />
										</button>
										{showMenu &&
											activeFileId === file.id && (
												<MenuPopup
													fileId={file.id}
													currentName={file.name}
													showMenu={showMenu}
													setShowMenu={setShowMenu}
													name={file.name
														.split(".")
														.slice(0, -1)
														.join(".")}
												/>
											)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
};
export default RecentFiles;
