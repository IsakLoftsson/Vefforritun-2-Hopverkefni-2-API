INSERT INTO users (name, password, admin) VALUES ('admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', true);
INSERT INTO users (name, password, admin) VALUES ('isakloftsson', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', true);
INSERT INTO users (name, password, admin) VALUES ('GilliMar', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', true);
INSERT INTO users (name, password, admin) VALUES ('LiljaOrk', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', true);

INSERT INTO task_types (name, slug) VALUES ('Útivist', 'utivist');
INSERT INTO task_types (name, slug) VALUES ('Skóli', 'skoli');
INSERT INTO task_types (name, slug) VALUES ('Vinnuverkefni', 'vinnuverkefni');
INSERT INTO task_types (name, slug) VALUES ('Heimaverkefni', 'heimaverkefni');
INSERT INTO task_types (name, slug) VALUES ('Annað', 'annad');

INSERT INTO task_tags (name) VALUES ('Skemmtilegt');
INSERT INTO task_tags (name) VALUES ('Þungt');
INSERT INTO task_tags (name) VALUES ('Létt');
INSERT INTO task_tags (name) VALUES ('Erfitt');
INSERT INTO task_tags (name) VALUES ('Annað');

INSERT INTO tasks (name, description, task_type, task_tag, user_id) VALUES ('Verkefni', 'Vinna verkefni', '2', '4', '4');
INSERT INTO tasks (name, description, task_type, task_tag, user_id) VALUES ('Pakka', 'Pakka fyrir útivist', '1', '3', '3');
INSERT INTO tasks (name, description, task_type, task_tag, user_id) VALUES ('Lesa', 'Lesa bók', '4', '2', '2');
INSERT INTO tasks (name, description, task_type, task_tag, user_id) VALUES ('Skóla', 'Fara í skóla', '3', '1', '1');
INSERT INTO tasks (name, description, task_type, task_tag, user_id) VALUES ('Annað', 'Annað', '5', '5', '1');