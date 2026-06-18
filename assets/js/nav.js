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
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-nav__list a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current) a.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initActiveSidebarLink();
  // auto-init any quizzes on the page
  document.querySelectorAll('[id^="quiz-"]').forEach(q => initQuiz(q.id));
});
