"use client";

import { formatFileSize } from "@/lib/formatFileSize";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import {
	FileAudio,
	FileImage,
	FileText,
	FileVideo,
	Folder,
	Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Total {
	image: number;
	video: number;
	audio: number;
	document: number;
	other: number;
	[key: string]: number;
}

const FileTypes = () => {
	const [images, setImages] = useState<any[]>([]);
	const [videos, setVideos] = useState<any[]>([]);
	const [audios, setAudios] = useState<any[]>([]);
	const [documents, setDocuments] = useState<any[]>([]);
	const [others, setOthers] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [totalSize, setTotalSize] = useState<Total>({
		image: 0,
		video: 0,
		audio: 0,
		document: 0,
		other: 0,
	});

	const [totalCount, setTotalCount] = useState<Total>({
		image: 0,
		video: 0,
		audio: 0,
		document: 0,
		other: 0,
	});

	const types = ["image", "video", "audio", "document", "other"];
	const { getToken } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			const token = await getToken();
			setLoading(true);
			try {
				const response = await axios.get(
					"http://localhost:4000/file/get-all-by-type",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				console.log(response.data);

				setImages(response.data.files.image);
				setVideos(response.data.files.video);
				setAudios(response.data.files.audio);
				setDocuments(response.data.files.document);
				setOthers(response.data.files.other);

				setTotalCount(response.data.count);
				setTotalSize(response.data.totalSize);
			} catch (err: any) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [getToken]);

	return (
		<section className="my-8">
			<h3 className="font-semibold text-xl mb-6 text-primary">
				File Types
			</h3>

			{loading ? (
				<div className="flex justify-center items-center py-12">
					<Loader2 className="animate-spin text-primary h-8 w-8" />
				</div>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					{types.map((type) => (
						<FileTypeCard
							key={type}
							type={type}
							count={totalCount[type]}
							totalSize={totalSize[type]}
						/>
					))}
				</div>
			)}
		</section>
	);
};
export default FileTypes;

const FileTypeCard = ({
	type,
	count,
	totalSize,
}: {
	type: string;
	count: number;
	totalSize: number;
}) => {
	const getIcon = () => {
		switch (type) {
			case "image":
				return <FileImage size={24} />;
			case "video":
				return <FileVideo size={24} />;
			case "audio":
				return <FileAudio size={24} />;
			case "document":
				return <FileText size={24} />;
			default:
				return <Folder size={24} />;
		}
	};

	const getColor = () => {
		switch (type) {
			case "image":
				return "bg-blue-100 text-blue-600";
			case "video":
				return "bg-red-100 text-red-600";
			case "audio":
				return "bg-purple-100 text-purple-600";
			case "document":
				return "bg-green-100 text-green-600";
			default:
				return "bg-gray-100 text-gray-600";
		}
	};

	return (
		<div className="bg-card rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-all duration-200 cursor-pointer">
			<div className="flex flex-col h-full">
				<div className="flex items-center gap-3 mb-2">
					<div className={`p-2 rounded-md ${getColor()}`}>
						{getIcon()}
					</div>
					<div>
						<p className="font-medium capitalize">{type}</p>
						<p className="text-sm text-muted-foreground">
							{count} {count === 1 ? "file" : "files"}
						</p>
					</div>
				</div>
				<div className="mt-2 pt-2 border-t border-border">
					<p className="font-semibold text-primary text-right">
						{formatFileSize(totalSize)}
					</p>
				</div>
			</div>
		</div>
	);
};
