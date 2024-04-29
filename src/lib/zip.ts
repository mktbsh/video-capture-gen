import { AsyncZipOptions, zip } from "fflate";

export const compress = async (
  files: File[],
  filename: string,
  compressOptions: AsyncZipOptions | undefined = undefined
): Promise<File> => {
  try {
    const options = compressOptions || {};
    const fileContents: Record<string, Uint8Array> = {};
    const promises = files.map(async (f) => {
      const arrayBuffer = await f.arrayBuffer();
      fileContents[f.name] = new Uint8Array(arrayBuffer);
    });
    await Promise.all(promises);
    const zippedContent: Uint8Array = await new Promise((resolve, reject) => {
      zip(fileContents, options, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
    return new File([zippedContent], filename);
  } catch (err) {
    return Promise.reject(new Error(`compress failed: ${err}`));
  }
};
