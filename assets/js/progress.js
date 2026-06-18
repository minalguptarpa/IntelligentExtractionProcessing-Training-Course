/* =============================================
   IXP Course - progress.js
   Tracks module completion in localStorage
   Key: 'ixp-course-progress'
   Value: { "module-01": true, "module-02": true, ... }
   ============================================= */

const PROGRESS_KEY = 'ixp-course-progress';

const MODULES = [
  'module-01', 'module-02', 'module-03',
  'module-04', 'module-05', 'module-06', 'module-07'
];

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function saveProgress(data) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

function isCompleted(moduleId) {
  return !!getProgress()[moduleId];
}

function markComplete(moduleId) {
  const p = getProgress();
  p[moduleId] = true;
  saveProgress(p);
  dispatchProgressEvent(moduleId);
}

function markIncomplete(moduleId) {
  const p = getProgress();
  delete p[moduleId];
  saveProgress(p);
  dispatchProgressEvent(moduleId);
}

function getCompletedCount() {
  return MODULES.filter(id => isCompleted(id)).length;
}

function getProgressPercent() {
  return Math.round((getCompletedCount() / MODULES.length) * 100);
}

function dispatchProgressEvent(moduleId) {
  document.dispatchEvent(new CustomEvent('progressChanged', { detail: { moduleId } }));
}

/* ---- Update DOM progress bars (index page) ---- */
function updateProgressUI() {
  const percent = getProgressPercent();
  const count = getCompletedCount();

  // Progress bar fills
  document.querySelectorAll('.progress-bar-fill').forEach(el => {
    el.style.width = percent + '%';
  });
  // Stat numbers
  const numEl = document.getElementById('completed-count');
  const pctEl = document.getElementById('progress-percent');
  if (numEl) numEl.textContent = count;
  if (pctEl) pctEl.textContent = percent + '%';

  // Module card statuses
  MODULES.forEach(id => {
    const card = document.querySelector(`[data-module="${id}"]`);
    if (!card) return;
    const statusEl = card.querySelector('.module-card__status');
    const btnEl = card.querySelector('.btn');
    if (isCompleted(id)) {
      card.classList.add('completed');
      if (statusEl) { statusEl.textContent = '✓ Completed'; statusEl.className = 'module-card__status module-card__status--completed'; }
      if (btnEl) { btnEl.textContent = 'Review'; }
    } else {
      card.classList.remove('completed');
      if (statusEl) { statusEl.textContent = 'Not started'; statusEl.className = 'module-card__status module-card__status--not-started'; }
    }
  });
}

/* ---- Module page: wire up "Mark Complete" button ---- */
function initModulePage(moduleId) {
  const btn = document.getElementById('mark-complete-btn');
  if (!btn) return;

  function updateBtn() {
    if (isCompleted(moduleId)) {
      btn.textContent = '✓ Completed';
      btn.classList.add('completed');
      btn.disabled = true;
    } else {
      btn.textContent = 'Mark as Complete';
      btn.classList.remove('completed');
      btn.disabled = false;
    }
  }
  updateBtn();

  btn.addEventListener('click', () => {
    markComplete(moduleId);
    updateBtn();
    // Show toast
    showToast('🎉 Module marked as complete!');
  });

  // Sidebar nav: mark completed items with ✓
  document.querySelectorAll('.sidebar-nav__list a[data-module]').forEach(a => {
    const id = a.getAttribute('data-module');
    if (isCompleted(id)) {
      let check = a.querySelector('.check');
      if (!check) { check = document.createElement('span'); check.className = 'check'; check.textContent = '✓'; a.appendChild(check); }
    }
  });
}

function showToast(msg) {
  const existing = document.getElementById('ixp-toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.id = 'ixp-toast';
  t.style.cssText = `position:fixed;bottom:24px;right:24px;background:#065F46;color:#fff;padding:12px 20px;border-radius:8px;font-size:.875rem;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,.2);z-index:9999;transition:opacity .3s;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 350); }, 3000);
}

document.addEventListener('DOMContentLoaded', updateProgressUI);
document.addEventListener('progressChanged', updateProgressUI);
