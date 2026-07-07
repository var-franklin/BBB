import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';

const UploadBookPDFViewer = ({ pdfUrl }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  if (!pdfUrl) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-300">Page {currentPage}</span>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-300">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-700 mx-2" />
          <a
            href={pdfUrl}
            download
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Download PDF"
          >
            <Download className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto p-4">
        <div
          style={{
            width: `${zoom}%`,
            margin: '0 auto',
          }}
          className="bg-white rounded-lg shadow-lg"
        >
          <iframe
            src={`${pdfUrl}#page=${currentPage}`}
            className="w-full h-full min-h-screen rounded-lg"
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
};

export default UploadBookPDFViewer;