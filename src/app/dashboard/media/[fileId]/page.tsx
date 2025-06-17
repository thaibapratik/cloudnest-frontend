"use client";
import { useParams } from "next/navigation";

export default function MediaPreview() {
	console.log("hey", media);
	return (
		<div className="min-h-screen p-6 bg-gray-100">
			<h1 className="text-xl font-bold mb-4">Media Preview</h1>
			<div className="bg-white p-4 rounded shadow max-w-3xl mx-auto">
				{media.type === "image" && (
					<img
						src={media.url}
						alt="media"
						className="w-full rounded"
					/>
				)}

				{media.type === "video" && (
					<video controls className="w-full rounded">
						<source src={media.url} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				)}
			</div>
		</div>
	);
}
