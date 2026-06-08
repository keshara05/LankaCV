import React, { useEffect } from 'react';
import WatermarkOverlay from './WatermarkOverlay';
import { getTemplateHtml } from './templates';

export default function PreviewContainer({ cvData }) {
  const htmlContent = getTemplateHtml(cvData.templateId || '1', cvData);

  // Anti-Theft Browser Keybind Overrides
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Block Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        alert("Printing direct draft previews is disabled. Please complete the setup and check out to download your high-res clean PDF!");
      }
      // Block Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      onContextMenu={handleContextMenu}
      className="w-full flex justify-center items-start select-none bg-slate-100 dark:bg-slate-950 p-6 min-h-screen overflow-y-auto"
      style={{ 
        userSelect: 'none', 
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* A4 Proportion Container */}
      <div 
        className="relative w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-800 shadow-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden flex flex-col rounded-md transition-all duration-300"
      >
        {/* Dynamic Watermark Overlay */}
        <WatermarkOverlay />

        {/* The CV template content rendered via direct HTML injection */}
        <div 
          className="z-10 flex-1 flex flex-col pointer-events-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
