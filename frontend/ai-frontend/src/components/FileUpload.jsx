import { uploadFile } from "../services/api";

export default function FileUpload({ onUpload }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadFile(formData);
    onUpload(res.data);
  };

  return (
    <div className="card">
      <h3>Upload Dataset</h3>
      <input type="file" accept=".csv" onChange={handleUpload} />
    </div>
  );
}
