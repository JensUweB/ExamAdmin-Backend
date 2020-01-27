import { v4 } from 'uuid';

/**
 * Changes a given file name to an unique file name. Keeps the given file type.
 * Returns an relative path with unique filename
 * @param subFolder The subfolder in uploads/ directory
 * @param filename The name of the uploaded file.
 */
export async function normalizeFileUri(subFolder: string, filename: string): Promise<string> {
        // Create an new unique file name
        const id = v4();
        const fileArray = filename.split('.');
        const fileEnd = fileArray[fileArray.length-1];
        const newfilename = id + '.' + fileEnd.toLocaleLowerCase();
        const relativePath = __dirname + `/../../uploads/${subFolder}/${newfilename}`;   
        return relativePath;     
} 