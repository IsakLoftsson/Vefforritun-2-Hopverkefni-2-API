export type User = {
  id: number;
  name: string;
  username: string;
  password: string;
  admin: boolean;
};

export type TaskType = {
  id: number;
  name: string;
};

export type TaskTag = {
  id: number;
  name: string;
};

export type Task = {
  id: number;
  name: string;
  description: string;
  date: Date;
  taskTypeId: TaskType;
  taskTagId: TaskTag;
  user_id: number; // Foreign key tengt user
};

/* Bíðum aðeins með þetta
export type TaskTypeAssociation = {
  task_id: number; // Foreign key tengt task
  type_id: number; // Foreign key tengt task_type
};
*/

export type DatabaseTaskType = {
  id: string;
  name: string;
};

export type DatabaseTaskTag = {
  id: string;
  name: string;
};

export type DatabaseTask = {
  id: string;
  name: string;
  description: string;
  date: string;
  task_type_id: string;
  task_tag_id: string;
  user_id: string;
};