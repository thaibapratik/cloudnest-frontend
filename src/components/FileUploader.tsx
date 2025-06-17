import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { useFileStore } from "@/stores/fileStore";
import { useAuth } from "@clerk/nextjs";

interface FileUploaderProps {
	folderId: string;
	setIsDragging: any;
	isDragging: boolean;
}

export const FileUploader = ({
	folderId,
	setIsDragging,
	isDragging,
}: FileUploaderProps) => {
	// const [isDragging, setIsDragging] = useState(false);
	const { createFile } = useFileStore();
	const { getToken } = useAuth();

	const onDrop = async (acceptedFiles: File[]) => {
		setIsDragging(false);
		const token = await getToken();
		if (!token) {
			toast.error("Authentication token missing. Please log in.");
			return;
		}

		for (const file of acceptedFiles) {
			await createFile(token, file, folderId);
		}
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		onDragEnter: () => setIsDragging(true),
		onDragLeave: () => setIsDragging(false),
		noClick: true,
		noKeyboard: true,
	});

	return (
		<div>
			{isDragging && (
				<div {...getRootProps()} className="fixed inset-0 z-50">
					<input {...getInputProps()} />
					<div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl">
						Drop files to upload
					</div>
				</div>
			)}
		</div>
	);
};

export default FileUploader;
