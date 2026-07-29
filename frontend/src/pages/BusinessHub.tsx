import React, { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, MessageSquare, FileText, Stethoscope, Target, Play, Sparkles } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

const BusinessHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compliance' | 'voc' | 'proposal' | 'medical' | 'sales'>('compliance');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Form states
  const [complianceDoc, setComplianceDoc] = useState("Employee personal health data must be saved for 10 years without encryption. Third-party vendors can access raw database entries without signing NDA.");
  const [targetReg, setTargetReg] = useState("GDPR & HIPAA Standard");

  const [vocFeedback, setVocFeedback] = useState("App crashes on checkout screen.\nSearching takes 15 seconds.\nLove the dark mode!\nCustomer support didn't reply for 2 days.");

  const [rfpReq, setRfpReq] = useState("Need an AI Customer Support Agent with RAG integration over 5,000 PDF documents and SLA under 1 second.");
  const [agencyPast, setAgencyPast] = useState("Built 15 enterprise RAG pipelines, reduced support resolution time by 65% for Acme Corp.");

  const [patientSymptoms, setPatientSymptoms] = useState("Severe cough for 4 days, low fever, mild shortness of breath on exertion.");
  const [medicalHistory, setMedicalHistory] = useState("Asthma diagnosed 2018, allergic to Penicillin.");

  const [companyName, setCompanyName] = useState("Acme Logistics");
  const [industry, setIndustry] = useState("Supply Chain & Logistics");

  const runEngine = async (endpoint: string, payload: any) => {
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE}${endpoint}`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setResult(res.data);
    } catch (err: any) {
      setResult({ error: err.response?.data?.detail || err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-overlay)',
    color: 'var(--text-primary)'
  };

  return (
    <div style={{ padding: '32px', color: 'var(--text-primary)', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'var(--brand)', borderRadius: '8px', padding: '8px', display: 'flex' }}>
            <Sparkles size={24} color="white" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Enterprise Business Engines Hub</h1>
        </div>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>
          High-impact autonomous AI business tools ready to deploy to clients for immediate revenue.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        {[
          { id: 'compliance', name: 'Compliance Auditor', icon: <ShieldCheck size={18} /> },
          { id: 'voc', name: 'VoC Intelligence', icon: <MessageSquare size={18} /> },
          { id: 'proposal', name: 'Proposal & RFP Writer', icon: <FileText size={18} /> },
          { id: 'medical', name: 'Medical Pre-Consult', icon: <Stethoscope size={18} /> },
          { id: 'sales', name: 'B2B Sales Battlecard', icon: <Target size={18} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setResult(null); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px',
              border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
              backgroundColor: activeTab === tab.id ? 'var(--brand)' : 'var(--bg-overlay)',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)'
            }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Grid: Left Inputs / Right Output */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Left Form Panel */}
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px' }}>
          {activeTab === 'compliance' && (
            <div>
              <h3 style={{ marginTop: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>🏢 AI Compliance & Policy Auditor</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Scan company policies or contracts for GDPR/HIPAA violations.</p>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Target Regulation</label>
                <input value={targetReg} onChange={(e) => setTargetReg(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Policy / Contract Document</label>
                <textarea rows={6} value={complianceDoc} onChange={(e) => setComplianceDoc(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <button onClick={() => runEngine('/business/compliance-auditor', { policy_doc: complianceDoc, target_regulation: targetReg })} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Play size={18} /> {loading ? 'Auditing Policy...' : 'Run Compliance Audit'}
              </button>
            </div>
          )}

          {activeTab === 'voc' && (
            <div>
              <h3 style={{ marginTop: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>📞 Voice of Customer (VoC) Engine</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Turn thousands of customer feedback entries into roadmap priorities.</p>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Customer Feedback Entries (one per line)</label>
                <textarea rows={8} value={vocFeedback} onChange={(e) => setVocFeedback(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <button onClick={() => runEngine('/business/voc-intelligence', { feedback_items: vocFeedback.split('\n').filter(x => x.trim()) })} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Play size={18} /> {loading ? 'Extracting Insights...' : 'Analyze Customer Voice'}
              </button>
            </div>
          )}

          {activeTab === 'proposal' && (
            <div>
              <h3 style={{ marginTop: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>🏗️ AI Proposal & RFP Writer</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Draft custom agency proposals matched against past winning work.</p>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>RFP Requirements</label>
                <textarea rows={4} value={rfpReq} onChange={(e) => setRfpReq(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Agency Past Winning Projects</label>
                <textarea rows={4} value={agencyPast} onChange={(e) => setAgencyPast(e.target.value)} style={inputStyle} />
              </div>
              <button onClick={() => runEngine('/business/proposal-writer', { rfp_requirements: rfpReq, agency_past_work: agencyPast })} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Play size={18} /> {loading ? 'Generating Proposal...' : 'Write Sales Proposal'}
              </button>
            </div>
          )}

          {activeTab === 'medical' && (
            <div>
              <h3 style={{ marginTop: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>🧑‍⚕️ Medical Pre-Consultation Assistant</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Synthesize patient symptom intake into concise doctor briefing notes.</p>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Patient Symptoms</label>
                <textarea rows={4} value={patientSymptoms} onChange={(e) => setPatientSymptoms(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Medical History</label>
                <textarea rows={4} value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} style={inputStyle} />
              </div>
              <button onClick={() => runEngine('/business/medical-preconsult', { patient_symptoms: patientSymptoms, medical_history: medicalHistory })} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Play size={18} /> {loading ? 'Synthesizing Briefing...' : 'Generate Doctor Briefing'}
              </button>
            </div>
          )}

          {activeTab === 'sales' && (
            <div>
              <h3 style={{ marginTop: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>🛒 B2B Sales Intelligence Battlecard</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Generate 1-page B2B sales battlecards for outbound SDR teams.</p>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Prospect Company Name</label>
                <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Industry</label>
                <input value={industry} onChange={(e) => setIndustry(e.target.value)} style={inputStyle} />
              </div>
              <button onClick={() => runEngine('/business/sales-battlecard', { company_name: companyName, industry: industry })} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--brand)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Play size={18} /> {loading ? 'Building Battlecard...' : 'Generate SDR Battlecard'}
              </button>
            </div>
          )}
        </div>

        {/* Right Output Panel */}
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <Sparkles size={20} color="var(--brand)" /> Live Gemini Output
          </h3>
          <div style={{ flex: 1, backgroundColor: 'var(--bg-overlay)', borderRadius: '8px', border: '1px solid var(--border)', padding: '16px', fontFamily: 'monospace', overflowY: 'auto', maxHeight: '500px' }}>
            {loading ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '40px' }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>⚡ Gemini AI Processing...</div>
                <div style={{ fontSize: '0.85rem' }}>Executing autonomous multi-agent analysis...</div>
              </div>
            ) : result ? (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'var(--brand)', fontSize: '0.85rem' }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '60px' }}>
                Select an engine on the left and click Run to generate live business outputs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHub;
