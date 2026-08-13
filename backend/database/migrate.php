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

    // --- NEW PRE-FLIGHT CHECK: Prevent prefix collisions ---
    $prefixes = [];
    foreach ($migrationFiles as $file) {
        $basename = basename($file);
        // Extract everything before the first underscore (e.g., "008" or "008a")
        if (preg_match('/^([^_]+)_/', $basename, $matches)) {
            $prefix = $matches[1];
            if (isset($prefixes[$prefix])) {
                echo "❌ Migration Collision Detected!\n";
                echo "Multiple files share the prefix '{$prefix}_' (e.g., {$prefixes[$prefix]} and {$basename}).\n";
                echo "Please rename them to ensure strict execution order.\n";
                exit(1);
            }
            $prefixes[$prefix] = $basename;
        }
    }
    // -------------------------------------------------------

    $newMigrationsRun = 0;

    // 4. Loop through the files
    foreach ($migrationFiles as $file) {
        $fileName = basename($file);

        // If this file hasn't been executed yet, run it!
        if (!in_array($fileName, $executedMigrations)) {
            echo "⚙️  Migrating: $fileName...\n";
            
            $host = getenv('DB_HOST');
            $user = getenv('DB_USER');
            $pass = getenv('DB_PASS');
            $dbName = getenv('DB_NAME');
            
            // Check if mysql CLI is available in the system PATH
            $hasMysqlCli = false;
            if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                $hasMysqlCli = !empty(shell_exec("where mysql 2>nul"));
            } else {
                $hasMysqlCli = !empty(shell_exec("which mysql 2>/dev/null"));
            }

            if ($hasMysqlCli) {
                // Check client version to determine correct SSL disable flag (MariaDB vs MySQL)
                $mysqlVersion = shell_exec("mysql --version");
                $sslFlag = (stripos($mysqlVersion, 'MariaDB') !== false) ? "--skip-ssl" : "--ssl-mode=DISABLED";

                // CI/CD and Linux environments: Execute using the highly-reliable native MySQL client
                $command = "mysql $sslFlag -h " . escapeshellarg($host) . 
                           " -u " . escapeshellarg($user) . 
                           " -p" . escapeshellarg($pass) . 
                           " " . escapeshellarg($dbName) . 
                           " < " . escapeshellarg($file) . " 2>&1";
                           
                $output = shell_exec($command);
                
                if (strpos($output, 'ERROR') !== false && !strpos(strtoupper($output), 'ALREADY EXISTS')) {
                    throw new PDOException("MySQL CLI Error executing $fileName: " . $output);
                } else if (strpos(strtoupper($output), 'ALREADY EXISTS') !== false) {
                    echo "⚠️  Warning: Schema element already exists. Assuming success for $fileName\n";
                }
            } else {
                // FALLBACK: For teammates on Windows (XAMPP) who do not have mysql in their PATH.
                // Note: PDO::exec struggles with large multi-statement dumps, but works perfectly for incremental updates.
                $sql = file_get_contents($file);
                try {
                    $db->exec($sql);
                } catch (PDOException $innerE) {
                    $mysqlCode = $innerE->errorInfo[1] ?? null;
                    if (in_array($mysqlCode, [1050, 1060, 1061])) {
                        echo "⚠️  Warning: Schema element already exists. Assuming success for $fileName\n";
                    } else {
                        throw $innerE;
                    }
                }
            }
            
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