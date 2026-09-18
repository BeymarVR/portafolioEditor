/* ==========================================================================
   PORTFOLIO ADMIN — admin.js
   CRUD panel backed by localStorage
   ========================================================================== */

const STORAGE_KEY = 'portfolio_items';

/* ── Default Data (los 7 proyectos actuales del portafolio) ─────────────── */
const DEFAULT_PORTFOLIO_ITEMS = [
  {
    id: 'item-001',
    order: 1,
    category: 'youtube',
    videoType: 'youtube',
    videoSrc: 'https://youtu.be/eDU4u3DKWhw?si=_oCu_uEek6VDMsFf',
    thumbnail: 'assets/coju.jpeg',
    tag: 'YouTube / Dinamica',
    title: 'UNA CHICA GAMER VS 7 CHICOS | CojudoX',
    description: 'Ritmo rapido y divertido, con transiciones, efectos de sonido y música sin copyright.'
  },
  {
    id: 'item-002',
    order: 2,
    category: 'comercial',
    videoType: 'dailymotion',
    videoSrc: 'https://dai.ly/xataj1q',
    thumbnail: 'assets/capcut.jpeg',
    tag: 'Comercial',
    title: 'Video Promocional - Curso de Edicion',
    description: 'Reel promocionando un curso de edición, editado dinámicamente con transiciones fluidas, efectos de sonido y música sin copyright.'
  },
  {
    id: 'item-003',
    order: 3,
    category: 'shorts',
    videoType: 'dailymotion',
    videoSrc: 'https://dai.ly/xatamhm',
    thumbnail: 'assets/editing.jpeg',
    tag: 'TikTok / Reel',
    title: 'El Problema es TU EDICION',
    description: 'Video vertical editado dinámicamente con efectos de zoom para retención máxima.'
  },
  {
    id: 'item-004',
    order: 4,
    category: 'shorts',
    videoType: 'dailymotion',
    videoSrc: 'https://dai.ly/xatannm',
    thumbnail: 'assets/edi.jpeg',
    tag: 'Reels / Shorts',
    title: 'El 80% de los videos VIRALES son por su EDICION',
    description: 'Video vertical editado dinámicamente con efectos de zoom y subtítulos para retención máxima.'
  },
  {
    id: 'item-005',
    order: 5,
    category: 'shorts',
    videoType: 'dailymotion',
    videoSrc: 'https://dai.ly/xataiam',
    thumbnail: 'assets/poderlocal.png',
    tag: 'Reels / TikTok',
    title: 'LOS MEJORES PRODUCTOS ARTESANALES DE BOLIVIA',
    description: 'Promocionando PoderLocal, negocio de productos artesanales, con efectos de zoom y B-roll para retención máxima.'
  },
  {
    id: 'item-006',
    order: 6,
    category: 'youtube',
    videoType: 'youtube',
    videoSrc: 'https://youtu.be/PUe4PNCtwGo?si=9uNdUwRMO1TVRisY',
    thumbnail: 'assets/bolivia.png',
    tag: 'YouTube / Entretenimiento',
    title: 'La vida de un Boliviano',
    description: 'Un video que muestra la vida cotidiana de un boliviano, sus costumbres, tradiciones y su cultura.'
  },
  {
    id: 'item-007',
    order: 7,
    category: 'comercial',
    videoType: 'dailymotion',
    videoSrc: 'https://dai.ly/xataiai',
    thumbnail: 'assets/tamara.png',
    tag: 'TikTok',
    title: 'LOS MEJORES departamentos en Venta de SCZ',
    description: 'Un video que muestra los mejores departamentos en venta en Santa Cruz, Bolivia.'
  }
];

/* ── Estado ─────────────────────────────────────────────────────────────── */
let portfolioItems = [];
let currentFilter  = 'all';
let editingId      = null;
let deletingId     = null;

/* ── Utilidades ──────────────────────────────────────────────────────────── */
function generateId() {
  return 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function loadItems() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      portfolioItems = JSON.parse(stored);
      if (!Array.isArray(portfolioItems) || portfolioItems.length === 0) throw new Error();
    } catch (_) {
      portfolioItems = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_ITEMS));
      saveItems();
    }
  } else {
    portfolioItems = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_ITEMS));
    saveItems();
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioItems));
}

function getSortedItems() {
  return [...portfolioItems].sort((a, b) => a.order - b.order);
}

function getFilteredItems() {
  const sorted = getSortedItems();
  if (currentFilter === 'all') return sorted;
  return sorted.filter(item => item.category === currentFilter);
}

function getCategoryLabel(cat) {
  return { youtube: 'YouTube', shorts: 'Reels/Shorts', comercial: 'Comercial' }[cat] || cat;
}
function getCategoryClass(cat) {
  return { youtube: 'cat-youtube', shorts: 'cat-shorts', comercial: 'cat-comercial' }[cat] || '';
}

/* ── Toast ───────────────────────────────────────────────────────────────── */
let _toastTimer;
function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast toast-${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = 'toast'; }, 3200);
}

/* ── Stats ───────────────────────────────────────────────────────────────── */
function renderStats() {
  const total     = portfolioItems.length;
  const youtube   = portfolioItems.filter(i => i.category === 'youtube').length;
  const shorts    = portfolioItems.filter(i => i.category === 'shorts').length;
  const comercial = portfolioItems.filter(i => i.category === 'comercial').length;

  document.getElementById('stats-row').innerHTML = `
    <div class="stat-card">
      <div class="stat-number">${total}</div>
      <div class="stat-label">Total Proyectos</div>
    </div>
    <div class="stat-card cat-youtube-card">
      <div class="stat-number">${youtube}</div>
      <div class="stat-label">YouTube</div>
    </div>
    <div class="stat-card cat-shorts-card">
      <div class="stat-number">${shorts}</div>
      <div class="stat-label">Reels / Shorts</div>
    </div>
    <div class="stat-card cat-comercial-card">
      <div class="stat-number">${comercial}</div>
      <div class="stat-label">Comerciales</div>
    </div>
  `;

  const filteredCount = currentFilter === 'all'
    ? total
    : portfolioItems.filter(i => i.category === currentFilter).length;
  document.getElementById('items-count').textContent =
    `${filteredCount} proyecto${filteredCount !== 1 ? 's' : ''}`;
}

/* ── Renderizar lista de proyectos ────────────────────────────────────────── */
function renderProjects() {
  const list       = document.getElementById('projects-list');
  const emptyState = document.getElementById('empty-state');
  const filtered   = getFilteredItems();

  renderStats();

  if (filtered.length === 0) {
    list.style.display        = 'none';
    emptyState.style.display  = 'flex';
    lucide.createIcons();
    return;
  }

  list.style.display       = 'flex';
  emptyState.style.display = 'none';

  const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='62'%3E%3Crect width='90' height='62' fill='%231a1f35'/%3E%3Ctext x='45' y='36' font-size='11' fill='%235c6480' text-anchor='middle'%3ESin img%3C/text%3E%3C/svg%3E";

  list.innerHTML = filtered.map((item, idx) => `
    <div class="project-row" data-id="${item.id}">

      <!-- Orden -->
      <div class="project-row-order">
        <span class="order-num">${item.order}</span>
        <div class="order-btns">
          <button class="order-btn" data-action="move-up" data-id="${item.id}"
            title="Subir" ${idx === 0 ? 'disabled' : ''}>
            <i data-lucide="chevron-up"></i>
          </button>
          <button class="order-btn" data-action="move-down" data-id="${item.id}"
            title="Bajar" ${idx === filtered.length - 1 ? 'disabled' : ''}>
            <i data-lucide="chevron-down"></i>
          </button>
        </div>
      </div>

      <!-- Miniatura -->
      <div class="project-row-thumb">
        <img
          src="${item.thumbnail || ''}"
          alt="${escapeHtml(item.title)}"
          onerror="this.src='${FALLBACK_IMG}'"
        >
      </div>

      <!-- Info -->
      <div class="project-row-info">
        <div class="project-row-header">
          <h4 class="project-row-title">${escapeHtml(item.title)}</h4>
          <span class="category-badge ${getCategoryClass(item.category)}">${getCategoryLabel(item.category)}</span>
        </div>
        <p class="project-row-desc">${escapeHtml(item.description || '—')}</p>
        <div class="project-row-meta">
          <span class="meta-chip">
            <i data-lucide="${item.videoType === 'youtube' ? 'youtube' : 'play-circle'}"></i>
            ${item.videoType === 'youtube' ? 'YouTube' : 'Dailymotion'}
          </span>
          ${item.tag ? `<span class="meta-chip">${escapeHtml(item.tag)}</span>` : ''}
        </div>
      </div>

      <!-- Acciones -->
      <div class="project-row-actions">
        <button class="action-btn edit-btn" data-action="edit" data-id="${item.id}">
          <i data-lucide="pencil"></i> Editar
        </button>
        <button class="action-btn delete-btn" data-action="delete" data-id="${item.id}">
          <i data-lucide="trash-2"></i> Eliminar
        </button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
  attachRowListeners();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function attachRowListeners() {
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const action = btn.getAttribute('data-action');
      const id     = btn.getAttribute('data-id');
      if (action === 'edit')       openModal(id);
      else if (action === 'delete') openDeleteModal(id);
      else if (action === 'move-up')   moveItem(id, 'up');
      else if (action === 'move-down') moveItem(id, 'down');
    });
  });
}

/* ── Reordenar ───────────────────────────────────────────────────────────── */
function moveItem(id, direction) {
  const filtered = getFilteredItems();
  const idx      = filtered.findIndex(i => i.id === id);
  if (idx === -1) return;

  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= filtered.length) return;

  const curr   = portfolioItems.find(i => i.id === filtered[idx].id);
  const target = portfolioItems.find(i => i.id === filtered[targetIdx].id);
  if (!curr || !target) return;

  [curr.order, target.order] = [target.order, curr.order];

  saveItems();
  renderProjects();
  showToast('Orden actualizado ✓');
}

/* ── Modal Agregar/Editar ────────────────────────────────────────────────── */
function openModal(id = null) {
  editingId = id;
  const modal        = document.getElementById('project-modal');
  const modalTitle   = document.getElementById('modal-title-text');
  const saveText     = document.getElementById('modal-save-text');

  // Limpiar formulario
  document.getElementById('project-form').reset();
  document.getElementById('field-id').value = '';
  updateThumbPreview('');

  if (id) {
    const item = portfolioItems.find(i => i.id === id);
    if (!item) return;
    modalTitle.textContent = 'Editar Proyecto';
    saveText.textContent   = 'Guardar Cambios';

    document.getElementById('field-id').value          = item.id;
    document.getElementById('field-title').value       = item.title;
    document.getElementById('field-description').value = item.description || '';
    document.getElementById('field-category').value    = item.category;
    document.getElementById('field-videoType').value   = item.videoType;
    document.getElementById('field-videoSrc').value    = item.videoSrc;
    document.getElementById('field-tag').value         = item.tag || '';
    document.getElementById('field-order').value       = item.order;
    document.getElementById('field-thumbnail').value   = item.thumbnail || '';
    updateThumbPreview(item.thumbnail);
  } else {
    modalTitle.textContent = 'Agregar Proyecto';
    saveText.textContent   = 'Agregar Proyecto';
    const maxOrder = portfolioItems.length > 0 ? Math.max(...portfolioItems.map(i => i.order)) : 0;
    document.getElementById('field-order').value = maxOrder + 1;
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('field-title').focus(), 100);
}

function closeModal() {
  document.getElementById('project-modal').classList.remove('active');
  document.getElementById('project-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  editingId = null;
}

function saveProject() {
  const title    = document.getElementById('field-title').value.trim();
  const videoSrc = document.getElementById('field-videoSrc').value.trim();

  if (!title) {
    showToast('El título es obligatorio', 'error');
    document.getElementById('field-title').focus();
    return;
  }
  if (!videoSrc) {
    showToast('La URL del video es obligatoria', 'error');
    document.getElementById('field-videoSrc').focus();
    return;
  }

  const id          = document.getElementById('field-id').value || generateId();
  const category    = document.getElementById('field-category').value;
  const videoType   = document.getElementById('field-videoType').value;
  const description = document.getElementById('field-description').value.trim();
  const tag         = document.getElementById('field-tag').value.trim();
  const order       = parseInt(document.getElementById('field-order').value) || (portfolioItems.length + 1);
  const thumbnail   = document.getElementById('field-thumbnail').value.trim();

  const projectData = { id, order, category, videoType, videoSrc, thumbnail, tag, title, description };

  if (editingId) {
    const idx = portfolioItems.findIndex(i => i.id === editingId);
    if (idx !== -1) portfolioItems[idx] = projectData;
    showToast('Proyecto actualizado ✓');
  } else {
    portfolioItems.push(projectData);
    showToast('Proyecto agregado ✓');
  }

  saveItems();
  closeModal();
  renderProjects();
}

/* ── Modal Eliminar ──────────────────────────────────────────────────────── */
function openDeleteModal(id) {
  deletingId = id;
  const item = portfolioItems.find(i => i.id === id);
  if (!item) return;

  document.getElementById('delete-project-name').textContent = `"${item.title}"`;

  const modal = document.getElementById('delete-modal');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
  document.getElementById('delete-modal').classList.remove('active');
  document.getElementById('delete-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  deletingId = null;
}

function confirmDelete() {
  if (!deletingId) return;
  portfolioItems = portfolioItems.filter(i => i.id !== deletingId);
  // Renormalizar órdenes
  portfolioItems.sort((a, b) => a.order - b.order).forEach((item, idx) => { item.order = idx + 1; });
  saveItems();
  closeDeleteModal();
  renderProjects();
  showToast('Proyecto eliminado', 'info');
}

/* ── Preview de miniatura ────────────────────────────────────────────────── */
function updateThumbPreview(src) {
  const img         = document.getElementById('thumb-preview');
  const placeholder = document.getElementById('thumb-placeholder');

  if (src && src.trim()) {
    img.src = src;
    img.style.display         = 'block';
    placeholder.style.display = 'none';
    img.onerror = () => {
      img.style.display         = 'none';
      placeholder.style.display = 'flex';
    };
  } else {
    img.src               = '';
    img.style.display         = 'none';
    placeholder.style.display = 'flex';
  }
}

/* ── Exportar / Importar ─────────────────────────────────────────────────── */
function exportData() {
  const blob = new Blob([JSON.stringify(portfolioItems, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href:     url,
    download: 'portfolio_backup_' + new Date().toISOString().slice(0, 10) + '.json'
  });
  a.click();
  URL.revokeObjectURL(url);
  showToast('Datos exportados ✓');
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error();
      portfolioItems = data;
      saveItems();
      renderProjects();
      showToast(`${data.length} proyectos importados ✓`);
    } catch (_) {
      showToast('Formato JSON inválido', 'error');
    }
  };
  reader.readAsText(file);
}

/* ── Filtro ──────────────────────────────────────────────────────────────── */
function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.admin-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
  });
  renderProjects();
}

/* ── Inicialización ──────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  loadItems();
  renderProjects();

  /* --- Botones principales --- */
  document.getElementById('add-project-btn').addEventListener('click', () => openModal());

  /* --- Modal editar/agregar --- */
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', closeModal);
  document.getElementById('modal-save-btn').addEventListener('click', saveProject);

  /* --- Modal eliminar --- */
  document.getElementById('delete-close-btn').addEventListener('click', closeDeleteModal);
  document.getElementById('delete-cancel-btn').addEventListener('click', closeDeleteModal);
  document.getElementById('delete-overlay').addEventListener('click', closeDeleteModal);
  document.getElementById('delete-confirm-btn').addEventListener('click', confirmDelete);

  /* --- Preview de miniatura: campo texto --- */
  document.getElementById('field-thumbnail').addEventListener('input', e => {
    updateThumbPreview(e.target.value);
  });

  /* --- Preview de miniatura: subir archivo --- */
  document.getElementById('field-thumbnail-file').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      document.getElementById('field-thumbnail').value = evt.target.result;
      updateThumbPreview(evt.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  /* --- Filtros --- */
  document.querySelectorAll('.admin-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.getAttribute('data-filter')));
  });

  /* --- Exportar / Importar --- */
  document.getElementById('export-btn').addEventListener('click', exportData);
  document.getElementById('import-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) importData(file);
    e.target.value = '';
  });

  /* --- Teclas --- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeDeleteModal(); }
  });

  /* --- Enter en formulario (excepto textarea) --- */
  document.getElementById('project-form').addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      saveProject();
    }
  });
});
