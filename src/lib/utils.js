import { join } from 'path';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';

export const read = promisify(readFile);

export const write = promisify(writeFile);

export const loadTemplate = async target => {
  let data;
  try {
    data = await read(join(__dirname, 'templates', `${target}.iss`))
    data = data.toString();
  } catch (error) {
    throw error;
  }
  return data;
}
