export interface TaskDetailDialogProps {
  task: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface Comment {
  id: number;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface FileAttachment {
  id: number;
  name: string;
  size: string;
  uploadedBy: string;
}

export interface TaskLog {
  id: number;
  status: string;
  fromStatus?: string;
  toStatus?: string;
  date: string;
  changedBy: string;
  avatar?: string;
}
