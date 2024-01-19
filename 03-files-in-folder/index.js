const fs = require('fs/promises');
const path = require('path');

async function displayFileInfo() {
  const folderPath = path.join(__dirname, 'secret-folder');

  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(folderPath, file.name);

      if (file.isFile()) {
        const fileStats = await fs.stat(filePath);
        const fileSizeInKB = fileStats.size / 1024;

        console.log(
          `${file.name} - ${path
            .extname(file.name)
            .slice(1)} - ${fileSizeInKB.toFixed(3)}kb`,
        );
      } else {
        console.error(
          `Error: ${file.name} is a directory. Only files are allowed.`,
        );
      }
    }
  } catch (error) {
    console.error(`Error reading folder: ${error.message}`);
  }
}

displayFileInfo();
