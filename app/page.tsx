import { DashboardPageSection } from "@/components/sections/dashboard-page-section";
import {
  fetchDashboardOverview,
  fetchRecentReports,
  fetchReportPipeline,
} from "@/lib/api/dashboard";

export default function Home() {
  const overview = fetchDashboardOverview();
  const recentReports = fetchRecentReports();
  const pipeline = fetchReportPipeline();

  return (
    <DashboardPageSection
      overview={overview}
      recentReports={recentReports}
      pipeline={pipeline}
    />
  );
}
