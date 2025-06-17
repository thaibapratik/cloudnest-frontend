import FileTypes from "@/components/FileTypes";
import QuickAccess from "@/components/QuickAccess";
import RecentFiles from "@/components/RecentFiles";

const Dashboard = () => {
	return (
		<>
			<FileTypes />
			<QuickAccess />
			<RecentFiles />
		</>
	);
};
export default Dashboard;
