<?php

class EnvLoader {
    public static function load($path) {
        if (!file_exists($path)) {
            throw new Exception(".env file not found at: " . $path);
        }

        // Read file line by line
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            // Skip comments starting with #
            if (strpos(trim($line), '#') === 0) {
                continue;
            }

            // Split by the first '=' found
            list($name, $value) = explode('=', $line, 2);
            
            $name = trim($name);
            $value = trim($value);

            // Strip optional wrapping quotes from values
            $value = trim($value, '"\'');

            // Set the environment variables globally, ONLY if they are not already set by the system (like Docker!)
            if (getenv($name) === false) {
                putenv(sprintf('%s=%s', $name, $value));
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
}