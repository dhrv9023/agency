# VARAH SYSTEMS — Sub-300ms Voice AI Receptionist & Appointment Scheduler

> **Production-grade conversational telephony pipeline for healthcare practices, dental support organizations (DSOs), and appointment-driven enterprise operations.**

---

## ⚡ Architectural Overview

The Voice AI Receptionist is engineered to eliminate front-desk phone overload and capture the **25–40% of inbound patient calls that go to voicemail** ($800–$1,500 lost patient lifetime value per missed call).

```
[Inbound Caller] (PSTN / Mobile)
       │
       ▼
[Twilio / Telnyx SIP Trunk]
       │ (Bidirectional 8kHz/16kHz Raw PCM Audio Stream)
       ▼
[LiveKit / Pipecat WebRTC Media Server]
       │
       ├──► [Deepgram Nova-2] (Speech-to-Text: ~110ms)
       │           │ (Incremental Transcript Stream)
       │           ▼
       ├──► [Claude 3.5 Haiku / GPT-4o-mini] (Streaming LLM: ~95ms First-Token)
       │           │ (Token Buffer with Punctuation Chunking)
       │           ▼
       └──► [Cartesia Sonic / ElevenLabs Flash] (Text-to-Speech: ~80ms)
                   │
                   ▼
       [Audio Returned to Caller via SIP Trunk] (Total Roundtrip Latency: ~285ms)
                   │
       [PMS Integration Engine] ──► Query/Lock/Book Slot in Dentrix / Eaglesoft / OpenDental
```

---

## 🎯 Key Capabilities

1. **Sub-300ms Conversational Latency:** Natural conversational pacing without awkward pauses or robotic delays.
2. **Dynamic Calendar Negotiation:** Intelligently checks provider availability, suggests alternate slots, and handles conflicts.
3. **Conversational Interruptions (Barge-In):** When the caller speaks while the AI is talking, Voice Activity Detection (VAD) instantly silences the speech synthesis and listens.
4. **EHR / PMS Bi-directional Sync:** Direct API integration with Dentrix, Eaglesoft, OpenDental, AthenaHealth, or Google Calendar.
5. **Insurance Eligibility Pre-Check:** Captures dental/medical insurance carrier, member ID, and group number conversationally.
6. **Emergency Medical Triage:** Immediately identifies urgent symptoms (e.g. uncontrollable bleeding, severe swelling, acute trauma) and warm-transfers to an on-call clinician.

---

## 📁 Service Directory Structure

```
services/voice-ai-scheduler/
├── README.md                   # Complete technical architecture specification
├── backend/
│   ├── server.py               # FastAPI & WebSocket low-latency voice pipeline server
│   ├── pms_integrator.py       # Dentrix / Practice Management System API connector
│   ├── prompts.py              # Clinical conversational triage and slot negotiation prompt contract
│   └── requirements.txt        # Python microservice dependencies
├── frontend/
│   ├── index.html              # Interactive telephony simulator & PMS calendar dashboard
│   ├── styles.css              # Technical dark-mode UI styling with audio canvas visualizer
│   └── app.js                  # Speech engine, Web Audio visualizer & calendar state machine
└── docs/
    └── api_specification.md    # REST & WebSocket API endpoints documentation
```

---

## 🚀 Running the Interactive Demo

### Option 1: View via Next.js Dev Server (Instant Preview)
With your Next.js server running on port 3000, open:
👉 **`http://localhost:3000/demos/voice-ai-scheduler/`**

### Option 2: Standalone Browser Preview
Simply double-click or open `services/voice-ai-scheduler/frontend/index.html` in Chrome, Brave, Edge, or Safari.

### Option 3: Running the Python Streaming Backend
```bash
cd services/voice-ai-scheduler/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🔒 Enterprise Security & HIPAA Compliance
- **Zero Audio Retention Mode:** Audio buffers are processed in volatile RAM and purged immediately post-call.
- **BAA Ready:** Deepgram and Anthropic HIPAA-compliant endpoints with encryption in transit (TLS 1.3) and at rest (AES-256).
- **Audit Logging:** Every phone interaction generates an immutable cryptographic log with sanitized transcripts (all PII redacted).
