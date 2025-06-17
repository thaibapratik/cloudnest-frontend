export const formatFileSize = (bytes: number) => {
	if (bytes < 1024) return bytes + " B";
	else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
	else if (bytes < 1024 * 1024 * 1024)
		return (bytes / (1024 * 1024)).toFixed(1) + " MB";
	else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
};
