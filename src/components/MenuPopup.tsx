import { Heart, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import CreateRenameBox from "./CreateRenameBox";
import { useFileStore } from "@/stores/fileStore";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

interface MenuPopupProps {
	fileId: any;
	currentName: string;
	showMenu: boolean;
	setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
	name: string;
}

const MenuPopup = ({
	fileId,
	currentName,
	showMenu,
	setShowMenu,
	name,
}: MenuPopupProps) => {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const { updateFile, deleteFile, favoriteFile, softDeleteFile } =
		useFileStore();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [newName, setNewName] = useState<string>(name || "");
	const { getToken } = useAuth();

	const handleRename = async () => {
		setIsLoading(true);
		try {
			const token = await getToken();
			const fileExtension = currentName.split(".").pop();

			updateFile(fileId, newName, token, fileExtension);
			toast.success("File renamed!");
			setIsDialogOpen(false);
			setShowMenu(false);
		} catch (error) {
			console.error("Error updating file:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		setIsLoading(true);
		try {
			const token = await getToken();
			await softDeleteFile(token, fileId);
			setShowMenu(false);
		} catch (error) {
			console.error("Error deleting file:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFavorite = async () => {
		setIsLoading(true);
		try {
			const token = await getToken();
			await favoriteFile(fileId, token);
		} catch (error) {
			console.error("Error deleting file:", error);
		}
	};

	return (
		<div
			className="absolute right-8 top-0 z-10 min-w-[200px] rounded-md border border-border bg-popover shadow-md animate-in fade-in-80 zoom-in-95"
			onClick={(e) => e.stopPropagation()}
		>
			<ul className="py-1 text-sm">
				<li onClick={() => setIsDialogOpen(true)}>
					<button className="flex w-full items-center gap-2 px-4 py-2 text-white/70 hover:bg-white/10 transition-colors">
						<span className="flex gap-2 items-center">
							<Pencil size={16} />
							Rename
						</span>
					</button>
				</li>

				<li onClick={handleDelete}>
					<button className="flex w-full items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 transition-colors">
						<Trash2 size={16} />
						<span>Delete</span>
					</button>
				</li>

				<li onClick={handleFavorite}>
					<button className="flex w-full items-center gap-2 px-4 py-2 text-chart-3 hover:bg-chart-3/30 transition-colors">
						<Heart size={16} />
						<span>Favorite</span>
					</button>
				</li>
			</ul>
			{isDialogOpen && (
				<CreateRenameBox
					isDialogOpen={isDialogOpen}
					setIsDialogOpen={setIsDialogOpen}
					handleBoxClick={handleRename}
					isLoading={isLoading}
					newFolderName={newName}
					setNewFolderName={setNewName}
				>
					Rename
				</CreateRenameBox>
			)}
		</div>
	);
};
export default MenuPopup;
