import axios from "axios";
import { create } from "zustand";

interface FolderStore {
	folders: any;
	setFolders: (folders: any) => void;
	createFolder: (name: string, token: string | null) => Promise<any>;
	getFoldersWithLimit: (token: string | null, limit: number) => Promise<any>;
	getFolders: (token: string | null, folderId?: number) => Promise<any>;
	deleteFolder: (id: number, token: string | null) => Promise<any>;
	updateFolder: (
		id: number,
		name: string,
		token: string | null
	) => Promise<any>;
}

export const useFolderStore = create<FolderStore>((set) => ({
	folders: [],
	setFolders: (folders: any) => set({ folders }),

	createFolder: async (name: string, token: string | null) => {
		if (!name) name = "New Folder";
		const response = await axios.post(
			"http://localhost:4000/folder/create",
			{ name: name },
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		set((state: any) => ({ folders: [...state.folders, response.data] }));
		return { success: true, message: "Folder created successfully" };
	},

	getFolders: async (token: string | null, folderId?: number) => {
		try {
			const response = await axios.get(
				"http://localhost:4000/folder/get-all",
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			set({ folders: response.data });
		} catch (error: any) {
			console.log(error.message);
		}
	},

	getFoldersWithLimit: async (token: string | null, limit: number) => {
		const response = await axios.get(
			"http://localhost:4000/folder/get-all?limit=" + limit,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		set({ folders: response.data });
	},

	deleteFolder: async (id: number, token: string | null) => {
		const response = await axios.delete(
			"http://localhost:4000/folder/delete/" + id,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		set((state: any) => ({
			folders: state.folders.filter((folder: any) => folder.id !== id),
		}));
		return { success: true, message: "Folder deleted successfully" };
	},

	updateFolder: async (id: number, name: string, token: string | null) => {
		const response = await axios.put(
			"http://localhost:4000/folder/update/" + id,
			{ name: name },
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		set((state: any) => ({
			folders: state.folders.map((folder: any) =>
				folder.id === id ? response.data : folder
			),
		}));
		return { success: true, message: "Folder updated successfully" };
	},
}));
