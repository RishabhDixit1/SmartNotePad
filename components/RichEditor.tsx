
import React from 'react';

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  isProcessing: boolean;
}

const RichEditor: React.FC<RichEditorProps> = ({ content, onChange, isProcessing }) => {
  return (
    <div className="flex-1 p-8 flex flex-col bg-white overflow-hidden">
      <textarea
        className={`flex-1 w-full text-lg leading-relaxed text-slate-700 resize-none outline-none bg-transparent placeholder-slate-300 custom-scrollbar ${
          isProcessing ? 'opacity-50 pointer-events-none' : ''
        }`}
        placeholder="Start writing your thoughts..."
        value={content}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
      {isProcessing && (
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center z-20">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
            <span className="text-indigo-600 font-medium text-sm">AI is thinking...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichEditor;
