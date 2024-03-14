export type User = {
  id: number;
  name: string;
  username: string;
  password: string;
  admin: boolean;
};

export type Task = {
  id: number;
  name: string;
  date: Date;
  user_id: number; // Foreign key tengt user
};

export type TaskType = {
  id: number;
  name: string;
  description?: string;
};

export type TaskTypeAssociation = {
  task_id: number; // Foreign key tengt task
  type_id: number; // Foreign key tengt task_type
};

export type DatabaseTask = {
  id: string;
  name: string;
  date: Date; 
  user_id: string; // Foreign key tengt users
};

export type DatabaseTaskType = {
  id: string;
  name: string;
  description: string;
};

