export const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-primary text-primary-foreground",
    high: "bg-warning text-warning-foreground",
    urgent: "bg-destructive text-destructive-foreground",
  };
  return colors[priority] || colors.medium;
};

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    todo: "bg-muted text-muted-foreground",
    in_progress: "bg-primary text-primary-foreground",
    in_review: "bg-warning text-warning-foreground",
    completed: "bg-success text-success-foreground",
    blocked: "bg-destructive text-destructive-foreground",
  };
  return colors[status] || colors.todo;
};

export const formatStatusName = (status: string) => {
  return status?.replace("_", " ") || "";
};
