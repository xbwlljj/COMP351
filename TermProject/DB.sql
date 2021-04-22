-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 21, 2021 at 11:58 PM
-- Server version: 10.3.28-MariaDB-log
-- PHP Version: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bowenxue_nodemysql`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `customer_id` int(5) NOT NULL DEFAULT 0,
  `food_id` int(11) NOT NULL DEFAULT 0,
  `food_qty` int(11) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL DEFAULT 0,
  `customer_id` int(11) NOT NULL DEFAULT 0,
  `level_of_stars` varchar(255) NOT NULL DEFAULT '',
  `content` varchar(255) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `order_id`, `customer_id`, `level_of_stars`, `content`, `create_time`) VALUES
(1, 1, 2, '4', '1233', '2020-11-22 15:51:49');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT '',
  `firstname` varchar(255) NOT NULL DEFAULT '',
  `lastname` varchar(255) NOT NULL DEFAULT '',
  `gender` varchar(255) NOT NULL DEFAULT '',
  `birthday` varchar(255) NOT NULL DEFAULT '',
  `address` varchar(400) NOT NULL DEFAULT '',
  `postcode` varchar(255) NOT NULL DEFAULT '',
  `address2` varchar(255) NOT NULL DEFAULT '',
  `city` varchar(255) NOT NULL DEFAULT '',
  `state` varchar(255) NOT NULL DEFAULT '',
  `country` varchar(255) NOT NULL DEFAULT '',
  `phonenumber` varchar(255) NOT NULL DEFAULT '0',
  `email` varchar(255) NOT NULL DEFAULT '',
  `create_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_update_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `password`, `firstname`, `lastname`, `gender`, `birthday`, `address`, `postcode`, `address2`, `city`, `state`, `country`, `phonenumber`, `email`, `create_time`, `last_update_time`) VALUES
(1, '', '', '', '', '', '', '', '', '', '', '', '0', '1', '2020-11-22 02:47:36', '2020-11-22 02:47:36'),
(2, '111', '4', '5', '6', '10', '7', '9', '8', '11', '12', '13', '111', '111', '2020-11-22 03:08:26', '2020-11-22 03:08:26');

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE `food` (
  `id` int(11) NOT NULL,
  `food_name` varchar(255) NOT NULL DEFAULT '',
  `food_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `qty` int(11) NOT NULL DEFAULT 0,
  `food_image` varchar(255) NOT NULL DEFAULT '',
  `menu_id` int(11) NOT NULL DEFAULT 0,
  `create_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`id`, `food_name`, `food_price`, `qty`, `food_image`, `menu_id`, `create_time`) VALUES
(1, 'Beef-Wrap', 9.80, 20, '../image/burger/Beef-Wrap.jpg', 1, '2020-11-22 05:00:38'),
(2, 'Cod-Fish', 8.30, 20, '../image/burger/Cod-Fish.png', 1, '2020-11-22 05:00:59'),
(3, 'Double-Double', 2.30, 20, '../image/burger/Double-Double.jpg', 1, '2020-11-22 05:01:06'),
(4, 'Double-Beef', 3.40, 20, '../image/burger/Double-Beef.jpg', 1, '2020-11-22 05:01:15'),
(5, 'New-Orleans-Burger', 7.70, 20, '../image/burger/New-Orleans-Burger.jpg', 1, '2020-11-22 05:01:21'),
(6, 'Spicy-Chicken', 9.20, 20, '../image/burger/Spicy-Chicken.jpg', 1, '2020-11-22 05:01:23');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `menu_name` varchar(255) NOT NULL DEFAULT '',
  `image` varchar(255) NOT NULL DEFAULT '',
  `menu_description` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`id`, `menu_name`, `image`, `menu_description`) VALUES
(1, 'burger', '../image/burger/Cod-Fish.png', 'burger'),
(2, 'sides', '../image/sides/ChickenLeg.jpg', 'sides'),
(3, 'soft-drink', '../image/soft-drink/Cole.png', 'soft-drink');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `order_status` int(11) NOT NULL DEFAULT 0,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `shipped_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `cart_info` text DEFAULT NULL,
  `shipping_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `coupon_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cart_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payment_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `customer_id` int(11) NOT NULL DEFAULT 0,
  `receiver_name` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) DEFAULT '',
  `address` varchar(255) NOT NULL DEFAULT '',
  `phone` varchar(255) NOT NULL DEFAULT '',
  `card_number` varchar(255) NOT NULL DEFAULT '',
  `is_delete` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `order_status`, `order_date`, `shipped_date`, `cart_info`, `shipping_fee`, `coupon_fee`, `cart_fee`, `payment_amount`, `customer_id`, `receiver_name`, `email`, `address`, `phone`, `card_number`, `is_delete`) VALUES
(1, 0, '2020-11-22 14:45:59', '2020-11-22 14:45:59', '[{\"id\":1,\"food_name\":\"Beef-Wrap\",\"food_price\":9.8,\"qty\":20,\"food_image\":\"../image/burger/Beef-Wrap.jpg\",\"menu_id\":1,\"create_time\":\"2020-11-21T16:00:38.000Z\",\"food_qty\":1},{\"id\":3,\"food_name\":\"Double-Double\",\"food_price\":2.3,\"qty\":20,\"food_image\":\"../image/burger/Double-Double.jpg\",\"menu_id\":1,\"create_time\":\"2020-11-21T16:01:06.000Z\",\"food_qty\":3}]', 0.00, 0.10, 16.70, 16.80, 2, '1', '333', '2', '15261138211', '4', 0),
(2, 0, '2020-11-22 15:07:45', '2020-11-22 15:07:45', NULL, 0.00, 2.00, 0.00, 2.00, 2, '', '', '', '', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `questionID` int(11) NOT NULL,
  `content` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`questionID`, `content`) VALUES
(1, '\"Term Project Test\"-Bowen'),
(2, '\"I like Node JS\"-Xue'),
(13, 'test1'),
(14, 'test2'),
(15, 'test3'),
(16, 'PUT TEST');

-- --------------------------------------------------------

--
-- Table structure for table `score`
--

CREATE TABLE `score` (
  `scoreID` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `score` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `score`
--

INSERT INTO `score` (`scoreID`, `name`, `score`) VALUES
(1, 'Bowen', 100),
(8, 'final test', 10000000),
(7, 'AiboHuang', 100000),
(6, 'bowenxue', 15000),
(9, NULL, NULL),
(10, 'test', 123456),
(11, '123', 123);

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT '',
  `firstname` varchar(255) NOT NULL DEFAULT '',
  `lastname` varchar(255) NOT NULL DEFAULT '',
  `gender` varchar(255) NOT NULL DEFAULT '',
  `address` varchar(255) NOT NULL DEFAULT '',
  `postcode` varchar(255) NOT NULL DEFAULT '',
  `birthday` varchar(255) NOT NULL DEFAULT '',
  `phonenumber` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_id` (`customer_id`,`food_id`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`,`customer_id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `food`
--
ALTER TABLE `food`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`questionID`);

--
-- Indexes for table `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`scoreID`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `food`
--
ALTER TABLE `food`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `questionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `score`
--
ALTER TABLE `score`
  MODIFY `scoreID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
