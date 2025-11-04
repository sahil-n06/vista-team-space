import StatusManagement from "@/components/control-center/StatusManagement";
import WorksheetStatus from "@/components/control-center/WorksheetStatus";
import CustomFieldsManager from "@/components/control-center/CustomFieldsManager";
import LoginActivityMonitor from "@/components/control-center/LoginActivityMonitor";

const ControlCenter = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Control Center</h1>
        <p className="text-muted-foreground">
          Manage your workflow, statuses, custom fields, and monitor activity
        </p>
      </div>

      <div className="grid gap-6">
        <StatusManagement />
        <WorksheetStatus />
        <CustomFieldsManager />
        <LoginActivityMonitor />
      </div>
    </div>
  );
};

export default ControlCenter;
