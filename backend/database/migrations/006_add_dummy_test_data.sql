-- 1. Give a couple of other shops a profile image so they aren't blank
UPDATE shop SET profileImageURL = 'uploads/shopOwners/default_garage.jpg' WHERE id IN (1, 4);

-- 2. Populate Gallery Images (shopImage table)
INSERT INTO shopImage (shop_id, url) VALUES 
(12, 'uploads/gallery/shop12_img1.jpg'),
(12, 'uploads/gallery/shop12_img2.jpg'),
(1, 'uploads/gallery/shop1_img1.jpg');

-- 3. Populate Services (shopServices table)
INSERT INTO shopServices (shop_id, category, service_name, starting_price, duration) VALUES 
(12, 'Mechanical', 'Full Engine Tune-up', 'Rs. 5,000', '2 Hours'),
(12, 'Electrical', 'Battery Replacement', 'Rs. 1,500', '30 Mins'),
(12, 'Maintenance', 'Oil Change & Filter', 'Rs. 3,000', '45 Mins'),
(12, 'Towing', 'Flatbed Towing', 'Rs. 4,000', 'Varies');

-- 4. Create Service Requests to test the 'Completion Rate' Math
INSERT INTO serviceRequest (id, customer_id, shop_id, vehicle_category_id, description, status, created_at) VALUES 
(14, 4, 12, 2, 'Engine making a weird noise', 'Completed', '2026-05-10 10:00:00'),
(15, 7, 12, 1, 'Flat tire replacement', 'Completed', '2026-05-15 14:30:00'),
(16, 10, 12, 2, 'Brake pad replacement', 'Completed', '2026-06-01 09:15:00'),
(17, 4, 12, 2, 'Canceled by user', 'Canceled', '2026-06-05 11:00:00'); 

-- 5. Add Reviews linked to those completed requests
INSERT INTO review (customer_id, shop_id, service_request_id, rating, comment) VALUES 
(4, 12, 14, 5, 'Absolutely brilliant service! The tow truck arrived in 15 minutes and the repair was flawless. Highly recommended.'),
(7, 12, 15, 4, 'Good service, but the pricing was slightly higher than expected. Very professional though.'),
(10, 12, 16, 5, 'Quick and efficient brake replacement. The staff was very friendly and explained everything clearly.');