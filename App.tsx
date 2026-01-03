
import React, { useState, useEffect, useCallback } from 'react';
import { Note, AIAction } from './types';
import NoteSidebar from './components/NoteSidebar';
import RichEditor from './components/RichEditor';
import SmartActions from './components/SmartActions';
import { processNoteWithAI, generateTitle } from './services/geminiService';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('scribble-notes');
    if (saved) return JSON.parse(saved);
    return [{ id: '1', title: 'Welcome Note', content: 'Welcome to Scribble AI! Write your thoughts here and use the AI tools on the right to refine them.', updatedAt: Date.now() }];
  });
  
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('scribble-notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleUpdateContent = (content: string) => {
    setNotes(prev => prev.map(n => 
      n.id === activeNoteId ? { ...n, content, updatedAt: Date.now() } : n
    ));
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      updatedAt: Date.now()
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) return;
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(notes.find(n => n.id !== id)?.id || '');
    }
  };

  const handleAIAction = async (action: AIAction) => {
    if (!activeNote || !activeNote.content.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const result = await processNoteWithAI(activeNote.content, action);
      // We append or replace? Let's append for brainstorm, replace for refine/summarize
      const newContent = (action === 'brainstorm') 
        ? `${activeNote.content}\n\n---\nAI Suggestions:\n${result}`
        : result;
      
      handleUpdateContent(newContent);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoTitle = async () => {
    if (!activeNote || !activeNote.content.trim()) return;
    setIsProcessing(true);
    try {
      const title = await generateTitle(activeNote.content);
      setNotes(prev => prev.map(n => 
        n.id === activeNoteId ? { ...n, title, updatedAt: Date.now() } : n
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-slate-800 overflow-hidden">
      {/* Sidebar */}
      <NoteSidebar 
        notes={notes} 
        activeNoteId={activeNoteId} 
        onSelectNote={setActiveNoteId} 
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {activeNote ? (
          <>
            <div className="border-b border-slate-100 p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-10">
              <input 
                type="text" 
                value={activeNote.title}
                onChange={(e) => setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, title: e.target.value } : n))}
                className="text-xl font-bold bg-transparent outline-none w-full mr-4"
                placeholder="Title..."
              />
              <button 
                onClick={handleAutoTitle}
                disabled={isProcessing}
                className="text-xs text-indigo-600 font-medium hover:bg-indigo-50 px-2 py-1 rounded transition-colors whitespace-nowrap"
                title="Generate title using AI"
              >
                <i className="fas fa-magic mr-1"></i> Auto-Title
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <RichEditor 
                content={activeNote.content} 
                onChange={handleUpdateContent} 
                isProcessing={isProcessing}
              />
              
              <SmartActions 
                onAction={handleAIAction} 
                isProcessing={isProcessing}
                error={error}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Select or create a note to begin.
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
