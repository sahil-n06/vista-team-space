import { Button } from "@/components/ui/button";
import { Paperclip, Plus } from "lucide-react";

interface TaskDetailFilesProps {
  task: any;
}

const mockFiles = [
  { id: 1, name: "design-mockup.pdf", size: "2.4 MB", uploadedBy: "John Doe" },
  { id: 2, name: "requirements.docx", size: "1.2 MB", uploadedBy: "Jane Smith" },
];

export function TaskDetailFiles({ task }: TaskDetailFilesProps) {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Paperclip className="h-4 w-4" />
          Attached Files
        </h3>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </div>
      <div className="space-y-2">
        {mockFiles.map((file) => (
          <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {file.size} • Uploaded by {file.uploadedBy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
