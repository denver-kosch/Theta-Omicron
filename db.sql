DROP DATABASE IF EXISTS ThetaOmicron;
CREATE DATABASE IF NOT EXISTS ThetaOmicron;
USE ThetaOmicron;
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 30, 2024 at 01:08 AM
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
  `isChairman` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `CommitteeMembers`
--

INSERT INTO `CommitteeMembers` (`memberId`, `committeeId`, `isChairman`, `createdAt`, `updatedAt`) VALUES
(1, 21, 0, '2024-05-24 00:31:12', '2024-05-24 00:31:12'),
(2, 4, 1, '2024-05-24 00:31:12', '2024-05-24 00:31:12'),
(3, 4, 0, '2024-05-24 00:31:12', '2024-05-24 00:31:12'),
(3, 10, 1, '2024-05-24 00:31:12', '2024-05-24 00:31:12'),
(4, 4, 0, '2024-05-24 00:31:12', '2024-05-24 00:31:12'),
(7, 6, 1, '2024-05-24 00:31:12', '2024-05-24 00:31:12'),
(9, 19, 1, '2024-05-24 00:31:12', '2024-05-24 00:31:12'),
(9, 20, 1, '2024-05-24 00:31:12', '2024-05-24 00:31:12');

-- --------------------------------------------------------

--
-- Table structure for table `Committees`
--

CREATE TABLE `Committees` (
  `committeeId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `soId` int(11) NOT NULL DEFAULT '1',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Committees`
--

INSERT INTO `Committees` (`committeeId`, `name`, `soId`, `createdAt`, `updatedAt`) VALUES
(1, 'Scholarship Committee', 2, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(2, 'History Committee', 3, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(3, 'By-Laws Committee', 2, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(4, 'Rush Committee', 3, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(5, 'Ritual Committee', 3, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(6, 'Social Committee', 3, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(7, 'Public Relations Committee', 4, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(8, 'Alumni Relations Committee', 4, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(9, 'Awards Committee', 4, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(10, 'Intramural Committee', 4, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(11, 'Fundraising Committee', 5, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(12, 'Community Service Committee', 5, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(13, 'MHC Committee', 2, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(14, 'Brotherhood Committee', 3, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(15, 'Graphics Committee', 4, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(16, 'Guard', 2, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(17, 'House Manager', 2, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(18, 'Assistant Grand Scribe', 4, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(19, 'Assistant Grand Treasurer', 5, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(20, 'Pledge Educator', 3, '2024-05-24 00:31:29', '2024-05-24 00:31:29'),
(21, 'Executive Committee', 1, '2024-05-24 00:31:29', '2024-05-24 00:31:29');

-- --------------------------------------------------------

--
-- Table structure for table `Events`
--

CREATE TABLE `Events` (
  `eventId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` int(11) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `type` int(11) NOT NULL,
  `visibility` enum('Public','Members','Initiates','EC','Committee') NOT NULL DEFAULT 'Public',
  `status` enum('Pending','Approved','Denied') NOT NULL DEFAULT 'Pending',
  `mandatory` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `lastUpdatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Events`
--

INSERT INTO `Events` (`eventId`, `name`, `description`, `location`, `start`, `end`, `type`, `visibility`, `status`, `mandatory`, `createdAt`, `updatedAt`, `lastUpdatedBy`) VALUES
(1, 'Refreshments w/ DGT', 'Come hang out and get some cool refreshments from Kappa Sigma and the ladies of Delta Gamma Theta, and learn more about the orgs!', 1, '2024-09-03 15:00:00', '2024-09-03 16:30:00', 1, 'Public', 'Approved', 1, '2024-05-24 00:31:44', '2024-05-26 19:42:24', 1);

-- --------------------------------------------------------

--
-- Table structure for table `EventTypes`
--

CREATE TABLE `EventTypes` (
  `typeId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `committee` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `EventTypes`
--

INSERT INTO `EventTypes` (`typeId`, `name`, `committee`, `createdAt`, `updatedAt`) VALUES
(1, 'Champion Quest', 4, '2024-05-26 22:59:57', '2024-05-26 19:00:23'),
(2, 'EC', 21, '2024-05-27 07:24:58', '2024-05-27 07:24:58'),
(3, 'Intramurals', 10, '2024-05-28 23:22:45', '2024-05-28 23:22:45');

-- --------------------------------------------------------

--
-- Table structure for table `Families`
--

CREATE TABLE `Families` (
  `bigId` int(11) NOT NULL,
  `littleId` int(11) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Families`
--

INSERT INTO `Families` (`bigId`, `littleId`, `createdAt`, `updatedAt`) VALUES
(1, 2, '2024-05-24 00:32:01', '2024-05-24 00:32:01'),
(2, 9, '2024-05-24 00:32:01', '2024-05-24 00:32:01');

-- --------------------------------------------------------

--
-- Table structure for table `Locations`
--

CREATE TABLE `Locations` (
  `locationId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `zipCode` varchar(10) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Locations`
--

INSERT INTO `Locations` (`locationId`, `name`, `address`, `city`, `state`, `zipCode`, `createdAt`, `updatedAt`) VALUES
(1, 'Quad', '163 College Dr', 'New Concord', 'OH', '43762', '2024-05-25 22:41:10', '2024-05-25 22:41:10'),
(2, 'Circle 240', '240 Thomas Ct', 'New Concord', 'OH', '43762', '2024-05-27 05:35:19', '2024-05-27 05:35:19'),
(3, 'Lakeside 115/117', '115 Lakeside Dr', 'New Concord', 'OH', '43762', '2024-05-27 06:41:01', '2024-05-27 06:41:01');

-- --------------------------------------------------------

--
-- Table structure for table `MemberRoles`
--

CREATE TABLE `MemberRoles` (
  `memberId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `MemberMemberId` int(11) DEFAULT NULL,
  `RoleRoleId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Members`
--

CREATE TABLE `Members` (
  `memberId` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `status` enum('Pledge','Initiate','Alumnus') NOT NULL DEFAULT 'Pledge',
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
  `ritualCerts` int(11) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Members`
--

INSERT INTO `Members` (`memberId`, `firstName`, `lastName`, `status`, `phoneNum`, `email`, `schoolEmail`, `password`, `streetAddress`, `city`, `state`, `zipCode`, `country`, `initiationYear`, `graduationYear`, `ritualCerts`, `deleted`, `createdAt`, `updatedAt`) VALUES
(1, 'Denver', 'Kosch', 'Initiate', '17402437103', 'dkosch2@gmail.com', 'dkosch1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '12227 Ohio Ave', 'Millersport', 'OH', '43046', 'USA', 2022, 2025, 6, 0, '2024-05-24 00:29:14', '2024-05-24 00:29:14'),
(2, 'Caleb', 'Simpson', 'Initiate', '7402622969', 'calebmason62003@gmail.com', 'csimpson1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '162 N Franklin St', 'Richwood', 'OH', '43344', 'USA', 2023, 2025, 6, 0, '2024-05-24 00:29:14', '2024-05-24 00:29:14'),
(3, 'Zach', 'Amato', 'Initiate', '8146501005', 'zachdbz88@gmail.com', 'zamato1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '526 Lowther St', 'Bellwood', 'PA', '16617', 'USA', 2023, 2026, 4, 0, '2024-05-24 00:29:14', '2024-05-24 00:29:14'),
(4, 'Kacy', 'Perry', 'Initiate', '6144204472', 'kacyperry19@gmail.com', 'kperry1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '2155 Berry Hill Dr.', 'Grove City', 'OH', '43123', 'USA', 2024, 2027, 0, 0, '2024-05-24 00:29:14', '2024-05-24 00:29:14'),
(5, 'Tyler', 'Workman', 'Initiate', '3308424369', 'goldenty9@gmail.com', 'tworkman1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '2122 Williamsburg Cr.', 'Stow', 'OH', '44224', 'USA', 2023, 2026, 2, 0, '2024-05-24 00:29:14', '2024-05-24 00:29:14'),
(6, 'Drew', 'Schneider', 'Initiate', '7404050615', 'drewschneider34@gmail.com', 'andrews1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '3253 Licking Valley Rd', 'Newark', 'OH', '43055', 'USA', 2021, 2025, 1, 0, '2024-05-24 00:29:14', '2024-05-24 00:29:14'),
(7, 'Drew', 'Davis', 'Initiate', '5139399581', 'drewreecedavis@gmail.com', 'ddavis3', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '7134 Lookout Court', 'Hamilton', 'OH', '45011', 'USA', 2022, 2025, 1, 0, '2024-05-24 00:29:14', '2024-05-24 00:29:14'),
(8, 'Jacob', 'McDermott', 'Initiate', '6144006686', 'mcdjacoblax@gmail.com', 'jacobm1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '4454 Hunter Lake Dr.', 'Powell', 'OH', '43065', 'USA', 2023, 2026, 1, 0, '2024-05-24 00:29:14', '2024-05-24 00:29:14'),
(9, 'Nate', 'Farmer', 'Initiate', '3049752105', 'nfarmer2020@gmail.com', 'nfarmer1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '3609 Belmont St', 'Bellaire', 'OH', '43096', 'USA', 2023, 2025, 1, 0, '2024-05-24 00:29:14', '2024-05-24 00:29:14');

-- --------------------------------------------------------

--
-- Table structure for table `Officers`
--

CREATE TABLE `Officers` (
  `officeId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `memberId` int(11) NOT NULL DEFAULT '1',
  `bio` text NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Officers`
--

INSERT INTO `Officers` (`officeId`, `title`, `memberId`, `bio`, `createdAt`, `updatedAt`) VALUES
(1, 'Grand Master', 5, 'Example bio', '2024-05-29 01:09:11', '2024-05-29 01:09:11'),
(2, 'Grand Procurator', 6, 'Example bio', '2024-05-29 01:09:11', '2024-05-29 01:09:11'),
(3, 'Grand Master of Ceremonies', 1, 'Example bio', '2024-05-29 01:09:11', '2024-05-29 01:09:11'),
(4, 'Grand Scribe', 8, 'Example bio', '2024-05-29 01:09:11', '2024-05-29 01:09:11'),
(5, 'Grand Treasurer', 7, 'Example bio', '2024-05-29 01:09:11', '2024-05-29 01:09:11');

-- --------------------------------------------------------

--
-- Table structure for table `Roles`
--

CREATE TABLE `Roles` (
  `roleId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `canAssign` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Roles`
--

INSERT INTO `Roles` (`roleId`, `name`, `canAssign`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', 0, NULL, NULL),
(2, 'SuperAdmin', 1, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `CommitteeMembers`
--
ALTER TABLE `CommitteeMembers`
  ADD PRIMARY KEY (`memberId`,`committeeId`),
  ADD KEY `committeeId` (`committeeId`),
  ADD KEY `memberId` (`memberId`);

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
  ADD KEY `location` (`location`),
  ADD KEY `createdBy` (`lastUpdatedBy`),
  ADD KEY `type` (`type`);

--
-- Indexes for table `EventTypes`
--
ALTER TABLE `EventTypes`
  ADD PRIMARY KEY (`typeId`),
  ADD KEY `committee` (`committee`);

--
-- Indexes for table `Families`
--
ALTER TABLE `Families`
  ADD PRIMARY KEY (`bigId`,`littleId`),
  ADD KEY `littleId` (`littleId`);

--
-- Indexes for table `Locations`
--
ALTER TABLE `Locations`
  ADD PRIMARY KEY (`locationId`);

--
-- Indexes for table `MemberRoles`
--
ALTER TABLE `MemberRoles`
  ADD PRIMARY KEY (`memberId`,`roleId`) USING BTREE,
  ADD KEY `roleId` (`roleId`,`memberId`) USING BTREE,
  ADD KEY `MemberMemberId` (`MemberMemberId`),
  ADD KEY `RoleRoleId` (`RoleRoleId`);

--
-- Indexes for table `Members`
--
ALTER TABLE `Members`
  ADD PRIMARY KEY (`memberId`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `schoolEmail` (`schoolEmail`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `schoolEmail_2` (`schoolEmail`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `schoolEmail_3` (`schoolEmail`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `schoolEmail_4` (`schoolEmail`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `schoolEmail_5` (`schoolEmail`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `schoolEmail_6` (`schoolEmail`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `schoolEmail_7` (`schoolEmail`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `schoolEmail_8` (`schoolEmail`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `schoolEmail_9` (`schoolEmail`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `schoolEmail_10` (`schoolEmail`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `schoolEmail_11` (`schoolEmail`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `schoolEmail_12` (`schoolEmail`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `schoolEmail_13` (`schoolEmail`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `schoolEmail_14` (`schoolEmail`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `schoolEmail_15` (`schoolEmail`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `schoolEmail_16` (`schoolEmail`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `schoolEmail_17` (`schoolEmail`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `schoolEmail_18` (`schoolEmail`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `schoolEmail_19` (`schoolEmail`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `schoolEmail_20` (`schoolEmail`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `schoolEmail_21` (`schoolEmail`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `schoolEmail_22` (`schoolEmail`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `schoolEmail_23` (`schoolEmail`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `schoolEmail_24` (`schoolEmail`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `schoolEmail_25` (`schoolEmail`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `schoolEmail_26` (`schoolEmail`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `schoolEmail_27` (`schoolEmail`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `schoolEmail_28` (`schoolEmail`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `schoolEmail_29` (`schoolEmail`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `schoolEmail_30` (`schoolEmail`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `schoolEmail_31` (`schoolEmail`);

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
  ADD PRIMARY KEY (`roleId`),
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
  MODIFY `eventId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `EventTypes`
--
ALTER TABLE `EventTypes`
  MODIFY `typeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Locations`
--
ALTER TABLE `Locations`
  MODIFY `locationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  ADD CONSTRAINT `committees_ibfk_1` FOREIGN KEY (`soId`) REFERENCES `Officers` (`officeId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Events`
--
ALTER TABLE `Events`
  ADD CONSTRAINT `events_ibfk_2654` FOREIGN KEY (`location`) REFERENCES `Locations` (`locationId`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_2655` FOREIGN KEY (`type`) REFERENCES `EventTypes` (`typeId`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_2656` FOREIGN KEY (`lastUpdatedBy`) REFERENCES `Members` (`memberId`) ON DELETE SET NULL;

--
-- Constraints for table `EventTypes`
--
ALTER TABLE `EventTypes`
  ADD CONSTRAINT `eventtypes_ibfk_1` FOREIGN KEY (`committee`) REFERENCES `Committees` (`committeeId`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Families`
--
ALTER TABLE `Families`
  ADD CONSTRAINT `families_ibfk_1` FOREIGN KEY (`bigId`) REFERENCES `Members` (`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `MemberRoles`
--
ALTER TABLE `MemberRoles`
  ADD CONSTRAINT `memberroles_ibfk_1823` FOREIGN KEY (`MemberMemberId`) REFERENCES `Members` (`memberId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `memberroles_ibfk_1824` FOREIGN KEY (`RoleRoleId`) REFERENCES `Roles` (`roleId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Officers`
--
ALTER TABLE `Officers`
  ADD CONSTRAINT `officers_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `Members` (`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
