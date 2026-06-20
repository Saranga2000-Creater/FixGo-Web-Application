<?php
// Run this file from your terminal: php database/migrate.php

require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');
require_once __DIR__ . '/../config/Database.php';

echo "🚀 Starting Database Migrations...\n";

try {
    $db = (new Database())->connect();

    // 1. Create the 'migrations' tracking table if it doesn't exist
    $db->exec("
        CREATE TABLE IF NOT EXISTS migrations_tracker (
            id INT AUTO_INCREMENT PRIMARY KEY,
            migration_file VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // 2. Get all already-executed migrations from the database
    $stmt = $db->query("SELECT migration_file FROM migrations_tracker");
    $executedMigrations = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // 3. Scan the migrations folder for .sql files
    $migrationFiles = glob(__DIR__ . '/migrations/*.sql');
    sort($migrationFiles); // Ensure they run in alphabetical/numerical order

    $newMigrationsRun = 0;

    // 4. Loop through the files
    foreach ($migrationFiles as $file) {
        $fileName = basename($file);

        // If this file hasn't been executed yet, run it!
        if (!in_array($fileName, $executedMigrations)) {
            echo "⚙️  Migrating: $fileName...\n";
            
            // Read the SQL file
            $sql = file_get_contents($file);
            
            // Execute the SQL
            $db->exec($sql);
            
            // Record that we ran it so we never run it again
            $insertStmt = $db->prepare("INSERT INTO migrations_tracker (migration_file) VALUES (:file)");
            $insertStmt->execute([':file' => $fileName]);
            
            echo "✅ Success: $fileName\n";
            $newMigrationsRun++;
        }
    }

    if ($newMigrationsRun === 0) {
        echo "✨ Database is already up to date!\n";
    } else {
        echo "🎉 Finished! Executed $newMigrationsRun new migrations.\n";
    }

} catch (PDOException $e) {
    echo "❌ Migration Failed!\n";
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}


// ### Step 4: How Your Team Uses It
// Now, let's look at the workflow. Imagine your teammate wants to add a new column for "Customer Loyalty Points".

// 1. **They write the script:** They create `backend/database/migrations/002_add_loyalty_points.sql`.
// 2. **They push to Git:** They commit their code and push it to GitHub.
// 3. **You pull the code:** You pull their branch down to your localhost.
// 4. **You run the migrator:** You open your terminal, navigate to the backend folder, and run this simple command:

//    php database/migrate.php