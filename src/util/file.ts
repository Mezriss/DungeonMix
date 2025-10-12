import type { FileInfo } from "@/state";

export async function getFileHandleFromPath(
  rootDirHandle: FileSystemDirectoryHandle,
  path: string,
): Promise<FileSystemFileHandle> {
  // Normalize the path by removing leading slashes and splitting by the separator.
  const pathParts = path.replace(/^\//, "").split("/");
  const fileName = pathParts.pop(); // The last part is the filename.
  pathParts.shift(); //discarding root directory

  if (!fileName) {
    throw new Error("Path does not point to a file.");
  }

  let currentDirHandle = rootDirHandle;

  for (const dirName of pathParts) {
    currentDirHandle = await currentDirHandle.getDirectoryHandle(dirName, {
      create: false,
    });
  }

  const fileHandle = await currentDirHandle.getFileHandle(fileName, {
    create: false,
  });

  return fileHandle;
}

const SUPPORTED_FORMATS = ["mp3", "wav", "ogg", "m4a", "flac", "aac"];

export async function* getFilesRecursively(
  entry: FileSystemDirectoryHandle | FileSystemFileHandle,
  basePath = "",
): AsyncGenerator<{ file: File; path: string; format: string }> {
  if (entry.kind === "file") {
    const file = await entry.getFile();
    if (file !== null) {
      const extension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf(".") + 1);
      if (SUPPORTED_FORMATS.includes(extension)) {
        yield { file, format: extension, path: basePath };
      }
    }
  } else if (entry.kind === "directory") {
    const newPath = basePath ? `${basePath}/${entry.name}` : entry.name;
    for await (const handle of entry.values()) {
      yield* getFilesRecursively(handle, newPath);
    }
  }
}

export async function getFileList(
  handle: FileSystemDirectoryHandle,
): Promise<FileInfo[]> {
  const files: FileInfo[] = [];
  for await (const { file, path } of getFilesRecursively(handle)) {
    const fullPath = path ? `${path}/${file.name}` : file.name;

    files.push({
      name: file.name,
      path: fullPath,
    });
  }
  files.sort((a, b) => a.path.localeCompare(b.path));

  return files;
}
