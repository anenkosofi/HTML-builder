const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const sourceFolder = path.join(__dirname, 'files');
  const destinationFolder = path.join(__dirname, 'files-copy');

  try {
    await fs.mkdir(destinationFolder, { recursive: true });

    const copyFiles = await fs.readdir(destinationFolder);

    for (const file of copyFiles) {
      await fs.rm(path.join(destinationFolder, file));
    }

    const sourceFiles = await fs.readdir(sourceFolder);

    for (const file of sourceFiles) {
      const sourceFilePath = path.join(sourceFolder, file);
      const destinationFilePath = path.join(destinationFolder, file);

      await fs.copyFile(sourceFilePath, destinationFilePath);
    }

    console.log('Directory copied successfully.');
  } catch (error) {
    console.error(`Error copying directory: ${error.message}`);
  }
}

copyDir();
