import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

const defaultOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

export async function compressImage(
  file: File,
  options?: CompressionOptions,
): Promise<File> {
  const compressionOptions = {
    ...defaultOptions,
    ...(options?.maxSizeMB && { maxSizeMB: options.maxSizeMB }),
    ...(options?.maxWidthOrHeight && {
      maxWidthOrHeight: options.maxWidthOrHeight,
    }),
  };

  try {
    const compressed = await imageCompression(file, compressionOptions);
    return new File([compressed], file.name, { type: compressed.type });
  } catch {
    return file;
  }
}
