import fs from 'fs';
import path from 'path';

export const getImagePaths = (folderName: string): string[] => {
  const directoryPath = path.join(process.cwd(), 'public', 'images', 'Wordcount_Bargraphs', folderName);
  const fileNames = fs.readdirSync(directoryPath);
  return fileNames.map(fileName => `/images/Wordcount_Bargraphs/${folderName}/${fileName}`);
};
