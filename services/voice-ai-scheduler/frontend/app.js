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
    currentStep: 'INIT', // INIT, GREETED, OFFERING, BOOKED, EMERGENCY
    lockedSlotId: null,
    bookedSlotId: null,
    selectedProvider: 'all',
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
  // 6. CLINICAL CONVERSATION ENGINE & ACTION TRIGGERS
  // ----------------------------------------------------------------------------
  function handleCallerUtterance(text) {
    if (!state.isCallActive) {
      startCall();
      setTimeout(() => processUtterance(text), 1500);
    } else {
      processUtterance(text);
    }
  }

  function processUtterance(text) {
    appendTranscript('caller', text);
    speechStatusText.textContent = 'Aura analyzing clinical intent & PMS slots...';

    const t = text.toLowerCase();

    // 1. EMERGENCY CLINICAL TRIAGE TRIGGER
    if (t.includes('bleeding') || t.includes('uncontrollable') || t.includes('swelling') || t.includes('trauma')) {
      state.currentStep = 'EMERGENCY';
      speechStatusText.textContent = 'CRITICAL TRIAGE: Warm Transfer Initiated';

      speakAI("This sounds like an acute surgical emergency. I am transferring your call immediately to our on-call clinical triage director. Please hold while I bridge you.", () => {
        callStatePill.className = 'call-state-pill alert-chip';
        callStateText.textContent = 'WARM EMERGENCY TRANSFER';
        appendTranscript('system', 'Clinical alert: Caller transferred to On-Call Oral Surgeon Dr. Hitesh Patel.');
      });
      return;
    }

    // 2. RESCHEDULING SCENARIO
    if (t.includes('reschedule') || (t.includes('hygiene') && t.includes('friday'))) {
      state.currentStep = 'OFFERING';
      lockSlot('slot_4');

      speakAI("I'd be glad to help you reschedule that cleaning. For Dr. Sarah Lin, I have an opening this Friday at 1:15 PM, or with Dr. Patel at 2:30 PM. Would 1:15 PM work well for you?", () => {
        speechStatusText.textContent = 'Slot 1:15 PM held. Awaiting caller confirmation.';
      });
      return;
    }

    // 3. INSURANCE VERIFICATION SCENARIO
    if (t.includes('delta dental') || t.includes('insurance') || t.includes('consultation')) {
      state.currentStep = 'OFFERING';
      lockSlot('slot_2');

      speakAI("Yes, we are in-network with Delta Dental Premier PPO! For a new patient consultation, I have an opening tomorrow morning at 10:30 AM with Dr. Lin. Would you like me to reserve that slot for you?", () => {
        speechStatusText.textContent = 'Insurance verified. 10:30 AM held.';
      });
      return;
    }

    // 4. CONFIRMATION STEP (OR TOOTHACHE DEFAULT)
    if (t.includes('confirm') || t.includes('yes') || t.includes('toothache') || t.includes('cracked molar') || t.includes('pain') || state.currentStep === 'OFFERING') {
      state.currentStep = 'BOOKED';
      const slot = PMS_SCHEDULE.find(s => s.id === 'slot_2');

      commitSlot('slot_2', 'Alex Morgan', 'Emergency Toothache Exam', 'Thursday at 10:30 AM', 'Dr. Sarah Lin, DDS');

      speakAI("You are all set, Alex! I've confirmed your appointment for Thursday at 10:30 AM with Dr. Sarah Lin. We just texted your calendar invite and intake forms to your number. Is there anything else I can assist with today?", () => {
        speechStatusText.textContent = 'Appointment committed to Dentrix. SMS sent.';
        appendTranscript('system', 'PMS Update: Slot #slot_2 locked -> committed. Calendar invitation dispatched via Twilio SMS.');
      });
      return;
    }

    // Default Fallback
    speakAI("I can certainly help you with that. We have openings available tomorrow morning with Dr. Lin or Friday afternoon with Dr. Patel. Which day works best for your schedule?");
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
    if (!state.isCallActive) return;
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
      alert('Speech Recognition is not supported by your current browser. Please click one of the quick scenario buttons below to test!');
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

  // Initialize
  renderPmsSchedule();
  renderWaveform();

})();
