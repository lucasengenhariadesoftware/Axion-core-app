import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit3, Check, AlertTriangle } from 'lucide-react';

interface Note {
    id: string;
    title: string;
    content: string;
}

export function NotesAccordion() {
    const [isOpen, setIsOpen] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('axion_notes');
        if (saved) {
            try { setNotes(JSON.parse(saved)); } catch (e) {}
        }
    }, []);

    const saveNotes = (newNotes: Note[]) => {
        setNotes(newNotes);
        localStorage.setItem('axion_notes', JSON.stringify(newNotes));
    };

    const addNote = () => {
        if (!newTitle.trim()) {
            setIsAdding(false);
            return;
        }
        const newNote = { id: Date.now().toString(), title: newTitle, content: '' };
        saveNotes([...notes, newNote]);
        setNewTitle('');
        setIsAdding(false);
        setExpandedNoteId(newNote.id);
    };

    const updateNoteContent = (id: string, content: string) => {
        saveNotes(notes.map(n => n.id === id ? { ...n, content } : n));
    };

    const deleteNote = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNoteToDelete(id);
    };

    const confirmDelete = (id: string) => {
        saveNotes(notes.filter(n => n.id !== id));
        if (expandedNoteId === id) setExpandedNoteId(null);
        setNoteToDelete(null);
    };

    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            border: '1px solid #F3F4F6',
            overflow: 'hidden',
        }}>
            {/* Header / Trigger */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    padding: '20px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    background: isOpen ? '#F8FAFC' : '#ffffff',
                    transition: 'background 0.3s ease'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#EEF2FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Edit3 size={20} color="#4F46E5" />
                    </div>
                    <div>
                        <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#1E293B', margin: 0 }}>Minhas Anotações</h3>
                        <p style={{ fontSize: '12px', color: '#64748B', margin: 0, marginTop: '2px' }}>
                            {notes.length} {notes.length === 1 ? 'registro salvo' : 'registros salvos'}
                        </p>
                    </div>
                </div>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', background: isOpen ? '#E0E7FF' : '#F1F5F9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease'
                }}>
                    {isOpen ? <ChevronUp size={18} color="#4F46E5" /> : <ChevronDown size={18} color="#64748B" />}
                </div>
            </div>

            {/* Content Area */}
            {isOpen && (
                <div style={{ padding: '0 20px 20px 20px', background: '#F8FAFC' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                        {notes.map(note => {
                            const isExpanded = expandedNoteId === note.id;
                            const isDeleting = noteToDelete === note.id;
                            
                            return (
                                <div key={note.id} style={{ 
                                    background: '#ffffff',
                                    borderRadius: '16px',
                                    border: isExpanded ? '1px solid #C7D2FE' : '1px solid #E2E8F0',
                                    boxShadow: isExpanded ? '0 4px 12px rgba(79, 70, 229, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s ease'
                                }}>
                                    {/* Note Item Header */}
                                    <div 
                                        onClick={() => {
                                            if(!isDeleting) setExpandedNoteId(isExpanded ? null : note.id);
                                        }}
                                        style={{ 
                                            padding: '14px 16px', 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            cursor: isDeleting ? 'default' : 'pointer'
                                        }}
                                    >
                                        <span style={{ 
                                            fontWeight: 600, 
                                            fontSize: '15px', 
                                            color: isExpanded ? '#4F46E5' : '#334155'
                                        }}>
                                            {note.title}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {!isDeleting && (
                                                <button 
                                                    onClick={(e) => deleteNote(note.id, e)}
                                                    style={{ 
                                                        background: '#FFF1F2', 
                                                        border: 'none', 
                                                        color: '#E11D48', 
                                                        cursor: 'pointer', 
                                                        padding: '6px',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                            {isExpanded ? <ChevronUp size={18} color="#94A3B8" /> : <ChevronDown size={18} color="#94A3B8" />}
                                        </div>
                                    </div>

                                    {/* Delete Confirmation Inline */}
                                    {isDeleting && (
                                        <div style={{ padding: '0 16px 16px 16px', background: '#ffffff' }}>
                                            <div style={{ padding: '12px', background: '#FFF1F2', borderRadius: '12px', border: '1px solid #FECDD3' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                    <AlertTriangle size={18} color="#E11D48" />
                                                    <p style={{ margin: 0, fontWeight: 700, color: '#BE123C', fontSize: '14px' }}>Tem certeza que deseja apagar?</p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={(e) => { e.stopPropagation(); setNoteToDelete(null); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #FECDD3', background: 'white', color: '#BE123C', fontWeight: 600, cursor: 'pointer' }}>
                                                        Cancelar
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); confirmDelete(note.id); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#E11D48', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                                                        Sim, Apagar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Note Item Content */}
                                    {isExpanded && !isDeleting && (
                                        <div style={{ padding: '0 16px 16px 16px' }}>
                                            <div style={{ width: '100%', height: '1px', background: '#F1F5F9', marginBottom: '12px' }} />
                                            <textarea
                                                value={note.content}
                                                onChange={(e) => updateNoteContent(note.id, e.target.value)}
                                                placeholder="Adicione suas anotações aqui..."
                                                style={{
                                                    width: '100%',
                                                    minHeight: '120px',
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    border: '1px solid #E2E8F0',
                                                    background: '#F8FAFC',
                                                    resize: 'vertical',
                                                    fontFamily: 'inherit',
                                                    fontSize: '14px',
                                                    color: '#1E293B',
                                                    outline: 'none',
                                                    lineHeight: '1.5'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Add Note Button or Input */}
                        {isAdding ? (
                            <div style={{ 
                                display: 'flex', 
                                gap: '8px', 
                                marginTop: '4px',
                                background: '#ffffff',
                                padding: '8px',
                                borderRadius: '16px',
                                border: '1px solid #C7D2FE',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.08)'
                            }}>
                                <input 
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Qual é o título da anotação?"
                                    autoFocus
                                    style={{
                                        flex: 1,
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: '#F8FAFC',
                                        fontSize: '14px',
                                        outline: 'none',
                                        color: '#1E293B',
                                        fontWeight: 500
                                    }}
                                    onKeyPress={(e) => e.key === 'Enter' && addNote()}
                                />
                                <button 
                                    onClick={addNote} 
                                    style={{ 
                                        borderRadius: '12px', 
                                        background: '#4F46E5',
                                        color: 'white',
                                        border: 'none',
                                        width: '48px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Check size={20} />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsAdding(true)}
                                style={{ 
                                    width: '100%', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    gap: '8px', 
                                    marginTop: '8px',
                                    padding: '14px',
                                    background: '#EEF2FF',
                                    color: '#4F46E5',
                                    border: '1px dashed #A5B4FC',
                                    borderRadius: '16px',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Plus size={18} />
                                Criar Nova Anotação
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
