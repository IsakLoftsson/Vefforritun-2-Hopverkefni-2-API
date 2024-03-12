CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  name CHARACTER VARYING(64) NOT NULL,
  username character varying(64) NOT NULL UNIQUE,
  password character varying(256) NOT NULL,
  admin BOOLEAN DEFAULT false
);

CREATE TABLE public.task_types (
  id SERIAL PRIMARY KEY,
  name CHARACTER VARYING(64) NOT NULL UNIQUE,
  description TEXT DEFAULT ''
);

CREATE TABLE public.tasks (
  id SERIAL PRIMARY KEY,
  name CHARACTER VARYING(64) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE, -- Dagur en ekki tími
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE -- Einn user gerir hvert task
);

CREATE TABLE public.task_type_associations (
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  type_id INTEGER NOT NULL REFERENCES task_types(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, type_id)
);