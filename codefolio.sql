-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 01, 2026 at 08:37 AM
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
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`Id`, `Name`, `Email`, `Phone`, `address`, `CreatedAt`) VALUES
(3, 'Teoh', 'weijieteoh26@gmail.com', '0124567288', '1, Lorong Jambu Madu 4, Taman Jambu Madu', '2026-03-31 01:08:16'),
(5, 'Edward', 'veronlee123@gmail.com', '012345454', '15600 Batu Kawan', '2026-03-31 12:33:46'),
(6, 'Alex', 'alexkoid12@gmail.com', '0172345688', '1, Lorong Jambu Madu 4', '2026-03-31 21:24:14');

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
(1, 'Alex Koid', 'Software Engineer', 'IT', 'Active', '2022-02-11', 3200.00),
(5, 'Kevin Lee', 'Mechanical Engineer', 'Engineering', 'Inactive', '2023-11-13', 5000.00),
(6, 'Veronica Lee', 'Planner', 'Project Management', 'Active', '2000-12-31', 3000.00),
(7, 'Teoh Wei Jie', 'Software Engineer', 'IT', 'Active', '2025-09-05', 3500.00),
(8, 'Goh', 'Sales Executive', 'Sales', 'Active', '2024-06-18', 3000.00);

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
('https://www.nbcnews.com/world/israel/israeli-police-block-catholic-figures-palm-sunday-mass-jerusalem-holy-rcna265669', 'Israeli police block Catholic figures from Palm Sunday Mass at Jerusalem\'s Holy Sepulchre - NBC News', 'World leaders have voiced concern after Israeli police prevented Cardinal Pierbattista Pizzaballa, the Latin patriarch of Jerusalem, from entering the Church of the Holy Sepulchre on Sunday', 'https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/rockcms/2026-03/260329-Pierbattista-Pizzaballa-vl-1007a-47568d.jpg', 'NBC News', '2026-03-30 08:23:00'),
('https://www.space.com/astronomy/exoplanets/scientists-discover-mirror-of-our-solar-system-in-2-exoplanets-forming-around-a-star', 'Scientists discover mirror of our solar system in 2 exoplanets forming around a star - Space', '\"WISPIT 2 is the best look into our own past that we have to date.\"', 'https://cdn.mos.cms.futurecdn.net/LC6gZzoFy552UZbD2nz3cm-1600-80.png', 'Space.com', '2026-03-24 21:00:00'),
('https://www.washingtonpost.com/national-security/2026/03/24/us-orders-82nd-airborne-iran-paratroopers-kharg/', 'Army paratroopers ordered to Middle East as U.S. weighs next move in Iran conflict - The Washington Post', 'The orders follow weeks of speculation about whether the 82nd Airborne Division would join the war, after its headquarters unit abruptly pulled out of a training exercise this month.', 'https://www.washingtonpost.com/wp-apps/imrs.php?src=https://cloudfront-us-east-1.images.arcpublishing.com/wapo/XY2WPWRQYYI6VFY3IO7MH74YMA.jpg&w=1440', 'The Washington Post', '2026-03-25 04:20:00'),
('https://www.washingtonpost.com/politics/2026/03/25/democrats-midterms-special-election-wins/', 'What a GOP loss in Trump’s Mar-a-Lago district says about the midterms - The Washington Post', 'Including off-year elections last year, Democrats have flipped 30 Republican seats since the start of 2025.', 'https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/UOBPG3JBDS6YOCWRFMFBBKUNPE_size-normalized.JPG&w=1440', 'The Washington Post', '2026-03-26 00:37:29');

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE `orderitems` (
  `Id` int(11) NOT NULL,
  `OrderId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderitems`
--

INSERT INTO `orderitems` (`Id`, `OrderId`, `ProductId`, `Quantity`, `Price`) VALUES
(15, 12, 1, 49, 3.50),
(16, 12, 2, 27, 2.00),
(17, 13, 1, 47, 3.50),
(18, 13, 2, 25, 2.00),
(19, 14, 1, 3, 3.50),
(20, 15, 1, 3, 3.50),
(22, 17, 3, 5, 200.00),
(23, 18, 1, 3, 3.50),
(24, 18, 3, 3, 200.00);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `Id` int(11) NOT NULL,
  `CustomerId` int(11) NOT NULL,
  `OrderDate` datetime DEFAULT current_timestamp(),
  `TotalAmount` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`Id`, `CustomerId`, `OrderDate`, `TotalAmount`) VALUES
(12, 5, '2026-03-31 14:04:03', 225.50),
(13, 5, '2026-03-31 14:04:09', 214.50),
(14, 3, '2026-03-31 14:04:23', 10.50),
(15, 3, '2026-03-31 14:05:12', 10.50),
(17, 5, '2026-03-31 21:35:46', 1000.00),
(18, 6, '2026-04-01 10:29:40', 610.50);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `SKU` varchar(50) DEFAULT NULL,
  `Category` varchar(50) DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL,
  `StockQuantity` int(11) NOT NULL DEFAULT 0,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `UpdatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`Id`, `Name`, `SKU`, `Category`, `Price`, `StockQuantity`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'Pencil', 'S34535', 'Office Supplies', 3.50, 3, '2026-03-31 01:17:39', '2026-04-01 10:29:41'),
(2, 'Eraser', '12351', 'Office Supplies', 2.00, 55, '2026-03-31 01:45:34', '2026-03-31 17:38:37'),
(3, 'Motherboard', 'ELE-6279', 'Electronics', 200.00, 92, '2026-03-31 17:33:34', '2026-04-01 10:29:41');

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
(2, 'Research', 'Read some books', 0, 1, 'red'),
(8, 'Shopping', '- Buy banana\n- Strawberries\n- milk', 1, 4, 'yellow'),
(9, 'Helo', 'Hello There', 1, 3, 'green'),
(11, 'task12', 'cook', 0, 0, 'yellow');

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
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`Id`);

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
-- Indexes for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `OrderId` (`OrderId`),
  ADD KEY `ProductId` (`ProductId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `CustomerId` (`CustomerId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `SKU` (`SKU`);

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
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`Id`),
  ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`ProductId`) REFERENCES `products` (`Id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`CustomerId`) REFERENCES `customers` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
