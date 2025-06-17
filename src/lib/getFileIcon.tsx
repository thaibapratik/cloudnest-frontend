import {
	FileText,
	Image,
	BookOpen,
	FolderArchive,
	Music,
	Video,
	File,
} from "lucide-react";

const getFileIcon = (type: string) => {
	const t = type.toLowerCase();

	if (t.includes("pdf")) {
		return <BookOpen />;
	}

	if (t.includes("image") || t.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/)) {
		return <Image />;
	}

	if (t.includes("word") || t.includes("doc") || t.match(/\.(docx?)$/)) {
		return <FileText />;
	}

	if (
		t.includes("zip") ||
		t.includes("archive") ||
		t.match(/\.(zip|rar|7z|tar|gz)$/)
	) {
		return <FolderArchive />;
	}

	if (t.includes("audio") || t.match(/\.(mp3|wav|ogg|flac)$/)) {
		return <Music />;
	}

	if (t.includes("video") || t.match(/\.(mp4|mov|avi|wmv)$/)) {
		return <Video />;
	}

	return <File />;
};

export default getFileIcon;
