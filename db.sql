DROP DATABASE IF EXISTS ThetaOmicron;
CREATE DATABASE IF NOT EXISTS ThetaOmicron;
USE ThetaOmicron;
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 23, 2024 at 09:25 PM
-- Server version: 5.7.39
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ThetaOmicron`
--

-- --------------------------------------------------------

--
-- Table structure for table `CommitteeMembers`
--

CREATE TABLE `CommitteeMembers` (
  `memberId` int(11) NOT NULL,
  `committeeId` int(11) NOT NULL,
  `isChairman` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `CommitteeMembers`
--

INSERT INTO `CommitteeMembers` (`memberId`, `committeeId`, `isChairman`) VALUES
(1, 21, 0),
(2, 4, 1),
(3, 4, 0),
(3, 10, 1),
(4, 4, 0),
(7, 6, 1),
(9, 19, 1),
(9, 20, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Committees`
--

CREATE TABLE `Committees` (
  `committeeId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `soId` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Committees`
--

INSERT INTO `Committees` (`committeeId`, `name`, `soId`) VALUES
(1, 'Scholarship Committee', 2),
(2, 'History Committee', 3),
(3, 'By-Laws Committee', 2),
(4, 'Rush Committee', 3),
(5, 'Ritual Committee', 3),
(6, 'Social Committee', 3),
(7, 'Public Relations Committee', 4),
(8, 'Alumni Relations Committee', 4),
(9, 'Awards Committee', 4),
(10, 'Intramural Committee', 4),
(11, 'Fundraising Committee', 5),
(12, 'Community Service Committee', 5),
(13, 'MHC Committee', 2),
(14, 'Brotherhood Committee', 3),
(15, 'Graphics Committee', 4),
(16, 'Guard', 2),
(17, 'House Manager', 2),
(18, 'Assistant Grand Scribe', 4),
(19, 'Assistant Grand Treasurer', 5),
(20, 'Pledge Educator', 3),
(21, 'Executive Committee', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Events`
--

CREATE TABLE `Events` (
  `eventId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `location` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  `facilitatingCommittee` int(11) NOT NULL,
  `visibility` enum('Public','Members','Initiates','EC','Committee') NOT NULL DEFAULT 'Public'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Events`
--

INSERT INTO `Events` (`eventId`, `name`, `description`, `start`, `end`, `location`, `type`, `facilitatingCommittee`, `visibility`) VALUES
(1, 'Refreshments w/ DGT', 'Come hang out and get some cool refreshments from Kappa Sigma and DGT, and learn more about the orgs!', '2024-09-03 15:00:00', '2024-09-03 16:30:00', 'Quad', 'Rush', 4, 'Public');

-- --------------------------------------------------------

--
-- Table structure for table `Families`
--

CREATE TABLE `Families` (
  `bigId` int(11) NOT NULL,
  `littleId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Families`
--

INSERT INTO `Families` (`bigId`, `littleId`) VALUES
(1, 2),
(2, 9);

-- --------------------------------------------------------

--
-- Table structure for table `MemberRoles`
--

CREATE TABLE `MemberRoles` (
  `roleId` int(11) NOT NULL,
  `memberId` int(11) NOT NULL,
  `dateAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `MemberRoles`
--

INSERT INTO `MemberRoles` (`roleId`, `memberId`, `dateAdded`) VALUES
(1, 2, '2024-05-09 03:52:09'),
(2, 1, '2024-05-09 03:51:46');

-- --------------------------------------------------------

--
-- Table structure for table `Members`
--

CREATE TABLE `Members` (
  `memberId` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `status` enum('Pledge','Initiate','Alumnus','Expelled') NOT NULL,
  `phoneNum` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `schoolEmail` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `streetAddress` varchar(100) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `zipCode` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `initiationYear` int(11) DEFAULT NULL,
  `graduationYear` int(11) NOT NULL,
  `ritualCerts` int(11) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Members`
--

INSERT INTO `Members` (`memberId`, `firstName`, `lastName`, `status`, `phoneNum`, `email`, `schoolEmail`, `password`, `streetAddress`, `city`, `state`, `zipCode`, `country`, `initiationYear`, `graduationYear`, `ritualCerts`, `deleted`) VALUES
(1, 'Denver', 'Kosch', 'Initiate', '17402437103', 'dkosch2@gmail.com', 'dkosch1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '12227 Ohio Ave', 'Millersport', 'OH', '43046', 'USA', 2022, 2025, 6, 0),
(2, 'Caleb', 'Simpson', 'Initiate', '7402622969', 'calebmason62003@gmail.com', 'csimpson1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '162 N Franklin St', 'Richwood', 'OH', '43344', 'USA', 2023, 2025, 6, 0),
(3, 'Zach', 'Amato', 'Initiate', '8146501005', 'zachdbz88@gmail.com', 'zamato1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '526 Lowther St', 'Bellwood', 'PA', '16617', 'USA', 2023, 2026, 4, 0),
(4, 'Kacy', 'Perry', 'Initiate', '6144204472', 'kacyperry19@gmail.com', 'kperry1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '2155 Berry Hill Dr.', 'Grove City', 'OH', '43123', 'USA', 2024, 2027, 0, 0),
(5, 'Tyler', 'Workman', 'Initiate', '3308424369', 'goldenty9@gmail.com', 'tworkman1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '2122 Williamsburg Cr.', 'Stow', 'OH', '44224', 'USA', 2023, 2026, 2, 0),
(6, 'Drew', 'Schneider', 'Initiate', '7404050615', 'drewschneider34@gmail.com', 'andrews1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '3253 Licking Valley Rd', 'Newark', 'OH', '43055', 'USA', 2021, 2025, 1, 0),
(7, 'Drew', 'Davis', 'Initiate', '5139399581', 'drewreecedavis@gmail.com', 'ddavis3', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '7134 Lookout Court', 'Hamilton', 'OH', '45011', 'USA', 2022, 2025, 1, 0),
(8, 'Jacob', 'McDermott', 'Initiate', '6144006686', 'mcdjacoblax@gmail.com', 'jacobm1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '4454 Hunter Lake Dr.', 'Powell', 'OH', '43065', 'USA', 2023, 2026, 1, 0),
(9, 'Nate', 'Farmer', 'Initiate', '3049752105', 'nfarmer2020@gmail.com', 'nfarmer1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '3609 Belmont St', 'Bellaire', 'OH', '43096', 'USA', 2023, 2025, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `MembersRoles`
--

CREATE TABLE `MembersRoles` (
  `memberId` int(11) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  `dateAdded` datetime DEFAULT NULL,
  `MemberMemberId` int(11) NOT NULL,
  `RoleRoleId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Officers`
--

CREATE TABLE `Officers` (
  `officeId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `memberId` int(11) NOT NULL DEFAULT '1',
  `bio` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Officers`
--

INSERT INTO `Officers` (`officeId`, `title`, `memberId`, `bio`) VALUES
(1, 'Grand Master', 5, 'Example bio'),
(2, 'Grand Procurator', 6, 'Example bio'),
(3, 'Grand Master of Ceremonies', 1, 'Example bio'),
(4, 'Grand Scribe', 8, 'Example bio'),
(5, 'Grand Treasurer', 7, 'Example bio');

-- --------------------------------------------------------

--
-- Table structure for table `Roles`
--

CREATE TABLE `Roles` (
  `roleID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `canAssign` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Roles`
--

INSERT INTO `Roles` (`roleID`, `name`, `canAssign`) VALUES
(1, 'Admin', 0),
(2, 'SuperAdmin', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `CommitteeMembers`
--
ALTER TABLE `CommitteeMembers`
  ADD PRIMARY KEY (`memberId`,`committeeId`),
  ADD KEY `committeeId` (`committeeId`);

--
-- Indexes for table `Committees`
--
ALTER TABLE `Committees`
  ADD PRIMARY KEY (`committeeId`),
  ADD KEY `soId` (`soId`);

--
-- Indexes for table `Events`
--
ALTER TABLE `Events`
  ADD PRIMARY KEY (`eventId`),
  ADD KEY `committeeRunning` (`facilitatingCommittee`);

--
-- Indexes for table `Families`
--
ALTER TABLE `Families`
  ADD PRIMARY KEY (`bigId`,`littleId`),
  ADD KEY `littleId` (`littleId`);

--
-- Indexes for table `MemberRoles`
--
ALTER TABLE `MemberRoles`
  ADD PRIMARY KEY (`roleId`,`memberId`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `Members`
--
ALTER TABLE `Members`
  ADD PRIMARY KEY (`memberId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `MembersRoles`
--
ALTER TABLE `MembersRoles`
  ADD PRIMARY KEY (`MemberMemberId`,`RoleRoleId`),
  ADD KEY `memberId` (`memberId`),
  ADD KEY `roleId` (`roleId`),
  ADD KEY `RoleRoleId` (`RoleRoleId`);

--
-- Indexes for table `Officers`
--
ALTER TABLE `Officers`
  ADD PRIMARY KEY (`officeId`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `Roles`
--
ALTER TABLE `Roles`
  ADD PRIMARY KEY (`roleID`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Committees`
--
ALTER TABLE `Committees`
  MODIFY `committeeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `Events`
--
ALTER TABLE `Events`
  MODIFY `eventId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Members`
--
ALTER TABLE `Members`
  MODIFY `memberId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `Officers`
--
ALTER TABLE `Officers`
  MODIFY `officeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Roles`
--
ALTER TABLE `Roles`
  MODIFY `roleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `CommitteeMembers`
--
ALTER TABLE `CommitteeMembers`
  ADD CONSTRAINT `committeemembers_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `Members` (`memberId`),
  ADD CONSTRAINT `committeemembers_ibfk_2` FOREIGN KEY (`committeeId`) REFERENCES `Committees` (`committeeId`);

--
-- Constraints for table `Committees`
--
ALTER TABLE `Committees`
  ADD CONSTRAINT `committees_ibfk_1` FOREIGN KEY (`soId`) REFERENCES `Officers` (`officeId`);

--
-- Constraints for table `Events`
--
ALTER TABLE `Events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`facilitatingCommittee`) REFERENCES `Committees` (`committeeId`) ON DELETE CASCADE;

--
-- Constraints for table `Families`
--
ALTER TABLE `Families`
  ADD CONSTRAINT `families_ibfk_1` FOREIGN KEY (`bigId`) REFERENCES `Members` (`memberId`),
  ADD CONSTRAINT `families_ibfk_2` FOREIGN KEY (`littleId`) REFERENCES `Members` (`memberId`);

--
-- Constraints for table `MemberRoles`
--
ALTER TABLE `MemberRoles`
  ADD CONSTRAINT `memberroles_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `Members` (`memberId`),
  ADD CONSTRAINT `memberroles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `Roles` (`roleID`);

--
-- Constraints for table `MembersRoles`
--
ALTER TABLE `MembersRoles`
  ADD CONSTRAINT `membersroles_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `Members` (`memberId`),
  ADD CONSTRAINT `membersroles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `Roles` (`roleID`),
  ADD CONSTRAINT `membersroles_ibfk_3` FOREIGN KEY (`MemberMemberId`) REFERENCES `Members` (`memberId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `membersroles_ibfk_4` FOREIGN KEY (`RoleRoleId`) REFERENCES `Roles` (`roleID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Officers`
--
ALTER TABLE `Officers`
  ADD CONSTRAINT `officers_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `Members` (`memberId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;