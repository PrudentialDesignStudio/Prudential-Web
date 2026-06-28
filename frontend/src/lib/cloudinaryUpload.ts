// Direct browser → Cloudinary upload using an unsigned upload preset.
// No API secret is ever exposed here — the preset on Cloudinary's side
// controls what's allowed, which is the secure way to do client-side uploads.

const CLOUD_NAME = "dagt2a1w0";
const UPLOAD_PRESET = "pis_gallery";

export interface UploadResult {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
}

function resourceTypeFor(file: File): "image" | "video" {
  return file.type.startsWith("video/") ? "video" : "image";
}

export async function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const resourceType = resourceTypeFor(file);
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({ url: data.secure_url, publicId: data.public_id, resourceType });
      } else {
        reject(new Error(`Upload failed (${xhr.status}). Check your internet connection and try again.`));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed — check your internet connection and try again."));
    xhr.send(formData);
  });
}

// Uploads several files in parallel and reports per-file progress/results,
// so the UI can show a live status row for every item in a batch drop.
export async function uploadManyToCloudinary(
  files: File[],
  onFileProgress?: (index: number, percent: number) => void
): Promise<(UploadResult | { error: string })[]> {
  return Promise.all(
    files.map((file, i) =>
      uploadToCloudinary(file, (pct) => onFileProgress?.(i, pct)).catch((err) => ({
        error: err instanceof Error ? err.message : "Upload failed",
      }))
    )
  );
}
