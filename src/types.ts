export type User = {
  id: number;
  name: string;
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
  task_type: TaskType;
  task_tag: TaskTag;
  user_id: number; // Foreign key tengt user
};

/* Bíðum aðeins með þetta
export type TaskTypeAssociation = {
  task_id: number; // Foreign key tengt task
  type_id: number; // Foreign key tengt task_type
};
*/
export type DatabaseUser = {
  id: string;
  name: string;
  admin: boolean; // ?????? er ekki alveg viss hvort við notum þetta - ísak
};

export type DatabaseTaskType = {
  id: string;
  name: string;
  slug: string; // ?????? er ekki alveg viss hvort við notum þetta - ísak
};

export type DatabaseTaskTag = {
  id: string;
  name: string;
  slug: string; // ?????? er ekki alveg viss hvort við notum þetta - ísak
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