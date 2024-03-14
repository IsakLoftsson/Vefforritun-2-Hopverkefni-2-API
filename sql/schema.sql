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
  slug CHARACTER VARYING(64) NOT NULL UNIQUE
);

CREATE TABLE public.task_tags (
  id SERIAL PRIMARY KEY,
  name CHARACTER VARYING(64) NOT NULL UNIQUE
);


CREATE TABLE public.tasks (
  id SERIAL PRIMARY KEY,
  name CHARACTER VARYING(64) NOT NULL,
  description CHARACTER VARYING(128) DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE, -- Dagsetning (gefur okkur ekki klukku)
  task_type INTEGER NOT NULL REFERENCES task_types(id) ON DELETE CASCADE,
  task_tag INTEGER NOT NULL REFERENCES task_tags(id) ON DELETE CASCADE, 
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE -- Einn user gerir hvert task
);

/* Bíðum aðeins með þetta
CREATE TABLE public.task_type_association (
  task_id INTEGER NOT NULL REFERENCES task(id) ON DELETE CASCADE,
  type_id INTEGER NOT NULL REFERENCES task_type(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, type_id) -- tengir saman task og type og býr til primary Key fyrir viðburðinn
);
*/
