import React, { useState } from 'react';
import { X, Copy, Check, FileCode } from 'lucide-react';
import { SWIFT_FILES } from '../data/swiftCodeSnippets';
import { soundManager } from '../services/soundEffects';

interface SwiftCodeInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwiftCodeInspectorModal: React.FC<SwiftCodeInspectorModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('AscendModels.swift');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = SWIFT_FILES[selectedFile];

  const handleCopy = () => {
    soundManager.playHapticTap();
    if (currentFile) {
      navigator.clipboard.writeText(currentFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[85vh] bg-[#121214] border border-white/10 rounded-[32px] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center">
              <FileCode className="w-4 h-4 text-[#60A5FA]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Native iOS Codebase Inspector</h3>
              <p className="text-xs text-[#A1A1AA]">Swift 5.9 • SwiftUI • SwiftData • HealthKit Architecture</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playHapticTap();
              onClose();
            }}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-[#A1A1AA] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 min-h-0 flex flex-col sm:flex-row">
          {/* File Tree Sidebar */}
          <div className="w-full sm:w-56 border-b sm:border-b-0 sm:border-r border-white/10 p-3 space-y-1 overflow-y-auto bg-[#050507] shrink-0">
            <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block px-2 mb-1.5">
              Source Tree
            </span>
            {Object.keys(SWIFT_FILES).map((fname) => (
              <button
                key={fname}
                onClick={() => {
                  soundManager.playHapticTap();
                  setSelectedFile(fname);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                  selectedFile === fname
                    ? 'bg-[#3B82F6]/20 text-white font-bold border border-[#3B82F6]/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                    : 'text-[#A1A1AA] hover:bg-white/5 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0 text-[#60A5FA]" />
                <span className="truncate">{fname}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#050507]">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#18181B] shrink-0">
              <div className="min-w-0 pr-2">
                <span className="text-xs font-bold text-white font-mono block truncate">{currentFile?.path}</span>
                <span className="text-[10px] text-[#A1A1AA] block truncate">{currentFile?.description}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white font-semibold transition-all active:scale-95 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="flex-1 p-4 overflow-auto text-[11px] font-mono text-zinc-300 leading-relaxed select-text">
              <code>{currentFile?.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
