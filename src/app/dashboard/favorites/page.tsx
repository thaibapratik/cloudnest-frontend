"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2, MoreVertical, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatFileSize } from "@/lib/formatFileSize";
import getFileIcon from "@/lib/getFileIcon";
import { useFileStore } from "@/stores/fileStore";

const FavoritesPage = () => {
	const { getToken } = useAuth();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { getFavoriteFiles, files } = useFileStore();
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const token = await getToken();
				await getFavoriteFiles(token);
			} catch (err: any) {
				console.error(err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [getToken]);

	const handleDownload = (fileUrl: string, fileName: string) => {
		const link = document.createElement("a");
		link.href = fileUrl;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="min-h-screen bg-background p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-2xl font-bold text-foreground">
						Favorites
					</h1>
					<Button
						variant="outline"
						onClick={() => window.location.reload()}
					>
						<RefreshCw className="h-4 w-4 mr-2" /> Refresh
					</Button>
				</div>

				{/* Error */}
				{error && (
					<div className="bg-destructive/10 border border-destructive/50 text-destructive p-4 rounded-md mb-6">
						{error}
					</div>
				)}

				{/* Content */}
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<div className="flex flex-col items-center gap-4">
							<Loader2 className="h-12 w-12 text-primary animate-spin" />
							<p className="text-muted-foreground">
								Loading favorites...
							</p>
						</div>
					</div>
				) : files.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<div className="bg-card p-6 rounded-full mb-4 text-background">
							<Heart className="h-12 w-12 " />
						</div>
						<h3 className="text-xl font-medium text-foreground mb-2">
							No favorites yet
						</h3>
						<p className="text-muted-foreground">
							Mark files as favorites to access them quickly
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{files.map((file: any) => (
							<div
								key={file.id}
								className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-all group"
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
												className="absolute top-2 right-2 rounded-full bg-muted/50 text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="bg-popover border-border text-foreground">
											<DropdownMenuItem
												className="hover:bg-muted cursor-pointer"
												onClick={() =>
													handleDownload(
														file.fileUrl,
														file.name
													)
												}
											>
												Download
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
										<span>{formatFileSize(file.size)}</span>
										<span>
											{new Date(
												file.createdAt
											).toLocaleDateString()}
										</span>
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

export default FavoritesPage;
