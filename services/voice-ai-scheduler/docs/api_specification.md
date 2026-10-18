# VARAH SYSTEMS — Voice AI Telephony API Specification

## 1. REST Endpoints

### `GET /api/health`
Health check and telemetry target specifications.
```json
{
  "status": "OPERATIONAL",
  "service": "Voice AI Telephony Scheduler",
  "target_latency_ms": 285,
  "active_providers": 2,
  "available_slots": 6
}
```

### `GET /api/pms/slots`
Query Practice Management System (Dentrix / Eaglesoft) for open appointment slots.
- **Parameters:**
  - `date` (optional, string): `YYYY-MM-DD`
  - `procedure` (optional, string): Filter by clinical procedure (e.g., `Emergency Exam`, `Hygiene Cleaning`).

### `POST /api/pms/book`
Atomically lock and commit an appointment into the clinical database.
- **Payload:**
```json
{
  "slot_id": "slot_2",
  "patient_name": "Alex Morgan",
  "patient_phone": "(415) 890-4289",
  "patient_email": "alex.morgan@gmail.com",
  "procedure_name": "Emergency Exam",
  "insurance_carrier": "Delta Dental Premier PPO"
}
```

---

## 2. WebSocket Telephony Stream: `/ws/call-stream`

For continuous bidirectional audio streaming via Twilio Media Streams or WebRTC (LiveKit / Pipecat).

- **Sample Rate:** 24,000 Hz (Opus / Raw PCM)
- **Audio Framing:** 20ms chunks
- **Events:**
  - `CALL_CONNECTED`: Initialized handshake with caller metadata.
  - `USER_SPEAKING`: Streaming VAD event with interim transcripts.
  - `AGENT_SPEAKING`: Streaming synthesized audio chunks returned from TTS engine.
  - `CALL_HANGUP`: Finalizes session and triggers PMS write-through.
