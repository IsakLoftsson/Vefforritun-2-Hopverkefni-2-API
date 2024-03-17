INSERT INTO users (name, username, password, admin) VALUES ('admin', 'admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', true);
INSERT INTO users (name, username, password, admin) VALUES ('Ísak Loftsson', 'isak', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', true);
INSERT INTO users (name, username, password, admin) VALUES ('Gísli Már Guðmundsson', 'gilli', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', true);
INSERT INTO users (name, username, password, admin) VALUES ('Lilja Örk Loftsdóttir', 'lilja', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', true);

INSERT INTO task_types (name, slug) VALUES ('FlokkurTEST', 'flokkurtest');

INSERT INTO task_tags (name) VALUES ('TagTEST');

INSERT INTO tasks (name, description, task_type, task_tag, user_id) VALUES ('TaskTEST', 'TaskTestDescription', '1', '1', '2');