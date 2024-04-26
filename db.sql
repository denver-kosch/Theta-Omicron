DROP DATABASE IF EXISTS ThetaOmicron;
CREATE DATABASE IF NOT EXISTS ThetaOmicron;
USE ThetaOmicron;

CREATE TABLE `Chairs`(
    `chairId` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` INT NOT NULL
);

CREATE TABLE `Members`(
    `memberId` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL,
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `status` ENUM('Pledge', 'Initiate', 'Alumni') NOT NULL,
    `phoneNum` VARCHAR(20) NOT NULL,
    `streetAddress` VARCHAR(100) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `postalCode` VARCHAR(50) NOT NULL,
    `initiationYear` VARCHAR(50) NULL,
    `graduationYear` VARCHAR(50) NOT NULL,
    `profilePic` VARCHAR(100) NOT NULL
);

CREATE TABLE `Chairmen`(
    `memberId` INT NOT NULL,
    `chairId` INT NOT NULL,
    PRIMARY KEY(`memberId`, `chairId`)
);