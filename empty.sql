-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 01, 2013 at 12:35 PM
-- Server version: 5.5.24-log
-- PHP Version: 5.3.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ubilibrary`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE IF NOT EXISTS `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) NOT NULL,
  `name` varchar(256) COLLATE utf8_swedish_ci NOT NULL,
  `author_fn` varchar(64) COLLATE utf8_swedish_ci NOT NULL,
  `author_sn` varchar(64) COLLATE utf8_swedish_ci NOT NULL,
  `abstract` varchar(4096) COLLATE utf8_swedish_ci NOT NULL,
  `publisher` varchar(64) COLLATE utf8_swedish_ci NOT NULL,
  `length` varchar(64) COLLATE utf8_swedish_ci NOT NULL,
  `language` varchar(64) COLLATE utf8_swedish_ci NOT NULL,
  `tags` varchar(8192) COLLATE utf8_swedish_ci NOT NULL,
  `location` varchar(16) COLLATE utf8_swedish_ci NOT NULL,
  `picture` varchar(256) COLLATE utf8_swedish_ci NOT NULL,
  `rating` float NOT NULL,
  `rating_count` float NOT NULL,
  `category` varchar(64) COLLATE utf8_swedish_ci NOT NULL,
  `subcategory` varchar(64) COLLATE utf8_swedish_ci NOT NULL,
  `isbn` varchar(16) COLLATE utf8_swedish_ci NOT NULL,
  `type` varchar(64) COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `book_id` (`book_id`),
  FULLTEXT KEY `tags` (`tags`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci AUTO_INCREMENT=2193 ;

-- --------------------------------------------------------

--
-- Table structure for table `stats`
--

CREATE TABLE IF NOT EXISTS `stats` (
  `id` varchar(16) COLLATE utf8_swedish_ci NOT NULL,
  `name` varchar(32) COLLATE utf8_swedish_ci NOT NULL,
  `age` varchar(32) COLLATE utf8_swedish_ci NOT NULL,
  `gender` varchar(32) COLLATE utf8_swedish_ci NOT NULL,
  `start` int(11) NOT NULL,
  `click` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
