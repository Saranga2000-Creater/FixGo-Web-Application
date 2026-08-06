<?php
// Run this file from your terminal: php database/seed.php

require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');
require_once __DIR__ . '/../config/Database.php';

echo "🌱 Starting Database Seeding...\n";

try {
    $db = (new Database())->connect();

    // 1. Create the 'seeds' tracking table if it doesn't exist
    $db->exec("
        CREATE TABLE IF NOT EXISTS seeds_tracker (
            id INT AUTO_INCREMENT PRIMARY KEY,
            seed_file VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // 2. Get all already-executed seeds from the database
    $stmt = $db->query("SELECT seed_file FROM seeds_tracker");
    $executedSeeds = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // 3. Scan the seeds folder for .sql files
    $seedFiles = glob(__DIR__ . '/seeds/*.sql');
    sort($seedFiles); // Ensure they run in alphabetical/numerical order

    $newSeedsRun = 0;

    // 4. Loop through the files
    foreach ($seedFiles as $file) {
        $fileName = basename($file);

        // If this file hasn't been executed yet, run it!
        if (!in_array($fileName, $executedSeeds)) {
            echo "⚙️  Seeding: $fileName...\n";
            
            // Read the SQL file
            $sql = file_get_contents($file);
            
            try {
                // We need to disable foreign key checks temporarily because 
                // bulk inserting complex dumps might have circular dependencies or unordered references
                $db->exec("SET FOREIGN_KEY_CHECKS=0;");
                
                // Execute the SQL
                $db->exec($sql);
                
                $db->exec("SET FOREIGN_KEY_CHECKS=1;");
            } catch (PDOException $innerE) {
                $db->exec("SET FOREIGN_KEY_CHECKS=1;");
                throw $innerE; // It's a real error, abort!
            }
            
            // Record that we ran it so we never run it again
            $insertStmt = $db->prepare("INSERT INTO seeds_tracker (seed_file) VALUES (:file)");
            $insertStmt->execute([':file' => $fileName]);
            
            echo "✅ Success: $fileName\n";
            $newSeedsRun++;
        }
    }

    if ($newSeedsRun === 0) {
        echo "✨ Database is already fully seeded!\n";
    } else {
        echo "🎉 Finished! Executed $newSeedsRun new seeds.\n";
    }

} catch (PDOException $e) {
    echo "❌ Seeding Failed!\n";
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
