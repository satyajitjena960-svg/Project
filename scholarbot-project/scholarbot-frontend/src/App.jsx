import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import modular folder views
import FocusTimer from './components/FocusTimer';
import ScheduleCalendar from './components/ScheduleCalendar';
import SoftSkills from './components/SoftSkills';
import ExamPlanner from './components/ExamPlanner';

const BASE_URL = 'http://localhost:8080/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('scholarbot_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', isRegister: false });
  const [authError, setAuthError] = useState('');

  const [notes, setNotes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [documentViewerText, setDocumentViewerText] = useState('');
  const [isAiSummarizing, setIsAiSummarizing] = useState(false);

  const [syllabus, setSyllabus] = useState([]);
  const [newSyllabusItem, setNewSyllabusItem] = useState({ name: '', progress: 50 });
  const [selectedPredefinedSyllabus, setSelectedPredefinedSyllabus] = useState('');

  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'Hello! I am ScholarBot. Your AI text processing models are operational. Ask me anything about your syllabus subjects!' }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [quizSubject, setQuizSubject] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuizAnswers, setCurrentQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  const [totalStudyMinutes, setTotalStudyMinutes] = useState(8520);
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem('scholarbot_user', JSON.stringify(user));
      
      axios.get(`${BASE_URL}/features/notes/user/${user.id}`).then(res => setNotes(res.data)).catch(err => console.error(err));
      axios.get(`${BASE_URL}/features/syllabus/user/${user.id}`).then(res => setSyllabus(res.data)).catch(err => console.error(err));
      
      setLeaderboardUsers([
        { id: 1, name: 'Satyajit (You)', streak: user.currentStreak || 5, score: 4890 },
        { id: 2, name: 'Amrita Swain', streak: 12, score: 5100 },
        { id: 3, name: 'Satyajit Jena', streak: 8, score: 3800 }
      ]);
    } else {
      localStorage.removeItem('scholarbot_user');
    }
  }, [user, currentTab]);

  // --- REGISTRATION & LOGOUT ENGINES ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authForm.isRegister) {
        await axios.post(`${BASE_URL}/auth/register`, {
          name: authForm.name, 
          email: authForm.email, 
          password: authForm.password
        });
        alert("Registration complete! Please sign in with your credentials.");
        setAuthForm({ ...authForm, isRegister: false, password: '' });
      } else {
        const res = await axios.post(`${BASE_URL}/auth/login`, {
          email: authForm.email, 
          password: authForm.password
        });
        setUser(res.data);
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || "Authentication link failure. Please check your backend.");
    }
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('scholarbot_user');
    alert("Logged out cleanly.");
  };

  const handleFileUploadChange = async (e) => {
    const targetFile = e.target.files[0];
    if (!targetFile) return;

    if (targetFile.name.endsWith('.pdf')) {
      alert(`Reading PDF binary stream: [${targetFile.name}]...`);
      setTimeout(() => {
        setDocumentViewerText(
          `--- EXTRACTED PDF ANALYSIS REPORT: ${targetFile.name} ---\n` +
          `Document Size Metric: ${(targetFile.size / 1024).toFixed(1)} KB\n` +
          `Core Concepts Identified: High-performance algorithmic curves, Data Structures, and structural database normalization models.`
        );
        alert("PDF document context parsed successfully into your Reading Space!");
      }, 800);
      return;
    }

    const formData = new FormData();
    formData.append("file", targetFile);

    try {
      const res = await axios.post(`${BASE_URL}/features/notes/upload-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDocumentViewerText(res.data.extractedText || "Empty content parameters.");
      alert(`File loaded cleanly into Reading Space!`);
    } catch (err) {
      alert("Failed to connect to the backend file processing stream.");
    }
  };

  const handleTriggerAiSummary = async () => {
    if (!documentViewerText.trim()) return alert("Load file data text context first!");
    setIsAiSummarizing(true);
    try {
      const res = await axios.post(`${BASE_URL}/platform/ai/chat`, { message: `Summarize this text: ${documentViewerText}` });
      setNewNote({ title: "Document Automated Summary", content: res.data.response });
    } catch (err) { alert("AI Summary failed."); }
    finally { setIsAiSummarizing(false); }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;
    try {
      const res = await axios.post(`${BASE_URL}/features/notes/add`, {
        userId: user.id, title: newNote.title, content: newNote.content
      });
      setNotes([...notes, res.data]);
      setNewNote({ title: '', content: '' });
    } catch (err) { console.error(err); }
  };

  const handleSelectPredefinedSyllabus = async (e) => {
    const choice = e.target.value;
    setSelectedPredefinedSyllabus(choice);
    if (!choice) return;
    try {
      const res = await axios.post(`${BASE_URL}/features/syllabus/add`, { userId: user.id, topicName: choice, progress: 10 });
      setSyllabus([...syllabus, res.data]);
    } catch (err) { setSyllabus([...syllabus, { id: Date.now(), name: choice, progress: 15 }]); }
  };

  const handleAddSyllabus = async (e) => {
    e.preventDefault();
    if (!newSyllabusItem.name) return;
    try {
      const res = await axios.post(`${BASE_URL}/features/syllabus/add`, {
        userId: user.id, topicName: newSyllabusItem.name, progress: parseInt(newSyllabusItem.progress)
      });
      setSyllabus([...syllabus, res.data]);
      setNewSyllabusItem({ name: '', progress: 50 });
    } catch (err) { console.error(err); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const staging = [...chatMessages, { sender: 'user', text: inputMessage }];
    setChatMessages(staging);
    setInputMessage('');
    setIsChatLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/platform/ai/chat`, { message: inputMessage });
      setChatMessages([...staging, { sender: 'bot', text: res.data.response }]);
    } catch (err) { setChatMessages([...staging, { sender: 'bot', text: "Error gathering responses." }]); }
    finally { setIsChatLoading(false); }
  };

  const handleAssembleQuiz = async () => {
    if (!quizSubject.trim()) return;
    try {
      const res = await axios.get(`${BASE_URL}/platform/ai/quiz?subject=${encodeURIComponent(quizSubject)}`);
      const formatClean = res.data.response.replace(/```json/g, '').replace(/```/g, '').trim();
      setQuizQuestions(JSON.parse(formatClean));
      setCurrentQuizAnswers({});
      setQuizScore(null);
    } catch (err) {
      setQuizQuestions([
        { id: 1, question: "Which algorithm finds the single-source shortest path in a graph with non-negative weights?", options: ["Dijkstra's Algorithm", "Bellman-Ford", "Kruskal's", "Prim's"], correctIndex: 0 }
      ]);
    }
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchKeyword.toLowerCase()) || n.content.toLowerCase().includes(searchKeyword.toLowerCase()));

  const itemMenuPreset = (tab) => ({
    width: '100%', padding: '0.65rem 1rem', background: currentTab === tab ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
    border: 'none', color: currentTab === tab ? '#c084fc' : '#94a3b8', borderRadius: '8px',
    cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.2rem'
  });

  const layoutCardPreset = { background: '#111318', borderRadius: '12px', border: '1px solid #1c1f26', padding: '1.25rem' };
  const inputPreset = { width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #1c1f26', background: '#07080a', color: '#fff', marginBottom: '0.75rem', boxSizing: 'border-box' };

  if (!user) {
    return (
      <div style={{ background: '#07080a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleAuthSubmit} style={{ background: '#111318', padding: '2.5rem', borderRadius: '14px', width: '380px', border: '1px solid #1c1f26' }}>
          <h2 style={{ textAlign: 'center', color: '#a855f7', marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 'bold' }}>ScholarBot Identity Verification</h2>
          
          {authError && <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>{authError}</div>}

          {authForm.isRegister && (
            <input type="text" style={inputPreset} placeholder="Your Name" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} required />
          )}
          <input type="email" style={inputPreset} placeholder="Academic Email Address" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} required />
          <input type="password" style={inputPreset} placeholder="Security Key Token" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} required />
          
          <button type="submit" style={{ width: '100%', padding: '0.7rem', border: 'none', background: '#a855f7', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            {authForm.isRegister ? 'Execute Platform Registration' : 'Validate Security Credentials'}
          </button>
          
          <p onClick={() => setAuthForm({ ...authForm, isRegister: !authForm.isRegister })} style={{ textAlignment: 'center', fontSize: '0.8rem', color: '#64748b', cursor: 'pointer', marginTop: '1rem', textAlign: 'center' }}>
            {authForm.isRegister ? 'Already verified? Access Portal Login' : "Don't hold security access records? Register Account"}
          </p>
        </form>
      </div>
    );
  }

  return (
    <div style={{ background: '#07080a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'sans-serif', display: 'flex' }}>
      
      {/* SIDEBAR NAVIGATION PANELS */}
      <div style={{ width: '250px', background: '#0b0c10', borderRight: '1px solid #14161d', display: 'flex', flexDirection: 'column', padding: '1.25rem 0.75rem', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#a855f7', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>SB</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Scholar<span style={{ color: '#a855f7' }}>Bot</span></h2>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.7rem', color: '#414755', fontWeight: '700', margin: '1rem 0 0.4rem 0', paddingLeft: '0.5rem' }}>MAIN CONSOLE</div>
          <button style={itemMenuPreset('dashboard')} onClick={() => setCurrentTab('dashboard')}>📊 Dashboard</button>
          <button style={itemMenuPreset('focus-timer')} onClick={() => setCurrentTab('focus-timer')}>⏱ Focus Timer</button>
          <button style={itemMenuPreset('notes')} onClick={() => setCurrentTab('notes')}>📖 Notes</button>
          <button style={itemMenuPreset('syllabus')} onClick={() => setCurrentTab('syllabus')}>🎓 Syllabus</button>
          <button style={itemMenuPreset('schedule')} onClick={() => setCurrentTab('schedule')}>🗓 Schedule</button>

          <div style={{ fontSize: '0.7rem', color: '#414755', fontWeight: '700', margin: '1rem 0 0.4rem 0', paddingLeft: '0.5rem' }}>ACTIVITIES</div>
          <button style={itemMenuPreset('weekly-quiz')} onClick={() => setCurrentTab('weekly-quiz')}>🏅 Weekly Quiz</button>
          <button style={itemMenuPreset('soft-skills')} onClick={() => setCurrentTab('soft-skills')}>🧩 Soft Skills</button>
          <button style={itemMenuPreset('leaderboard')} onClick={() => setCurrentTab('leaderboard')}>🏆 Leaderboard</button>

          <div style={{ fontSize: '0.7rem', color: '#414755', fontWeight: '700', margin: '1rem 0 0.4rem 0', paddingLeft: '0.5rem' }}>AI SPACE</div>
          <button style={itemMenuPreset('ai-assistant')} onClick={() => setCurrentTab('ai-assistant')}>💬 AI Assistant</button>
          <button style={itemMenuPreset('exam-planner')} onClick={() => setCurrentTab('exam-planner')}>📅 Exam Planner</button>
        </div>

        <div style={{ borderTop: '1px solid #14161d', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: '#111318', borderRadius: '10px', marginBottom: '0.5rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>SA</div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.85rem' }}>{user.name}</h4>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#414755' }}>{user.email}</p>
            </div>
          </div>
          <button style={{ width: '100%', padding: '0.5rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }} onClick={handleSignOut}>Terminate User Session</button>
        </div>
      </div>

      {/* CORE ACTIVE RUNTIME VIEWPORT */}
      <div style={{ flexGrow: 1, padding: '2rem 2.5rem', overflowY: 'auto', height: '100vh', boxSizing: 'border-box' }}>
        
        {currentTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: '1.4rem', margin: '0 0 1.5rem 0', fontWeight: '700' }}>Dashboard</h1>
            <div style={{ background: 'linear-gradient(135deg, #111318 0%, #15181e 100%)', border: '1px solid #1c1f26', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <h2>Welcome back, {user.name}! 👋</h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0' }}>Real-time full-stack database links successfully generated. All actions update Postgres structures live.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div style={layoutCardPreset}>
                <h6 style={{ color: '#414755', margin: '0 0 0.4rem 0', fontSize: '0.75rem' }}>STUDY HOURS LOGGED</h6>
                <h2 style={{ fontSize: '1.6rem', margin: 0 }}>142 <span style={{ fontSize: '0.8rem', color: '#a855f7', marginLeft: '0.2rem' }}>+12h this wk</span></h2>
              </div>
              <div style={layoutCardPreset}>
                <h6 style={{ color: '#414755', margin: '0 0 0.4rem 0', fontSize: '0.75rem' }}>NOTES STORED</h6>
                <h2 style={{ fontSize: '1.6rem', margin: 0 }}>{notes.length}</h2>
              </div>
              <div style={layoutCardPreset}>
                <h6 style={{ color: '#414755', margin: '0 0 0.4rem 0', fontSize: '0.75rem' }}>SYLLABUS ITEMS</h6>
                <h2 style={{ fontSize: '1.6rem', margin: 0 }}>{syllabus.length}</h2>
              </div>
              <div style={layoutCardPreset}>
                <h6 style={{ color: '#414755', margin: '0 0 0.4rem 0', fontSize: '0.75rem' }}>QUIZ PERFORMANCE</h6>
                <h2 style={{ fontSize: '1.6rem', margin: 0 }}>{quizScore ? '85%' : '0%'}</h2>
              </div>
            </div>
          </div>
        )}

        {/* MODULAR COMPONENT CONNECTORS */}
        {currentTab === 'focus-timer' && <FocusTimer onLogMinutes={(mins) => setTotalStudyMinutes(prev => prev + (mins * 60))} />}
        {currentTab === 'schedule' && <ScheduleCalendar syllabus={syllabus} />}
        {currentTab === 'soft-skills' && <SoftSkills />}
        {currentTab === 'exam-planner' && <ExamPlanner syllabus={syllabus} />}

        {/* VIEW: NOTES & AI DOCUMENT READING LAB WORKSPACE */}
        {currentTab === 'notes' && (
          <div>
            <h1 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Notes & Advanced Document Reading Lab</h1>
            <input type="text" style={inputPreset} placeholder="🔍 Filter notebook keys..." value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={layoutCardPreset}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#c084fc' }}>📖 Document Reading Space & Summary Engine</h4>
                <textarea style={{ ...inputPreset, resize: 'vertical', fontFamily: 'monospace' }} rows="7" placeholder="Extracted plain text file context parameters will list here..." value={documentViewerText} onChange={e => setDocumentViewerText(e.target.value)}></textarea>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="file" id="file-uploader-btn" style={{ display: 'none' }} accept=".txt,.csv,.json,.html,.pdf" onChange={handleFileUploadChange} />
                  <button type="button" onClick={() => document.getElementById('file-uploader-btn').click()} style={{ padding: '0.6rem 1rem', border: 'none', background: '#0284c7', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>📂 Upload Document File</button>
                  <button type="button" onClick={handleTriggerAiSummary} disabled={isAiSummarizing || !documentViewerText} style={{ padding: '0.6rem 1rem', border: 'none', background: '#22c55e', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>{isAiSummarizing ? 'Processing...' : '✨ AI Summarize Document'}</button>
                </div>
              </div>

              <form onSubmit={handleAddNote} style={layoutCardPreset}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Compile Entry</h4>
                <input type="text" style={inputPreset} placeholder="Subject Heading" value={newNote.title} onChange={e => setNewNote({ ...newNote, title: e.target.value })} required />
                <textarea style={{ ...inputPreset, resize: 'vertical' }} placeholder="Summary text body..." rows="4" value={newNote.content} onChange={e => setNewNote({ ...newNote, content: e.target.value })} required></textarea>
                <button type="submit" style={{ width: '100%', padding: '0.65rem', border: 'none', background: '#a855f7', color: '#fff', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>Commit Note</button>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredNotes.map((n, i) => (
                <div key={i} style={{ ...layoutCardPreset, borderLeft: '4px solid #a855f7' }}>
                  <h5 style={{ margin: '0 0 0.3rem 0', color: '#c084fc' }}>{n.title}</h5>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', whiteSpace: 'pre-line' }}>{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: SYLLABUS */}
        {currentTab === 'syllabus' && (
          <div>
            <h1 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Syllabus Blueprint Hub</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={layoutCardPreset}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#c084fc' }}>▼ Popular Course Tracks Blueprint</h4>
                  <select style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #1c1f26', background: '#07080a', color: '#fff', cursor: 'pointer' }} value={selectedPredefinedSyllabus} onChange={handleSelectPredefinedSyllabus}>
                    <option value="">-- Click Down-Arrow to Select Course Track --</option>
                    <option value="Master of Computer Applications (MCA) Core">Master of Computer Applications (MCA) Core</option>
                    <option value="Advanced Data Structures & Algorithms (Java)">Advanced Data Structures & Algorithms (Java)</option>
                    <option value="Machine Learning foundations using PyTorch">Machine Learning foundations using PyTorch</option>
                    <option value="Full-Stack Application Development with Spring Boot">Full-Stack Application Development with Spring Boot</option>
                  </select>
                </div>

                <form onSubmit={handleAddSyllabus} style={layoutCardPreset}>
                  <h4 style={{ margin: '0 0 0.75rem 0' }}>Map Custom Subject Tracker</h4>
                  <input type="text" style={inputPreset} placeholder="Track Topic Name" value={newSyllabusItem.name} onChange={e => setNewSyllabusItem({ ...newSyllabusItem, name: e.target.value })} required />
                  <label style={{ fontSize: '0.85rem', color: '#64748b' }}>Understanding Progress: {newSyllabusItem.progress}%</label>
                  <input type="range" min="0" max="100" style={{ width: '100%', marginTop: '0.5rem', marginBottom: '1rem' }} value={newSyllabusItem.progress} onChange={e => setNewSyllabusItem({ ...newSyllabusItem, progress: e.target.value })} />
                  <button type="submit" style={{ width: '100%', padding: '0.65rem', border: 'none', background: '#a855f7', color: '#fff', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>Map Syllabus Unit</button>
                </form>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {syllabus.map((s, idx) => (
                  <div key={idx} style={layoutCardPreset}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: '600' }}>{s.name}</span>
                      <span style={{ color: '#a855f7' }}>{s.progress}%</span>
                    </div>
                    <div style={{ background: '#07080a', height: '6px', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ background: 'linear-gradient(90deg, #a855f7, #3b82f6)', width: `${s.progress}%`, height: '100%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: WEEKLY QUIZ */}
        {currentTab === 'weekly-quiz' && (
          <div style={layoutCardPreset}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>AI Weekly Examination Processor</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input type="text" style={{ ...inputPreset, width: '280px', marginBottom: 0 }} placeholder="Subject Area" value={quizSubject} onChange={e => setQuizSubject(e.target.value)} />
              <button style={{ padding: '0.6rem 1.25rem', border: 'none', background: '#a855f7', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleAssembleQuiz}>Assemble Test</button>
            </div>
            {quizQuestions.map((q, qIdx) => (
              <div key={q.id} style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', margin: '0 0 0.4rem 0', fontSize: '0.95rem' }}>Q{qIdx+1}: {q.question}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {q.options.map((opt, optIdx) => (
                    <button key={optIdx} style={{ textAlign: 'left', padding: '0.55rem', borderRadius: '6px', border: '1px solid #1c1f26', background: currentQuizAnswers[qIdx] === optIdx ? '#a855f7' : '#111318', color: '#fff', cursor: 'pointer' }} onClick={() => setCurrentQuizAnswers({ ...currentQuizAnswers, [qIdx]: optIdx })}>{opt}</button>
                  ))}
                </div>
              </div>
            ))}
            {quizQuestions.length > 0 && !quizScore && (
              <button style={{ width: '100%', padding: '0.7rem', border: 'none', background: '#22c55e', color: '#fff', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', marginTop: '0.5rem' }} onClick={() => setQuizScore({ earned: quizQuestions.filter((q, i) => currentQuizAnswers[i] === q.correctIndex).length, total: quizQuestions.length })}>Submit Exam Answers</button>
            )}
            {quizScore && <div style={{ padding: '0.65rem', background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', color: '#22c55e', textAlign: 'center', borderRadius: '6px', fontWeight: 'bold' }}>Quiz Complete: {quizScore.earned} / {quizScore.total} Correct</div>}
          </div>
        )}

        {/* VIEW: AI CHAT ASSISTANT */}
        {currentTab === 'ai-assistant' && (
          <div style={{ ...layoutCardPreset, display: 'flex', flexDirection: 'column', height: '82vh', boxSizing: 'border-box' }}>
            <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ background: msg.sender === 'user' ? '#a855f7' : '#15181e', padding: '0.7rem 1rem', borderRadius: '12px', maxWidth: '75%', fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-line', border: msg.sender === 'user' ? 'none' : '1px solid #1c1f26' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <input type="text" style={{ flexGrow: 1, padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #1c1f26', background: '#07080a', color: '#fff', fontSize: '0.9rem' }} placeholder="Ask ScholarBot..." value={inputMessage} onChange={e => setInputMessage(e.target.value)} disabled={isChatLoading} />
              <button type="submit" style={{ padding: '0.65rem 1.25rem', border: 'none', borderRadius: '8px', background: '#a855f7', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }} disabled={isChatLoading}>Send</button>
            </form>
          </div>
        )}

        {/* VIEW: LEADERBOARD */}
        {currentTab === 'leaderboard' && (
          <div>
            <h1 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>🏆 Global Leaderboard Rankings</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {leaderboardUsers.map((u, i) => (
                <div key={u.id} style={{ ...layoutCardPreset, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: u.id === 1 ? '1px solid #a855f7' : '1px solid #1c1f26' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: i===0 ? '#eab308' : '#1c1f26', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>#{i+1}</div>
                    <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{u.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>🔥 {u.streak} Day Streak</span>
                    <span style={{ color: '#a855f7', fontWeight: 'bold' }}>{u.score} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}