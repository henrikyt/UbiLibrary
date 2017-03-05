-- Set database user
DROP DATABASE IF EXISTS `ubilibrary`;
CREATE DATABASE `ubilibrary`;
GRANT ALL PRIVILEGES ON ubilibrary.* TO 'ubilibraryuser'@'localhost' IDENTIFIED BY 'ubioulu' WITH GRANT OPTION;