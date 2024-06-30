import fs from 'fs';
import path from 'path';

export const getImagePaths = (dir: string): string[] => {
  const directoryPath = path.join(process.cwd(), 'public', dir);
  const fileNames = fs.readdirSync(directoryPath);
  return fileNames.map(fileName => `/${dir}/${fileName}`);
};