import React, { useState } from 'react';
import { Upload, File, X, Eye, Download } from 'lucide-react';

const UploadBookPDF = ({ onPDFChange, initialPDF = null }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(initialPDF);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const previewUrl = URL.createObjectURL(file);
      setPdfFile(file);
      setPdfPreview(previewUrl);
      
      if (onPDFChange) {
        onPDFChange(file);
      }
    } catch (err) {
      setError('Error processing file');
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    if (pdfPreview) {
      URL.revokeObjectURL(pdfPreview);
    }
    setPdfFile(null);
    setPdfPreview(null);
    if (onPDFChange) {
      onPDFChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="flex-1">
          <div className={`relative border-2 border-dashed rounded-lg p-6 
            ${pdfPreview ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'} 
            transition-colors cursor-pointer`}>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload className={`w-8 h-8 ${pdfPreview ? 'text-blue-500' : 'text-gray-400'}`} />
              {!pdfPreview && (
                <div className="text-sm text-gray-400">
                  <p className="font-medium">Click to upload PDF (Optional)</p>
                  <p className="text-xs">PDF (max. 10MB)</p>
                </div>
              )}
              {pdfPreview && (
                <div className="flex items-center gap-2 text-blue-500">
                  <File className="w-4 h-4" />
                  <span className="text-sm font-medium">PDF uploaded</span>
                </div>
              )}
            </div>
          </div>
        </label>

        {pdfPreview && (
          <button
            onClick={clearFile}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Remove PDF"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      {pdfPreview && pdfFile && (
        <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
          <File className="w-5 h-5 text-blue-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {pdfFile.name}
            </p>
            <p className="text-xs text-gray-400">
              {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={pdfPreview}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
              title="Preview PDF"
            >
              <Eye className="w-5 h-5" />
            </a>
            <a
              href={pdfPreview}
              download={pdfFile.name}
              className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadBookPDF;