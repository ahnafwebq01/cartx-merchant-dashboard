import { FullPageLoader } from "@/components/ui/loader-spinner";

export default function DashboardLoading() {
  return (
    <FullPageLoader
      title="Loading Dashboard..."
      description="Synchronizing live merchant metrics, catalog health, and system status"
    />
  );
}

