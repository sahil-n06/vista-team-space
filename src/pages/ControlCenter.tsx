import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusManagementTab from "@/components/control-center/StatusManagementTab";
import WorksheetStatusTab from "@/components/control-center/WorksheetStatusTab";
import CustomFieldsTab from "@/components/control-center/CustomFieldsTab";
import LoginActivityTab from "@/components/control-center/LoginActivityTab";

const ControlCenter = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Control Center</h1>
        <p className="text-muted-foreground">
          Manage your workflow, statuses, custom fields, and monitor activity
        </p>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">Status Management</TabsTrigger>
          <TabsTrigger value="worksheet">Worksheet Status</TabsTrigger>
          <TabsTrigger value="fields">Custom Fields</TabsTrigger>
          <TabsTrigger value="activity">Login Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-6">
          <StatusManagementTab />
        </TabsContent>

        <TabsContent value="worksheet" className="mt-6">
          <WorksheetStatusTab />
        </TabsContent>

        <TabsContent value="fields" className="mt-6">
          <CustomFieldsTab />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <LoginActivityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControlCenter;
