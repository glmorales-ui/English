/**
 * AI Foundry English Coach — C1
 * Main Script Application
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let currentMode = 'practice'; // 'practice' | 'timed'
  let globalScore = parseInt(localStorage.getItem('c1_score') || '0', 10);
  let audioPlayCounts = { list1: 2, list2: 2 };
  
  // MediaRecorder State
  let mediaRecorder;
  let audioChunks = [];
  let speechRecognition;

  updateScoreDisplay();

  // Navigation Logic
  const navButtons = document.querySelectorAll('.nav-btn');
  const moduleCards = document.querySelectorAll('.module-card');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      moduleCards.forEach(c => c.classList.add('hidden'));

      btn.classList.add('active');
      const targetId = `module-${btn.dataset.module}`;
      document.getElementById(targetId).classList.remove('hidden');
    });
  });

  // Activity Tab Switching Logic
  const actTabs = document.querySelectorAll('.act-tab');
  actTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const parentModule = e.target.closest('.module-card');
      parentModule.querySelectorAll('.act-tab').forEach(t => t.classList.remove('active'));
      parentModule.querySelectorAll('.activity-content').forEach(c => c.classList.add('hidden'));

      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.remove('hidden');
    });
  });

  // Mode Selection
  const practiceBtn = document.getElementById('mode-practice-btn');
  const timedBtn = document.getElementById('mode-timed-btn');

  practiceBtn.addEventListener('click', () => {
    currentMode = 'practice';
    practiceBtn.classList.add('active');
    timedBtn.classList.remove('active');
    toggleHintsAndTimers();
  });

  timedBtn.addEventListener('click', () => {
    currentMode = 'timed';
    timedBtn.classList.add('active');
    practiceBtn.classList.remove('active');
    toggleHintsAndTimers();
  });

  function toggleHintsAndTimers() {
    const hintButtons = document.querySelectorAll('.btn-hint');
    const timerBanners = document.querySelectorAll('.timer-banner');
    
    if (currentMode === 'timed') {
      hintButtons.forEach(b => b.classList.add('hidden'));
      timerBanners.forEach(t => t.classList.remove('hidden'));
    } else {
      hintButtons.forEach(b => b.classList.remove('hidden'));
      timerBanners.forEach(t => t.classList.add('hidden'));
    }
  }

  function updateScoreDisplay() {
    document.getElementById('global-score').textContent = globalScore;
    localStorage.setItem('c1_score', globalScore.toString());
  }

  // --- LISTENING MODULE ---
  const textAudio1 = "While traditionalists express valid concerns regarding academic integrity in the era of generative AI, higher education institutions must pivot from outright prohibition toward algorithmic literacy. Integrating large language models into research methodology allows undergraduates to synthesize vast datasets rapidly. However, the cognitive heavy lifting—critical evaluation, contextual nuance, and ethical framing—remains uniquely human. Universities that fail to adapt risk producing graduates ill-equipped for automated workplaces.";

  document.getElementById('btn-play-list1').addEventListener('click', () => {
    if (currentMode === 'timed' && audioPlayCounts.list1 <= 0) {
      alert('No plays remaining for this audio in Timed Challenge mode!');
      return;
    }
    speakText(textAudio1);
    if (currentMode === 'timed') {
      audioPlayCounts.list1--;
      document.getElementById('plays-list1').textContent = `Plays remaining: ${audioPlayCounts.list1}`;
    }
  });

  document.getElementById('btn-script-list1').addEventListener('click', () => {
    document.getElementById('script-box-list1').classList.toggle('hidden');
  });

  document.getElementById('btn-hint-list1').addEventListener('click', () => {
    document.getElementById('hint-list1').classList.toggle('hidden');
  });

  document.getElementById('btn-sub-list1').addEventListener('click', () => {
    const g1 = document.getElementById('gap1').value.trim().toLowerCase();
    const g2 = document.getElementById('gap2').value.trim().toLowerCase();
    const g3 = document.getElementById('gap3').value.trim().toLowerCase();

    let score = 0;
    let feedbackHtml = '<h4>Listening Part 1 Results:</h4><ul>';

    if (g1.includes('algorithmic literacy')) {
      score++;
      feedbackHtml += '<li>Gap 1: ✅ <strong>Correct!</strong> ("algorithmic literacy")</li>';
    } else {
      feedbackHtml += '<li>Gap 1: ❌ <strong>Incorrect.</strong> Correct answer: <em>algorithmic literacy</em>. Note the speaker mentions pivoting away from prohibition.</li>';
    }

    if (g2.includes('synthesize')) {
      score++;
      feedbackHtml += '<li>Gap 2: ✅ <strong>Correct!</strong> ("synthesize")</li>';
    } else {
      feedbackHtml += '<li>Gap 2: ❌ <strong>Incorrect.</strong> Correct answer: <em>synthesize</em>. The text refers to processing vast datasets rapidly.</li>';
    }

    if (g3.includes('heavy lifting') || g3.includes('cognitive heavy lifting')) {
      score++;
      feedbackHtml += '<li>Gap 3: ✅ <strong>Correct!</strong> ("cognitive heavy lifting")</li>';
    } else {
      feedbackHtml += '<li>Gap 3: ❌ <strong>Incorrect.</strong> Correct answer: <em>cognitive heavy lifting</em>. This highlights the essential human contribution.</li>';
    }

    feedbackHtml += '</ul>';
    const fbBox = document.getElementById('fb-list1');
    fbBox.innerHTML = feedbackHtml;
    fbBox.classList.remove('hidden');

    if (score === 3) globalScore += 10;
    updateScoreDisplay();
  });

  // Listening Act 2
  document.getElementById('btn-sub-list2').addEventListener('click', () => {
    const m1 = document.getElementById('match1').value;
    const m2 = document.getElementById('match2').value;

    let fb = '<h4>Matching Feedback:</h4><ul>';
    if (m1 === 'B') {
      fb += '<li>Item 1: ✅ Correct (Marcus emphasizes autonomy and mental well-being).</li>';
    } else {
      fb += '<li>Item 1: ❌ Incorrect (Correct speaker: Marcus).</li>';
    }

    if (m2 === 'A') {
      fb += '<li>Item 2: ✅ Correct (Elena expresses concern over missing junior mentorship).</li>';
    } else {
      fb += '<li>Item 2: ❌ Incorrect (Correct speaker: Elena).</li>';
    }
    fb += '</ul>';

    const fbBox = document.getElementById('fb-list2');
    fbBox.innerHTML = fb;
    fbBox.classList.remove('hidden');
  });

  // --- READING MODULE ---
  document.getElementById('btn-hint-read1').addEventListener('click', () => {
    document.getElementById('hint-read1').classList.toggle('hidden');
  });

  document.getElementById('btn-sub-read1').addEventListener('click', () => {
    const rg1 = document.getElementById('read-gap1').value;
    const rg2 = document.getElementById('read-gap2').value;

    let fb = '<h4>Reading Gapped Text Analysis:</h4><ul>';
    if (rg1 === 'A') {
      fb += '<li>Gap 1: ✅ <strong>Correct!</strong> Sentence A ("This transactional relationship...") logically completes the idea of trading data for convenience.</li>';
    } else {
      fb += '<li>Gap 1: ❌ <strong>Incorrect.</strong> Option A is correct because "transactional relationship" explicitly connects to the prior sentence.</li>';
    }

    if (rg2 === 'A') {
      fb += '<li>Gap 2: ✅ <strong>Correct!</strong> Sentence A introduces the limitation of GDPR enforcement.</li>';
    } else {
      fb += '<li>Gap 2: ❌ <strong>Incorrect.</strong> Option A correctly introduces a contrast to GDPR effectiveness.</li>';
    }
    fb += '</ul>';

    const fbBox = document.getElementById('fb-read1');
    fbBox.innerHTML = fb;
    fbBox.classList.remove('hidden');
  });

  document.getElementById('btn-sub-read2').addEventListener('click', () => {
    const q1 = document.querySelector('input[name="read-mcq1"]:checked')?.value;
    const q2 = document.querySelector('input[name="read-mcq2"]:checked')?.value;

    let fb = '<h4>Inference Analysis:</h4><ul>';
    if (q1 === 'B') {
      fb += '<li>Q1: ✅ <strong>Correct.</strong> Author emphasizes human agency over deterministic technological views.</li>';
    } else {
      fb += '<li>Q1: ❌ <strong>Incorrect.</strong> Correct answer is B.</li>';
    }

    if (q2 === 'A') {
      fb += '<li>Q2: ✅ <strong>Correct.</strong> Conflating efficiency with inevitability implies assuming tech growth cannot be redirected.</li>';
    } else {
      fb += '<li>Q2: ❌ <strong>Incorrect.</strong> Correct answer is A.</li>';
    }
    fb += '</ul>';

    const fbBox = document.getElementById('fb-read2');
    fbBox.innerHTML = fb;
    fbBox.classList.remove('hidden');
  });

  // --- WRITING MODULE ---
  setupWordCounter('text-write1', 'wc-write1');
  setupWordCounter('text-write2', 'wc-write2');

  function setupWordCounter(inputId, displayId) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    input.addEventListener('input', () => {
      const words = input.value.trim().split(/\s+/).filter(w => w.length > 0).length;
      display.textContent = `Word Count: ${words} words`;
    });
  }

  // Timers for Writing
  document.getElementById('btn-start-write1').addEventListener('click', () => {
    startTimer(30 * 60, document.querySelector('#timer-write1 span'));
  });

  document.getElementById('btn-start-write2').addEventListener('click', () => {
    startTimer(20 * 60, document.querySelector('#timer-write2 span'));
  });

  document.getElementById('btn-sub-write1').addEventListener('click', () => {
    const text = document.getElementById('text-write1').value;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;

    let fb = `<h4>Essay Evaluation:</h4><p>Word count: <strong>${words}</strong> (Target: 220–280 words).</p>`;
    if (words >= 220 && words <= 280) {
      fb += '<p>✅ Length criteria met!</p>';
    } else {
      fb += '<p>⚠️ Word count is outside recommended C1 range.</p>';
    }
    fb += '<h5>C1 Rubric Review Checklist:</h5><ul><li>Cohesion: Are complex connectors (e.g., <em>nevertheless, notwithstanding</em>) used naturally?</li><li>Argumentation: Did you address at least two of the prompt points?</li></ul>';
    
    const fbBox = document.getElementById('fb-write1');
    fbBox.innerHTML = fb;
    fbBox.classList.remove('hidden');
  });

  // --- SPEAKING MODULE (getUserMedia & SpeechRecognition Corregido) ---
  const recBtn1 = document.getElementById('rec-btn-1');
  const stopBtn1 = document.getElementById('stop-btn-1');
  const status1 = document.getElementById('rec-status-1');
  const audioPreview1 = document.getElementById('audio-playback-1');
  const transcript1 = document.getElementById('transcript-1');

  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition = new SpeechRecognition();
    
    speechRecognition.continuous = true;
    speechRecognition.interimResults = false; // Corregido: evita duplicaciones acumulativas
    speechRecognition.lang = 'en-US';

    speechRecognition.onresult = (event) => {
      let transcriptActual = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcriptActual += event.results[i][0].transcript + ' ';
        }
      }
      if (transcriptActual.trim().length > 0) {
        transcript1.value = (transcript1.value + ' ' + transcriptActual).replace(/\s+/g, ' ').trim();
      }
    };

    speechRecognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
    };
  }

  recBtn1.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPreview1.src = audioUrl;
        audioPreview1.classList.remove('hidden');
      };

      mediaRecorder.start();
      if (speechRecognition) speechRecognition.start();

      recBtn1.disabled = true;
      stopBtn1.disabled = false;
      status1.textContent = 'Status: Recording...';
    } catch (err) {
      alert('Microphone access denied or not supported. You can still use timers and practice offline!');
      status1.textContent = 'Status: Mic Error';
    }
  });

  stopBtn1.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      if (speechRecognition) speechRecognition.stop();
      recBtn1.disabled = false;
      stopBtn1.disabled = true;
      status1.textContent = 'Status: Stopped & Saved';
    }
  });

  // Model Answer Playback
  document.getElementById('btn-model-1').addEventListener('click', () => {
    const modelDiv = document.getElementById('model-text-1');
    modelDiv.classList.toggle('hidden');
    const textToSpeak = modelDiv.innerText;
    speakText(textToSpeak);
  });

  // Speaking Timed Sequences (Prep + Speaking)
  setupSpeakingSequence('spk-start-2', 'spk-phase-2', 'spk-clock-2', 40, 50);
  setupSpeakingSequence('spk-start-3', 'spk-phase-3', 'spk-clock-3', 45, 120);

  function setupSpeakingSequence(btnId, phaseId, clockId, prepSecs, speakSecs) {
    document.getElementById(btnId).addEventListener('click', () => {
      const phaseEl = document.getElementById(phaseId);
      const clockEl = document.getElementById(clockId);

      phaseEl.textContent = 'Phase: Preparation';
      startCountdown(prepSecs, clockEl, () => {
        phaseEl.textContent = 'Phase: SPEAKING NOW!';
        startCountdown(speakSecs, clockEl, () => {
          phaseEl.textContent = 'Phase: Completed!';
        });
      });
    });
  }

  // --- COPY FOR FEEDBACK FEATURE ---
  setupCopyFeedback('btn-copy-write1', () => {
    const task = "Essay (AI in Higher Education)";
    const userText = document.getElementById('text-write1').value;
    return formatLLMPrompt(task, userText);
  });

  setupCopyFeedback('btn-copy-write2', () => {
    const task = "Synthesis Report (Remote Work Dynamics)";
    const userText = document.getElementById('text-write2').value;
    return formatLLMPrompt(task, userText);
  });

  setupCopyFeedback('btn-copy-speak1', () => {
    const task = "Speaking Task 1 (Voicemail regarding AI accuracy)";
    const userText = document.getElementById('transcript-1').value;
    return formatLLMPrompt(task, userText);
  });

  setupCopyFeedback('btn-copy-speak2', () => {
    const task = "Speaking Task 2 (Oral Synthesis)";
    const userText = document.getElementById('transcript-2').value;
    return formatLLMPrompt(task, userText);
  });

  setupCopyFeedback('btn-copy-speak3', () => {
    const task = "Speaking Task 3 (Extended Debate)";
    const userText = document.getElementById('transcript-3').value;
    return formatLLMPrompt(task, userText);
  });

  function setupCopyFeedback(btnId, getContentFn) {
    document.getElementById(btnId).addEventListener('click', () => {
      const content = getContentFn();
      navigator.clipboard.writeText(content).then(() => {
        alert('Copied to clipboard! You can now paste this prompt into your LLM for instant feedback.');
      });
    });
  }

  function formatLLMPrompt(taskName, userSubmission) {
    return `Act as an Oxford Test of English C1 Examiner. Evaluate my response for the following task:

[TASK]: ${taskName}
[MY RESPONSE]: 
${userSubmission || "(No text provided)"}

Please provide:
1. Two specific strengths in my response (focus on C1 vocabulary and discourse markers).
2. Two concrete areas for improvement.
3. One actionable suggestion for my next practice attempt.`;
  }

  // Helper Utilities
  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser. Please view the script.');
    }
  }

  function startTimer(durationSeconds, displayElement) {
    let timer = durationSeconds;
    const interval = setInterval(() => {
      const minutes = Math.floor(timer / 60);
      const seconds = timer % 60;
      displayElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      if (--timer < 0) {
        clearInterval(interval);
        displayElement.textContent = "00:00 - Time's Up!";
      }
    }, 1000);
  }

  function startCountdown(seconds, displayElement, onComplete) {
    let timer = seconds;
    const interval = setInterval(() => {
      const mins = Math.floor(timer / 60);
      const secs = timer % 60;
      displayElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      if (--timer < 0) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 1000);
  }
});