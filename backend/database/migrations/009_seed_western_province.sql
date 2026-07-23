-- =================================================================
-- FixGo Database — Seed Data (Migration 009)
-- Western Province, Sri Lanka
-- 10 Shops | 3 Customers | 5 Service Requests | 4 Reviews
-- Default password for ALL accounts: "password"
-- Hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- =================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------
-- STEP 1: TRUNCATE (strict dependency order)
-- -----------------------------------------------------------------
TRUNCATE TABLE `history`;
TRUNCATE TABLE `notification`;
TRUNCATE TABLE `customerVehicle`;
TRUNCATE TABLE `reportedContent`;
TRUNCATE TABLE `review`;
TRUNCATE TABLE `serviceRequest`;
TRUNCATE TABLE `monthlyBill`;
TRUNCATE TABLE `shopServices`;
TRUNCATE TABLE `shopImage`;
TRUNCATE TABLE `shopVehicleCategories`;
TRUNCATE TABLE `shopCategoryMapping`;
TRUNCATE TABLE `shop`;
TRUNCATE TABLE `customer`;
TRUNCATE TABLE `admin`;
TRUNCATE TABLE `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------
-- STEP 2: USERS
-- IDs 1–10 = Shop Owners | 11–13 = Customers | 14 = Admin
-- -----------------------------------------------------------------
INSERT INTO `users` (`id`, `email`, `userRole`, `password`, `isActive`, `verification_token`, `is_email_verified`) VALUES
(1,  'ranjith.autoworks@gmail.com',    'shop_owner', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1),
(2,  'pradeep.motors@gmail.com',       'shop_owner', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1),
(3,  'hameed.spareparts@gmail.com',    'shop_owner', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1),
(4,  'suresh.servicecentre@gmail.com', 'shop_owner', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1),
(5,  'nalaka.kelaniya@gmail.com',      'shop_owner', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1),
(6,  'chaminda.moratuwa@gmail.com',    'shop_owner', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1),
(7,  'dasun.malabe@gmail.com',         'shop_owner', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1),
(8,  'thilina.gampaha@gmail.com',      'shop_owner', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1),
(9,  'rizwan.panadura@gmail.com',      'shop_owner', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1),
(10, 'lasantha.negombo@gmail.com',     'shop_owner', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1),
(11, 'kamal.perera@gmail.com',         'customer',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1),
(12, 'nirosha.fernando@gmail.com',     'customer',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1),
(13, 'tharaka.silva@gmail.com',        'customer',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1),
(14, 'admin@fixgo.lk',                 'admin',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL, 1);

-- -----------------------------------------------------------------
-- STEP 3: ADMIN
-- -----------------------------------------------------------------
INSERT INTO `admin` (`id`, `name`, `contactNumber`) VALUES
(14, 'FixGo System Admin', '0112223344');

-- -----------------------------------------------------------------
-- STEP 4: CUSTOMERS
-- id MUST equal users.id
-- -----------------------------------------------------------------
INSERT INTO `customer` (`id`, `name`, `contactNumber`, `address`, `profilePhoto`, `createdAt`, `cancellation_strikes`) VALUES
(11, 'Kamal Perera',     '0771234567', '12/3, Wijerama Road, Nugegoda',             NULL, '2026-06-01 08:00:00', 0),
(12, 'Nirosha Fernando', '0712345678', '45, Station Road, Dehiwala',                NULL, '2026-06-05 10:00:00', 0),
(13, 'Tharaka Silva',    '0763456789', '78, Lake Drive, Battaramulla, Colombo 20',  NULL, '2026-06-10 14:00:00', 0);

-- -----------------------------------------------------------------
-- STEP 5: SHOPS  (10 shops — Western Province)
-- id MUST equal users.id | POINT(longitude latitude)
-- -----------------------------------------------------------------
INSERT INTO `shop` (`id`, `name`, `address`, `contactNumber`, `owner`, `location`, `description`, `openTime`, `closeTime`, `isAvailable`, `carriageService`, `BRN`, `profileImageURL`, `default_driver_name`, `default_driver_phone`, `default_truck_brand`, `default_truck_color`, `tow_truck_plate`) VALUES
(1,  'Colombo Auto Works',
     '32, Galle Road, Kollupitiya, Colombo 03', '0112456789', 'Ranjith Perera',
     ST_GeomFromText('POINT(79.8481 6.9045)'),
     'Full-service garage specialising in engine overhaul, brake systems, and AC servicing.',
     '07:30:00', '18:00:00', 1, 0, 'PV/2019/1001', NULL, NULL, NULL, NULL, NULL, NULL),

(2,  'Nugegoda Motors',
     '45, High Level Road, Nugegoda', '0112889733', 'Pradeep Jayasinghe',
     ST_GeomFromText('POINT(79.8883 6.8728)'),
     'Trusted neighbourhood garage for quick repairs, oil changes, and tyre rotations.',
     '08:00:00', '18:30:00', 1, 0, 'PV/2018/2002', NULL, NULL, NULL, NULL, NULL, NULL),

(3,  'Lanka Spare Parts Hub',
     '210, Panchikawatte Road, Colombo 10', '0112445599', 'M.H.M. Hameed',
     ST_GeomFromText('POINT(79.8550 6.9419)'),
     'One-stop shop for genuine OEM spare parts, lubricants, and accessories for Japanese and Korean vehicles.',
     '08:30:00', '17:30:00', 1, 0, 'PV/2020/3003', NULL, NULL, NULL, NULL, NULL, NULL),

(4,  'Mount Lavinia Auto Service',
     '78, Galle Road, Mount Lavinia', '0112738899', 'Suresh Kumara',
     ST_GeomFromText('POINT(79.8652 6.8536)'),
     'Premium detailing, full body wash, interior cleaning, and computerised diagnostics.',
     '07:00:00', '19:00:00', 1, 0, 'PV/2017/4004', NULL, NULL, NULL, NULL, NULL, NULL),

(5,  'Kelaniya Auto Repair',
     '15, Kandy Road, Kelaniya', '0112912345', 'Nalaka Bandara',
     ST_GeomFromText('POINT(79.9217 6.9547)'),
     'Specialising in electrical systems, suspension, and exhaust repairs for all local brands.',
     '08:00:00', '17:00:00', 1, 0, 'PV/2021/5005', NULL, NULL, NULL, NULL, NULL, NULL),

(6,  'Moratuwa Quick Fix Garage',
     '22, Rawathawatte Road, Moratuwa', '0112645566', 'Chaminda Wickrama',
     ST_GeomFromText('POINT(79.8813 6.7735)'),
     'Fast, affordable repairs for all makes. Clutch replacements, gearboxes, and steering systems.',
     '07:30:00', '17:30:00', 1, 0, 'PV/2016/6006', NULL, NULL, NULL, NULL, NULL, NULL),

(7,  'Malabe Speed Auto Center',
     '56, Kaduwela Road, Malabe', '0114778899', 'Dasun Alwis',
     ST_GeomFromText('POINT(79.9706 6.9019)'),
     '24/7 roadside recovery and full mechanical garage. Tow truck on standby at all times.',
     '00:00:00', '23:59:59', 1, 1, 'PV/2022/7007',
     NULL, 'Roshan Dissanayake', '0778891234', 'Tata', 'Yellow', 'WP NA-7777'),

(8,  'Gampaha Vehicle Services',
     '118, Colombo Road, Gampaha', '0332223344', 'Thilina Rathnayake',
     ST_GeomFromText('POINT(79.9997 7.0917)'),
     'Full vehicle servicing, periodic maintenance, and wheel alignment for all passenger vehicles.',
     '08:00:00', '18:00:00', 1, 0, 'PV/2015/8008', NULL, NULL, NULL, NULL, NULL, NULL),

(9,  'Panadura Auto Spares',
     '67, Galle Road, Panadura', '0342567890', 'Rizwan Hamdhan',
     ST_GeomFromText('POINT(79.9032 6.7132)'),
     'Retail stockist of body panels, belts, filters, and lubricants for commercial and passenger vehicles.',
     '08:30:00', '17:00:00', 1, 0, 'PV/2014/9009', NULL, NULL, NULL, NULL, NULL, NULL),

(10, 'Negombo Auto Hub',
     '33, Colombo Road, Negombo', '0312234455', 'Lasantha Samaraweera',
     ST_GeomFromText('POINT(79.8358 7.2083)'),
     'General garage and roadside assistance for all vehicle types. Serving the Negombo coastal belt.',
     '07:30:00', '18:00:00', 1, 0, 'PV/2013/1010', NULL, NULL, NULL, NULL, NULL, NULL);

-- -----------------------------------------------------------------
-- STEP 6: SHOP CATEGORY MAPPINGS
-- shopCategory IDs: 1=Garages | 2=Service Centers | 3=Spare Parts
-- -----------------------------------------------------------------
INSERT INTO `shopCategoryMapping` (`shop_id`, `shop_category_id`) VALUES
(1, 1),   -- Colombo Auto Works        → Garages
(2, 1),   -- Nugegoda Motors           → Garages
(3, 3),   -- Lanka Spare Parts Hub     → Spare Parts
(4, 2),   -- Mount Lavinia Auto Service → Service Centers
(5, 1),   -- Kelaniya Auto Repair      → Garages
(6, 1),   -- Moratuwa Quick Fix        → Garages
(7, 1),   -- Malabe Speed Auto Center  → Garages
(8, 2),   -- Gampaha Vehicle Services  → Service Centers
(9, 3),   -- Panadura Auto Spares      → Spare Parts
(10, 1);  -- Negombo Auto Hub          → Garages

-- -----------------------------------------------------------------
-- STEP 7: SHOP VEHICLE CATEGORIES
-- vehicleCategory IDs: 1=3-Wheelers & Bikes | 2=4-Wheelers | 3=Commercial
-- -----------------------------------------------------------------
INSERT INTO `shopVehicleCategories` (`shop_id`, `vehicle_category_id`) VALUES
(1, 1), (1, 2),          -- Colombo Auto Works
(2, 1), (2, 2),          -- Nugegoda Motors
(3, 1), (3, 2), (3, 3),  -- Lanka Spare Parts Hub (all types)
(4, 2),                  -- Mount Lavinia (cars only)
(5, 1), (5, 2),          -- Kelaniya Auto Repair
(6, 1), (6, 2), (6, 3),  -- Moratuwa Quick Fix (all types)
(7, 1), (7, 2), (7, 3),  -- Malabe Speed Auto Center (all + tow)
(8, 2),                  -- Gampaha Vehicle Services
(9, 1), (9, 2), (9, 3),  -- Panadura Auto Spares (all types)
(10, 1), (10, 2);        -- Negombo Auto Hub

-- -----------------------------------------------------------------
-- STEP 8: SHOP SERVICES (sample services per shop)
-- -----------------------------------------------------------------
INSERT INTO `shopServices` (`shop_id`, `category`, `service_name`, `starting_price`, `duration`) VALUES
-- Shop 1: Colombo Auto Works
(1, 'Mechanical',    'Full Engine Tune-up',        'Rs. 8,500',  '3 Hours'),
(1, 'Mechanical',    'Brake Pad Replacement',       'Rs. 3,500',  '1 Hour'),
(1, 'Maintenance',   'Oil & Filter Change',         'Rs. 2,500',  '45 Mins'),
(1, 'Electrical',    'Electrical Diagnostics',      'Rs. 1,500',  '30 Mins'),
-- Shop 2: Nugegoda Motors
(2, 'Mechanical',    'Clutch Replacement',          'Rs. 12,000', '4 Hours'),
(2, 'Maintenance',   'Oil Change & Top-up',         'Rs. 2,000',  '30 Mins'),
(2, 'Mechanical',    'Tyre Rotation & Balancing',   'Rs. 1,200',  '45 Mins'),
-- Shop 3: Lanka Spare Parts Hub
(3, 'Parts Supply',  'Genuine Engine Oil (4L)',     'Rs. 3,800',  'In Stock'),
(3, 'Parts Supply',  'OEM Air Filter',              'Rs. 1,200',  'In Stock'),
(3, 'Parts Supply',  'Car Battery (Japanese)',      'Rs. 22,000', 'In Stock'),
-- Shop 4: Mount Lavinia Auto Service
(4, 'Detailing',     'Full Body Wash & Wax',        'Rs. 4,500',  '2 Hours'),
(4, 'Detailing',     'Interior Deep Clean',         'Rs. 6,500',  '3 Hours'),
(4, 'Maintenance',   'Periodic Service (Full)',     'Rs. 9,000',  '4 Hours'),
-- Shop 7: Malabe Speed Auto Center (tow-capable)
(7, 'Towing',        'Flatbed Tow (within 10km)',   'Rs. 4,500',  'Varies'),
(7, 'Towing',        'Flatbed Tow (10–25km)',        'Rs. 8,000',  'Varies'),
(7, 'Mechanical',    'Engine Diagnostics (OBD)',    'Rs. 2,500',  '1 Hour'),
(7, 'Mechanical',    'Suspension & Steering Check', 'Rs. 1,800',  '1 Hour'),
-- Shop 8: Gampaha Vehicle Services
(8, 'Maintenance',   'Full Vehicle Service',        'Rs. 7,500',  '3 Hours'),
(8, 'Mechanical',    'Wheel Alignment',             'Rs. 1,500',  '45 Mins'),
-- Shop 10: Negombo Auto Hub
(10, 'Mechanical',   'General Repairs',             'Rs. 3,000',  '2 Hours'),
(10, 'Maintenance',  'Oil Change',                  'Rs. 2,200',  '30 Mins');

-- -----------------------------------------------------------------
-- STEP 9: SHOP GALLERY IMAGES (placeholder paths)
-- -----------------------------------------------------------------
INSERT INTO `shopImage` (`shop_id`, `url`) VALUES
(1, 'uploads/gallery/shop1_front.jpg'),
(1, 'uploads/gallery/shop1_interior.jpg'),
(2, 'uploads/gallery/shop2_front.jpg'),
(4, 'uploads/gallery/shop4_detailing.jpg'),
(7, 'uploads/gallery/shop7_towtruck.jpg'),
(7, 'uploads/gallery/shop7_garage.jpg'),
(10,'uploads/gallery/shop10_front.jpg');

-- -----------------------------------------------------------------
-- STEP 10: SERVICE REQUESTS (4 Completed + 1 Cancelled)
-- Customer locations: Central Colombo area POINT(lng lat)
-- -----------------------------------------------------------------
INSERT INTO `serviceRequest` (
    `id`, `customer_id`, `shop_id`, `vehicle_category_id`,
    `vehicle_brand`, `vehicle_color`, `description`,
    `status`, `urgency_level`, `issue_category`, `requires_tow`,
    `location`, `pickup_landmark`,
    `preferred_date`, `preferred_time`,
    `photo`,
    `created_at`, `accepted_at`, `confirmed_at`, `completed_at`,
    `cancelled_at`, `cancelled_by`, `cancellation_reason`
) VALUES

-- SR 1: Kamal → Shop 1 (Colombo Auto Works) | Completed
(1, 11, 1, 2,
 'Toyota Vitz', 'Silver',
 'Engine making a rattling noise on startup. Needs full inspection.',
 'Completed', 'Normal', 'Engine', 0,
 ST_GeomFromText('POINT(79.8612 6.9271)'), 'Near Liberty Roundabout, Colombo 03',
 '2026-06-15', '10:00 AM - 12:00 PM',
 NULL,
 '2026-06-15 08:30:00', '2026-06-15 09:05:00', '2026-06-15 10:15:00', '2026-06-15 13:00:00',
 NULL, NULL, NULL),

-- SR 2: Nirosha → Shop 4 (Mount Lavinia Auto Service) | Completed
(2, 12, 4, 2,
 'Honda Fit', 'White',
 'Brake pads worn out. Squeaking sound when braking.',
 'Completed', 'Normal', 'Brakes', 0,
 ST_GeomFromText('POINT(79.8580 6.8620)'), 'Near Mount Lavinia Hotel junction',
 '2026-06-20', '02:00 PM - 04:00 PM',
 NULL,
 '2026-06-20 12:00:00', '2026-06-20 12:45:00', '2026-06-20 14:10:00', '2026-06-20 16:30:00',
 NULL, NULL, NULL),

-- SR 3: Tharaka → Shop 7 (Malabe Speed Auto Center) | Completed with tow
(3, 13, 7, 2,
 'Suzuki Alto', 'Blue',
 'Car broke down suddenly on Rajagiriya flyover. Needs tow and engine check.',
 'Completed', 'Urgent', 'Engine', 1,
 ST_GeomFromText('POINT(79.8986 6.9165)'), 'Rajagiriya flyover, near McDonalds',
 NULL, NULL,
 NULL,
 '2026-06-25 09:00:00', '2026-06-25 09:22:00', '2026-06-25 10:00:00', '2026-06-25 14:45:00',
 NULL, NULL, NULL),

-- SR 4: Kamal → Shop 2 (Nugegoda Motors) | Completed
(4, 11, 2, 2,
 'Nissan March', 'Black',
 'Routine oil change and tyre rotation needed before long trip.',
 'Completed', 'Normal', 'Maintenance', 0,
 ST_GeomFromText('POINT(79.8860 6.8700)'), 'Nugegoda Town, near Majestic City',
 '2026-07-01', '08:00 AM - 10:00 AM',
 NULL,
 '2026-07-01 07:00:00', '2026-07-01 07:30:00', '2026-07-01 08:15:00', '2026-07-01 10:00:00',
 NULL, NULL, NULL),

-- SR 5: Nirosha → Shop 5 (Kelaniya Auto Repair) | Cancelled
(5, 12, 5, 1,
 'Honda CB150R', 'Red',
 'Bike battery dead, cannot start. Need battery check and replacement.',
 'Cancelled', 'Normal', 'Electrical', 0,
 ST_GeomFromText('POINT(79.9150 6.9500)'), 'Kelaniya temple junction, main road',
 '2026-07-05', '03:00 PM - 05:00 PM',
 NULL,
 '2026-07-05 10:00:00', NULL, NULL, NULL,
 '2026-07-05 11:30:00', 'Customer', 'Found a closer mechanic to handle the issue.');

-- -----------------------------------------------------------------
-- STEP 11: REVIEWS (4 reviews linked to the 4 Completed requests)
-- review.unique_review = UNIQUE(service_request_id, customer_id)
-- -----------------------------------------------------------------
INSERT INTO `review` (`customer_id`, `shop_id`, `service_request_id`, `rating`, `comment`, `created_at`) VALUES

-- SR 1 → Shop 1 | Kamal | 5 stars
(11, 1, 1, 5,
 'Absolutely outstanding service! They identified the rattling noise within minutes — turned out to be a loose heat shield. Fixed quickly and at a very fair price. Will definitely return.',
 '2026-06-15 14:00:00'),

-- SR 2 → Shop 4 | Nirosha | 4 stars
(12, 4, 2, 4,
 'Very professional team and the service centre is clean and well-organised. Brake replacement was done perfectly. Slightly longer wait than expected but overall a great experience.',
 '2026-06-20 17:00:00'),

-- SR 3 → Shop 7 | Tharaka | 5 stars
(13, 7, 3, 5,
 'The tow truck arrived in under 25 minutes to Rajagiriya which I was amazed by. Engine diagnosis was thorough and the repair was completed the same day. Highly recommended for emergencies!',
 '2026-06-25 16:00:00'),

-- SR 4 → Shop 2 | Kamal | 4 stars
(11, 2, 4, 4,
 'Good service and friendly staff. Oil change and tyre rotation done well within the appointment time. Pricing is reasonable. The waiting area could be improved but minor complaint.',
 '2026-07-01 11:00:00');
