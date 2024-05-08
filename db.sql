DROP DATABASE IF EXISTS ThetaOmicron;
CREATE DATABASE IF NOT EXISTS ThetaOmicron;
USE ThetaOmicron;
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 08, 2024 at 02:46 AM
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
-- Table structure for table `Chairmen`
--

CREATE TABLE `Chairmen` (
  `memberId` int(11) NOT NULL,
  `chairId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Chairmen`
--

INSERT INTO `Chairmen` (`memberId`, `chairId`) VALUES
(5, 1),
(6, 2),
(1, 3),
(7, 4),
(8, 5),
(2, 15),
(3, 16),
(4, 16),
(9, 18),
(9, 19),
(3, 30);

-- --------------------------------------------------------

--
-- Table structure for table `Chairs`
--

CREATE TABLE `Chairs` (
  `chairId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Chairs`
--

INSERT INTO `Chairs` (`chairId`, `title`) VALUES
(1, 'Grand Master'),
(2, 'Grand Procurator'),
(3, 'Grand Master of Ceremonies'),
(4, 'Grand Treasurer'),
(5, 'Grand Scribe'),
(6, 'Guard'),
(7, 'Scholarship Chairman'),
(8, 'Scholarship Committee'),
(9, 'Historian Chairman'),
(10, 'History Committee'),
(11, 'House Manager'),
(12, 'Assistant House Manager'),
(13, 'By-Laws Chairman'),
(14, 'By-Laws Committee'),
(15, 'Rush Chairman'),
(16, 'Rush Committee'),
(17, 'Assistant Grand Scribe'),
(18, 'Assistant Grand Treasurer'),
(19, 'Pledge Educator'),
(20, 'Ritual Chairman'),
(21, 'Ritual Committee'),
(22, 'Social Chairman'),
(23, 'Social Committee'),
(24, 'Public Relations Chairman'),
(25, 'Public Relations Committee'),
(26, 'Alumni Relations Chairman'),
(27, 'Alumni Relations Committee'),
(28, 'Awards Chairman'),
(29, 'Awards Committee'),
(30, 'Intramural Chairman'),
(31, 'Intramural Committee'),
(32, 'Fundraising Chairman'),
(33, 'Fundraising Committee'),
(34, 'Community Service Chairman'),
(35, 'Community Service Committee'),
(36, 'MHC Chairman'),
(37, 'MHC Committee'),
(38, 'Brotherhood Chairman'),
(39, 'Brotherhood Committee'),
(40, 'Graphics Chairman'),
(41, 'Graphics Committee');

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
-- Table structure for table `Members`
--

CREATE TABLE `Members` (
  `memberId` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `status` enum('Pledge','Initiate','Alumus') NOT NULL,
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
  `ritualCerts` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Members`
--

INSERT INTO `Members` (`memberId`, `firstName`, `lastName`, `status`, `phoneNum`, `email`, `schoolEmail`, `password`, `streetAddress`, `city`, `state`, `zipCode`, `country`, `initiationYear`, `graduationYear`, `ritualCerts`) VALUES
(1, 'Denver', 'Kosch', 'Initiate', '17402437103', 'dkosch2@gmail.com', 'dkosch1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '12227 Ohio Ave', 'Millersport', 'OH', '43046', 'USA', 2022, 2025, 6),
(2, 'Caleb', 'Simpson', 'Initiate', '7402622969', 'calebmason62003@gmail.com', 'csimpson1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '162 N Franklin St', 'Richwood', 'OH', '43344', 'USA', 2023, 2025, 6),
(3, 'Zach', 'Amato', 'Initiate', '8146501005', 'zachdbz88@gmail.com', 'zamato1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '526 Lowther St', 'Bellwood', 'PA', '16617', 'USA', 2023, 2026, 4),
(4, 'Kacy', 'Perry', 'Initiate', '6144204472', 'kacyperry19@gmail.com', 'kperry1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '2155 Berry Hill Dr.', 'Grove City', 'OH', '43123', 'USA', 2024, 2027, 0),
(5, 'Tyler', 'Workman', 'Initiate', '3308424369', 'goldenty9@gmail.com', 'tworkman1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '2122 Williamsburg Cr.', 'Stow', 'OH', '44224', 'USA', 2023, 2026, 2),
(6, 'Drew', 'Schneider', 'Initiate', '7404050615', 'drewschneider34@gmail.com', 'andrews1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '3253 Licking Valley Rd', 'Newark', 'OH', '43055', 'USA', 2021, 2025, 1),
(7, 'Drew', 'Davis', 'Initiate', '5139399581', 'drewreecedavis@gmail.com', 'ddavis3', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '7134 Lookout Court', 'Hamilton', 'OH', '45011', 'USA', 2022, 2025, 1),
(8, 'Jacob', 'McDermott', 'Initiate', '6144006686', 'mcdjacoblax@gmail.com', 'jacobm1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '4454 Hunter Lake Dr.', 'Powell', 'OH', '43065', 'USA', 2023, 2026, 1),
(9, 'Nate', 'Farmer', 'Initiate', '3049752105', 'nfarmer2020@gmail.com', 'nfarmer1', '$2b$10$RsSiGs1A4UJ57SYscYlZz.S4l5X2owJ8S3Q3nxYD9/fuZxWP2KGIa', '3609 Belmont St', 'Bellaire', 'OH', '43096', 'USA', 2023, 2025, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Chairmen`
--
ALTER TABLE `Chairmen`
  ADD PRIMARY KEY (`memberId`,`chairId`),
  ADD KEY `chairId` (`chairId`);

--
-- Indexes for table `Chairs`
--
ALTER TABLE `Chairs`
  ADD PRIMARY KEY (`chairId`);

--
-- Indexes for table `Families`
--
ALTER TABLE `Families`
  ADD PRIMARY KEY (`bigId`,`littleId`),
  ADD KEY `littleId` (`littleId`);

--
-- Indexes for table `Members`
--
ALTER TABLE `Members`
  ADD PRIMARY KEY (`memberId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Chairs`
--
ALTER TABLE `Chairs`
  MODIFY `chairId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `Members`
--
ALTER TABLE `Members`
  MODIFY `memberId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Chairmen`
--
ALTER TABLE `Chairmen`
  ADD CONSTRAINT `chairmen_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `Members` (`memberId`),
  ADD CONSTRAINT `chairmen_ibfk_2` FOREIGN KEY (`chairId`) REFERENCES `Chairs` (`chairId`);

--
-- Constraints for table `Families`
--
ALTER TABLE `Families`
  ADD CONSTRAINT `families_ibfk_1` FOREIGN KEY (`bigId`) REFERENCES `Members` (`memberId`),
  ADD CONSTRAINT `families_ibfk_2` FOREIGN KEY (`littleId`) REFERENCES `Members` (`memberId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
