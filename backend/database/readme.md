markdown_content = """# 🚀 FixGo Database Migration Guide

To prevent "Unknown column" errors and ensure every developer's localhost database is perfectly synchronized, we have moved away from manually making changes in phpMyAdmin. Instead, all database changes are tracked as code.

Please read this guide carefully before making any changes to the database.

---

## 🛠️ Phase 1: Initial Setup (Getting the Complete DB)

If you are setting up the project for the first time, or transitioning to this new migration system, you need to sync your database with the official baseline (`001_initial_baseline.sql`).

### For the Rest of the Team (The Great Reset):
1. Pull the latest code: `git pull origin development`
2. Open your local **phpMyAdmin**.
3. Go to the `fixgo` database, select **all** existing tables, and click **Drop**. *(You need a totally blank database to start).*
4. Open your terminal, navigate to the `backend` folder, and run: php database/migrate.php

### How to Modify the Database (Creating a New Migration)

🚨 IMPORTANT: Never use phpMyAdmin to manually add or edit columns.

1. Navigate to your backend/database/migrations/ folder.
2. Create a new .sql file and number it sequentially. (Example: If the last file was 001, name yours "002_add_loyalty_points.sql" **critical-exactly follow this naming format**).
3. Write your raw MySQL command inside this new file.
    (Example: ALTER TABLE customer ADD COLUMN loyalty_points INT DEFAULT 0;)
4. Open your terminal, navigate to the backend folder, and test your new file locally by running:

    php database/migrate.php

5. Commit the new .sql file to Git and push your code to the repository.
    (Remember: Once a file is pushed, you cannot edit it. If you made a mistake, create a new file like 003_fix_mistake.sql).

### How to Sync Your Database (Migrating After a Teammate's Update)

If a teammate adds a new database feature and pushes it to Git, you must sync your local database to match theirs so your app does not crash.

1. Switch to your development branch ( or the branch you want to pull on) and pull the latest code:

    git pull origin development

2. Open your terminal, navigate to the backend folder, and run the migration script:

    php database/migrate.php

    (The script will automatically check your tracker table, skip the old migrations you already have, and securely apply only the new ones your teammate wrote).