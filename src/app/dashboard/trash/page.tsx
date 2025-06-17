"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Trash, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/formatFileSize";
import getFileIcon from "@/lib/getFileIcon";
import { useFileStore } from "@/stores/fileStore";

const TrashPage = () => {
	const { getToken } = useAuth();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [restoring, setRestoring] = useState<number | null>(null);
	const [deleting, setDeleting] = useState<number | null>(null);
	const { getTrashFiles, files, softDeleteFile, deleteFile } = useFileStore();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const token = await getToken();
			await getTrashFiles(token);
			setLoading(false);
		};
		fetchData();
	}, [getToken]);

	const handleRestore = async (id: number) => {
		setRestoring(id);
		const token = await getToken();
		await softDeleteFile(token, id);
		setRestoring(null);
	};

	const handlePermanentDelete = async (id: number) => {
		if (
			confirm(
				"Are you sure you want to permanently delete this file? This action cannot be undone."
			)
		) {
			setDeleting(id);
			const token = await getToken();
			await deleteFile(id, token);
			setDeleting(null);
		}
	};

	return (
		<div className="min-h-screen bg-background text-foreground py-10 px-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold tracking-tight">
						Recycle Bin
					</h1>
				</div>

				{/* Error */}
				{error && (
					<div className="bg-destructive/10 border border-destructive/50 text-destructive p-4 rounded-md mb-6">
						{error}
					</div>
				)}

				{/* Loading */}
				{loading ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
						<p className="mt-4 text-muted-foreground">
							Loading trash items...
						</p>
					</div>
				) : files.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<div className="bg-card p-6 rounded-full mb-4 border border-border">
							<Trash className="h-12 w-12 text-muted-foreground" />
						</div>
						<h3 className="text-xl font-medium mb-2">
							Recycle Bin is empty
						</h3>
						<p className="text-muted-foreground text-sm">
							Deleted files will appear here for 30 days before
							being permanently removed.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{files.map((item: any) => (
							<div
								key={item.id}
								className="bg-card rounded-xl overflow-hidden border border-border hover:border-muted transition-all"
							>
								<div className="relative">
									{item.thumbnailUrl ? (
										<img
											src={item.thumbnailUrl}
											alt={item.name}
											className="w-full h-40 object-cover"
										/>
									) : (
										<div className="w-full h-40 flex items-center justify-center bg-muted">
											<span className="text-4xl text-muted-foreground">
												{getFileIcon(item.type)}
											</span>
										</div>
									)}
								</div>

								<div className="p-4">
									<h3 className="font-medium truncate mb-1">
										{item.name}
									</h3>
									<div className="flex justify-between items-center text-xs text-muted-foreground">
										<span>{formatFileSize(item.size)}</span>
										<span>
											{new Date(
												item.deletedAt
											).toLocaleDateString()}
										</span>
									</div>

									<div className="mt-4 flex justify-between gap-2">
										<Button
											variant="outline"
											size="sm"
											disabled={restoring === item.id}
											onClick={() =>
												handleRestore(item.id)
											}
										>
											<RotateCcw className="h-4 w-4 mr-2" />
											{restoring === item.id
												? "Restoring..."
												: "Restore"}
										</Button>

										<Button
											variant="destructive"
											size="sm"
											disabled={deleting === item.id}
											onClick={() =>
												handlePermanentDelete(item.id)
											}
										>
											{deleting === item.id
												? "Deleting..."
												: "Delete"}
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default TrashPage;
