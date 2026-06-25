/* =============================================
   IXP Course - nav.js
   Quiz logic + general navigation helpers
   ============================================= */

/* ---- Quiz Engine ---- */
function initQuiz(quizId) {
  const quiz = document.getElementById(quizId);
  if (!quiz) return;

  const submitBtn = quiz.querySelector('.quiz-submit-btn');
  const resultEl = quiz.querySelector('.quiz-result');
  let total = 0; let correct = 0;

  submitBtn.addEventListener('click', () => {
    total = 0; correct = 0;
    quiz.querySelectorAll('.quiz-question').forEach(q => {
      total++;
      const feedback = q.querySelector('.quiz-feedback');
      const correctAnswer = q.dataset.correct; // comma-separated if multiple
      const correctAnswers = correctAnswer ? correctAnswer.split(',') : [];
      const type = q.dataset.type || 'single';

      let selected = [];
      if (type === 'single') {
        const checked = q.querySelector('input[type=radio]:checked');
        if (checked) selected = [checked.value];
      } else {
        q.querySelectorAll('input[type=checkbox]:checked').forEach(c => selected.push(c.value));
      }

      // Reset styles
      q.querySelectorAll('label').forEach(l => { l.classList.remove('correct', 'incorrect'); });

      const isCorrect = selected.length > 0 &&
        correctAnswers.every(a => selected.includes(a)) &&
        selected.every(a => correctAnswers.includes(a));

      if (isCorrect) {
        correct++;
        feedback.className = 'quiz-feedback show correct-fb';
        feedback.textContent = '✓ Correct! ' + (q.dataset.explanation || '');
        // highlight correct
        selected.forEach(v => {
          const lbl = q.querySelector(`label[data-value="${v}"]`);
          if (lbl) lbl.classList.add('correct');
        });
      } else {
        feedback.className = 'quiz-feedback show incorrect-fb';
        feedback.textContent = '✗ Incorrect. ' + (q.dataset.explanation || 'Review the lesson content and try again.');
        selected.forEach(v => {
          const lbl = q.querySelector(`label[data-value="${v}"]`);
          if (lbl) lbl.classList.add('incorrect');
        });
        // show correct
        correctAnswers.forEach(v => {
          const lbl = q.querySelector(`label[data-value="${v}"]`);
          if (lbl) lbl.classList.add('correct');
        });
      }
    });

    if (resultEl) {
      const pct = Math.round((correct / total) * 100);
      resultEl.className = 'quiz-result show ' + (pct >= 70 ? 'pass' : 'fail');
      resultEl.innerHTML = `You scored <strong>${correct}/${total}</strong> (${pct}%). ` +
        (pct >= 70 ? '🎉 Great job! You can proceed to the next module.' : '📚 Review the lesson content and try again.');
    }
  });
}

/* ---- Active sidebar link ---- */
function initActiveSidebarLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav__list a').forEach(a => {
    const href = a.getAttribute('href').split('#')[0].split('/').pop();
    if (href && href === current) a.classList.add('active');
  });
}

/* ---- Sidebar collapse/expand for modules with sub-parts ---- */
function initSidebarToggle() {
  const list = document.querySelector('.sidebar-nav__list');
  if (!list) return;

  const items = Array.from(list.querySelectorAll('li'));
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  let i = 0;
  while (i < items.length) {
    const mainLink = items[i].querySelector('a[data-module]');
    if (!mainLink) { i++; continue; }

    // Collect consecutive sub-link items following this module link
    const subItems = [];
    let j = i + 1;
    while (j < items.length) {
      const a = items[j].querySelector('a');
      if (a && (a.classList.contains('sidebar-nav__sub') || a.classList.contains('sidebar-nav__subsub'))) {
        subItems.push(items[j]);
        j++;
      } else break;
    }

    if (subItems.length === 0) { i++; continue; }

    // Check if current page is this module or one of its sub-pages
    const isActiveModule = subItems.some(si => {
      const f = si.querySelector('a').getAttribute('href').split('#')[0].split('/').pop();
      return f && f === currentFile;
    }) || mainLink.getAttribute('href').split('#')[0].split('/').pop() === currentFile;

    // Inject toggle arrow
    const toggle = document.createElement('span');
    toggle.className = 'sidebar-toggle';
    toggle.setAttribute('aria-hidden', 'true');
    toggle.textContent = isActiveModule ? ' ▼' : ' ▶';
    mainLink.appendChild(toggle);

    // Collapse sub-items if not on this module
    if (!isActiveModule) {
      subItems.forEach(si => { si.style.display = 'none'; });
    }

    // Each module toggles independently — multiple can be open at once
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isHidden = subItems[0].style.display === 'none';
      subItems.forEach(si => { si.style.display = isHidden ? '' : 'none'; });
      toggle.textContent = isHidden ? ' ▼' : ' ▶';
    });

    i = j;
  }
}

/* ---- Nested sub-group collapse/expand (e.g. Theory within Part 1) ---- */
function initSubGroupToggle() {
  const list = document.querySelector('.sidebar-nav__list');
  if (!list) return;

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  list.querySelectorAll('a[data-group]').forEach(groupLink => {
    const groupId = groupLink.getAttribute('data-group');
    const childItems = Array.from(
      list.querySelectorAll(`li a[data-child-of="${groupId}"]`)
    ).map(a => a.closest('li'));

    if (childItems.length === 0) return;

    // Expand if current page is one of the child pages or the group page itself
    const isActive = childItems.some(li => {
      const f = li.querySelector('a').getAttribute('href').split('#')[0].split('/').pop();
      return f && f === currentFile;
    }) || groupLink.getAttribute('href').split('#')[0].split('/').pop() === currentFile;

    const toggle = document.createElement('span');
    toggle.className = 'sidebar-toggle';
    toggle.setAttribute('aria-hidden', 'true');
    toggle.textContent = isActive ? ' ▼' : ' ▶';
    groupLink.appendChild(toggle);

    if (!isActive) {
      childItems.forEach(li => { li.style.display = 'none'; });
    }

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isHidden = childItems[0].style.display === 'none';
      childItems.forEach(li => { li.style.display = isHidden ? '' : 'none'; });
      toggle.textContent = isHidden ? ' ▼' : ' ▶';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initActiveSidebarLink();
  initSidebarToggle();
  initSubGroupToggle();
  // auto-init any quizzes on the page
  document.querySelectorAll('[id^="quiz-"]').forEach(q => initQuiz(q.id));
});
