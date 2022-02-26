import jsonfile from 'jsonfile';


// Constants
const dbFilePath = 'src/repos/database.json';


/**
 * Fetch the json from the file.
 */
function openDb(): Promise<Record<string, any>> {
    return jsonfile.readFile(dbFilePath);
}

/**
 * Update the file.
 */
function saveDb(db: Record<string, any>): Promise<void> {
    return jsonfile.writeFile(dbFilePath, db);
}


// Export default
export default {
    openDb,
    saveDb,
} as const;
