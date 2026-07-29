from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import json
import re
from services.gemini_service import call_gemini

router = APIRouter(prefix="/business", tags=["business-engines"])

# Models
class ComplianceAuditRequest(BaseModel):
    policy_doc: str
    target_regulation: str = "GDPR & HIPAA Standard"

class VocAnalysisRequest(BaseModel):
    feedback_items: List[str]

class ProposalWriterRequest(BaseModel):
    rfp_requirements: str
    agency_past_work: str

class MedicalPreconsultRequest(BaseModel):
    patient_symptoms: str
    medical_history: str

class SalesBattlecardRequest(BaseModel):
    company_name: str
    industry: str

# 1. COMPLIANCE & POLICY AUDITOR
@router.post("/compliance-auditor")
async def audit_compliance(req: ComplianceAuditRequest):
    system_inst = "You are an expert Enterprise Compliance Auditor. Analyze the document against the regulation and output JSON."
    prompt = f"POLICY DOCUMENT:\n{req.policy_doc}\n\nTARGET REGULATION:\n{req.target_regulation}\n\nOutput JSON: {{\n  \"overall_risk\": \"HIGH | MEDIUM | LOW\",\n  \"violations\": [\"violation 1\", \"violation 2\"],\n  \"recommended_actions\": [\"fix 1\", \"fix 2\"]\n}}"
    
    resp = await call_gemini(prompt, system_instruction=system_inst, temperature=0.2)
    try:
        match = re.search(r"\{.*\}", resp, re.DOTALL)
        result = json.loads(match.group(0)) if match else {"overall_risk": "MEDIUM", "violations": [resp], "recommended_actions": ["Review document"]}
    except:
        result = {"overall_risk": "MEDIUM", "violations": [resp], "recommended_actions": ["Review document"]}
        
    return {
        "engine": "Compliance & Policy Auditor",
        "target_regulation": req.target_regulation,
        "audit_result": result
    }

# 2. VOICE OF CUSTOMER INTELLIGENCE ENGINE
@router.post("/voc-intelligence")
async def voc_intelligence(req: VocAnalysisRequest):
    items_str = "\n- ".join(req.feedback_items[:50])
    prompt = f"Analyze these customer feedback entries:\n{items_str}\n\nOutput JSON with fields: top_pain_points (list), sentiment_breakdown (dict), feature_requests (list), churn_risk_signals (list)."
    resp = await call_gemini(prompt, system_instruction="Output valid JSON analysis.", temperature=0.3)
    
    try:
        match = re.search(r"\{.*\}", resp, re.DOTALL)
        data = json.loads(match.group(0)) if match else {"top_pain_points": ["Usability"], "sentiment_breakdown": {"positive": 60, "negative": 40}}
    except:
        data = {"raw_analysis": resp}
        
    return {
        "engine": "Voice of Customer Intelligence Engine",
        "total_items_analyzed": len(req.feedback_items),
        "insights": data
    }

# 3. PROPOSAL & RFP WRITER
@router.post("/proposal-writer")
async def generate_proposal(req: ProposalWriterRequest):
    prompt = f"RFP REQUIREMENTS:\n{req.rfp_requirements}\n\nAGENCY PAST WORK:\n{req.agency_past_work}\n\nGenerate a professional sales proposal including Executive Summary, Scope of Work, Deliverables, and Recommended Budget Range."
    proposal = await call_gemini(prompt, system_instruction="You are a senior RFP proposal strategist.", temperature=0.5)
    
    return {
        "engine": "Proposal & RFP Writer",
        "proposal_markdown": proposal
    }

# 4. MEDICAL PRE-CONSULTATION ASSISTANT
@router.post("/medical-preconsult")
async def medical_preconsult(req: MedicalPreconsultRequest):
    prompt = f"PATIENT SYMPTOMS: {req.patient_symptoms}\nPAST MEDICAL HISTORY: {req.medical_history}\n\nGenerate a concise 1-page doctor briefing note highlighting chief complaints, red flags, and suggested clinical follow-up questions."
    briefing = await call_gemini(prompt, system_instruction="You are a clinical triage documentation assistant.", temperature=0.2)
    
    return {
        "engine": "Medical Pre-Consultation Assistant",
        "doctor_briefing": briefing
    }

# 5. B2B SALES INTELLIGENCE BATTLECARD
@router.post("/sales-battlecard")
async def generate_sales_battlecard(req: SalesBattlecardRequest):
    prompt = f"Generate a 1-page B2B Sales Battlecard for:\nCOMPANY: {req.company_name}\nINDUSTRY: {req.industry}\n\nInclude: Company Overview, Likely Pain Points, Recommended Pitch Angle, Objection Handling, and Custom Opening Line."
    battlecard = await call_gemini(prompt, system_instruction="You are an expert enterprise SDR strategist.", temperature=0.4)
    
    return {
        "engine": "B2B Sales Intelligence Battlecard",
        "company": req.company_name,
        "battlecard_markdown": battlecard
    }
