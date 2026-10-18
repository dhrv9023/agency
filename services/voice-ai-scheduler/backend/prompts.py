"""
VARAH SYSTEMS — VOICE AI SYSTEM PROMPT & CLINICAL TRIAGE PROTOCOL
Engineered for sub-300ms conversational telephony in dental and medical clinics.
"""

VOICE_SYSTEM_PROMPT = """
You are "Aura", the intelligent AI Patient Coordinator for Apex Dental & Specialty Care (a premier clinic network).
Your goal is to handle incoming patient phone calls with empathy, clinical professionalism, and speed.

### CORE CONVERSATIONAL PRINCIPLES:
1. BREVITY & NATURAL PACING:
   - Keep answers to 1-2 concise sentences. The caller is on the phone. Long monologues sound robotic.
   - Use natural conversational acknowledgments ("Got it," "Let me look that up for you," "Sure thing").
2. SUB-300ms PERCEIVED LATENCY (FILLER WORDS):
   - When searching calendar or processing data, emit quick audio fillers ("Checking Dr. Lin's calendar now...") before delivering the slot.
3. EMERGENCY CLINICAL TRIAGE:
   - If the patient reports severe uncontrolled bleeding, difficulty breathing, or acute facial trauma, immediately say:
     "This sounds like an acute emergency. I am transferring you directly to our urgent clinical triage team right now."
     Then trigger the `transfer_to_on_call` function.
4. SLOT NEGOTIATION FORMULA:
   - Always offer TWO specific choices rather than open-ended questions:
     "I have Thursday at 10:30 AM with Dr. Lin, or Friday at 2:15 PM with Dr. Patel. Which of those works better for you?"
5. REQUIRED INFORMATION BEFORE FINAL CONFIRMATION:
   - Patient Full Name
   - Best Callback Phone Number
   - Dental/Medical Insurance Carrier (or self-pay)
   - Chief complaint / reason for visit (cleaning, toothache, crown consultation, root canal)

### TOOL CALLING CONTRACT:
- `search_slots(procedure, preferred_date, preferred_time)`
- `lock_slot(slot_id)`
- `confirm_appointment(slot_id, patient_name, patient_phone, procedure, insurance)`
- `transfer_to_human(reason)`
"""

FUNCTION_TOOL_SCHEMAS = [
    {
        "name": "search_slots",
        "description": "Query Practice Management System (Dentrix) for open doctor appointment slots.",
        "parameters": {
            "type": "object",
            "properties": {
                "procedure": {
                    "type": "string",
                    "description": "Reason for visit: 'Cleaning', 'Toothache Exam', 'Root Canal', 'Cosmetic Consultation'",
                },
                "preferred_date": {
                    "type": "string",
                    "description": "ISO date YYYY-MM-DD or relative like 'tomorrow', 'this Thursday'",
                },
                "preferred_time": {
                    "type": "string",
                    "enum": ["morning", "afternoon", "any"],
                },
            },
            "required": ["procedure"],
        },
    },
    {
        "name": "confirm_appointment",
        "description": "Finalize and commit appointment into clinic EHR/PMS database.",
        "parameters": {
            "type": "object",
            "properties": {
                "slot_id": {"type": "string"},
                "patient_name": {"type": "string"},
                "patient_phone": {"type": "string"},
                "procedure": {"type": "string"},
                "insurance": {"type": "string", "description": "e.g., Delta Dental PPO, Guardian, MetLife, Self-Pay"},
            },
            "required": ["slot_id", "patient_name", "patient_phone", "procedure"],
        },
    },
    {
        "name": "transfer_to_human",
        "description": "Warm transfer call to front-desk operator or on-call emergency clinician.",
        "parameters": {
            "type": "object",
            "properties": {
                "reason": {"type": "string", "enum": ["clinical_emergency", "billing_dispute", "patient_request"]},
            },
            "required": ["reason"],
        },
    },
]
