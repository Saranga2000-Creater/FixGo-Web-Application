-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 18, 2026 at 12:25 PM
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
-- Database: `fixgo_web`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `contactNumber` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `contactNumber`) VALUES
(5, 'System Admin', '0112223344');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `contactNumber` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `profilePhoto` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `name`, `contactNumber`, `address`, `profilePhoto`, `createdAt`) VALUES
(4, 'Sahan Kavinda', '0771234567', 'Menikhinna, Central Province', NULL, '2026-06-17 16:03:31'),
(7, 'Sahan Kavinda', '+94 77 123 4567', '29/115, Senagama', 'uploads/customers/customer_6a3278d9396727.19730139.jpeg', '2026-06-17 16:07:13'),
(10, 'fff', '23', 'ff', 'uploads/customers/customer_6a33bb8932fc96.74474615.jpg', '2026-06-18 15:04:01');

-- --------------------------------------------------------

--
-- Table structure for table `customerVehicle`
--

CREATE TABLE `customerVehicle` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `vehicle_category_id` int(11) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `service_request_id` int(11) DEFAULT NULL,
  `monthly_bill_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `monthlyBill`
--

CREATE TABLE `monthlyBill` (
  `id` int(11) NOT NULL,
  `shop_id` int(11) DEFAULT NULL,
  `service_charge_rule_id` int(11) DEFAULT NULL,
  `month` varchar(255) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `totalCompletedRequests` int(11) DEFAULT NULL,
  `totalAmount` double DEFAULT NULL,
  `paymentStatus` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `service_request_id` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `isRead` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reportedContent`
--

CREATE TABLE `reportedContent` (
  `id` int(11) NOT NULL,
  `reporter_user_id` int(11) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `reportedEntityType` varchar(255) DEFAULT NULL,
  `reported_entity_id` int(11) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `shop_id` int(11) DEFAULT NULL,
  `service_request_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `serviceChargeRule`
--

CREATE TABLE `serviceChargeRule` (
  `id` int(11) NOT NULL,
  `chargePerRequest` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `serviceRequest`
--

CREATE TABLE `serviceRequest` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `shop_id` int(11) DEFAULT NULL,
  `vehicle_category_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `urgency_level` varchar(20) DEFAULT 'Normal',
  `location` point DEFAULT NULL,
  `pickup_landmark` varchar(255) DEFAULT NULL,
  `preferred_date` date DEFAULT NULL,
  `preferred_time` varchar(50) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `vehicle_brand` varchar(255) DEFAULT NULL,
  `vehicle_color` varchar(255) DEFAULT NULL,
  `issue_category` varchar(100) DEFAULT NULL,
  `requires_tow` tinyint(1) DEFAULT 0,
  `dispatched_driver_name` varchar(255) DEFAULT NULL,
  `dispatched_driver_phone` varchar(255) DEFAULT NULL,
  `dispatched_truck_brand` varchar(255) DEFAULT NULL,
  `dispatched_truck_color` varchar(255) DEFAULT NULL,
  `dispatched_truck_plate` varchar(255) DEFAULT NULL,
  `promised_eta` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `accepted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `serviceRequest`
--

INSERT INTO `serviceRequest` (`id`, `customer_id`, `shop_id`, `vehicle_category_id`, `description`, `status`, `urgency_level`, `location`, `pickup_landmark`, `preferred_date`, `preferred_time`, `photo`, `vehicle_brand`, `vehicle_color`, `issue_category`, `requires_tow`, `dispatched_driver_name`, `dispatched_driver_phone`, `dispatched_truck_brand`, `dispatched_truck_color`, `dispatched_truck_plate`, `promised_eta`, `created_at`, `accepted_at`) VALUES
(13, 4, 2, 2, 'fff', 'Pending', 'Normal', 0x000000000101000000e78c28ed0dfe5340569fabadd89f1b40, NULL, '2026-06-19', '03:00 PM - 05:00 PM', NULL, 'ff', 'ff', 'Tire', 0, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-18 09:27:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `shop`
--

CREATE TABLE `shop` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contactNumber` varchar(255) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `location` point DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `openTime` time DEFAULT NULL,
  `closeTime` time DEFAULT NULL,
  `isAvailable` tinyint(1) DEFAULT NULL,
  `carriageService` tinyint(1) DEFAULT 0,
  `BRN` varchar(255) DEFAULT NULL,
  `profileImageURL` varchar(255) DEFAULT NULL,
  `default_driver_name` varchar(255) DEFAULT NULL,
  `default_driver_phone` varchar(255) DEFAULT NULL,
  `default_truck_brand` varchar(255) DEFAULT NULL,
  `default_truck_color` varchar(255) DEFAULT NULL,
  `tow_truck_plate` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shop`
--

INSERT INTO `shop` (`id`, `name`, `address`, `contactNumber`, `owner`, `location`, `description`, `openTime`, `closeTime`, `isAvailable`, `carriageService`, `BRN`, `profileImageURL`, `default_driver_name`, `default_driver_phone`, `default_truck_brand`, `default_truck_color`, `tow_truck_plate`) VALUES
(1, 'QuickFix Auto Garage', '15 Pepiliyana Road, Nugegoda', '0112889900', 'Sunil Perera', 0x00000000010100000046b6f3fdd4f8534083c0caa145761b40, 'General auto repair, engine tune-ups, undercarriage repairs, and mechanical fixes for all vehicle makes.', '08:00:00', '18:00:00', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Lanka Auto Spares', '220 Panchikawatte Road, Colombo 10', '0112445566', 'Rifkhan Ahmed', 0x0000000001010000005e4bc8073df75340d0d556ec2fbb1b40, 'Retailer of genuine and OEM spare parts for Japanese and European vehicles. Batteries, lubricants, and body panels.', '08:30:00', '17:30:00', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Hybrid Hub Service Center', '450 Galle Road, Mount Lavinia', '0112773322', 'Nuwan Jayasuriya', 0x0000000001010000008fc2f5285cf75340273108ac1c5a1b40, 'Specialized hybrid vehicle maintenance. Full body wash, interior detailing, oil changes, and computerized diagnostics.', '07:00:00', '19:00:00', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'Apex Recovery & Auto Malabe', '45 Kaduwela Rd, Malabe', '0114556677', 'Samantha Perera', 0x000000000101000000e78c28ed0dfe5340569fabadd89f1b40, '24/7 Towing and full-service mechanical garage specializing in rapid recovery.', '00:00:00', '23:59:59', 1, 1, NULL, NULL, 'Kamal Fernando', '0778899000', 'Tata', 'Yellow', 'WP NA-5522'),
(12, 'Aasanga Auto', '17, Kollupitiya, Colombo 7', '+94 77 123 4567', 'Asanga Bandara', 0x0000000001010000004fd49a8165f6534031b1aaaf40a51b40, 'We offer all kinds of garage services and tow truck transport', '08:00:00', '18:00:00', 1, 1, '', 'uploads/shopOwners/shop_6a33bd8beab136.51683093.jpg', 'Nimesh Senarath', '+94 75 127 8963', 'Toyota', 'White', 'WP TT - 1257');

-- --------------------------------------------------------

--
-- Table structure for table `shopCategory`
--

CREATE TABLE `shopCategory` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shopCategory`
--

INSERT INTO `shopCategory` (`id`, `name`, `description`) VALUES
(1, 'Garages', 'General automotive repair and mechanical fixes'),
(2, 'Service Centers', 'Washing, detailing, and routine maintenance'),
(3, 'Spare Parts', 'Retail auto parts, lubricants, and accessories');

-- --------------------------------------------------------

--
-- Table structure for table `shopCategoryMapping`
--

CREATE TABLE `shopCategoryMapping` (
  `id` int(11) NOT NULL,
  `shop_id` int(11) DEFAULT NULL,
  `shop_category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shopCategoryMapping`
--

INSERT INTO `shopCategoryMapping` (`id`, `shop_id`, `shop_category_id`) VALUES
(1, 1, 1),
(2, 2, 3),
(3, 3, 2),
(4, 4, 1),
(5, 12, 1);

-- --------------------------------------------------------

--
-- Table structure for table `shopImage`
--

CREATE TABLE `shopImage` (
  `id` int(11) NOT NULL,
  `shop_id` int(11) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shopServices`
--

CREATE TABLE `shopServices` (
  `id` int(11) NOT NULL,
  `shop_id` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `starting_price` varchar(50) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shopVehicleCategories`
--

CREATE TABLE `shopVehicleCategories` (
  `id` int(11) NOT NULL,
  `shop_id` int(11) DEFAULT NULL,
  `vehicle_category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shopVehicleCategories`
--

INSERT INTO `shopVehicleCategories` (`id`, `shop_id`, `vehicle_category_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 1),
(4, 2, 2),
(5, 2, 3),
(6, 3, 2),
(7, 4, 1),
(8, 4, 2),
(9, 4, 3),
(10, 12, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `userRole` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `userRole`, `password`, `isActive`) VALUES
(1, 'sunil.garage@test.com', 'shop_owner', 'password123', 1),
(2, 'rifkhan.spares@test.com', 'shop_owner', 'password123', 1),
(3, 'nuwan.service@test.com', 'shop_owner', 'password123', 1),
(4, 'customer@test.com', 'customer', 'password123', 1),
(5, 'admin@test.com', 'admin', 'admin123', 1),
(6, 'apex.recovery@test.com', 'shop_owner', 'password_hash_here', 1),
(7, 'sahankavi29@gmail.com', 'customer', '$2y$10$emjCyi6Z8mq7XK1DTYHEK.9TfwWbzyIR9y.zF0UCk/ZmnO/4Co4ki', 1),
(10, 'ff@gmail.com', 'customer', '$2y$10$0XBeBihofivU2CuipqAohOtpShIgCOC/ts5AGusN.pMIU8W1Z1VQG', 1),
(12, 'asanga@gmail.com', 'shop_owner', '$2y$10$B0vRvipErMC92aM8IZCVRev0LJeoXNVL20x5b..JCzuPIgv5xqRxC', 1);

-- --------------------------------------------------------

--
-- Table structure for table `vehicleCategory`
--

CREATE TABLE `vehicleCategory` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicleCategory`
--

INSERT INTO `vehicleCategory` (`id`, `name`, `description`) VALUES
(1, '3 Wheelers & Bikes', 'Motorcycles, scooters, and tuk-tuks'),
(2, '4 Wheelers', 'Cars, SUVs, vans, and standard passenger vehicles'),
(3, 'Commercial Vehicles', 'Lorrys, trucks, and busses');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customerVehicle`
--
ALTER TABLE `customerVehicle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `vehicle_category_id` (`vehicle_category_id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_request_id` (`service_request_id`),
  ADD KEY `monthly_bill_id` (`monthly_bill_id`);

--
-- Indexes for table `monthlyBill`
--
ALTER TABLE `monthlyBill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shop_id` (`shop_id`),
  ADD KEY `service_charge_rule_id` (`service_charge_rule_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `service_request_id` (`service_request_id`);

--
-- Indexes for table `reportedContent`
--
ALTER TABLE `reportedContent`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reporter_user_id` (`reporter_user_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `shop_id` (`shop_id`),
  ADD KEY `service_request_id` (`service_request_id`);

--
-- Indexes for table `serviceChargeRule`
--
ALTER TABLE `serviceChargeRule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `serviceRequest`
--
ALTER TABLE `serviceRequest`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `shop_id` (`shop_id`),
  ADD KEY `vehicle_category_id` (`vehicle_category_id`);

--
-- Indexes for table `shop`
--
ALTER TABLE `shop`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shopCategory`
--
ALTER TABLE `shopCategory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shopCategoryMapping`
--
ALTER TABLE `shopCategoryMapping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shop_id` (`shop_id`),
  ADD KEY `shop_category_id` (`shop_category_id`);

--
-- Indexes for table `shopImage`
--
ALTER TABLE `shopImage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shop_id` (`shop_id`);

--
-- Indexes for table `shopServices`
--
ALTER TABLE `shopServices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shop_id` (`shop_id`);

--
-- Indexes for table `shopVehicleCategories`
--
ALTER TABLE `shopVehicleCategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shop_id` (`shop_id`),
  ADD KEY `vehicle_category_id` (`vehicle_category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicleCategory`
--
ALTER TABLE `vehicleCategory`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customerVehicle`
--
ALTER TABLE `customerVehicle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `monthlyBill`
--
ALTER TABLE `monthlyBill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reportedContent`
--
ALTER TABLE `reportedContent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `serviceChargeRule`
--
ALTER TABLE `serviceChargeRule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `serviceRequest`
--
ALTER TABLE `serviceRequest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `shop`
--
ALTER TABLE `shop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `shopCategory`
--
ALTER TABLE `shopCategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `shopCategoryMapping`
--
ALTER TABLE `shopCategoryMapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `shopImage`
--
ALTER TABLE `shopImage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shopServices`
--
ALTER TABLE `shopServices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shopVehicleCategories`
--
ALTER TABLE `shopVehicleCategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `vehicleCategory`
--
ALTER TABLE `vehicleCategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`);

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`);

--
-- Constraints for table `customerVehicle`
--
ALTER TABLE `customerVehicle`
  ADD CONSTRAINT `customerVehicle_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  ADD CONSTRAINT `customerVehicle_ibfk_2` FOREIGN KEY (`vehicle_category_id`) REFERENCES `vehicleCategory` (`id`);

--
-- Constraints for table `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `history_ibfk_1` FOREIGN KEY (`service_request_id`) REFERENCES `serviceRequest` (`id`),
  ADD CONSTRAINT `history_ibfk_2` FOREIGN KEY (`monthly_bill_id`) REFERENCES `monthlyBill` (`id`);

--
-- Constraints for table `monthlyBill`
--
ALTER TABLE `monthlyBill`
  ADD CONSTRAINT `monthlyBill_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  ADD CONSTRAINT `monthlyBill_ibfk_2` FOREIGN KEY (`service_charge_rule_id`) REFERENCES `serviceChargeRule` (`id`);

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`service_request_id`) REFERENCES `serviceRequest` (`id`);

--
-- Constraints for table `reportedContent`
--
ALTER TABLE `reportedContent`
  ADD CONSTRAINT `reportedContent_ibfk_1` FOREIGN KEY (`reporter_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reportedContent_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  ADD CONSTRAINT `review_ibfk_3` FOREIGN KEY (`service_request_id`) REFERENCES `serviceRequest` (`id`);

--
-- Constraints for table `serviceRequest`
--
ALTER TABLE `serviceRequest`
  ADD CONSTRAINT `serviceRequest_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  ADD CONSTRAINT `serviceRequest_ibfk_2` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  ADD CONSTRAINT `serviceRequest_ibfk_3` FOREIGN KEY (`vehicle_category_id`) REFERENCES `vehicleCategory` (`id`);

--
-- Constraints for table `shop`
--
ALTER TABLE `shop`
  ADD CONSTRAINT `shop_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`);

--
-- Constraints for table `shopCategoryMapping`
--
ALTER TABLE `shopCategoryMapping`
  ADD CONSTRAINT `shopCategoryMapping_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  ADD CONSTRAINT `shopCategoryMapping_ibfk_2` FOREIGN KEY (`shop_category_id`) REFERENCES `shopCategory` (`id`);

--
-- Constraints for table `shopImage`
--
ALTER TABLE `shopImage`
  ADD CONSTRAINT `shopImage_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`);

--
-- Constraints for table `shopServices`
--
ALTER TABLE `shopServices`
  ADD CONSTRAINT `shopServices_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shopVehicleCategories`
--
ALTER TABLE `shopVehicleCategories`
  ADD CONSTRAINT `shopVehicleCategories_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  ADD CONSTRAINT `shopVehicleCategories_ibfk_2` FOREIGN KEY (`vehicle_category_id`) REFERENCES `vehicleCategory` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
