
import React from 'react';
import { AIAction } from '../types';

interface SmartActionsProps {
  onAction: (action: AIAction) => void;
  isProcessing: boolean;
  error: string | null;
}

const SmartActions: React.FC<SmartActionsProps> = ({ onAction, isProcessing, error }) => {
  const actions: { id: AIAction; label: string; icon: string; color: string }[] = [
    { id: 'summarize', label: 'Summarize', icon: 'fa-list-ul', color: 'indigo' },
    { id: 'refine', label: 'Fix & Refine', icon: 'fa-wand-sparkles', color: 'purple' },
    { id: 'brainstorm', label: 'Brainstorm', icon: 'fa-lightbulb', color: 'amber' },
    { id: 'translate', label: 'To Spanish', icon: 'fa-language', color: 'emerald' },
    { id: 'shorter', label: 'Make Shorter', icon: 'fa-compress-alt', color: 'rose' },
    { id: 'longer', label: 'Expand Info', icon: 'fa-expand-alt', color: 'blue' },
  ];

  return (
    <div className="w-64 border-l border-slate-100 bg-slate-50/30 p-4 space-y-6">
      <div>
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Smart Tools</h4>
        <div className="grid grid-cols-1 gap-2">
          {actions.map(action => (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              disabled={isProcessing}
              className={`flex items-center p-3 rounded-lg text-sm font-medium transition-all group border border-transparent shadow-sm bg-white ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-100 hover:shadow-md active:scale-[0.98]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg bg-${action.color}-50 text-${action.color}-600 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                <i className={`fas ${action.icon}`}></i>
              </div>
              <span className="text-slate-600">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Attention</p>
          <p className="text-xs text-red-600 leading-tight">{error}</p>
        </div>
      )}

      <div className="pt-4 mt-auto">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl text-white shadow-lg">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-80">Pro Tip</p>
          <p className="text-xs font-medium leading-relaxed">
            Write down your raw thoughts and let AI handle the formatting and grammar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartActions;
