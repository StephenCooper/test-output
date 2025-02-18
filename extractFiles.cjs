const fs = require('fs');
const path = require('path');

// Directory to search for JSON files
const docsDir = '/Users/stephencooper/Workspace/doc-diff/test-output/docs';

// Function to process a single JSON file
const processJsonFile = (jsonFilePath) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Extract the files object
        const files = jsonData.files;

        // Check if files property exists
        if (!files) {
            // console.warn(`No files property found in ${jsonFilePath}`);
            return;
        }

        // Directory to save the extracted files
        const outputDir = path.dirname(jsonFilePath);

        // Iterate over the files object and create separate files
        for (const [fileName, fileContent] of Object.entries(files)) {
            const filePath = path.join(outputDir, fileName);
            fs.writeFile(filePath, fileContent, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing file ${fileName}:`, err);
                } else {
                    // console.log(`File ${fileName} created successfully.`);
                }
            });
        }
    });
};

// Function to recursively search for JSON files
const searchJsonFiles = (dir) => {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(dir, file.name);
            if (file.isDirectory()) {
                searchJsonFiles(filePath);
            } else if (file.isFile() && path.extname(file.name) === '.json') {
                processJsonFile(filePath);
            }
        });
    });
};

// Function to recursively search for and delete contents.json files
const deleteContentsJsonFiles = (dir) => {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(dir, file.name);
            if (file.isDirectory()) {
                deleteContentsJsonFiles(filePath);
            } else if (file.isFile() && file.name === 'contents.json') {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error deleting file ${filePath}:`, err);
                    } else {
                        // console.log(`File ${filePath} deleted successfully.`);
                    }
                });
            }
        });
    });
};

// delete files under /Users/stephencooper/Workspace/doc-diff/test-output/docs if it exists
if(fs.existsSync('/Users/stephencooper/Workspace/doc-diff/test-output/docs')){
    fs.rmdirSync('/Users/stephencooper/Workspace/doc-diff/test-output/docs', { recursive: true });
}

// copy docs directory from /Users/stephencooper/Workspace/latest/dist/generated-examples/ag-grid-docs/ to /Users/stephencooper/Workspace/doc-diff/test-output/
fs.cp('/Users/stephencooper/Workspace/latest/dist/generated-examples/ag-grid-docs/docs', '/Users/stephencooper/Workspace/doc-diff/test-output/docs', { recursive: true }, (err) => {
    if (err) {
        console.error('Error copying directory:', err);
        return;
    }

    // Start searching for JSON files
    searchJsonFiles(docsDir);

   // Delete contents.json files
   deleteContentsJsonFiles(docsDir);
});
