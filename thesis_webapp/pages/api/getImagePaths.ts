import { NextApiRequest, NextApiResponse } from 'next';
import { getImagePaths } from '../../lib/getImagePaths';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { folderName } = req.query;
  const imagePaths = getImagePaths(folderName as string);
  res.status(200).json(imagePaths);
}
