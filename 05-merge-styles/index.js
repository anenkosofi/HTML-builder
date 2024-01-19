const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  const sourceFolder = path.join(__dirname, 'styles');
  const destinationFolder = path.join(__dirname, 'project-dist');
  const outputFile = path.join(destinationFolder, 'bundle.css');

  try {
    await fs.mkdir(destinationFolder, { recursive: true });

    const files = await fs.readdir(sourceFolder);

    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    const styles = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(sourceFolder, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent;
      }),
    );

    await fs.writeFile(outputFile, styles.join('\n'));

    console.log('Styles merged successfully.');
  } catch (error) {
    console.error(`Error merging styles: ${error.message}`);
  }
}

mergeStyles();
