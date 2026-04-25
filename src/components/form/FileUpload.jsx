import { useRef, useState } from "react";
import Button from "../common/Button";
import "../../styles/components/form/FileUpload.css";

/**
 * Drag-and-drop file input with click-to-select fallback. Accepts
 * CSV and Excel files and lets the parent hook the selection.
 */
const FileUpload = ({
	onFileSelect,
	accept = ".csv,.xlsx,.xls",
	uploadedFile = null,
	onRemoveFile,
	onDownloadTemplate,
}) => {
	const inputRef = useRef(null);
	const [dragOver, setDragOver] = useState(false);

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file) onFileSelect(file);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		const file = e.dataTransfer.files?.[0];
		if (file) onFileSelect(file);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setDragOver(true);
	};

	const handleDragLeave = () => setDragOver(false);

	const openPicker = () => inputRef.current?.click();

	const fileSizeText = (bytes) => {
		if (bytes < 1024) return `${bytes}B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
	};

	return (
		<div className="file-upload">
			<div
				className={`file-upload__dropzone ${dragOver ? "file-upload__dropzone--active" : ""}`}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
			>
				<div className="file-upload__icon" aria-hidden="true">
					<svg width="40" height="40" viewBox="0 0 24 24" fill="none">
						<path
							d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
				<div className="file-upload__title">Upload Site Information</div>
				<div className="file-upload__hint">
					Drag and drop your CSV or Excel file here, or click to select
				</div>
				<input
					ref={inputRef}
					type="file"
					accept={accept}
					onChange={handleFileChange}
					className="file-upload__input"
					aria-label="Choose a file to upload"
				/>
				<Button variant="primary" onClick={openPicker}>
					Select file
				</Button>
				{onDownloadTemplate && (
					<button
						type="button"
						className="file-upload__template"
						onClick={onDownloadTemplate}
					>
						Download CSV Template
					</button>
				)}
			</div>

			{uploadedFile && (
				<div className="file-upload__uploaded">
					<div className="file-upload__uploaded-label">Uploaded</div>
					<div className="file-upload__file">
						<span className="file-upload__file-icon" aria-hidden="true">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
								<path
									d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M14 2v6h6"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
						<span className="file-upload__file-name">{uploadedFile.name}</span>
						<span className="file-upload__file-size">
							{fileSizeText(uploadedFile.size)}
						</span>
						{onRemoveFile && (
							<button
								type="button"
								className="file-upload__remove"
								onClick={onRemoveFile}
								aria-label="Remove file"
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 14 14"
									aria-hidden="true"
								>
									<circle cx="7" cy="7" r="7" fill="currentColor" />
									<path
										d="M4.5 4.5 L9.5 9.5 M9.5 4.5 L4.5 9.5"
										stroke="#fff"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
								</svg>
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default FileUpload;
