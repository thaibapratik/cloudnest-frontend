"use client";

import { useAuth } from "@clerk/nextjs";
import { Folder, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useFolderStore } from "@/stores/folderStore";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const QuickAccess = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const { getToken, userId } = useAuth();
	const { getFoldersWithLimit, createFolder, folders } = useFolderStore();
	const router = useRouter();

	useEffect(() => {
		const loadFolders = async () => {
			setLoading(true);
			try {
				const token = await getToken();
				await getFoldersWithLimit(token, 4);
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		};
		loadFolders();
	}, [getToken, getFoldersWithLimit]);

	const handleAddFolder = async () => {
		setLoading(true);
		try {
			const token = await getToken();
			await createFolder("New Folder", token);
		} catch (err: any) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};
	return (
		<section className="mt-8">
			<div className="flex justify-between items-center mb-6">
				<h3 className="font-semibold text-xl text-primary">
					Quick Access
				</h3>
				<Button onClick={handleAddFolder} className="gap-2">
					<Plus size={16} />
					New Folder
				</Button>
			</div>

			{loading ? (
				<div className="flex justify-center items-center py-12">
					<Loader2 className="animate-spin text-primary h-8 w-8" />
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{folders.map((folder: any) => (
						<div
							key={folder.id}
							onClick={() =>
								router.push(`/dashboard/root/${folder.id}`)
							}
							className="bg-card rounded-lg p-5 border border-[#dfd0b8]/10 hover:border-[#948979]/30 hover:shadow-md transition-all cursor-pointer group"
						>
							<div className="flex items-start gap-4">
								<div className="p-3 bg-white rounded-lg text-[#948979] group-hover:bg-[#948979]/20 transition-colors">
									<Folder className="h-6 w-6" />
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="font-medium text-foreground truncate transition-colors">
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
		</section>
	);
};
export default QuickAccess;
