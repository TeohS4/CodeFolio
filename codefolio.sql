-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 29, 2026 at 11:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `codefolio`
--

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `job_title` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL,
  `join_date` date DEFAULT NULL,
  `salary` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `job_title`, `department`, `status`, `join_date`, `salary`) VALUES
(1, 'Alex Koid', 'Software Engineer', 'IT', 'Active', '2022-02-12', 3100.00),
(5, 'Kevin Lee', 'Mechanical Engineer', 'Engineering', 'Inactive', '2023-11-13', 5000.00),
(6, 'Veronica Lee', 'Planner', 'Project Management', 'Active', '2000-12-31', 3000.00),
(7, 'Teoh Wei Jie', 'Software Engineer', 'IT', 'Active', '2025-09-05', 3500.00),
(8, 'Goh', 'Sales Executive', 'Sales', 'Inactive', '2024-06-19', 3000.00);

-- --------------------------------------------------------

--
-- Table structure for table `news_bookmark`
--

CREATE TABLE `news_bookmark` (
  `url` varchar(500) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `url_to_image` varchar(500) DEFAULT NULL,
  `source_name` varchar(100) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news_bookmark`
--

INSERT INTO `news_bookmark` (`url`, `title`, `description`, `url_to_image`, `source_name`, `published_at`) VALUES
('https://news.harvard.edu/gazette/story/2026/03/seal-doctor-astronaut-harvard-alumni-day-speaker/', 'SEAL, doctor, astronaut, Harvard Alumni Day speaker - Harvard University', 'Jonny Kim will address Harvard’s global alumni community.', 'https://news.harvard.edu/wp-content/uploads/2026/03/Kim-in-space.jpg', 'Harvard School of Engineering and Applied Sciences', '2026-03-24 18:29:01'),
('https://www.space.com/astronomy/exoplanets/scientists-discover-mirror-of-our-solar-system-in-2-exoplanets-forming-around-a-star', 'Scientists discover mirror of our solar system in 2 exoplanets forming around a star - Space', '\"WISPIT 2 is the best look into our own past that we have to date.\"', 'https://cdn.mos.cms.futurecdn.net/LC6gZzoFy552UZbD2nz3cm-1600-80.png', 'Space.com', '2026-03-24 21:00:00'),
('https://www.washingtonpost.com/national-security/2026/03/24/us-orders-82nd-airborne-iran-paratroopers-kharg/', 'Army paratroopers ordered to Middle East as U.S. weighs next move in Iran conflict - The Washington Post', 'The orders follow weeks of speculation about whether the 82nd Airborne Division would join the war, after its headquarters unit abruptly pulled out of a training exercise this month.', 'https://www.washingtonpost.com/wp-apps/imrs.php?src=https://cloudfront-us-east-1.images.arcpublishing.com/wapo/XY2WPWRQYYI6VFY3IO7MH74YMA.jpg&w=1440', 'The Washington Post', '2026-03-25 04:20:00'),
('https://www.washingtonpost.com/politics/2026/03/25/democrats-midterms-special-election-wins/', 'What a GOP loss in Trump’s Mar-a-Lago district says about the midterms - The Washington Post', 'Including off-year elections last year, Democrats have flipped 30 Republican seats since the start of 2025.', 'https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/UOBPG3JBDS6YOCWRFMFBBKUNPE_size-normalized.JPG&w=1440', 'The Washington Post', '2026-03-26 00:37:29');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `done` tinyint(1) DEFAULT 0,
  `position` int(11) NOT NULL,
  `priority` varchar(10) DEFAULT 'green'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `name`, `description`, `done`, `position`, `priority`) VALUES
(2, 'Research', 'Read some books', 0, 2, 'red'),
(6, 'Exercise2', 'Test exercise2', 0, 0, 'green'),
(8, 'Shopping', '- Buy banana\n- Strawberries\n- milk', 1, 3, 'yellow'),
(9, 'Helo', 'Hello There', 1, 4, 'green');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'test', '1234', '2026-03-29 08:42:37');

-- --------------------------------------------------------

--
-- Table structure for table `watchlist`
--

CREATE TABLE `watchlist` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `overview` text DEFAULT NULL,
  `poster_path` varchar(255) DEFAULT NULL,
  `release_date` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `watchlist`
--

INSERT INTO `watchlist` (`id`, `title`, `overview`, `poster_path`, `release_date`, `created_at`) VALUES
(557, 'Spider-Man', 'After being bitten by a genetically altered spider at Oscorp, nerdy but endearing high school student Peter Parker is endowed with amazing powers to become the superhero known as Spider-Man.', '/kjdJntyBeEvqm9w97QGBdxPptzj.jpg', '2002-05-01', '2026-03-25 16:15:26'),
(1724, 'The Incredible Hulk', 'Scientist Bruce Banner scours the planet for an antidote to the unbridled force of rage within him: the Hulk. But when the military masterminds who dream of exploiting his powers force him back to civilization, he finds himself coming face to face with a new, deadly foe.', '/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg', '2008-06-12', '2026-03-26 07:23:59'),
(10195, 'Thor', 'Against his father Odin\'s will, The Mighty Thor - a powerful but arrogant warrior god - recklessly reignites an ancient war. Thor is cast down to Earth and forced to live among humans as punishment. Once here, Thor learns what it takes to be a true hero when the most dangerous villain of his world sends the darkest forces of Asgard to invade Earth.', '/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg', '2011-04-21', '2026-03-25 13:35:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news_bookmark`
--
ALTER TABLE `news_bookmark`
  ADD PRIMARY KEY (`url`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
