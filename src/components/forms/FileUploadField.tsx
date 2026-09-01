import { useState, type ChangeEvent, type DragEvent } from "react";
import { File02, Trash01, UploadCloud01 } from "@untitledui/icons";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TOTAL_SIZE = 25 * 1024 * 1024;

type FileUploadFieldProps = {
  files: File[];
  error?: string;
  onChange: (files: File[]) => void;
  onError: (message: string) => void;
  onClearError: () => void;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadField({ files, error, onChange, onError, onClearError }: FileUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);

  function addFiles(selected: File[]) {
    const existingKeys = new Set(files.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
    const newFiles = selected.filter((file) => !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`));
    const combined = [...files, ...newFiles];

    if (combined.length > MAX_FILES) {
      onError(`Attach no more than ${MAX_FILES} files.`);
      return;
    }

    const oversized = newFiles.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      onError(`${oversized.name} exceeds the 10 MB per-file limit.`);
      return;
    }

    if (combined.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_SIZE) {
      onError("Combined file size cannot exceed 25 MB.");
      return;
    }

    onClearError();
    onChange(combined);
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    addFiles(selected);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  function removeFile(index: number) {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
    onClearError();
  }

  return (
    <div className="mp-file-field mp-field--full">
      <div className="mp-file-heading">
        <label htmlFor="attachments">Supporting documents <span>(optional)</span></label>
        <span className="mp-file-count" aria-live="polite">{files.length} of 3 files selected</span>
      </div>
      <input
        id="attachments"
        name="attachments"
        type="file"
        multiple
        className="mp-file-input"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "attachments-help attachments-error" : "attachments-help"}
        onChange={handleFiles}
      />
      <div
        className={`mp-file-dropzone${isDragging ? " is-dragging" : ""}${error ? " has-error" : ""}`}
        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false); }}
        onDrop={handleDrop}
      >
        <span className="mp-file-upload-icon" aria-hidden="true"><UploadCloud01 /></span>
        <div className="mp-file-drop-copy">
          <strong>{isDragging ? "Release to add your files" : "Drop supporting files here"}</strong>
          <p id="attachments-help">Any file type · 10 MB each · 25 MB total</p>
        </div>
        <label className="mp-file-choose" htmlFor="attachments">Choose files</label>
      </div>
      {error && <small id="attachments-error" className="mp-field-error">{error}</small>}
      {files.length > 0 && (
        <ul className="mp-file-list" aria-label="Selected supporting documents">
          {files.map((file, index) => (
            <li key={`${file.name}-${file.lastModified}-${index}`}>
              <span className="mp-file-type-icon" aria-hidden="true"><File02 /></span>
              <span className="mp-file-details"><strong>{file.name}</strong><small>{formatFileSize(file.size)}</small></span>
              <button type="button" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`} title="Remove file"><Trash01 aria-hidden="true" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
