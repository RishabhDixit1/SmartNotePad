
import React from 'react';
import { Note } from '../types';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
}

const NoteSidebar: React.FC<SidebarProps> = ({ notes, activeNoteId, onSelectNote, onCreateNote, onDeleteNote }) => {
  return (
    <aside className="w-72 border-r border-slate-100 flex flex-col bg-slate-50/50">
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-indigo-600">Scribble AI</h1>
        <button 
          onClick={onCreateNote}
          className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
          title="New Note"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1">
        {notes.sort((a, b) => b.updatedAt - a.updatedAt).map(note => (
          <div 
            key={note.id}
            onClick={() => onSelectNote(note.id)}
            className={`group p-3 rounded-xl cursor-pointer transition-all ${
              activeNoteId === note.id 
                ? 'bg-white shadow-sm border border-slate-200 ring-1 ring-slate-200' 
                : 'hover:bg-slate-100 border border-transparent'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className={`font-semibold text-sm truncate pr-4 ${activeNoteId === note.id ? 'text-indigo-600' : 'text-slate-700'}`}>
                {note.title || 'Untitled Note'}
              </h3>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                className={`text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs`}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
            <p className="text-xs text-slate-400 truncate">
              {note.content.substring(0, 60) || 'No content yet...'}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 text-[10px] text-slate-400 font-medium uppercase tracking-widest text-center">
        Powered by Gemini 3 Flash
      </div>
    </aside>
  );
};

export default NoteSidebar;
