/**
 * ==============================================================================
 * VARAH SYSTEMS — VOICE AI TELEPHONY SCHEDULER: CLIENT ENGINE
 * Handles Web Speech Recognition, SpeechSynthesis audio output, Web Audio
 * sine-wave canvas visualizer, sub-300ms latency telemetry, and PMS slot sync.
 * ==============================================================================
 */

(function () {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. STATE & CLINICAL SCHEDULE DEFINITION
  // ----------------------------------------------------------------------------
  const state = {
    isCallActive: false,
    isMicActive: false,
    isSpeaking: false,
    currentStep: 'INIT', // INIT, GREETED, AWAITING_TIME, AWAITING_NAME, COMMITTED, COMPLETED, EMERGENCY
    lockedSlotId: null,
    bookedSlotId: null,
    selectedProvider: 'all',
    memory: {
      patientName: '',
      requestedDay: '',
      requestedTime: '',
      requestedDoctor: '',
      procedure: 'Comprehensive Exam & Cleaning',
      insurance: 'Delta Dental Premier PPO',
    }
  };

  const PMS_SCHEDULE = [
    { id: 'slot_1', time: '09:00 AM', provider: 'Dr. Sarah Lin, DDS', status: 'available', type: 'General & Hygiene' },
    { id: 'slot_2', time: '10:30 AM', provider: 'Dr. Sarah Lin, DDS', status: 'available', type: 'Emergency Exam' },
    { id: 'slot_3', time: '11:45 AM', provider: 'Dr. Hitesh Patel, DMD', status: 'booked', type: 'Surgical Extraction' },
    { id: 'slot_4', time: '01:15 PM', provider: 'Dr. Sarah Lin, DDS', status: 'available', type: 'Crown & Bridge' },
    { id: 'slot_5', time: '02:30 PM', provider: 'Dr. Hitesh Patel, DMD', status: 'available', type: 'Endodontic Root Canal' },
    { id: 'slot_6', time: '03:45 PM', provider: 'Dr. Hitesh Patel, DMD', status: 'available', type: 'Implant Consult' },
    { id: 'slot_7', time: '04:30 PM', provider: 'Dr. Sarah Lin, DDS', status: 'booked', type: 'Cosmetic Veneers' },
  ];

  // DOM Elements
  const btnToggleCall = document.getElementById('btn-toggle-call');
  const btnCallLabel = document.getElementById('btn-call-label');
  const btnToggleMic = document.getElementById('btn-toggle-mic');
  const btnResetDemo = document.getElementById('btn-reset-demo');
  const callStatePill = document.getElementById('call-state-pill');
  const callStateText = document.getElementById('call-state-text');
  const speechStatusBar = document.getElementById('speech-status-bar');
  const speechStatusText = document.getElementById('speech-status-text');
  const avatarRing = document.getElementById('agent-avatar-ring');
  const transcriptLog = document.getElementById('transcript-log');
  const pmsSlotsGrid = document.getElementById('pms-slots-grid');
  const bookingReceiptCard = document.getElementById('booking-receipt-card');
  const canvas = document.getElementById('waveform-canvas');
  const ctx = canvas.getContext('2d');
  const callerInputForm = document.getElementById('caller-input-form');
  const callerInputText = document.getElementById('caller-input-text');

  // Latency HUD DOM
  const hudTotal = document.getElementById('hud-total-latency');
  const hudStt = document.getElementById('hud-stt');
  const hudLlm = document.getElementById('hud-llm');
  const hudTts = document.getElementById('hud-tts');

  // ----------------------------------------------------------------------------
  // 2. SPEECH RECOGNITION (WEB SPEECH API)
  // ----------------------------------------------------------------------------
  let recognition = null;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleCallerUtterance(transcript);
    };

    recognition.onerror = (err) => {
      console.warn('Speech Recognition notice:', err.error);
      setMicState(false);
    };

    recognition.onend = () => {
      setMicState(false);
    };
  }

  // ----------------------------------------------------------------------------
  // 3. CANVAS AUDIO SINE-WAVE VISUALIZER
  // ----------------------------------------------------------------------------
  let animationId = null;
  let wavePhase = 0;

  function renderWaveform() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const midY = canvas.height / 2;
    const width = canvas.width;

    ctx.lineWidth = 2.5;

    if (!state.isCallActive) {
      // Resting subtle straight line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();
      animationId = requestAnimationFrame(renderWaveform);
      return;
    }

    // Dynamic wave modulation based on state
    const amplitude = state.isSpeaking ? 22 : state.isMicActive ? 14 : 4;
    const freq = state.isSpeaking ? 0.045 : 0.02;
    const speed = state.isSpeaking ? 0.18 : 0.06;

    wavePhase += speed;

    // Glowing primary wave
    ctx.strokeStyle = state.isSpeaking ? '#00f0ff' : state.isMicActive ? '#a78bfa' : 'rgba(0, 240, 255, 0.35)';
    ctx.shadowBlur = state.isSpeaking ? 14 : 0;
    ctx.shadowColor = '#00f0ff';

    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const envelope = Math.sin((x / width) * Math.PI); // Pinches ends
      const y = midY + Math.sin(x * freq + wavePhase) * amplitude * envelope;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Secondary harmonic wave
    if (state.isSpeaking || state.isMicActive) {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const envelope = Math.sin((x / width) * Math.PI);
        const y = midY + Math.cos(x * freq * 1.4 - wavePhase) * (amplitude * 0.6) * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    animationId = requestAnimationFrame(renderWaveform);
  }

  // ----------------------------------------------------------------------------
  // 4. PMS SCHEDULE RENDERING & STATE MUTATIONS
  // ----------------------------------------------------------------------------
  function renderPmsSchedule() {
    pmsSlotsGrid.innerHTML = '';
    let availCount = 0;

    PMS_SCHEDULE.forEach((slot) => {
      const isLocked = state.lockedSlotId === slot.id;
      const isBooked = state.bookedSlotId === slot.id || slot.status === 'booked';
      const isAvailable = !isLocked && !isBooked;

      if (isAvailable) availCount++;

      const card = document.createElement('div');
      card.className = `slot-card ${isBooked ? 'booked' : isLocked ? 'locked' : 'available'}`;
      card.id = `card_${slot.id}`;

      card.innerHTML = `
        <div class="slot-time">${slot.time}</div>
        <div class="slot-prov">${slot.provider}</div>
        <div class="slot-tag">${isBooked ? 'BOOKED' : isLocked ? 'HOLDING...' : 'AVAILABLE'}</div>
      `;
      pmsSlotsGrid.appendChild(card);
    });

    const counterEl = document.getElementById('slots-available-counter');
    if (counterEl) {
      counterEl.textContent = `${availCount} Slots Available`;
    }
  }

  function lockSlot(slotId) {
    state.lockedSlotId = slotId;
    renderPmsSchedule();
  }

  function commitSlot(slotId, patientName, procedure, timeStr, providerStr) {
    state.lockedSlotId = null;
    state.bookedSlotId = slotId;
    renderPmsSchedule();

    // Populate and animate receipt card
    bookingReceiptCard.style.display = 'block';
    document.getElementById('receipt-patient-name').textContent = patientName;
    document.getElementById('receipt-procedure').textContent = procedure;
    document.getElementById('receipt-time').textContent = timeStr;
    document.getElementById('receipt-provider').textContent = providerStr;
  }

  // ----------------------------------------------------------------------------
  // 5. CALL LIFECYCLE & AUDIO SPEECH SYNTHESIS
  // ----------------------------------------------------------------------------
  function startCall() {
    state.isCallActive = true;
    state.currentStep = 'GREETED';

    btnToggleCall.classList.add('active');
    btnCallLabel.textContent = 'Hang Up Call';
    btnToggleMic.disabled = false;

    callStatePill.className = 'call-state-pill active';
    callStateText.textContent = 'CALL CONNECTED';

    updateTelemetry(282, 109, 94, 79);

    appendTranscript('system', 'Call answered by Aura via Twilio SIP trunk (sub-300ms streaming audio buffer).');

    // Immediate warm greeting
    const greeting = "Thanks for calling Apex Dental Care. My name is Aura, the clinic AI coordinator. How can I help you today?";
    speakAI(greeting, () => {
      speechStatusText.textContent = 'Aura is listening. Click a scenario or use mic.';
    });
  }

  function hangUpCall() {
    state.isCallActive = false;
    state.isSpeaking = false;
    state.isMicActive = false;

    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognition) recognition.stop();

    btnToggleCall.classList.remove('active');
    btnCallLabel.textContent = 'Start Live Call';
    btnToggleMic.disabled = true;
    btnToggleMic.classList.remove('active');

    callStatePill.className = 'call-state-pill';
    callStateText.textContent = 'LINE IDLE';

    avatarRing.classList.remove('speaking');
    speechStatusText.textContent = 'Call ended. Click "Start Live Call" to restart.';

    appendTranscript('system', 'Call session terminated. Volatile audio buffer purged (Zero-Retention Mode).');
  }

  function setMicState(active) {
    state.isMicActive = active;
    if (active) {
      btnToggleMic.classList.add('active');
      speechStatusText.textContent = 'Listening to your microphone...';
    } else {
      btnToggleMic.classList.remove('active');
      speechStatusText.textContent = state.isCallActive ? 'Line open. Choose a prompt or speak.' : 'Line Idle.';
    }
  }

  function speakAI(text, onComplete) {
    appendTranscript('agent', text);
    state.isSpeaking = true;
    avatarRing.classList.add('speaking');
    callStatePill.className = 'call-state-pill speaking';
    callStateText.textContent = 'AURA SPEAKING';
    speechStatusText.textContent = 'Aura is speaking...';

    // Jitter latency slightly for realism
    const total = 280 + Math.floor(Math.random() * 15);
    const stt = 110 + Math.floor(Math.random() * 6);
    const llm = 92 + Math.floor(Math.random() * 6);
    const tts = total - stt - llm;
    updateTelemetry(total, stt, llm, tts);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05; // Natural conversational cadence
      utterance.pitch = 1.0;

      // Select high-quality English voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen')));
      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onend = () => {
        state.isSpeaking = false;
        avatarRing.classList.remove('speaking');
        callStatePill.className = 'call-state-pill active';
        callStateText.textContent = 'CALL CONNECTED';
        if (onComplete) onComplete();
      };

      utterance.onerror = () => {
        state.isSpeaking = false;
        avatarRing.classList.remove('speaking');
        if (onComplete) onComplete();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        state.isSpeaking = false;
        avatarRing.classList.remove('speaking');
        if (onComplete) onComplete();
      }, 2500);
    }
  }

  // ----------------------------------------------------------------------------
  // ----------------------------------------------------------------------------
  // 6. CLINICAL CONVERSATION ENGINE & STATE MACHINE
  // ----------------------------------------------------------------------------
  function extractPatientName(text) {
    const clean = text.trim();
    const lower = clean.toLowerCase();

    // If it contains day/time/intent keywords, it's NOT a patient name
    const intentWords = [
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'morning', 'afternoon', 'evening', 'tomorrow', 'today', 'tonight',
      'appointment', 'schedule', 'book', 'dr', 'doctor', 'lin', 'patel',
      'tooth', 'toothache', 'cleaning', 'hygiene', 'reschedule', 'exam',
      'insurance', 'delta', 'dental', 'cost', 'price', 'am', 'pm'
    ];
    if (intentWords.some(w => lower.includes(w))) {
      return null;
    }

    const namePatterns = [
      /(?:my name is|i am|this is|i'm|call me|name's)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i,
      /^([a-zA-Z]+(?:\s+[a-zA-Z]+)?)$/i
    ];

    const stopWords = [
      'yes', 'sure', 'confirm', 'okay', 'ok', 'yep', 'yeah', 'correct', 'right',
      'hello', 'hi', 'hey', 'please', 'thanks', 'thank you', 'none', 'nothing',
      'that works', 'sounds good', 'book it', 'first', 'second', 'the first', 'the second'
    ];

    for (const pattern of namePatterns) {
      const match = clean.match(pattern);
      if (match && match[1]) {
        const candidate = match[1].trim();
        if (!stopWords.includes(candidate.toLowerCase()) && candidate.length >= 2) {
          return candidate.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        }
      }
    }
    return null;
  }

  function handleCallerUtterance(text) {
    if (!text || !text.trim()) return;

    // Barge-in interruption: cancel agent speech immediately if user speaks
    if (state.isSpeaking && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      state.isSpeaking = false;
      avatarRing.classList.remove('speaking');
    }

    if (!state.isCallActive) {
      startCall();
      setTimeout(() => processUtterance(text), 1600);
    } else {
      processUtterance(text);
    }
  }

  function processUtterance(text) {
    appendTranscript('caller', text);
    speechStatusText.textContent = 'Aura analyzing clinical intent & Dentrix PMS slots...';

    const t = text.toLowerCase().trim();

    // 1. EMERGENCY CLINICAL TRIAGE TRIGGER
    if (t.includes('bleeding') || t.includes('uncontrollable') || t.includes('swelling') || t.includes('trauma') || t.includes('accident')) {
      state.currentStep = 'EMERGENCY';
      speechStatusText.textContent = 'CRITICAL TRIAGE: Warm Transfer Initiated';

      speakAI("This sounds like an acute surgical emergency. I am transferring your call immediately to our on-call clinical triage director, Dr. Hitesh Patel. Please hold while I bridge you.", () => {
        callStatePill.className = 'call-state-pill alert-chip';
        callStateText.textContent = 'WARM EMERGENCY TRANSFER';
        appendTranscript('system', 'Clinical alert: Caller transferred to On-Call Oral Surgeon Dr. Hitesh Patel.');
      });
      return;
    }

    // 2. WRAP-UP / GOODBYE AFTER BOOKING
    if (state.currentStep === 'COMMITTED' && (t.includes('no') || t.includes("that's all") || t.includes('that is all') || t.includes('nothing') || t.includes('thank') || t.includes('bye') || t.includes('goodbye'))) {
      state.currentStep = 'COMPLETED';
      const name = state.memory.patientName ? `, ${state.memory.patientName}` : '';
      speakAI(`You're very welcome${name}! We look forward to seeing you at Apex Dental Care. Have a wonderful rest of your day, goodbye!`, () => {
        speechStatusText.textContent = 'Call completed. Session ended gracefully.';
      });
      return;
    }

    // 3. DAY INTENTS & SLOTS SELECTION (e.g. "Monday", "Tomorrow morning", "Friday")
    if (t.includes('tomorrow morning') || (t.includes('tomorrow') && (t.includes('morning') || t.includes('am')))) {
      state.memory.requestedDay = 'Tomorrow';
      state.memory.requestedTime = '10:30 AM';
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_2');

      speakAI("Tomorrow morning is perfect. I have 10:30 AM available with Dr. Sarah Lin, and I've placed a temporary hold on that slot in our schedule. May I please have your full name to finalize the reservation?", () => {
        speechStatusText.textContent = 'Slot 10:30 AM held in Dentrix. Awaiting caller name.';
      });
      return;
    }

    if (t.includes('tomorrow afternoon') || (t.includes('tomorrow') && (t.includes('afternoon') || t.includes('pm')))) {
      state.memory.requestedDay = 'Tomorrow';
      state.memory.requestedTime = '01:15 PM';
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_4');

      speakAI("Tomorrow afternoon we have 1:15 PM with Dr. Sarah Lin or 2:30 PM with Dr. Patel. I've placed a hold on 1:15 PM for you. Would you like me to book this with your name?", () => {
        speechStatusText.textContent = 'Slot 1:15 PM held in Dentrix. Awaiting caller name.';
      });
      return;
    }

    if (t.includes('tomorrow')) {
      state.memory.requestedDay = 'Tomorrow';
      state.currentStep = 'AWAITING_TIME';
      lockSlot('slot_2');

      speakAI("For tomorrow, Dr. Sarah Lin has 10:30 AM in the morning and 1:15 PM in the afternoon. Which time works better for your schedule?", () => {
        speechStatusText.textContent = 'Tomorrow slots presented. Awaiting time preference.';
      });
      return;
    }

    if (t.includes('monday') || t.includes('mon')) {
      state.memory.requestedDay = 'Monday';
      state.currentStep = 'AWAITING_TIME';
      lockSlot('slot_1');

      speakAI("For Monday, Dr. Sarah Lin has an opening at 9:00 AM for hygiene and 10:30 AM for exams, or Dr. Patel has 2:30 PM in the afternoon. Would morning or afternoon suit you better?", () => {
        speechStatusText.textContent = 'Monday slots presented from Dentrix. Awaiting time preference.';
      });
      return;
    }

    if (t.includes('friday') || t.includes('fri')) {
      state.memory.requestedDay = 'Friday';
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_4');

      speakAI("For Friday, Dr. Sarah Lin has an opening at 1:15 PM, and Dr. Patel has 2:30 PM. I've held 1:15 PM with Dr. Lin for you. Would that work, and what is your name?", () => {
        speechStatusText.textContent = 'Friday 1:15 PM held in Dentrix. Awaiting caller name.';
      });
      return;
    }

    if (t.includes('tuesday') || t.includes('wednesday') || t.includes('thursday') || t.includes('next week')) {
      const dayCapitalized = t.includes('tuesday') ? 'Tuesday' : t.includes('wednesday') ? 'Wednesday' : t.includes('thursday') ? 'Thursday' : 'Next week';
      state.memory.requestedDay = dayCapitalized;
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_2');

      speakAI(`We have openings available for ${dayCapitalized}! Our earliest slot is 10:30 AM with Dr. Sarah Lin. I've placed a temporary hold on that time. Would you like me to book it with your name?`, () => {
        speechStatusText.textContent = `${dayCapitalized} 10:30 AM held in Dentrix. Awaiting caller name.`;
      });
      return;
    }

    // 5. TIME PREFERENCE INTENTS (e.g. "morning", "afternoon", "10:30", "1:15", "first one")
    if (t.includes('morning') || t.includes(' am') || t.includes('am ') || t.endsWith('am')) {
      state.memory.requestedTime = '10:30 AM';
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_2');

      speakAI("Got it, morning! I have 10:30 AM tomorrow with Dr. Sarah Lin available. I've placed a temporary 2-minute hold on that slot in Dentrix. May I have your full name to reserve it?", () => {
        speechStatusText.textContent = 'Dentrix lock: 10:30 AM held. Awaiting patient name.';
      });
      return;
    }

    if (t.includes('afternoon') || t.includes(' pm') || t.includes('pm ') || t.endsWith('pm') || t.includes('evening')) {
      state.memory.requestedTime = '01:15 PM';
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_4');

      speakAI("Understood, afternoon! I have 1:15 PM with Dr. Sarah Lin or 2:30 PM with Dr. Patel. I've held 1:15 PM for you. May I have your name to confirm it?", () => {
        speechStatusText.textContent = 'Dentrix lock: 1:15 PM held. Awaiting patient name.';
      });
      return;
    }

    if (t.includes('10:30') || t.includes('10 30') || t.includes('ten thirty')) {
      state.memory.requestedTime = '10:30 AM';
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_2');

      speakAI("10:30 AM is an ideal slot! I've held that time with Dr. Sarah Lin. May I please have your full name to complete the booking?", () => {
        speechStatusText.textContent = 'Dentrix lock: 10:30 AM held. Awaiting patient name.';
      });
      return;
    }

    if (t.includes('9:00') || t.includes('9 am') || t.includes('nine am') || t.includes('9am')) {
      state.memory.requestedTime = '09:00 AM';
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_1');

      speakAI("9:00 AM with Dr. Sarah Lin is held for you! What is your full name to finalize the reservation in Dentrix?", () => {
        speechStatusText.textContent = 'Dentrix lock: 09:00 AM held. Awaiting patient name.';
      });
      return;
    }

    if (t.includes('1:15') || t.includes('1 15') || t.includes('one fifteen')) {
      state.memory.requestedTime = '01:15 PM';
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_4');

      speakAI("1:15 PM with Dr. Sarah Lin is reserved! Could you please share your full name so I can dispatch your calendar invite?", () => {
        speechStatusText.textContent = 'Dentrix lock: 01:15 PM held. Awaiting patient name.';
      });
      return;
    }

    if (t.includes('2:30') || t.includes('2 30') || t.includes('two thirty')) {
      state.memory.requestedTime = '02:30 PM';
      state.memory.requestedDoctor = 'Dr. Hitesh Patel, DMD';
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_5');

      speakAI("2:30 PM with Dr. Hitesh Patel is held for you! May I have your full name to confirm?", () => {
        speechStatusText.textContent = 'Dentrix lock: 02:30 PM held. Awaiting patient name.';
      });
      return;
    }

    if (t.includes('first') || t.includes('first one') || t.includes('earliest')) {
      state.memory.requestedTime = '10:30 AM';
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_2');

      speakAI("Perfect, let's lock in the first opening tomorrow at 10:30 AM with Dr. Sarah Lin. May I have your full name to confirm?", () => {
        speechStatusText.textContent = 'Dentrix lock: 10:30 AM held. Awaiting patient name.';
      });
      return;
    }

    if (t.includes('second') || t.includes('second one') || t.includes('later')) {
      state.memory.requestedTime = '01:15 PM';
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_4');

      speakAI("Great, I've selected the afternoon opening at 1:15 PM with Dr. Sarah Lin. That time is now reserved in Dentrix. May I have your full name to finalize it?", () => {
        speechStatusText.textContent = 'Dentrix lock: 01:15 PM held. Awaiting patient name.';
      });
      return;
    }

    // 6. DOCTOR PREFERENCES
    if (t.includes('dr lin') || t.includes('dr. lin') || t.includes('sarah lin') || t.includes('lin')) {
      state.memory.requestedDoctor = 'Dr. Sarah Lin, DDS';
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_2');

      speakAI("Dr. Sarah Lin is fantastic! She has 10:30 AM tomorrow morning or 1:15 PM Friday. I've placed a temporary hold on 10:30 AM tomorrow for you. Would you like me to book that with your name?", () => {
        speechStatusText.textContent = 'Dr. Lin: 10:30 AM held. Awaiting caller name.';
      });
      return;
    }

    if (t.includes('dr patel') || t.includes('dr. patel') || t.includes('hitesh patel') || t.includes('patel')) {
      state.memory.requestedDoctor = 'Dr. Hitesh Patel, DMD';
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_5');

      speakAI("Dr. Hitesh Patel specializes in oral surgery, root canals, and implants. He has an opening Friday at 2:30 PM. I've held that slot for you. What is your full name to lock it in?", () => {
        speechStatusText.textContent = 'Dr. Patel: 2:30 PM held. Awaiting caller name.';
      });
      return;
    }

    // 7. CLINICAL PROCEDURES / SYMPTOMS
    if (t.includes('toothache') || t.includes('cracked molar') || t.includes('pain') || t.includes('cavity') || t.includes('hurt')) {
      state.memory.procedure = 'Emergency Toothache Exam';
      state.currentStep = 'AWAITING_TIME';
      lockSlot('slot_2');

      speakAI("I'm so sorry you're dealing with dental pain. We always prioritize urgent cases! I have an emergency exam slot tomorrow morning at 10:30 AM with Dr. Sarah Lin. Does that time work for you?", () => {
        speechStatusText.textContent = 'Emergency exam slot 10:30 AM held. Awaiting caller response.';
      });
      return;
    }

    if (t.includes('cleaning') || t.includes('hygiene') || t.includes('checkup') || t.includes('routine')) {
      state.memory.procedure = 'Routine Hygiene Cleaning';
      state.currentStep = 'AWAITING_TIME';
      lockSlot('slot_1');

      speakAI("Preventive cleanings are so important! We have a routine hygiene opening tomorrow morning at 9:00 AM with Dr. Lin, or Friday at 1:15 PM. Which one fits your schedule better?", () => {
        speechStatusText.textContent = 'Hygiene slots retrieved. Awaiting time preference.';
      });
      return;
    }

    if (t.includes('reschedule')) {
      state.currentStep = 'AWAITING_TIME';
      lockSlot('slot_4');

      speakAI("I'd be glad to help you reschedule that cleaning. For Dr. Sarah Lin, I have an opening tomorrow morning at 10:30 AM, or this Friday at 1:15 PM. Would 10:30 AM work well for you?", () => {
        speechStatusText.textContent = 'Reschedule options retrieved. 10:30 AM held.';
      });
      return;
    }

    // 8. INSURANCE VERIFICATION
    if (t.includes('delta dental') || t.includes('insurance') || t.includes('ppo') || t.includes('metlife') || t.includes('cigna') || t.includes('aetna') || t.includes('guardian') || t.includes('coverage')) {
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_2');

      speakAI("Yes, we are in-network with Delta Dental Premier PPO, Guardian, MetLife, and Cigna! Preventative visits are typically covered at 100%. I have an open slot tomorrow at 10:30 AM with Dr. Lin. May I have your name to reserve it?", () => {
        speechStatusText.textContent = 'Insurance verified: In-Network PPO. 10:30 AM held.';
      });
      return;
    }

    // 9. PRICING & LOCATION
    if (t.includes('cost') || t.includes('price') || t.includes('how much') || t.includes('fee')) {
      state.currentStep = 'AWAITING_NAME';
      lockSlot('slot_2');

      speakAI("For self-pay patients, our new patient comprehensive exam and x-ray package is flat $149, or zero out-of-pocket under most PPO plans. We have 10:30 AM open tomorrow with Dr. Lin. Would you like me to hold that for you?", () => {
        speechStatusText.textContent = 'Fee schedule quoted ($149 or 100% PPO). 10:30 AM held.';
      });
      return;
    }

    if (t.includes('where') || t.includes('location') || t.includes('address') || t.includes('parking')) {
      speakAI("We are located at 450 Sutter Medical Pavilion, Suite 800, right next to Union Square with validated underground garage parking. Can I help you book an appointment while I have you on the line?", () => {
        speechStatusText.textContent = 'Clinic location provided. Awaiting scheduling inquiry.';
      });
      return;
    }

    // 9. CHECK FOR PATIENT NAME OR EXPLICIT CONFIRMATION
    const extractedName = extractPatientName(text);
    const isAffirmation = t === 'yes' || t.startsWith('yes ') || t.includes('confirm') || t.includes('sounds good') || 
                          t.includes('that works') || t.includes('book it') || t.includes('please do') || 
                          t.includes('sure') || t.includes('perfect') || t.includes('go ahead') || t.includes('book that');

    if ((state.currentStep === 'AWAITING_NAME' || state.lockedSlotId) && (extractedName || isAffirmation)) {
      const patientName = extractedName || state.memory.patientName || 'Alex Morgan';
      state.memory.patientName = patientName;
      state.currentStep = 'COMMITTED';

      const targetSlotId = state.lockedSlotId || 'slot_2';
      const slotObj = PMS_SCHEDULE.find(s => s.id === targetSlotId) || PMS_SCHEDULE[1];
      const timeStr = state.memory.requestedDay 
        ? `${state.memory.requestedDay} at ${slotObj.time}` 
        : `Tomorrow at ${slotObj.time}`;
      const providerStr = slotObj.provider;
      const procedureStr = state.memory.procedure || slotObj.type;

      commitSlot(targetSlotId, patientName, procedureStr, timeStr, providerStr);

      speakAI(`You are all set, ${patientName}! I have officially confirmed your appointment for ${timeStr} with ${providerStr}. We just texted your calendar invite and digital intake forms to your number. Is there anything else I can assist with today?`, () => {
        speechStatusText.textContent = 'Appointment committed to Dentrix. SMS sent.';
        appendTranscript('system', `PMS Update: Slot #${targetSlotId} locked -> committed. Calendar invitation dispatched via Twilio SMS.`);
      });
      return;
    }

    // 10. CONTEXT-AWARE SMART FALLBACK (Never repeats identical canned string blindly)
    if (state.currentStep === 'AWAITING_NAME') {
      const targetSlot = PMS_SCHEDULE.find(s => s.id === (state.lockedSlotId || 'slot_2')) || PMS_SCHEDULE[1];
      speakAI(`I have the ${targetSlot.time} opening held on our schedule for you. May I just have your full name so I can confirm the reservation in Dentrix?`, () => {
        speechStatusText.textContent = 'Slot held. Awaiting caller name.';
      });
    } else if (state.currentStep === 'AWAITING_TIME') {
      speakAI("Would tomorrow morning at 10:30 AM with Dr. Sarah Lin or Friday afternoon at 2:30 PM with Dr. Patel work better for you?", () => {
        speechStatusText.textContent = 'Awaiting day/time preference.';
      });
    } else if (state.currentStep === 'COMMITTED') {
      speakAI("Your appointment is confirmed on our schedule! Please let me know if you need directions, pre-visit instructions, or anything else today.");
    } else {
      state.currentStep = 'AWAITING_TIME';
      speakAI("I can certainly help you with that! We have openings available tomorrow morning at 10:30 AM with Dr. Sarah Lin or Friday afternoon at 2:30 PM with Dr. Patel. Which day works best for your schedule?", () => {
        speechStatusText.textContent = 'Schedule options presented. Awaiting caller choice.';
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 7. UTILITIES & TELEMETRY UPDATES
  // ----------------------------------------------------------------------------
  function appendTranscript(type, msg) {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;

    const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (type === 'system') {
      entry.innerHTML = `<span class="speaker">[${now}]</span><span class="log-text">${escapeHtml(msg)}</span>`;
    } else if (type === 'caller') {
      entry.innerHTML = `<span class="speaker">[Caller]:</span><span class="log-text">${escapeHtml(msg)}</span>`;
    } else {
      entry.innerHTML = `<span class="speaker">[Aura AI]:</span><span class="log-text">${escapeHtml(msg)}</span>`;
    }

    transcriptLog.appendChild(entry);
    transcriptLog.scrollTop = transcriptLog.scrollHeight;
  }

  function updateTelemetry(total, stt, llm, tts) {
    hudTotal.innerHTML = `${total} <span class="unit">ms</span>`;
    hudStt.textContent = `${stt} ms`;
    hudLlm.textContent = `${llm} ms`;
    hudTts.textContent = `${tts} ms`;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function resetDemo() {
    hangUpCall();
    state.lockedSlotId = null;
    state.bookedSlotId = null;
    state.currentStep = 'INIT';
    state.memory = {
      patientName: '',
      requestedDay: '',
      requestedTime: '',
      requestedDoctor: '',
      procedure: 'Comprehensive Exam & Cleaning',
      insurance: 'Delta Dental Premier PPO',
    };
    if (callerInputText) callerInputText.value = '';
    bookingReceiptCard.style.display = 'none';
    renderPmsSchedule();
    transcriptLog.innerHTML = `
      <div class="log-entry system-msg">
        <span class="log-time">[System]</span>
        <span class="log-text">Session reset. Sub-300ms audio pipeline ready.</span>
      </div>
    `;
    updateTelemetry(285, 112, 94, 79);
  }

  // ----------------------------------------------------------------------------
  // 8. EVENT LISTENERS
  // ----------------------------------------------------------------------------
  btnToggleCall.addEventListener('click', () => {
    if (state.isCallActive) hangUpCall();
    else startCall();
  });

  btnToggleMic.addEventListener('click', () => {
    if (!state.isCallActive) {
      startCall();
      setTimeout(() => {
        if (recognition) {
          try {
            recognition.start();
            setMicState(true);
          } catch (e) {
            console.warn('SpeechRecognition error:', e);
          }
        }
      }, 1000);
      return;
    }
    if (recognition) {
      if (state.isMicActive) {
        recognition.stop();
        setMicState(false);
      } else {
        try {
          recognition.start();
          setMicState(true);
        } catch (e) {
          console.warn('SpeechRecognition error:', e);
        }
      }
    } else {
      alert('Speech Recognition is not supported by your current browser. You can type directly in the chat box below or click any scenario!');
    }
  });

  btnResetDemo.addEventListener('click', resetDemo);

  // Quick scenario chips
  document.querySelectorAll('.scenario-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) handleCallerUtterance(prompt);
    });
  });

  // Direct text input form
  if (callerInputForm && callerInputText) {
    callerInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = callerInputText.value.trim();
      if (!val) return;
      callerInputText.value = '';
      handleCallerUtterance(val);
    });
  }

  // Initialize
  renderPmsSchedule();
  renderWaveform();

})();
