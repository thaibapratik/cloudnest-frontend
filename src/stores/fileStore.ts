import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

interface FileStore {
	files: any;
	setFiles: (files: any) => void;
	createFile: (
		token: string | null,
		file: File,
		folder?: string
	) => Promise<any>;
	getFiles: (token: string | null) => Promise<any>;
	deleteFile: (id: number, token: string | null) => Promise<any>;
	updateFile: (
		id: number,
		name: string,
		token: string | null,
		fileExtension: string | undefined
	) => Promise<any>;
	getFilesByFolderId: (
		folderId: number | null,
		token: string | null
	) => Promise<any>;
	favoriteFile: (id: number, token: string | null) => Promise<void>;
	getFavoriteFiles: (token: string | null) => Promise<void>;
	softDeleteFile: (token: string | null, id: number) => Promise<void>;
	getTrashFiles: (token: string | null) => Promise<void>;
}

export const useFileStore = create<FileStore>((set) => ({
	files: [],
	setFiles: (files) => set({ files }),

	createFile: async (token: string | null, file: File, folderId?: string) => {
		const formData = new FormData();
		formData.append("file", file);

		if (folderId) {
			console.log("Sending formData with folderId:");
			formData.append("folderId", folderId);
		}

		const toastId = toast.loading(`Uploading ${file.name}...`, {
			duration: Infinity,
		});
		try {
			const response = await axios.post(
				"https://cloudnest-backend.onrender.com/file/upload",
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},

					onUploadProgress: (e) => {
						const progress = e.total
							? Math.round((e.loaded * 100) / e.total)
							: 0;

						toast.loading(
							`Uploading ${file.name} (${progress} %)`,
							{ id: toastId }
						);
					},
				}
			);
			toast.success(`${file.name} uploaded ✅`, {
				id: toastId,
				duration: 2000,
			});

			console.log("Response data:", response.data);

			// Check if response.data.file exists before updating state
			if (response.data && response.data.file) {
				set((state: any) => ({
					files: [...state.files, response.data.file],
				}));
				return { success: true, message: "File uploaded successfully" };
			} else {
				throw new Error("Invalid server response");
			}
		} catch (error: any) {
			toast.error(`${file.name} failed to upload ❌`, {
				id: toastId,
				duration: 2000,
			});
			console.error(
				"Upload error:",
				error.response?.data || error.message
			);

			throw error;
		}
	},

	getFiles: async (token: string | null) => {
		const response = await axios.get(
			"https://cloudnest-backend.onrender.com/file/list",
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		console.log("Fetching Files", response.data.files);
		set({ files: response.data.files });
	},

	deleteFile: async (id: number, token: string | null) => {
		const response = await axios.delete(
			"https://cloudnest-backend.onrender.com/file/" + id,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		console.log(response.data);
		set((state: any) => ({
			files: state.files.filter((file: any) => file.id !== id),
		}));
		return { success: true, message: "File deleted successfully" };
	},

	updateFile: async (
		id: number,
		name: string,
		token: string | null,
		fileExtension: string | undefined
	) => {
		const response = await axios.patch(
			"https://cloudnest-backend.onrender.com/file/" + id,
			{ name: `${name}.${fileExtension}` },
			{
				headers: {
					Authorization: `Bearer ${token}`,
					// "Content-Type": "application/json",
				},
			}
		);

		console.log(response.data);

		set((state: any) => ({
			files: state.files.map((file: any) =>
				file.id === id ? response.data : file
			),
		}));

		return { success: true, message: "File updated successfully" };
	},

	getFilesByFolderId: async (
		folderId: number | null,
		token: string | null
	) => {
		try {
			const response = await axios.get(
				`https://cloudnest-backend.onrender.com/file/folder/${folderId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log(response.data);
			set({ files: response.data });
		} catch (error) {
			console.log(error);
		}
	},

	favoriteFile: async (id: number, token: string | null) => {
		try {
			const { data: file } = await axios.get(
				`https://cloudnest-backend.onrender.com/file/${id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const currentIsLiked = !file?.isLiked;

			const response = await axios.patch(
				`https://cloudnest-backend.onrender.com/file/` + id,
				{
					isLiked: currentIsLiked,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			toast.success(
				`File has been ${
					currentIsLiked
						? "added to favorites"
						: "removed from favorites"
				}`,
				{ duration: 1500 }
			);
		} catch (error) {
			console.log(error);
			toast.error("Failed to favorite", { duration: 1500 });
		}
	},

	getFavoriteFiles: async (token: string | null) => {
		try {
			const response = await axios.get(
				`https://cloudnest-backend.onrender.com/file/favorites`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log(response.data);
			set({ files: response.data.files });
		} catch (error) {
			console.log(error);
			toast.error("Failed to fetch favorite files");
		}
	},

	softDeleteFile: async (token: string | null, id: number) => {
		try {
			const { data: file } = await axios.get(
				`https://cloudnest-backend.onrender.com/file/${id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const currentIsDeleted = file?.isDeleted;

			const { data } = await axios.patch(
				`https://cloudnest-backend.onrender.com/file/${id}`,
				{
					isDeleted: !currentIsDeleted,
					deletedAt: currentIsDeleted ? null : new Date(),
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log(data);
			toast.success(
				`File has been ${currentIsDeleted ? "restored" : "trashed"}`
			);
			set((state) => ({
				files: state.files.filter((file: any) => file.id !== id),
			}));
		} catch (error) {
			console.log(error);
			toast.error("Error on trashing the file");
		}
	},

	getTrashFiles: async (token: string | null) => {
		try {
			console.log("on store working");
			const { data } = await axios.get(
				"https://cloudnest-backend.onrender.com/file/trash",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log(data);
			set({ files: data });
		} catch (error) {
			console.log(error);
		}
	},
}));
