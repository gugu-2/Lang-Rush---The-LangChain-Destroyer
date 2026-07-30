import React, { useState } from 'react';
import { Plus, Folder, Key, Trash2, Edit3, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockProjects = [
  { id: 'p1', name: 'Production App', environment: 'production', runs_count: 14823, created_at: '3 months ago', color: 'var(--brand)' },
  { id: 'p2', name: 'Staging Environment', environment: 'staging', runs_count: 2341, created_at: '1 month ago', color: '#a855f7' },
  { id: 'p3', name: 'R&D Sandbox', environment: 'development', runs_count: 892, created_at: '2 weeks ago', color: '#10b981' },
];

export default function Projects() {
  const [projects, setProjects] = useState(mockProjects);
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ padding: '32px', color: 'var(--text-primary)', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Projects & API Keys</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage your workspace environments and telemetry access tokens.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {projects.map(project => (
          <div key={project.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: project.color }} />
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{project.name}</h3>
              </div>
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {project.environment}
              </span>
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {project.runs_count.toLocaleString()} total execution traces recorded
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/runs" style={{ flex: 1, textAlign: 'center', padding: '8px', backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                View Traces
              </Link>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', width: '400px', boxShadow: 'var(--shadow-lg)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Create New Project</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Project Name</label>
              <input type="text" placeholder="My LLM App" style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
