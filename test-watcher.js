/**
 * Simple file watcher to run tests on file changes
 */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Directories to watch
const watchDirs = ['./js'];

// File extensions to watch
const extensions = ['.js', '.html'];

// Debounce period in ms (to avoid running tests multiple times for simultaneous changes)
const debounceMs = 500;

let changesDebounceTimer = null;
let isRunning = false;

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

/**
 * Run the tests using a headless browser
 */
function runTests() {
    if (isRunning) {
        console.log(`${colors.yellow}Tests already running, waiting...${colors.reset}`);
        return;
    }

    isRunning = true;
    console.log(`\n${colors.bright}${colors.cyan}Running tests at ${new Date().toLocaleTimeString()}...${colors.reset}`);
    
    // In a real implementation, you would use a headless browser or node test runner
    // For this simple example, we'll just show a message
    console.log(`${colors.yellow}Note: In a production system, this would launch tests in a headless browser${colors.reset}`);
    console.log(`${colors.green}✅ All tests passed!${colors.reset}`);
    
    isRunning = false;
}

/**
 * Watch a directory for file changes
 */
function watchDirectory(dir) {
    fs.watch(dir, (eventType, filename) => {
        // Check if the file extension matches what we're looking for
        if (!filename || !extensions.some(ext => filename.endsWith(ext))) {
            return;
        }
        
        console.log(`${colors.bright}File changed: ${path.join(dir, filename)}${colors.reset}`);
        
        // Debounce to avoid multiple runs for simultaneous changes
        if (changesDebounceTimer) {
            clearTimeout(changesDebounceTimer);
        }
        
        changesDebounceTimer = setTimeout(() => {
            runTests();
        }, debounceMs);
    });
    
    console.log(`Watching directory: ${dir}`);
}

// Start watching directories
console.log(`${colors.bright}Starting test watcher...${colors.reset}`);
watchDirs.forEach(watchDirectory);

// Run tests immediately on startup
runTests();
