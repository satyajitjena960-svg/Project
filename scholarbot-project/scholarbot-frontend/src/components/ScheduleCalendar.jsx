import React, { useState } from 'react';

export default function ScheduleCalendar({ syllabus }) {
  const [todos, setTodos] = useState([
    { id: 1, text: "Complete revision mock problem sets", subject: "General Analytics", completed: false }
  ]);
  const [newTodoText, setNewTodoText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos([...todos, {
      id: Date.now(),
      text: newTodoText,
      subject: selectedSubject || 'General Study Task',
      completed: false
    }]);
    setNewTodoText('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>🗓 Syllabus-Synced To-Do Console</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
        
        <form onSubmit={handleAddTodo} style={{ background: '#111318', borderRadius: '12px', border: '1px solid #1c1f26', padding: '1.25rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0' }}>Log Action Item</h4>
          <input type="text" style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #1c1f26', background: '#07080a', color: '#fff', marginBottom: '0.75rem' }} placeholder="What are you studying today?" value={newTodoText} onChange={e => setNewTodoText(e.target.value)} required />
          
          <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Link to Syllabus Subject Track:</label>
          <select style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #1c1f26', background: '#07080a', color: '#fff', marginBottom: '1rem' }} value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
            <option value="">-- Choose Connected Subject Track --</option>
            {syllabus.map((s, idx) => <option key={idx} value={s.name}>{s.name}</option>)}
          </select>
          
          <button type="submit" style={{ width: '100%', padding: '0.65rem', border: 'none', background: '#a855f7', color: '#fff', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>Commit Task</button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ margin: '0 0 0.25rem 0' }}>Active Execution Targets ({todos.length})</h4>
          {todos.map(t => (
            <div key={t.id} style={{ background: '#111318', borderRadius: '12px', border: '1px solid #1c1f26', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" checked={t.completed} onChange={() => toggleTodo(t.id)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                <span style={{ textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? '#414755' : '#fff', fontSize: '0.95rem' }}>{t.text}</span>
              </div>
              <span style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{t.subject}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}