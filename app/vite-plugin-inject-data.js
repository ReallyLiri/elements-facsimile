import fs from 'fs';
import path from 'path';

export function injectDataPlugin() {
  return {
    name: 'inject-data',
    resolveId(id) {
      if (id === 'virtual:pdf-data') {
        return id;
      }
      if (id === 'virtual:diagram-data') {
        return id;
      }
      if (id === 'virtual:diagram-images') {
        return id;
      }
    },
    load(id) {
      if (id === 'virtual:pdf-data') {
        return generatePdfData();
      }
      if (id === 'virtual:diagram-data') {
        return generateDiagramData();
      }
      if (id === 'virtual:diagram-images') {
        return generateDiagramImages();
      }
    }
  };
}

function generatePdfData() {
  const docsDir = path.resolve('../docs');
  const diagramsDir = path.resolve('../docs/diagrams');

  const pdfFiles = fs.readdirSync(docsDir)
    .filter(file => file.endsWith('.pdf'))
    .map(file => file.replace('.pdf', ''));

  const diagramKeys = fs.readdirSync(diagramsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const pdfData = pdfFiles.map(key => ({
    key,
    hasDigrams: diagramKeys.includes(key)
  })).sort((a, b) => a.key.localeCompare(b.key));

  return `export const pdfData = ${JSON.stringify(pdfData, null, 2)};`;
}

function generateDiagramData() {
  const diagramsDir = path.resolve('../docs/diagrams');

  const diagramKeys = fs.readdirSync(diagramsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const diagramData = {};
  diagramKeys.forEach(key => {
    const title = key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
    diagramData[key] = {
      title,
      description: `Diagrams and illustrations from the ${title} edition`
    };
  });

  return `export const diagramData = ${JSON.stringify(diagramData, null, 2)};`;
}

function generateDiagramImages() {
  const diagramsDir = path.resolve('../docs/diagrams');
  const diagramImages = {};

  const diagramKeys = fs.readdirSync(diagramsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  diagramKeys.forEach(key => {
    const cropsDir = path.resolve(diagramsDir, key, 'crops');
    if (fs.existsSync(cropsDir)) {
      const images = fs.readdirSync(cropsDir)
        .filter(file => file.endsWith('.jpg'))
        .sort((a, b) => {
          const aInfo = parseImageName(a);
          const bInfo = parseImageName(b);

          const aPage = parseInt(aInfo.pageNumber) || 0;
          const bPage = parseInt(bInfo.pageNumber) || 0;

          if (aPage !== bPage) {
            return aPage - bPage;
          }

          if (aInfo.classification !== bInfo.classification) {
            return aInfo.classification.localeCompare(bInfo.classification);
          }

          const aIndex = parseInt(aInfo.index) || 0;
          const bIndex = parseInt(bInfo.index) || 0;
          return aIndex - bIndex;
        });

      diagramImages[key] = images;
    }
  });

  return `export const diagramImages = ${JSON.stringify(diagramImages, null, 2)};`;
}

function parseImageName(filename) {
  const nameWithoutExt = filename.replace('.jpg', '');
  const parts = nameWithoutExt.split('_');

  if (parts.length >= 3) {
    const pageNumber = parts[0];
    const index = parts[parts.length - 1];
    const classification = parts.slice(1, -1).join('_');

    return {
      pageNumber,
      classification,
      index,
      displayName: `Page ${pageNumber} - ${classification} ${index}`
    };
  }

  return {
    pageNumber: '',
    classification: '',
    index: '',
    displayName: filename
  };
}