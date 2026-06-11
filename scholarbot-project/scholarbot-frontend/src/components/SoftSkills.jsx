import React, { useState } from 'react';
import axios from 'axios';

export default function SoftSkills() {
  const [selectedSkill, setSelectedSkill] = useState('star');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const triggerAiCoach = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsLoading(true);
    setAiFeedback('');
    try {
      const res = await axios.post('http://localhost:8080/api/platform/ai/chat', { 
        message: `Provide soft-skill coaching regarding this scenario under the lens of ${selectedSkill === 'star' ? 'Behavioral STAR interviewing models' : 'High-Impact Engineering Presentations'}: ${aiPrompt}`
      });
      setAiFeedback(res.data.response);
    } catch (err) {
      setAiFeedback("AI Coach timeout context. Please check that your API endpoints are clear.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>🧩 Leadership & Soft Skills Vault</h1>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button onClick={() => { setSelectedSkill('star'); setAiFeedback(''); }} style={{ padding: '0.55rem 1.25rem', border: '1px solid #1c1f26', background: selectedSkill === 'star' ? '#a855f7' : '#111318', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>STAR Behavioral Model</button>
        <button onClick={() => { setSelectedSkill('presentation'); setAiFeedback(''); }} style={{ padding: '0.55rem 1.25rem', border: '1px solid #1c1f26', background: selectedSkill === 'presentation' ? '#a855f7' : '#111318', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Technical Systems Delivery</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: '#111318', borderRadius: '12px', border: '1px solid #1c1f26', padding: '1.25rem' }}>
          <h4>Ask your AI Soft-Skill Coach</h4>
          <textarea style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #1c1f26', background: '#07080a', color: '#fff', marginTop: '0.5rem', resize: 'vertical' }} rows="5" placeholder={selectedSkill === 'star' ? "Paste a draft answer for a behavioral question (e.g. 'Tell me about a time you handled a group project bug'...)" : "Paste your layout slide topic descriptions to evaluate clarity curves..."} value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}></textarea>
          <button onClick={triggerAiCoach} disabled={isLoading} style={{ width: '100%', padding: '0.65rem', border: 'none', background: '#22c55e', color: '#fff', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', marginTop: '0.5rem' }}>{isLoading ? 'Analyzing Parameters...' : 'Analyze & Optimize Skills'}</button>
        </div>

        <div style={{ background: '#111318', borderRadius: '12px', border: '1px solid #1c1f26', padding: '1.25rem', borderLeft: selectedSkill === 'star' ? '4px solid #3b82f6' : '4px solid #22c55e' }}>
          <h4>AI Strategy Response Evaluations</h4>
          {aiFeedback ? (
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{aiFeedback}</p>
          ) : (
            <p style={{ fontSize: '0.9rem', color: '#414755', fontStyle: 'italic' }}>Input text query modules on the left grid canvas to initiate coaching feedback hooks.</p>
          )}
        </div>
      </div>
    </div>
  );
}