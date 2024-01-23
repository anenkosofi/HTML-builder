const fs = require('fs/promises');
const path = require('path');

async function buildPage() {
  const sourceFolder = path.join(__dirname);
  const destinationFolder = path.join(sourceFolder, 'project-dist');
  const templateFilePath = path.join(sourceFolder, 'template.html');
  const indexFilePath = path.join(destinationFolder, 'index.html');
  const assetsFolder = path.join(sourceFolder, 'assets');
  const assetsOutputFolder = path.join(destinationFolder, 'assets');

  try {
    await fs.mkdir(destinationFolder, { recursive: true });

    const templateContent = await fs.readFile(templateFilePath, 'utf-8');

    const componentTags = templateContent.match(/{{\s*([^}\s]+)\s*}}/g);

    if (componentTags) {
      let modifiedContent = templateContent;
      for (const tag of componentTags) {
        const componentName = tag.match(/{{\s*([^}\s]+)\s*}}/)[1];
        const componentFilePath = path.join(
          sourceFolder,
          'components',
          `${componentName}.html`,
        );
        const componentContent = await fs.readFile(componentFilePath, 'utf-8');
        modifiedContent = modifiedContent.replace(tag, componentContent);
      }

      await fs.writeFile(indexFilePath, modifiedContent);
      console.log('index.html created successfully.');
    }

    const stylesSourceFolder = path.join(sourceFolder, 'styles');
    const stylesDestinationFolder = destinationFolder;
    const stylesOutputFile = path.join(stylesDestinationFolder, 'style.css');

    const files = await fs.readdir(stylesSourceFolder);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    const styles = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(stylesSourceFolder, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent;
      }),
    );
    await fs.writeFile(stylesOutputFile, styles.join('\n'));
    console.log('style.css created successfully.');

    const copyAssets = async (source, destination) => {
      const copyFiles = await fs.readdir(destination);

      for (const file of copyFiles) {
        await fs.rm(path.join(destination, file));
      }

      const entries = await fs.readdir(source, { withFileTypes: true });

      for (const entry of entries) {
        const sourcePath = path.join(source, entry.name);
        const destinationPath = path.join(destination, entry.name);

        if (entry.isDirectory()) {
          await fs.mkdir(destinationPath, { recursive: true });
          await copyAssets(sourcePath, destinationPath);
        } else {
          await fs.copyFile(sourcePath, destinationPath);
        }
      }
    };

    await copyAssets(assetsFolder, assetsOutputFolder);
    console.log('assets folder copied successfully.');

    console.log('Build process completed successfully.');
  } catch (error) {
    console.error(`Error building page: ${error.message}`);
  }
}

buildPage();
