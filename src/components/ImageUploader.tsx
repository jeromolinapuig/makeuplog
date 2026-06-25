type ImageUploaderProps = {
  label: string;
  multiple?: boolean;
  images: string[];
  onChange: (images: string[]) => void;
};

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({ label, multiple = false, images, onChange }: ImageUploaderProps) {
  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const selected = await Promise.all(Array.from(files).map(readFile));
    onChange(multiple ? [...images, ...selected] : selected.slice(0, 1));
  }

  return (
    <div className="image-uploader">
      <label>
        {label}
        <input type="file" accept="image/*" multiple={multiple} onChange={(event) => handleFiles(event.target.files)} />
      </label>
      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((image, index) => (
            <div key={`${image.slice(0, 24)}-${index}`} className="image-preview">
              <img src={image} alt={`${label} ${index + 1}`} />
              <button type="button" onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
