"use client";

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { Cloud } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Home() {
	const { getToken } = useAuth();

	useEffect(() => {
		const checkUser = async () => {
			const token = await getToken();
			if (token) {
				redirect("/dashboard");
			}
		};
		checkUser();
	}, [getToken]);

	return (
		<div className="h-screen bg-[#f0faf5] flex flex-col items-center pt-0 overflow-hidden">
			<img
				src="https://img.freepik.com/premium-photo/grunge-dusty-noise-grainy-texture-background_1008660-1715.jpg?semt=ais_hybrid&w=740"
				alt="noise"
				className="w-full h-full object-cover absolute -z-20"
			/>
			{/* Header - fixed the positioning */}
			<header className="flex justify-between items-center w-full px-10 py-2 mt-0 ">
				<div className="flex items-center gap-2">
					<div className="bg-teal-400 rounded-md p-1">
						<Cloud className="text-white" size={24} />
					</div>
					<span className="text-xl font-bold text-teal-500 tracking-wide">
						CloudNest
					</span>
				</div>

				<div className="flex gap-4 justify-center items-center">
					<span className="px-6 py-3 rounded-md bg-gray-900 text-white font-medium hover:bg-gray-800 transition">
						<SignUpButton>Get Started</SignUpButton>
					</span>
					<span className="px-6 py-3 rounded-md bg-[#e8f6ef] text-gray-800 font-medium hover:bg-[#d8f0e5] transition">
						<SignInButton>Sign in</SignInButton>
					</span>
				</div>
			</header>

			{/* Main content */}
			<div className="relative flex h-full justify-center items-center">
				{/* Removed the green glow background divs */}

				{/* Hero Section */}
				<section className="flex flex-col  items-center text-center relative z-10 mb-16 mt-20 ">
					<div className="absolute -top-40 -z-10 w-[100rem] h-[40rem] blur-xl">
						<DotLottieReact
							src="https://lottie.host/3b900040-4c43-492c-b7e9-6291823de183/us9XxtPiG5.lottie"
							loop
							autoplay
						/>
					</div>
					<p className="text-teal-600 font-medium mb-2 tracking-widest uppercase text-sm xl:text-md">
						CloudNest, your cloud storage solution
					</p>
					<h1 className="text-4xl md:text-5xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight">
						Organizing and Secure Data
						<br />
						Management
					</h1>
					<p className="text-gray-600 text-base mb-8 lg:text-xl max-w-2xl mx-auto">
						Effortlessly store, access, and share your files from
						anywhere. Our cloud storage app offers fast uploads,
						military-grade encryption, and seamless syncing across
						all your devices.
					</p>
					<div className="flex gap-4 mb-12 justify-center">
						<span className="px-6 py-3 rounded-md bg-gray-900 text-white font-medium hover:bg-gray-800 transition">
							<SignUpButton>Get Started</SignUpButton>
						</span>
						<span className="px-6 py-3 rounded-md bg-[#e8f6ef] text-gray-800 font-medium hover:bg-[#d8f0e5] transition">
							<SignInButton>Sign in</SignInButton>
						</span>
					</div>
				</section>

				{/* Features section remains unchanged */}
				<section className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
					{/* Feature cards remain unchanged */}
				</section>
			</div>
		</div>
	);
}
