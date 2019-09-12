DROP DATABASE IF EXISTS parker;
CREATE DATABASE parker;
USE parker;

# To load this script:
# I'm assuming you set it up like instructed in ./README.md'
# Just write:
# mysql -u root --password=root < mysql

# Below tables are just examples, feel free to expand/remove as needed

CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  passwordHash varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO users (email, passwordHash) VALUES ('user@test.com', 'hash');
INSERT INTO users (email, passwordHash) VALUES ('user@test.com', 'hash');

CREATE TABLE parkingSpots (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  userId INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

INSERT INTO parkingSpots (userId) VALUES (1);
INSERT INTO parkingSpots (userId) VALUES (2);
