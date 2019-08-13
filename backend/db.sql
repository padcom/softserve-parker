DROP DATABASE IF EXISTS parker;
CREATE DATABASE parker;
USE parker;

#Below tables are just for example, feel free to expand/remove as needed

CREATE TABLE users (
  user_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  password_hash varchar(255) NOT NULL,
  PRIMARY KEY (user_id)
);

INSERT INTO users (email, password_hash) VALUES ('user@test.com', 'hash');
INSERT INTO users (email, password_hash) VALUES ('user@test.com', 'hash');

CREATE TABLE parking_spots (
  parking_spot_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (parking_spot_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO parking_spots (user_id) VALUES (1);
INSERT INTO parking_spots (user_id) VALUES (2);
