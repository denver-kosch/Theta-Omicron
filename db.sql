DROP DATABASE IF EXISTS ThetaOmicron;
CREATE DATABASE IF NOT EXISTS ThetaOmicron;
USE ThetaOmicron;

CREATE TABLE `Chairs`(
    `chairId` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL
)ENGINE=InnoDB;

CREATE TABLE `Members`(
    `memberId` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `status` ENUM('Pledge', 'Initiate', 'Alumni') NOT NULL,
    `phoneNum` VARCHAR(20) NOT NULL,
    `streetAddress` VARCHAR(100) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `postalCode` VARCHAR(50) NOT NULL,
    `initiationYear` VARCHAR(50) NULL,
    `graduationYear` VARCHAR(50) NOT NULL
)ENGINE=InnoDB;

CREATE TABLE `Chairmen`(
    `memberId` INT NOT NULL,
    `chairId` INT NOT NULL,
    PRIMARY KEY(`memberId`, `chairId`),
    FOREIGN KEY (memberId) REFERENCES Members(memberId),
    FOREIGN KEY (chairId) REFERENCES Chairs(chairId)
)ENGINE=InnoDB;

INSERT INTO Chairs(title) VALUES 
('Grand Master'),('Grand Procurator'),('Grand Master of Ceremonies'),('Grand Treasurer'),('Grand Scribe'), ('Guard'),
('Scholarship Chairman'),('Scholarship Committee'),
('Historian Chairman'), ('History Committee'),
('House Manager'), ('Assistant House Manager'),
('By-Laws Chairman'), ('By-Laws Committee'),
('Rush Chairman'), ('Rush Committee'),
('Assistant Grand Scribe'), ('Assistant Grand Treasurer'),
('Pledge Educator'),
('Ritual Chairman'), ('Ritual Committee'),
('Social Chairman'), ('Social Committee'),
('Public Relations Chairman'), ('Public Relations Committee'),
('Alumni Relations Chairman'), ('Alumni Relations Committee'),
('Awards Chairman'), ('Awards Committee'),
('Intramural Chairman'), ('Intramural Committee'),
('Fundraising Chairman'), ('Fundraising Committee'),
('Community Service Chairman'), ('Community Service Committee'),
('MHC Chairman'), ('MHC Committee'),
('Brotherhood Chairman'), ('Brotherhood Committee'),
('Graphics Chairman'), ('Graphics Committee');
