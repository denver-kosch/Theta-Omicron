DROP DATABASE IF EXISTS ThetaOmicron;
CREATE DATABASE IF NOT EXISTS ThetaOmicron;
USE ThetaOmicron;
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 27, 2024 at 05:45 AM
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
(1, 3);

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
-- Table structure for table `Members`
--

CREATE TABLE `Members` (
  `memberId` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `status` enum('Pledge','Initiate','Alumus') NOT NULL,
  `phoneNum` varchar(20) NOT NULL,
  `streetAddress` varchar(100) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `postalCode` varchar(50) NOT NULL,
  `initiationYear` int(11) NOT NULL,
  `graduationYear` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Members`
--

INSERT INTO `Members` (`memberId`, `email`, `password`, `firstName`, `lastName`, `status`, `phoneNum`, `streetAddress`, `city`, `state`, `postalCode`, `initiationYear`, `graduationYear`) VALUES
(1, 'dkosch2@gmail.com', '$2b$10$TiUOc/pj19QgHOow5JEHnelptYQxf.yMtHPNe95yDX1Artf0KXH0u', 'Denver', 'Kosch', 'Initiate', '17402437103', '12227 Ohio Ave', 'Millersport', 'OH', '43046', 2022, 2025);

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
-- Indexes for table `Members`
--
ALTER TABLE `Members`
  ADD PRIMARY KEY (`memberId`);

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
  MODIFY `memberId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Chairmen`
--
ALTER TABLE `Chairmen`
  ADD CONSTRAINT `chairmen_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `Members` (`memberId`),
  ADD CONSTRAINT `chairmen_ibfk_2` FOREIGN KEY (`chairId`) REFERENCES `Chairs` (`chairId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
