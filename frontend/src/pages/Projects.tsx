import React, { useState } from 'react';
import { Plus, MoreVertical, Activity, AlertTriangle, DollarSign } from 'lucide-react';

const mockProjects = [
  { id: 'p1', name: 'Customer Support Bot', env: 'Production', color: '#4f6ef7', runs: 12450, errorRate: 1.2, cost: 345.20 },
  { id: 'p2', name: 'Internal QA Agent', env: 'Staging', color: '#a855f7', runs: 3200, errorRate: 4.5, cost: 89.10 },
  { id: 'p3', name: 'RAG Pipeline Dev', env: 'Development', color: '#22c55e', runs: 850, errorRate: 12.4, cost: 12.40 },
  { id: 'p4', name: 'SQL Generator', env: 'Production', color: '#f59e0b', runs: 45200, errorRate: 0.8, cost: 1205.50 },
];

export default function Projects() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ padding: '32px', color: 'white', height: '100%', overflowY: 'auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Projects</h1>
        <button 
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {mockProjects.map(project => (
          <div key={project.id} className="card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: project.color, boxShadow: `0 0 10px ${project.color}80` }}></div>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>{project.name}</h3>
              </div>
              <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <MoreVertical size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <span style={{ 
                backgroundColor: project.env === 'Production' ? 'rgba(34, 197, 94, 0.1)' : project.env === 'Staging' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                color: project.env === 'Production' ? '#22c55e' : project.env === 'Staging' ? '#a855f7' : '#94a3b8',
                padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase'
              }}>
                {project.env}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '8px' }}><Activity size={14} /> Runs</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{(project.runs).toLocaleString()}</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '8px' }}><AlertTriangle size={14} /> Errors</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: project.errorRate > 5 ? '#f43f5e' : 'white' }}>{project.errorRate}%</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '8px' }}><DollarSign size={14} /> Spend</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>${project.cost.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal placeholder */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px', width: '500px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Create New Project</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.875rem' }}>Project Name</label>
              <input type="text" style={{ width: '100%', padding: '10px 12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
