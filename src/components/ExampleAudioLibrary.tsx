import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { get, set } from "idb-keyval";
import styles from "./ExampleAudioLibrary.module.css";
import { getFilesRecursively, getFileHandleFromPath } from "../util/file";

interface AudioFile {
  name: string;
  file: File;
  url: string;
  path: string;
  format: string;
}

interface PlayingAudio {
  howl: Howl;
  name: string;
}

const STORAGE_KEY = "dungeonmix-directory-handle";

export default function AudioLibrary() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<PlayingAudio | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const dragCounter = useRef(0);
  const [isDragOver, setIsDragOver] = useState(false);

  // Load persisted directory handle on component mount
  useEffect(() => {
    const loadPersistedDirectory = async () => {
      try {
        const handle = await getPersistedDirectoryHandle();
        if (handle) {
          await loadAudioFiles(handle);
        }
      } catch (error) {
        console.warn("Failed to load persisted directory:", error);
        // Clear invalid handle from storage
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    loadPersistedDirectory();
  }, []);

  const getPersistedDirectoryHandle =
    async (): Promise<FileSystemDirectoryHandle | null> => {
      const handle = (await get(
        STORAGE_KEY,
      )) as FileSystemDirectoryHandle | null;
      if (!handle) return null;

      const hasPermission = await handle.queryPermission({ mode: "read" });
      if (hasPermission === "granted") {
        return handle;
      }

      return null;
    };

  const persistDirectoryHandle = async (handle: FileSystemDirectoryHandle) => {
    try {
      await set(STORAGE_KEY, handle);
    } catch (error) {
      console.warn("Failed to persist directory handle:", error);
    }
  };

  const loadAudioFiles = async (handle: FileSystemDirectoryHandle) => {
    setIsLoading(true);
    setError(null);

    try {
      const files: AudioFile[] = [];

      for await (const { file, path, format } of getFilesRecursively(handle)) {
        const url = URL.createObjectURL(file);
        const fullPath = path ? `${path}/${file.name}` : file.name;

        files.push({
          name: file.name,
          file,
          url,
          path: fullPath,
          format,
        });
      }

      // Sort files alphabetically by path
      files.sort((a, b) => a.path.localeCompare(b.path));
      setAudioFiles(files);
    } catch (error) {
      console.error("Error loading audio files:", error);
      setError("Failed to load audio files from the selected directory.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectDirectory = async () => {
    try {
      setError(null);
      if (!window.showDirectoryPicker) {
        throw new Error("File System Access API not supported");
      }
      const handle = await window.showDirectoryPicker({
        mode: "read",
      });
      console.info(handle.name);
      await persistDirectoryHandle(handle);
      await loadAudioFiles(handle);
    } catch (error: unknown) {
      const err = error as { name?: string };
      if (err.name !== "AbortError") {
        console.error("Error selecting directory:", error);
        setError("Failed to select directory. Please try again.");
      }
    }
  };

  const playAudio = async (audioFile: AudioFile) => {
    // Stop current audio if playing
    if (currentlyPlaying) {
      currentlyPlaying.howl.stop();
    }

    const dirHandle = await getPersistedDirectoryHandle();
    const fileHandle = await getFileHandleFromPath(dirHandle!, audioFile.path);
    const src = URL.createObjectURL(await fileHandle.getFile());

    const howl = new Howl({
      src: [src], //[audioFile.url],
      format: [audioFile.format],
      html5: true,
      onplay: () => {
        setCurrentlyPlaying({ howl, name: audioFile.name });
      },
      onend: () => {
        setCurrentlyPlaying(null);
      },
      onloaderror: (_id: number, error: unknown) => {
        console.error("Audio playback error:", error);
        setCurrentlyPlaying(null);
        setError(`Failed to play ${audioFile.name}`);
      },
      onplayerror: (_id: number, error: unknown) => {
        console.error("Audio playback error:", error);
        setCurrentlyPlaying(null);
        setError(`Failed to play ${audioFile.name}`);
      },
    });

    howl.play();
  };

  const stopAudio = () => {
    if (currentlyPlaying) {
      currentlyPlaying.howl.stop();
      setCurrentlyPlaying(null);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer?.types.includes("Files")) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    try {
      const items = Array.from(e.dataTransfer.items);

      for (const item of items) {
        if (item.kind === "file") {
          if (item.getAsFileSystemHandle) {
            const handle = await item.getAsFileSystemHandle();
            if (handle && handle.kind === "directory") {
              const dirHandle = handle as unknown as FileSystemDirectoryHandle;
              await persistDirectoryHandle(dirHandle);
              await loadAudioFiles(dirHandle);
              return;
            }
          }
        }
      }

      setError("Please drop a folder containing audio files.");
    } catch (error) {
      console.error("Error handling dropped directory:", error);
      setError("Failed to access the dropped folder.");
    }
  };

  // Cleanup URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      audioFiles.forEach((file) => {
        URL.revokeObjectURL(file.url);
      });
      if (currentlyPlaying) {
        currentlyPlaying.howl.stop();
      }
    };
  }, [audioFiles, currentlyPlaying]);

  const isAudioCurrentlyPlaying = (fileName: string) => {
    return currentlyPlaying?.name === fileName;
  };

  if (audioFiles.length === 0 && !isLoading) {
    return (
      <div
        className={`${styles.audioLibrary} ${isDragOver ? styles.dragOver : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div>Give DungeonMix access to a folder with your audio files.</div>
        <div>
          Drag and drop a folder or{" "}
          <button onClick={selectDirectory} disabled={isLoading}>
            browse
          </button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    );
  }

  return (
    <div className={styles.audioLibrary}>
      <div className={styles.header}>
        <h3>Audio Library</h3>
        <button
          onClick={selectDirectory}
          disabled={isLoading}
          className={styles.changeButton}
        >
          Change Folder
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {isLoading && (
        <div className={styles.loading}>Loading audio files...</div>
      )}

      {audioFiles.length > 0 && (
        <div className={styles.fileList}>
          <div className={styles.stats}>
            {audioFiles.length} audio file{audioFiles.length !== 1 ? "s" : ""}{" "}
            found
          </div>

          {audioFiles.map((audioFile, index) => (
            <div key={index} className={styles.fileItem}>
              <div className={styles.fileName}>
                <div className={styles.name}>{audioFile.name}</div>
                <div className={styles.path}>{audioFile.path}</div>
              </div>

              <div className={styles.controls}>
                {isAudioCurrentlyPlaying(audioFile.name) ? (
                  <button
                    onClick={stopAudio}
                    className={`${styles.button} ${styles.stopButton}`}
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={() => playAudio(audioFile)}
                    className={`${styles.button} ${styles.playButton}`}
                  >
                    Play
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
