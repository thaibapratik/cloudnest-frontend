import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const CreateRenameBox = ({
	isDialogOpen,
	setIsDialogOpen,
	handleBoxClick,
	isLoading,
	newFolderName,
	children,
	setNewFolderName,
}: {
	isDialogOpen: boolean;
	setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleBoxClick: () => void;
	isLoading: boolean;
	newFolderName: string;
	children: string;
	setNewFolderName: React.Dispatch<React.SetStateAction<string>>;
}) => {
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="bg-[#393e46] border-[#dfd0b8]/10 text-[#dfd0b8]">
				<DialogHeader>
					<DialogTitle className="text-[#dfd0b8]">
						{children === "Create" ? "Create New Folder" : "Rename"}
					</DialogTitle>
				</DialogHeader>
				<div className="py-4">
					<Input
						placeholder="Folder name"
						value={newFolderName}
						onChange={(e) => setNewFolderName(e.target.value)}
						className="bg-[#222831] border-[#dfd0b8]/10 text-[#dfd0b8] focus-visible:ring-[#948979]/30"
						autoFocus
					/>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsDialogOpen(false)}
						className="border-[#dfd0b8]/20 text-[#dfd0b8] hover:bg-[#222831] hover:text-[#dfd0b8]"
					>
						Cancel
					</Button>
					<Button
						onClick={handleBoxClick}
						disabled={!newFolderName.trim() || isLoading}
						className="bg-[#948979] text-[#222831] hover:bg-[#948979]/90"
					>
						{isLoading ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								{children === "Create"
									? "Creating..."
									: "Renaming..."}
							</>
						) : children === "Create" ? (
							"Create Folder"
						) : (
							"Rename"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default CreateRenameBox;
