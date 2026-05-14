import React from 'react';
import { X, File as FileIcon, Trash2 } from 'lucide-react';

interface FileListProps {
  files: { file: File, path: string }[];
  onRemove: (index: number) => void;
  onClearAll: () => void;
}

export function FileList({ files, onRemove, onClearAll }: FileListProps) {
  if (files.length === 0) {
    return null; /* or empty state if desired */
  }

  // Group files by top-level directory for a cleaner look if there are many files, 
  // or just show a scrollable list. Let's go with a scrollable list with tooltips.
  return (
    <div className="mt-4 flex flex-col w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[11px] font-bold text-[#F5F7F2] uppercase tracking-wider">
          Vybrané Súbory ({files.length})
        </h3>
        <button
          onClick={onClearAll}
          className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider"
          title="Odstrániť všetky súbory"
        >
          <Trash2 size={12} />
          <span>Vyčistiť Zoznam</span>
        </button>
      </div>
      
      <div className="max-h-[160px] overflow-y-auto custom-scrollbar border border-[#3E4B37] rounded-md bg-[#111111]/50 flex flex-col p-1 gap-1">
        {files.map((item, idx) => (
          <div 
            key={`${item.path}-${idx}`} 
            className="flex items-center justify-between p-1.5 hover:bg-[#3E4B37]/30 rounded transition-colors group"
          >
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              <FileIcon size={12} className="text-[#919B82] shrink-0" />
              <span className="text-[11px] text-[#F5F7F2] truncate font-mono" title={item.path}>
                {item.path}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-[9px] text-[#919B82] hidden group-hover:inline-block">
                {(item.file.size / 1024).toFixed(1)} KB
              </span>
              <button
                onClick={() => onRemove(idx)}
                className="text-[#919B82] hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center w-5 h-5 rounded hover:bg-black/20"
                title="Odstrániť súbor"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
