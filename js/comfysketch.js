import { app } from "../../scripts/app.js";

/*
 * Quick Pose Sketch v7
 * - Filled SVG icons
 * - Separate floating panels: Toolbar, Color, Size/Opacity, Layers
 * - Light grey interface (#a3a3a3)
 * - All panels draggable
 */

// Add global slider styles
const globalSliderStyle = document.createElement('style');
globalSliderStyle.id = 'comfysketch-global-styles';
globalSliderStyle.textContent = `
    .comfysketch-slider {
        -webkit-appearance: none; appearance: none;
        background: #ccc; border-radius: 2px; outline: none;
    }
    .comfysketch-slider::-webkit-slider-thumb {
        -webkit-appearance: none; appearance: none;
        width: 10px; height: 10px; border-radius: 50%;
        background: #555; cursor: pointer; border: none;
    }
    .comfysketch-slider::-moz-range-thumb {
        width: 10px; height: 10px; border-radius: 50%;
        background: #555; cursor: pointer; border: none;
    }
    .tool-properties-panel input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none; appearance: none;
        width: 8px; height: 8px; border-radius: 50%;
        background: #555; cursor: pointer; border: none;
    }
    .tool-properties-panel input[type="range"]::-moz-range-thumb {
        width: 8px; height: 8px; border-radius: 50%;
        background: #555; cursor: pointer; border: none;
    }
`;
if (!document.getElementById('comfysketch-global-styles')) {
    document.head.appendChild(globalSliderStyle);
}

const PANEL_BG = 'rgba(249, 249, 249, 0.95)';
const PANEL_BORDER = '#ccc';
const TEXT_DARK = '#222';
const TEXT_LIGHT = '#666';

// ==================== LUCIDE ICONS ====================
const ICONS = {
    // File
    newFile: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>`,
    folder: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>`,
    save: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    // Tools
    brush: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>`,
    pencil: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
    line: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19 19 5"/></svg>`,
    circle: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`,
    fill: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/><path d="m5 2 5 5"/><path d="M2 13h15"/><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"/></svg>`,
    eraser: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>`,
    eyedropper: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/></svg>`,
    // Brush types
    roundBrush: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="6"/></svg>`,
    softBrush: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4" opacity="0.3"/><circle cx="12" cy="12" r="6" opacity="0.5"/><circle cx="12" cy="12" r="8" opacity="0.3"/></svg>`,
    airbrush: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3" opacity="0.6"/><circle cx="12" cy="12" r="5" opacity="0.4"/><circle cx="12" cy="12" r="7" opacity="0.2"/><circle cx="12" cy="12" r="9" opacity="0.1"/></svg>`,
    sprayBrush: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="6" cy="6" r="1.5"/><circle cx="18" cy="8" r="1"/><circle cx="8" cy="16" r="2"/><circle cx="16" cy="17" r="1.5"/><circle cx="12" cy="10" r="1"/><circle cx="14" cy="5" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="19" cy="14" r="1"/><circle cx="10" cy="19" r="1"/></svg>`,
    markerBrush: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12h14"/></svg>`,
    square: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
    // Transform
    flipH: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><path d="M12 20v2"/><path d="M12 14v2"/><path d="M12 8v2"/><path d="M12 2v2"/></svg>`,
    flipV: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/><path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"/><path d="M4 12H2"/><path d="M10 12H8"/><path d="M16 12h-2"/><path d="M22 12h-2"/></svg>`,
    // Mirror draw modes
    mirrorDrawH: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="m7 8-4 4 4 4"/><path d="m17 8 4 4-4 4"/></svg>`,
    mirrorDrawV: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18"/><path d="m8 7-4-4 4-4" transform="rotate(90 12 12)"/><path d="m8 17-4 4 4 4" transform="rotate(90 12 12)"/></svg>`,
    mirrorDrawBoth: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M3 12h18"/><circle cx="12" cy="12" r="2"/></svg>`,
    // Zoom
    fitToView: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>`,
    zoomIn: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>`,
    zoomOut: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>`,
    // Actions
    undo: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>`,
    redo: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    // Theme
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    // Layers
    addLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
    deleteLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
    mergeLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h10"/></svg>`,
    visible: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    hidden: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
};

// ==================== DRAGGABLE PANEL BASE ====================
class DraggablePanel {
    constructor(title, icon = '') {
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: absolute;
            background: ${PANEL_BG};
            border: 1px solid ${PANEL_BORDER};
            border-radius: 6px;
            padding: 4px;
            z-index: 100001;
            user-select: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        `;
        
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.isCollapsed = false;
        
        // Header
        this.header = document.createElement('div');
        this.header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2px 4px 4px 4px;
            margin-bottom: 4px;
            border-bottom: 1px solid ${PANEL_BORDER};
            cursor: move;
        `;
        
        const titleEl = document.createElement('span');
        titleEl.textContent = icon ? `${icon} ${title}` : title;
        titleEl.style.cssText = `font-size: 10px; color: ${TEXT_DARK}; font-weight: 600;`;
        this.header.appendChild(titleEl);
        
        const collapseBtn = document.createElement('button');
        collapseBtn.innerHTML = '−';
        collapseBtn.style.cssText = `
            background: none; border: none; color: ${TEXT_DARK};
            font-size: 12px; cursor: pointer; padding: 0 3px; line-height: 1;
        `;
        collapseBtn.onclick = (e) => { e.stopPropagation(); this.toggleCollapse(); };
        this.collapseBtn = collapseBtn;
        this.header.appendChild(collapseBtn);
        
        this.container.appendChild(this.header);
        
        // Content
        this.content = document.createElement('div');
        this.container.appendChild(this.content);
        
        // Drag events only (no resize)
        this.header.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', () => this.endDrag());
    }
    
    startDrag(e) {
        if (e.target.tagName === 'BUTTON') return;
        this.isDragging = true;
        const rect = this.container.getBoundingClientRect();
        this.dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        this.container.style.zIndex = '100010';
    }
    
    onMouseMove(e) {
        if (this.isDragging) {
            this.container.style.left = `${e.clientX - this.dragOffset.x}px`;
            this.container.style.top = `${e.clientY - this.dragOffset.y}px`;
        }
    }
    
    endDrag() {
        this.isDragging = false;
        this.container.style.zIndex = '100001';
    }
    
    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        this.content.style.display = this.isCollapsed ? 'none' : 'block';
        this.collapseBtn.innerHTML = this.isCollapsed ? '+' : '−';
    }
    
    updateTheme(isDark) {
        this.isDark = isDark;
        this.container.style.background = isDark ? 'rgba(45,45,45,0.98)' : PANEL_BG;
        this.container.style.borderColor = isDark ? '#555' : PANEL_BORDER;
        this.header.style.borderColor = isDark ? '#555' : PANEL_BORDER;
        this.header.querySelectorAll('span').forEach(el => el.style.color = isDark ? '#eee' : TEXT_DARK);
        this.collapseBtn.style.color = isDark ? '#eee' : TEXT_DARK;
        
        // Update all buttons
        this.content.querySelectorAll('button').forEach(btn => {
            const isActive = btn.style.background === 'rgb(169, 213, 255)';
            if (!isActive) {
                btn.style.background = isDark ? '#3a3a3a' : '#e8e8e8';
                btn.style.borderColor = isDark ? '#555' : '#ccc';
                btn.style.color = isDark ? '#eee' : '#444';
            }
        });
        
        // Update all text/labels
        this.content.querySelectorAll('span').forEach(el => {
            el.style.color = isDark ? '#ddd' : '#333';
        });
        this.content.querySelectorAll('div').forEach(el => {
            const fs = el.style.fontSize;
            if (fs === '8px' || fs === '7px' || fs === '9px') {
                el.style.color = isDark ? '#ccc' : TEXT_DARK;
            }
        });
        
        // Update inputs
        this.content.querySelectorAll('input[type="text"]').forEach(inp => {
            inp.style.background = isDark ? '#3a3a3a' : '#fff';
            inp.style.color = isDark ? '#eee' : '#222';
            inp.style.borderColor = isDark ? '#555' : '#ccc';
        });
        
        // Update sliders
        this.content.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.style.background = isDark ? '#555' : '#ccc';
        });
        
        // Update sub-panels and other backgrounds
        this.content.querySelectorAll('.tool-properties-panel').forEach(panel => {
            panel.style.background = isDark ? '#3a3a3a' : '#fff';
            panel.style.borderColor = isDark ? '#555' : '#ccc';
            panel.querySelectorAll('span').forEach(el => el.style.color = isDark ? '#ddd' : '#333');
            panel.querySelectorAll('button').forEach(btn => {
                btn.style.background = isDark ? '#4a4a4a' : '#e8e8e8';
                btn.style.borderColor = isDark ? '#666' : '#ccc';
                btn.style.color = isDark ? '#eee' : '#333';
            });
        });
    }
    
    setPosition(x, y) {
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;
    }
    
    getElement() { return this.container; }
}


// ==================== COLOR WHEEL PANEL ====================
class ColorWheelPanel extends DraggablePanel {
    constructor(pad) {
        super('Color');
        this.pad = pad;
        this.hue = 0;
        this.saturation = 0;
        this.value = 0;  // Start with black
        this.size = 138;
        this.isDraggingWheel = false;
        this.isDraggingSV = false;
        this.loadPresets();
        this.createContent();
    }
    
    loadPresets() {
        try {
            const saved = localStorage.getItem('comfysketch_presets');
            if (saved) {
                this.presets = JSON.parse(saved);
            } else {
                this.presets = [null, null, null, null, null, null];
            }
        } catch (e) {
            this.presets = [null, null, null, null, null, null];
        }
    }
    
    savePresets() {
        try {
            localStorage.setItem('comfysketch_presets', JSON.stringify(this.presets));
        } catch (e) { }
    }
    
    createContent() {
        this.content.style.cssText = 'width: 150px;';
        
        const wheelContainer = document.createElement('div');
        wheelContainer.style.cssText = `position: relative; width: ${this.size}px; height: ${this.size}px; margin: 0 auto 6px auto;`;
        
        this.wheelCanvas = document.createElement('canvas');
        this.wheelCanvas.width = this.size;
        this.wheelCanvas.height = this.size;
        this.wheelCanvas.style.cssText = 'position: absolute; cursor: crosshair;';
        wheelContainer.appendChild(this.wheelCanvas);
        
        this.svCanvas = document.createElement('canvas');
        this.svCanvas.width = this.size;
        this.svCanvas.height = this.size;
        this.svCanvas.style.cssText = 'position: absolute; top: 0; left: 0; cursor: crosshair;';
        wheelContainer.appendChild(this.svCanvas);
        this.content.appendChild(wheelContainer);
        
        // Color controls row: FG/BG + swap + eyedropper + hex
        const colorRow = document.createElement('div');
        colorRow.style.cssText = 'display: flex; gap: 4px; align-items: center; margin-bottom: 6px;';
        
        // FG/BG color stack
        const colorStack = document.createElement('div');
        colorStack.style.cssText = 'position: relative; width: 28px; height: 28px;';
        
        this.bgColorBtn = document.createElement('button');
        this.bgColorBtn.style.cssText = `
            position: absolute; bottom: 0; right: 0;
            width: 18px; height: 18px; border-radius: 2px;
            border: 1px solid #999; background: ${this.pad.bgColor};
            cursor: pointer;
        `;
        this.bgColorBtn.title = 'Background color';
        this.bgColorBtn.onclick = () => this.swapColors();
        colorStack.appendChild(this.bgColorBtn);
        
        this.fgColorBtn = document.createElement('button');
        this.fgColorBtn.style.cssText = `
            position: absolute; top: 0; left: 0;
            width: 18px; height: 18px; border-radius: 2px;
            border: 2px solid #fff; background: ${this.pad.color};
            cursor: pointer; z-index: 1;
            box-shadow: 0 0 2px rgba(0,0,0,0.3);
        `;
        this.fgColorBtn.title = 'Foreground color';
        colorStack.appendChild(this.fgColorBtn);
        colorRow.appendChild(colorStack);
        
        // Swap button
        const swapBtn = document.createElement('button');
        swapBtn.innerHTML = '⇄';
        swapBtn.title = 'Swap colors (X)';
        swapBtn.style.cssText = `
            width: 20px; height: 20px; border-radius: 3px;
            border: 1px solid #ccc; background: #e8e8e8;
            cursor: pointer; font-size: 10px; color: #444;
        `;
        swapBtn.onclick = (e) => { e.stopPropagation(); this.swapColors(); };
        colorRow.appendChild(swapBtn);
        
        // Eyedropper button
        const eyedropperBtn = document.createElement('button');
        eyedropperBtn.innerHTML = ICONS.eyedropper;
        eyedropperBtn.title = 'Eyedropper (I)';
        eyedropperBtn.style.cssText = `
            width: 20px; height: 20px; border-radius: 3px;
            border: 1px solid #ccc; background: #e8e8e8;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            color: #444;
        `;
        eyedropperBtn.onclick = (e) => { 
            e.stopPropagation(); 
            this.pad.tool = 'eyedropper'; 
            this.pad.toolbarPanel?.updateToolButtons();
            this.pad.updateCursor();
        };
        colorRow.appendChild(eyedropperBtn);
        
        // Hex input
        this.hexInput = document.createElement('input');
        this.hexInput.type = 'text';
        this.hexInput.style.cssText = `
            padding: 2px 3px; border-radius: 3px;
            border: 1px solid #ccc; background: #fff;
            color: #222; font-family: monospace; font-size: 10px;
            width: 48px; height: 20px; box-sizing: border-box;
        `;
        this.hexInput.addEventListener('change', () => {
            const hex = this.hexInput.value;
            if (/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
                this.setFromHex(hex.startsWith('#') ? hex : '#' + hex);
                this.pad.color = this.getHex();
                this.updateFgBg();
            }
        });
        colorRow.appendChild(this.hexInput);
        
        // Settings button
        const settingsBtn = document.createElement('button');
        settingsBtn.innerHTML = '⚙';
        settingsBtn.title = 'HSL/RGB sliders';
        settingsBtn.style.cssText = `
            width: 20px; height: 20px; border-radius: 3px;
            border: 1px solid #ccc; background: #e8e8e8;
            cursor: pointer; font-size: 11px; color: #444;
        `;
        settingsBtn.onclick = (e) => { 
            e.stopPropagation(); 
            this.toggleSliders();
        };
        colorRow.appendChild(settingsBtn);
        
        this.content.appendChild(colorRow);
        
        // HSL/RGB Sliders panel (hidden by default)
        this.slidersPanel = document.createElement('div');
        this.slidersPanel.style.cssText = 'display: none; margin-bottom: 6px; padding: 5px; background: #f5f5f5; border-radius: 4px;';
        
        // Mode toggle
        const modeRow = document.createElement('div');
        modeRow.style.cssText = 'display: flex; gap: 3px; margin-bottom: 5px;';
        
        this.hslBtn = document.createElement('button');
        this.hslBtn.textContent = 'HSL';
        this.hslBtn.style.cssText = `
            flex: 1; padding: 3px; border-radius: 2px; border: 1px solid #ccc;
            background: #d6dadb; color: #333; cursor: pointer; font-size: 10px;
        `;
        this.hslBtn.onclick = (e) => { e.stopPropagation(); this.setSliderMode('hsl'); };
        modeRow.appendChild(this.hslBtn);
        
        this.rgbBtn = document.createElement('button');
        this.rgbBtn.textContent = 'RGB';
        this.rgbBtn.style.cssText = `
            flex: 1; padding: 3px; border-radius: 2px; border: 1px solid #ccc;
            background: #e8e8e8; color: #333; cursor: pointer; font-size: 10px;
        `;
        this.rgbBtn.onclick = (e) => { e.stopPropagation(); this.setSliderMode('rgb'); };
        modeRow.appendChild(this.rgbBtn);
        
        this.slidersPanel.appendChild(modeRow);
        
        // Sliders container
        this.slidersContainer = document.createElement('div');
        this.slidersPanel.appendChild(this.slidersContainer);
        
        this.sliderMode = 'hsl';
        this.createSliders();
        
        this.content.appendChild(this.slidersPanel);
        
        const presetsHeader = document.createElement('div');
        presetsHeader.style.cssText = 'display: flex; gap: 4px; align-items: center; margin-bottom: 3px;';
        
        const savePresetBtn = document.createElement('button');
        savePresetBtn.textContent = 'Save';
        savePresetBtn.title = 'Save current color to selected slot';
        savePresetBtn.style.cssText = `
            padding: 2px 5px; border-radius: 2px; border: 1px solid #ccc;
            background: #e8e8e8; color: #444; cursor: pointer;
            font-size: 10px; font-weight: 500;
        `;
        savePresetBtn.onclick = (e) => {
            e.stopPropagation();
            this.saveToSelectedPreset();
        };
        presetsHeader.appendChild(savePresetBtn);
        
        const presetsLabel = document.createElement('div');
        presetsLabel.textContent = 'Presets';
        presetsLabel.style.cssText = 'font-size: 10px; color: #666;';
        presetsHeader.appendChild(presetsLabel);
        
        this.content.appendChild(presetsHeader);
        
        this.presetsContainer = document.createElement('div');
        this.presetsContainer.style.cssText = 'display: flex; wrap; gap: 3px;';
        this.selectedPresetIndex = 0;
        this.renderPresets();
        this.content.appendChild(this.presetsContainer);
        
        this.svCanvas.addEventListener('mousedown', (e) => {
            const rect = this.svCanvas.getBoundingClientRect();
            const cx = this.size / 2, cy = this.size / 2;
            const mx = e.clientX - rect.left - cx;
            const my = e.clientY - rect.top - cy;
            const dist = Math.sqrt(mx * mx + my * my);
            const innerR = this.size / 2 - 14;
            
            if (dist > innerR) {
                this.isDraggingWheel = true;
                this.updateHue(e);
            } else {
                this.isDraggingSV = true;
                this.updateSV(e);
            }
        });
        this.svCanvas.addEventListener('mousemove', (e) => {
            if (this.isDraggingWheel) this.updateHue(e);
            if (this.isDraggingSV) this.updateSV(e);
        });
        this.svCanvas.addEventListener('mouseup', () => { this.isDraggingWheel = false; this.isDraggingSV = false; });
        this.svCanvas.addEventListener('mouseleave', () => { this.isDraggingWheel = false; this.isDraggingSV = false; });
        
        this.setFromHex(this.pad.color);
        this.drawWheel();
        this.drawSV();
        this.updatePreview();
    }
    
    saveToSelectedPreset() {
        this.presets[this.selectedPresetIndex] = this.pad.color;
        this.savePresets();
        this.renderPresets();
    }
    
    renderPresets() {
        this.presetsContainer.innerHTML = '';
        this.presets.forEach((color, i) => {
            const btn = document.createElement('button');
            const isSelected = i === this.selectedPresetIndex;
            const isEmpty = !color;
            btn.style.cssText = `
                width: 18px; height: 18px; border-radius: 2px;
                border: ${isSelected ? '2px solid #4a9eff' : '1px solid #999'}; 
                background: ${isEmpty ? '#fff' : color};
                cursor: pointer; padding: 0;
                box-sizing: border-box;
                ${isEmpty ? 'background-image: linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%), linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%); background-size: 4px 4px; background-position: 0 0, 2px 2px;' : ''}
            `;
            btn.title = isEmpty ? 'Empty - Select then Save to store color' : `${color} - Click to use`;
            btn.onclick = (e) => {
                e.stopPropagation();
                this.selectedPresetIndex = i;
                if (color) {
                    this.setFromHex(color);
                    this.pad.color = color;
                    this.updateFgBg();
                }
                this.renderPresets();
            };
            this.presetsContainer.appendChild(btn);
        });
    }
    
    swapColors() {
        const temp = this.pad.color;
        this.pad.color = this.pad.bgColor;
        this.pad.bgColor = temp;
        this.setFromHex(this.pad.color);
        this.updateFgBg();
    }
    
    updateFgBg() {
        this.fgColorBtn.style.background = this.pad.color;
        this.bgColorBtn.style.background = this.pad.bgColor;
        this.pad.updateBrushCursor();
    }
    
    drawWheel() {
        const ctx = this.wheelCanvas.getContext('2d');
        const cx = this.size / 2, cy = this.size / 2;
        const outerR = this.size / 2 - 2, innerR = this.size / 2 - 14;
        ctx.clearRect(0, 0, this.size, this.size);
        
        // Draw hue ring - angle 0 at top, going clockwise
        for (let angle = 0; angle < 360; angle++) {
            const startAngle = (angle - 90 - 1) * Math.PI / 180;
            const endAngle = (angle - 90 + 1) * Math.PI / 180;
            ctx.beginPath();
            ctx.arc(cx, cy, outerR, startAngle, endAngle);
            ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
            ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
            ctx.fill();
        }
        
        // Marker position - hue 0 at top
        const hueAngle = (this.hue - 90) * Math.PI / 180;
        const markerR = (outerR + innerR) / 2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(hueAngle) * markerR, cy + Math.sin(hueAngle) * markerR, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
    
    drawSV() {
        const ctx = this.svCanvas.getContext('2d');
        const cx = this.size / 2, cy = this.size / 2;
        const innerR = this.size / 2 - 16;
        const squareSize = innerR * 1.3;
        const halfSize = squareSize / 2;
        
        ctx.clearRect(0, 0, this.size, this.size);
        
        const left = cx - halfSize;
        const top = cy - halfSize;
        
        const [hr, hg, hb] = this.hsvToRgb(this.hue, 100, 100);
        const hueColor = `rgb(${hr},${hg},${hb})`;
        
        // White to hue color (horizontal - saturation)
        ctx.fillStyle = '#fff';
        ctx.fillRect(left, top, squareSize, squareSize);
        
        const gradH = ctx.createLinearGradient(left, 0, left + squareSize, 0);
        gradH.addColorStop(0, '#fff');
        gradH.addColorStop(1, hueColor);
        ctx.fillStyle = gradH;
        ctx.fillRect(left, top, squareSize, squareSize);
        
        // Transparent to black (vertical - value)
        const gradV = ctx.createLinearGradient(0, top, 0, top + squareSize);
        gradV.addColorStop(0, 'rgba(0,0,0,0)');
        gradV.addColorStop(1, '#000');
        ctx.fillStyle = gradV;
        ctx.fillRect(left, top, squareSize, squareSize);
        
        // Border
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.strokeRect(left, top, squareSize, squareSize);
        
        // Marker position
        const markerX = left + (this.saturation / 100) * squareSize;
        const markerY = top + (1 - this.value / 100) * squareSize;
        
        ctx.beginPath();
        ctx.arc(markerX, markerY, 5, 0, Math.PI * 2);
        ctx.fillStyle = this.value > 50 ? '#333' : '#fff';
        ctx.fill();
        ctx.strokeStyle = this.value > 50 ? '#fff' : '#333';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
    
    updateHue(e) {
        const rect = this.svCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left - this.size / 2;
        const y = e.clientY - rect.top - this.size / 2;
        this.hue = (Math.atan2(y, x) * 180 / Math.PI + 90 + 360) % 360;
        this.drawWheel(); this.drawSV(); this.updatePreview();
        this.pad.color = this.getHex();
        this.updateFgBg();
        this.updateSliderValues();
    }
    
    updateSV(e) {
        const rect = this.svCanvas.getBoundingClientRect();
        const cx = this.size / 2, cy = this.size / 2;
        const innerR = this.size / 2 - 16;
        const squareSize = innerR * 1.3;
        const halfSize = squareSize / 2;
        
        const left = cx - halfSize;
        const top = cy - halfSize;
        
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        
        const clampedX = Math.max(left, Math.min(left + squareSize, mx));
        const clampedY = Math.max(top, Math.min(top + squareSize, my));
        
        this.saturation = ((clampedX - left) / squareSize) * 100;
        this.value = (1 - (clampedY - top) / squareSize) * 100;
        
        this.drawSV(); this.updatePreview();
        this.pad.color = this.getHex();
        this.updateFgBg();
        this.updateSliderValues();
    }
    
    updatePreview() {
        const hex = this.getHex();
        this.hexInput.value = hex;
    }
    
    hsvToRgb(h, s, v) {
        s /= 100; v /= 100;
        const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
        let r, g, b;
        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
    }
    
    getHex() {
        const [r, g, b] = this.hsvToRgb(this.hue, this.saturation, this.value);
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    }
    
    setFromHex(hex) {
        const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
        const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
        this.value = (max / 255) * 100;
        this.saturation = max === 0 ? 0 : (d / max) * 100;
        if (d === 0) this.hue = 0;
        else if (max === r) this.hue = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        else if (max === g) this.hue = ((b - r) / d + 2) * 60;
        else this.hue = ((r - g) / d + 4) * 60;
        this.drawWheel(); this.drawSV(); this.updatePreview();
        this.updateSliderValues();
    }
    
    toggleSliders() {
        const isVisible = this.slidersPanel.style.display !== 'none';
        this.slidersPanel.style.display = isVisible ? 'none' : 'block';
    }
    
    setSliderMode(mode) {
        this.sliderMode = mode;
        this.hslBtn.style.background = mode === 'hsl' ? '#d6dadb' : '#e8e8e8';
        this.rgbBtn.style.background = mode === 'rgb' ? '#d6dadb' : '#e8e8e8';
        this.createSliders();
    }
    
    createSliders() {
        this.slidersContainer.innerHTML = '';
        
        if (this.sliderMode === 'hsl') {
            this.hSlider = this.createSlider('H', 0, 360, Math.round(this.hue), (v) => {
                this.hue = v;
                this.applyFromSliders();
            });
            this.sSlider = this.createSlider('S', 0, 100, Math.round(this.saturation), (v) => {
                this.saturation = v;
                this.applyFromSliders();
            });
            this.lSlider = this.createSlider('V', 0, 100, Math.round(this.value), (v) => {
                this.value = v;
                this.applyFromSliders();
            });
        } else {
            const [r, g, b] = this.hsvToRgb(this.hue, this.saturation, this.value);
            this.rSlider = this.createSlider('R', 0, 255, r, () => this.applyFromRgbSliders());
            this.gSlider = this.createSlider('G', 0, 255, g, () => this.applyFromRgbSliders());
            this.bSlider = this.createSlider('B', 0, 255, b, () => this.applyFromRgbSliders());
        }
    }
    
    createSlider(label, min, max, value, onChange) {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; align-items: center; gap: 3px; margin-bottom: 4px;';
        
        const labelEl = document.createElement('span');
        labelEl.textContent = label;
        labelEl.style.cssText = 'width: 14px; font-size: 10px; color: #444; font-weight: bold;';
        row.appendChild(labelEl);
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.className = 'comfysketch-slider';
        slider.style.cssText = `
            flex: 1; height: 4px; cursor: pointer;
            max-width: 70px;
        `;
        row.appendChild(slider);
        
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = value;
        valueDisplay.style.cssText = `
            width: 24px; font-size: 10px; text-align: right;
            color: #333;
        `;
        row.appendChild(valueDisplay);
        
        slider.oninput = () => { 
            valueDisplay.textContent = slider.value; 
            onChange(parseInt(slider.value)); 
        };
        
        this.slidersContainer.appendChild(row);
        return { slider, valueDisplay };
    }
    
    applyFromSliders() {
        this.drawWheel(); this.drawSV(); this.updatePreview();
        this.pad.color = this.getHex();
        this.updateFgBg();
    }
    
    applyFromRgbSliders() {
        const r = parseInt(this.rSlider.valueDisplay.textContent);
        const g = parseInt(this.gSlider.valueDisplay.textContent);
        const b = parseInt(this.bSlider.valueDisplay.textContent);
        const hex = '#' + [r, g, b].map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('').toUpperCase();
        this.setFromHex(hex);
        this.pad.color = hex;
        this.updateFgBg();
    }
    
    updateSliderValues() {
        if (!this.slidersPanel || this.slidersPanel.style.display === 'none') return;
        
        if (this.sliderMode === 'hsl') {
            if (this.hSlider) { this.hSlider.slider.value = Math.round(this.hue); this.hSlider.valueDisplay.textContent = Math.round(this.hue); }
            if (this.sSlider) { this.sSlider.slider.value = Math.round(this.saturation); this.sSlider.valueDisplay.textContent = Math.round(this.saturation); }
            if (this.lSlider) { this.lSlider.slider.value = Math.round(this.value); this.lSlider.valueDisplay.textContent = Math.round(this.value); }
        } else {
            const [r, g, b] = this.hsvToRgb(this.hue, this.saturation, this.value);
            if (this.rSlider) { this.rSlider.slider.value = r; this.rSlider.valueDisplay.textContent = r; }
            if (this.gSlider) { this.gSlider.slider.value = g; this.gSlider.valueDisplay.textContent = g; }
            if (this.bSlider) { this.bSlider.slider.value = b; this.bSlider.valueDisplay.textContent = b; }
        }
    }
    
    updateTheme(isDark) {
        super.updateTheme(isDark);
        
        // Sliders panel
        if (this.slidersPanel) {
            this.slidersPanel.style.background = isDark ? '#3a3a3a' : '#f5f5f5';
            this.slidersPanel.querySelectorAll('span').forEach(el => el.style.color = isDark ? '#ddd' : '#444');
            this.slidersPanel.querySelectorAll('input[type="range"]').forEach(sl => sl.style.background = isDark ? '#555' : '#ccc');
        }
        
        // HSL/RGB buttons
        if (this.hslBtn) {
            const isHsl = this.sliderMode === 'hsl';
            this.hslBtn.style.background = isHsl ? '#d6dadb' : (isDark ? '#4a4a4a' : '#e8e8e8');
            this.hslBtn.style.color = isDark && !isHsl ? '#eee' : '#333';
            this.hslBtn.style.borderColor = isDark ? '#555' : '#ccc';
        }
        if (this.rgbBtn) {
            const isRgb = this.sliderMode === 'rgb';
            this.rgbBtn.style.background = isRgb ? '#d6dadb' : (isDark ? '#4a4a4a' : '#e8e8e8');
            this.rgbBtn.style.color = isDark && !isRgb ? '#eee' : '#333';
            this.rgbBtn.style.borderColor = isDark ? '#555' : '#ccc';
        }
        
        // Hex input
        if (this.hexInput) {
            this.hexInput.style.background = isDark ? '#3a3a3a' : '#fff';
            this.hexInput.style.color = isDark ? '#eee' : '#222';
            this.hexInput.style.borderColor = isDark ? '#555' : '#ccc';
        }
    }
}


// ==================== SIZE/OPACITY FLOATING WIDGET ====================
class SizeOpacityWidget {
    constructor(pad) {
        this.pad = pad;
        this.size = 70;
        this.maxBrushSize = 100;
        this.isDragging = false;
        this.isDraggingSize = false;
        this.isDraggingOpacity = false;
        this.opacityStartX = 0;
        this.opacityStartVal = 0;
        this.dragOffset = { x: 0, y: 0 };
        this.showLabel = false;
        this.labelTimeout = null;
        this.createWidget();
    }
    
    createWidget() {
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: absolute;
            width: ${this.size}px;
            height: ${this.size + 12}px;
            z-index: 100001;
        `;
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.canvas.style.cssText = 'cursor: pointer; display: block;';
        this.container.appendChild(this.canvas);
        
        this.dragHandle = document.createElement('div');
        this.dragHandle.style.cssText = `
            width: 15px; height: 10px; margin: 3px auto 0 auto;
            background: rgba(150,150,150,0.6); border-radius: 5px;
            cursor: move;
        `;
        this.dragHandle.title = 'Drag to move';
        this.container.appendChild(this.dragHandle);
        
        this.dragHandle.addEventListener('mousedown', (e) => this.startDrag(e));
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', () => this.onMouseUp());
        
        this.draw();
    }
    
    startDrag(e) {
        e.stopPropagation();
        this.isDragging = true;
        const rect = this.container.getBoundingClientRect();
        this.dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    
    draw() {
        const ctx = this.canvas.getContext('2d');
        const cx = this.size / 2;
        const cy = this.size / 2;
        const outerR = this.size / 2 - 2;
        const innerR = outerR - 10;
        const centerR = innerR - 4;
        
        ctx.clearRect(0, 0, this.size, this.size);
        
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
        ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
        ctx.fillStyle = '#888';
        ctx.fill();
        
        const sizeAngle = (this.pad.brushSize / this.maxBrushSize) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, -Math.PI / 2, sizeAngle);
        ctx.arc(cx, cy, innerR, sizeAngle, -Math.PI / 2, true);
        ctx.closePath();
        ctx.fillStyle = '#d6dadb';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
        const alpha = this.pad.opacity / 100;
        ctx.fillStyle = this.pad.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = alpha > 0.5 ? '#000' : '#fff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${this.pad.opacity}%`, cx, cy);
    }
    
    showCenterLabel() {
        if (this.labelTimeout) clearTimeout(this.labelTimeout);
        
        if (!this.labelEl) {
            this.labelEl = document.createElement('div');
            this.labelEl.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                padding: 8px 16px; background: rgba(0,0,0,0.6); color: #fff;
                font-size: 14px; border-radius: 6px; z-index: 100010;
                pointer-events: none; font-family: sans-serif;
            `;
            document.body.appendChild(this.labelEl);
        }
        
        this.labelEl.textContent = `Size: ${this.pad.brushSize}px  |  Opacity: ${this.pad.opacity}%`;
        this.labelEl.style.display = 'block';
        
        this.labelTimeout = setTimeout(() => {
            if (this.labelEl) this.labelEl.style.display = 'none';
        }, 800);
    }
    
    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - this.size / 2;
        const y = e.clientY - rect.top - this.size / 2;
        const dist = Math.sqrt(x * x + y * y);
        
        const outerR = this.size / 2 - 2;
        const innerR = outerR - 10;
        const centerR = innerR - 4;
        
        if (dist <= centerR) {
            e.stopPropagation();
            this.isDraggingOpacity = true;
            this.opacityStartX = e.clientX;
            this.opacityStartVal = this.pad.opacity;
            this.showCenterLabel();
        } else if (dist >= innerR && dist <= outerR) {
            e.stopPropagation();
            this.isDraggingSize = true;
            this.updateFromMouse(e, 'size');
            this.showCenterLabel();
        }
    }
    
    onMouseMove(e) {
        if (this.isDragging) {
            this.container.style.left = `${e.clientX - this.dragOffset.x}px`;
            this.container.style.top = `${e.clientY - this.dragOffset.y}px`;
        }
        if (this.isDraggingSize) {
            this.updateFromMouse(e, 'size');
            this.showCenterLabel();
        }
        if (this.isDraggingOpacity) {
            const delta = e.clientX - this.opacityStartX;
            const newVal = Math.max(1, Math.min(100, this.opacityStartVal + Math.round(delta / 2)));
            this.pad.opacity = newVal;
            this.draw();
            this.showCenterLabel();
        }
    }
    
    onMouseUp() {
        this.isDragging = false;
        this.isDraggingSize = false;
        this.isDraggingOpacity = false;
    }
    
    updateFromMouse(e, type) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - this.size / 2;
        const y = e.clientY - rect.top - this.size / 2;
        let angle = Math.atan2(y, x) + Math.PI / 2;
        if (angle < 0) angle += Math.PI * 2;
        
        const value = Math.max(1, Math.min(this.maxBrushSize, Math.round((angle / (Math.PI * 2)) * this.maxBrushSize)));
        this.pad.brushSize = value;
        
        this.draw();
        this.pad.updateBrushCursor?.();
    }
    
    update() {
        this.draw();
    }
    
    setPosition(x, y) {
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;
    }
    
    getElement() { return this.container; }
}


// ==================== LAYERS PANEL ====================
class LayersPanel extends DraggablePanel {
    constructor(pad) {
        super('Layers');
        this.pad = pad;
        this.createContent();
    }
    
    createContent() {
        this.content.style.cssText = 'width: 150px;';
        
        // Buttons row
        const btns = document.createElement('div');
        btns.style.cssText = 'display: flex; gap: 3px; margin-bottom: 4px;';
        
        const addBtn = this.createBtn(ICONS.addLayer, 'Add layer');
        addBtn.onclick = () => { this.pad.addLayer(); this.update(); };
        btns.appendChild(addBtn);
        
        const delBtn = this.createBtn(ICONS.deleteLayer, 'Delete layer');
        delBtn.onclick = () => { this.pad.deleteLayer(); this.update(); };
        btns.appendChild(delBtn);
        
        const mergeBtn = this.createBtn(ICONS.mergeLayer, 'Merge down');
        mergeBtn.onclick = () => { this.pad.mergeDown(); this.update(); };
        btns.appendChild(mergeBtn);
        
        const renameBtn = this.createTextBtn('Aa', 'Rename layer');
        renameBtn.onclick = () => this.renameActiveLayer();
        btns.appendChild(renameBtn);
        
        this.content.appendChild(btns);
        
        // Layer opacity row
        const opacityRow = document.createElement('div');
        opacityRow.style.cssText = 'display: flex; align-items: center; gap: 4px; margin-bottom: 4px;';
        
        const opacityLabel = document.createElement('span');
        opacityLabel.textContent = 'Opacity';
        opacityLabel.style.cssText = 'font-size: 10px; color: #444;';
        opacityRow.appendChild(opacityLabel);
        
        this.opacitySlider = document.createElement('input');
        this.opacitySlider.type = 'range';
        this.opacitySlider.min = 0;
        this.opacitySlider.max = 100;
        this.opacitySlider.value = 100;
        this.opacitySlider.className = 'comfysketch-slider';
        this.opacitySlider.style.cssText = `
            flex: 1; height: 4px; cursor: pointer;
            max-width: 60px;
        `;
        this.opacitySlider.oninput = () => {
            const layer = this.pad.getActiveLayer();
            if (layer) {
                layer.opacity = this.opacitySlider.value / 100;
                this.opacityValue.textContent = this.opacitySlider.value + '%';
                this.pad.renderLayers();
            }
        };
        opacityRow.appendChild(this.opacitySlider);
        
        this.opacityValue = document.createElement('span');
        this.opacityValue.textContent = '100%';
        this.opacityValue.style.cssText = 'font-size: 10px; color: #333; width: 30px; text-align: right;';
        opacityRow.appendChild(this.opacityValue);
        
        this.content.appendChild(opacityRow);
        
        // Layers list
        this.layersList = document.createElement('div');
        this.layersList.style.cssText = 'display: flex; flex-direction: column; gap: 2px; max-height: 200px; overflow-y: auto;';
        this.content.appendChild(this.layersList);
    }
    
    createBtn(icon, title) {
        const btn = document.createElement('button');
        btn.innerHTML = icon;
        btn.title = title;
        btn.style.cssText = `
            width: 24px; height: 24px; border-radius: 3px;
            border: 1px solid #ccc; background: #e8e8e8;
            color: #444; cursor: pointer; font-size: 10px;
            display: flex; align-items: center; justify-content: center;
        `;
        return btn;
    }
    
    createTextBtn(text, title) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.title = title;
        btn.style.cssText = `
            width: 24px; height: 24px; border-radius: 3px;
            border: 1px solid #ccc; background: #e8e8e8;
            color: #444; cursor: pointer; font-size: 10px; font-weight: 600;
            display: flex; align-items: center; justify-content: center;
        `;
        return btn;
    }
    
    renameActiveLayer() {
        const layer = this.pad.layers[this.pad.activeLayerIndex];
        if (!layer) return;
        const newName = prompt('Rename layer:', layer.name);
        if (newName !== null && newName.trim()) {
            layer.name = newName.trim();
            this.update();
        }
    }
    
    update() {
        this.layersList.innerHTML = '';
        
        for (let i = this.pad.layers.length - 1; i >= 0; i--) {
            const layer = this.pad.layers[i];
            const layerIndex = i;
            const item = document.createElement('div');
            item.draggable = true;
            item.dataset.index = i;
            item.style.cssText = `
                display: flex; align-items: center; gap: 4px;
                padding: 3px 4px; border-radius: 3px;
                background: ${i === this.pad.activeLayerIndex ? '#d6dadb' : 'transparent'};
                cursor: grab;
            `;
            item.onclick = () => { this.pad.activeLayerIndex = layerIndex; this.update(); };
            
            item.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', i.toString());
                item.style.opacity = '0.5';
            };
            item.ondragend = () => { item.style.opacity = '1'; };
            item.ondragover = (e) => { e.preventDefault(); item.style.background = '#d0d0d0'; };
            item.ondragleave = () => { item.style.background = layerIndex === this.pad.activeLayerIndex ? '#d6dadb' : 'transparent'; };
            item.ondrop = (e) => {
                e.preventDefault();
                const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
                const toIdx = layerIndex;
                if (fromIdx !== toIdx) {
                    const [moved] = this.pad.layers.splice(fromIdx, 1);
                    this.pad.layers.splice(toIdx, 0, moved);
                    if (this.pad.activeLayerIndex === fromIdx) this.pad.activeLayerIndex = toIdx;
                    else if (fromIdx < this.pad.activeLayerIndex && toIdx >= this.pad.activeLayerIndex) this.pad.activeLayerIndex--;
                    else if (fromIdx > this.pad.activeLayerIndex && toIdx <= this.pad.activeLayerIndex) this.pad.activeLayerIndex++;
                    this.pad.renderLayers();
                    this.update();
                }
            };
            
            const visBtn = document.createElement('button');
            visBtn.innerHTML = layer.visible ? ICONS.visible : ICONS.hidden;
            visBtn.style.cssText = 'background: none; border: none; cursor: pointer; padding: 0; color: #333; display: flex; align-items: center;';
            visBtn.onclick = (e) => { e.stopPropagation(); layer.visible = !layer.visible; this.pad.renderLayers(); this.update(); };
            item.appendChild(visBtn);
            
            const thumb = document.createElement('canvas');
            thumb.width = 16; thumb.height = 16;
            thumb.style.cssText = 'border: 1px solid #ccc; border-radius: 2px; background: #fff; flex-shrink: 0;';
            thumb.getContext('2d').drawImage(layer.canvas, 0, 0, 16, 16);
            item.appendChild(thumb);
            
            const name = document.createElement('span');
            name.textContent = layer.name;
            name.style.cssText = `flex: 1; font-size: 10px; color: ${this.isDark ? '#ddd' : TEXT_DARK}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`;
            item.appendChild(name);
            
            // Apply theme to visibility button
            visBtn.style.color = this.isDark ? '#ddd' : '#333';
            
            this.layersList.appendChild(item);
        }
        
        // Update opacity slider to reflect active layer
        const activeLayer = this.pad.getActiveLayer();
        if (activeLayer && this.opacitySlider) {
            const opacityVal = Math.round(activeLayer.opacity * 100);
            this.opacitySlider.value = opacityVal;
            this.opacityValue.textContent = opacityVal + '%';
        }
    }
    
    updateTheme(isDark) {
        super.updateTheme(isDark);
        this.isDark = isDark;
        
        // Opacity slider and label
        if (this.opacitySlider) {
            this.opacitySlider.style.background = isDark ? '#555' : '#ccc';
        }
        if (this.opacityValue) {
            this.opacityValue.style.color = isDark ? '#ddd' : '#333';
        }
        
        // Re-render layers to apply theme to layer items
        this.update();
    }
}


// ==================== MAIN TOOLBAR PANEL ====================
class ToolbarPanel extends DraggablePanel {
    constructor(pad) {
        super('Tools');
        this.pad = pad;
        this.createContent();
    }
    
    createContent() {
        this.addSection('Draw');
        const tools = [
            { id: 'draw', icon: ICONS.brush, label: 'Brush (B)' },
            { id: 'pencil', icon: ICONS.pencil, label: 'Pencil (P)' },
            { id: 'line', icon: ICONS.line, label: 'Line (L)' },
            { id: 'circle', icon: ICONS.circle, label: 'Circle (C) - Shift: perfect' },
            { id: 'square', icon: ICONS.square, label: 'Square (R) - Shift: perfect' },
            { id: 'fill', icon: ICONS.fill, label: 'Fill (G)' },
            { id: 'erase', icon: ICONS.eraser, label: 'Erase (E)' },
        ];
        const toolsGrid = document.createElement('div');
        toolsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 22px); gap: 3px; margin-bottom: 6px;';
        tools.forEach(t => {
            const btn = this.createBtn(t.icon, t.label + ' (double-click for options)', t.id === this.pad.tool);
            btn.dataset.tool = t.id;
            btn.onclick = () => { this.pad.tool = t.id; this.updateToolButtons(); this.pad.updateCursor(); };
            btn.ondblclick = (e) => { e.stopPropagation(); this.showToolProperties(t.id, btn); };
            toolsGrid.appendChild(btn);
        });
        this.content.appendChild(toolsGrid);
        
        this.addSection('Brush');
        const brushTypes = [
            { id: 'round', icon: ICONS.roundBrush, label: 'Round' },
            { id: 'soft', icon: ICONS.softBrush, label: 'Soft' },
            { id: 'airbrush', icon: ICONS.airbrush, label: 'Airbrush' },
            { id: 'spray', icon: ICONS.sprayBrush, label: 'Spray' },
        ];
        const brushGrid = document.createElement('div');
        brushGrid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 22px); gap: 3px;';
        brushTypes.forEach(t => {
            const btn = this.createBtn(t.icon, t.label + ' (double-click for options)', t.id === this.pad.brushType);
            btn.dataset.brushtype = t.id;
            btn.onclick = () => { this.pad.brushType = t.id; this.updateBrushTypeButtons(); };
            btn.ondblclick = (e) => { e.stopPropagation(); this.showBrushProperties(t.id, btn); };
            brushGrid.appendChild(btn);
        });
        this.content.appendChild(brushGrid);
    }
    
    showToolProperties(toolId, anchorBtn) {
        this.closePropertiesPanel();
        
        const isDark = this.isDark;
        const panel = document.createElement('div');
        panel.className = 'tool-properties-panel';
        panel.style.cssText = `
            position: absolute; left: 100%; top: 0; margin-left: 8px;
            background: ${isDark ? '#3a3a3a' : '#fff'}; 
            border: 1px solid ${isDark ? '#555' : '#ccc'}; border-radius: 6px;
            padding: 6px; width: 110px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 100001; overflow: hidden;
        `;
        
        const title = document.createElement('div');
        title.textContent = toolId.charAt(0).toUpperCase() + toolId.slice(1) + ' Options';
        title.style.cssText = `font-size: 10px; font-weight: bold; margin-bottom: 5px; color: ${isDark ? '#eee' : '#333'};`;
        panel.appendChild(title);
        
        // Tool-specific properties
        if (toolId === 'draw' || toolId === 'erase') {
            this.addSliderProp(panel, 'Size', 1, 100, this.pad.brushSize, (v) => { this.pad.brushSize = v; }, isDark);
            this.addSliderProp(panel, 'Opacity', 1, 100, this.pad.opacity, (v) => { this.pad.opacity = v; }, isDark);
            this.addCheckboxProp(panel, 'Mirror H', this.pad.mirrorDrawH, (v) => { this.pad.mirrorDrawH = v; }, isDark);
            this.addCheckboxProp(panel, 'Mirror V', this.pad.mirrorDrawV, (v) => { this.pad.mirrorDrawV = v; }, isDark);
        } else if (toolId === 'pencil') {
            this.addSliderProp(panel, 'Opacity', 1, 100, this.pad.opacity, (v) => { this.pad.opacity = v; }, isDark);
            this.addCheckboxProp(panel, 'Mirror H', this.pad.mirrorDrawH, (v) => { this.pad.mirrorDrawH = v; }, isDark);
            this.addCheckboxProp(panel, 'Mirror V', this.pad.mirrorDrawV, (v) => { this.pad.mirrorDrawV = v; }, isDark);
        } else if (toolId === 'line' || toolId === 'circle' || toolId === 'square') {
            this.addSliderProp(panel, 'Stroke', 1, 50, this.pad.brushSize, (v) => { this.pad.brushSize = v; }, isDark);
            this.addSliderProp(panel, 'Opacity', 1, 100, this.pad.opacity, (v) => { this.pad.opacity = v; }, isDark);
        } else if (toolId === 'fill') {
            this.addSliderProp(panel, 'Tolerance', 0, 100, this.pad.fillTolerance || 32, (v) => { this.pad.fillTolerance = v; }, isDark);
        }
        
        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style.cssText = `
            width: 100%; margin-top: 6px; padding: 3px;
            background: ${isDark ? '#4a4a4a' : '#e8e8e8'}; 
            border: 1px solid ${isDark ? '#666' : '#ccc'}; border-radius: 3px;
            cursor: pointer; font-size: 10px; color: ${isDark ? '#eee' : '#333'};
        `;
        resetBtn.onclick = () => {
            this.pad.brushSize = 10;
            this.pad.opacity = 100;
            this.pad.mirrorDrawH = false;
            this.pad.mirrorDrawV = false;
            this.pad.fillTolerance = 32;
            this.closePropertiesPanel();
            this.showToolProperties(toolId, anchorBtn);
        };
        panel.appendChild(resetBtn);
        
        this.propertiesPanel = panel;
        this.container.appendChild(panel);
        
        // Close on outside click
        setTimeout(() => {
            this.outsideClickHandler = (e) => {
                if (!panel.contains(e.target) && !anchorBtn.contains(e.target)) {
                    this.closePropertiesPanel();
                }
            };
            document.addEventListener('click', this.outsideClickHandler);
        }, 10);
    }
    
    showBrushProperties(brushId, anchorBtn) {
        this.closePropertiesPanel();
        
        const isDark = this.isDark;
        const panel = document.createElement('div');
        panel.className = 'tool-properties-panel';
        panel.style.cssText = `
            position: absolute; left: 100%; top: 0; margin-left: 8px;
            background: ${isDark ? '#3a3a3a' : '#fff'}; 
            border: 1px solid ${isDark ? '#555' : '#ccc'}; border-radius: 6px;
            padding: 6px; width: 110px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 100001; overflow: hidden;
        `;
        
        const title = document.createElement('div');
        title.textContent = brushId.charAt(0).toUpperCase() + brushId.slice(1) + ' Brush';
        title.style.cssText = `font-size: 10px; font-weight: bold; margin-bottom: 5px; color: ${isDark ? '#eee' : '#333'};`;
        panel.appendChild(title);
        
        this.addSliderProp(panel, 'Size', 1, 100, this.pad.brushSize, (v) => { this.pad.brushSize = v; }, isDark);
        this.addSliderProp(panel, 'Opacity', 1, 100, this.pad.opacity, (v) => { this.pad.opacity = v; }, isDark);
        
        // Tip shape settings for round brush
        if (brushId === 'round') {
            this.addSliderProp(panel, 'Hardness', 1, 100, this.pad.brushHardness || 100, (v) => { this.pad.brushHardness = v; }, isDark);
            this.addSliderProp(panel, 'Roundness', 10, 100, this.pad.brushRoundness || 100, (v) => { this.pad.brushRoundness = v; }, isDark);
            this.addSliderProp(panel, 'Angle', 0, 180, this.pad.brushAngle || 0, (v) => { this.pad.brushAngle = v; }, isDark);
        } else if (brushId === 'soft') {
            this.addSliderProp(panel, 'Hardness', 1, 100, this.pad.brushHardness || 50, (v) => { this.pad.brushHardness = v; }, isDark);
            this.addSliderProp(panel, 'Roundness', 10, 100, this.pad.brushRoundness || 100, (v) => { this.pad.brushRoundness = v; }, isDark);
            this.addSliderProp(panel, 'Angle', 0, 180, this.pad.brushAngle || 0, (v) => { this.pad.brushAngle = v; }, isDark);
        } else if (brushId === 'airbrush') {
            this.addSliderProp(panel, 'Flow', 1, 100, this.pad.airbrushFlow || 20, (v) => { this.pad.airbrushFlow = v; }, isDark);
            this.addSliderProp(panel, 'Softness', 1, 100, this.pad.airbrushSoftness || 80, (v) => { this.pad.airbrushSoftness = v; }, isDark);
        } else if (brushId === 'spray') {
            this.addSliderProp(panel, 'Density', 1, 100, this.pad.sprayDensity || 50, (v) => { this.pad.sprayDensity = v; }, isDark);
        }
        
        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style.cssText = `
            width: 100%; margin-top: 6px; padding: 3px;
            background: ${isDark ? '#4a4a4a' : '#e8e8e8'}; 
            border: 1px solid ${isDark ? '#666' : '#ccc'}; border-radius: 3px;
            cursor: pointer; font-size: 10px; color: ${isDark ? '#eee' : '#333'};
        `;
        resetBtn.onclick = () => {
            this.pad.brushSize = 10;
            this.pad.opacity = 100;
            this.pad.brushHardness = brushId === 'round' ? 100 : 50;
            this.pad.sprayDensity = 50;
            this.pad.brushRoundness = 100;
            this.pad.brushAngle = 0;
            this.pad.airbrushFlow = 20;
            this.pad.airbrushSoftness = 80;
            this.closePropertiesPanel();
            this.showBrushProperties(brushId, anchorBtn);
        };
        panel.appendChild(resetBtn);
        
        this.propertiesPanel = panel;
        this.container.appendChild(panel);
        
        setTimeout(() => {
            this.outsideClickHandler = (e) => {
                if (!panel.contains(e.target) && !anchorBtn.contains(e.target)) {
                    this.closePropertiesPanel();
                }
            };
            document.addEventListener('click', this.outsideClickHandler);
        }, 10);
    }
    
    addSliderProp(panel, label, min, max, value, onChange, isDark = false) {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; align-items: center; gap: 3px; margin-bottom: 3px;';
        
        const labelEl = document.createElement('span');
        labelEl.textContent = label;
        labelEl.style.cssText = `width: 38px; font-size: 10px; color: ${isDark ? '#ccc' : '#444'}; flex-shrink: 0;`;
        row.appendChild(labelEl);
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.className = 'comfysketch-slider';
        slider.style.cssText = `flex: 1; height: 3px; cursor: pointer; min-width: 0; max-width: 45px; background: ${isDark ? '#555' : '#ccc'};`;
        row.appendChild(slider);
        
        const valEl = document.createElement('span');
        valEl.textContent = value;
        valEl.style.cssText = `width: 18px; font-size: 10px; text-align: right; color: ${isDark ? '#ddd' : '#333'}; flex-shrink: 0;`;
        row.appendChild(valEl);
        
        slider.oninput = () => {
            valEl.textContent = slider.value;
            onChange(parseInt(slider.value));
        };
        
        panel.appendChild(row);
    }
    
    addCheckboxProp(panel, label, checked, onChange, isDark = false) {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; align-items: center; gap: 3px; margin-bottom: 3px;';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        checkbox.style.cssText = 'width: 10px; height: 10px; cursor: pointer;';
        checkbox.onchange = () => onChange(checkbox.checked);
        row.appendChild(checkbox);
        
        const labelEl = document.createElement('span');
        labelEl.textContent = label;
        labelEl.style.cssText = `font-size: 10px; color: ${isDark ? '#ccc' : '#444'};`;
        row.appendChild(labelEl);
        
        panel.appendChild(row);
    }
    
    closePropertiesPanel() {
        if (this.propertiesPanel) {
            this.propertiesPanel.remove();
            this.propertiesPanel = null;
        }
        if (this.outsideClickHandler) {
            document.removeEventListener('click', this.outsideClickHandler);
            this.outsideClickHandler = null;
        }
    }
    
    addSection(title) {
        const label = document.createElement('div');
        label.textContent = title;
        label.style.cssText = `font-size: 10px; color: ${TEXT_DARK}; margin-bottom: 2px; text-transform: uppercase;`;
        this.content.appendChild(label);
    }
    
    createBtn(icon, title, isActive = false) {
        const btn = document.createElement('button');
        btn.innerHTML = icon;
        btn.title = title;
        btn.style.cssText = `
            width: 24px; height: 24px; border-radius: 3px;
            border: 1px solid ${isActive ? '#606a6e' : '#ccc'};
            background: ${isActive ? '#d6dadb' : '#e8e8e8'};
            color: ${isActive ? '#333' : '#444'};
            cursor: pointer; font-size: 11px;
            display: flex; align-items: center; justify-content: center;
        `;
        return btn;
    }
    
    updateToolButtons() {
        const isDark = this.isDark;
        this.content.querySelectorAll('button[data-tool]').forEach(btn => {
            const isActive = btn.dataset.tool === this.pad.tool;
            btn.style.background = isActive ? '#d6dadb' : (isDark ? '#3a3a3a' : '#e8e8e8');
            btn.style.borderColor = isActive ? '#606a6e' : (isDark ? '#555' : '#ccc');
            btn.style.color = isActive ? '#333' : (isDark ? '#eee' : '#444');
        });
    }
    
    updateBrushTypeButtons() {
        const isDark = this.isDark;
        this.content.querySelectorAll('button[data-brushtype]').forEach(btn => {
            const isActive = btn.dataset.brushtype === this.pad.brushType;
            btn.style.background = isActive ? '#d6dadb' : (isDark ? '#3a3a3a' : '#e8e8e8');
            btn.style.borderColor = isActive ? '#606a6e' : (isDark ? '#555' : '#ccc');
            btn.style.color = isActive ? '#333' : (isDark ? '#eee' : '#444');
        });
    }
    
    updateTheme(isDark) {
        super.updateTheme(isDark);
        this.isDark = isDark;
        this.updateToolButtons();
        this.updateBrushTypeButtons();
        
        // Section labels
        this.content.querySelectorAll('div').forEach(el => {
            if (el.style.textTransform === 'uppercase') {
                el.style.color = isDark ? '#aaa' : TEXT_DARK;
            }
        });
    }
}

class TopBar {
    constructor(pad) {
        this.pad = pad;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.createBar();
    }
    
    createBar() {
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
            display: flex; gap: 4px; padding: 6px 10px;
            background: rgba(249,249,249,0.95); border-radius: 6px;
            border: 1px solid #ccc; z-index: 100002;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            cursor: move;
        `;
        
        this.container.addEventListener('mousedown', (e) => {
            if (e.target === this.container) {
                this.isDragging = true;
                const rect = this.container.getBoundingClientRect();
                this.dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
                this.container.style.transform = 'none';
            }
        });
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.container.style.left = `${e.clientX - this.dragOffset.x}px`;
                this.container.style.top = `${e.clientY - this.dragOffset.y}px`;
            }
        });
        document.addEventListener('mouseup', () => { this.isDragging = false; });
        
        const newBtn = this.createBtn(ICONS.newFile, 'New');
		newBtn.style.background = '#5c698f';
        newBtn.style.borderColor = '#606a6e';
		newBtn.style.color = '#333';
        newBtn.onclick = () => { if (confirm('New canvas?')) this.pad.newCanvas(); };
        this.container.appendChild(newBtn);
        
        const loadBtn = this.createBtn(ICONS.folder, 'Open');
		loadBtn.style.background = '#bcb5a6';
        loadBtn.style.borderColor = '#606a6e';
		loadBtn.style.color = '#333';
        loadBtn.onclick = () => this.pad.loadImage();
        this.container.appendChild(loadBtn);
        
        const saveBtn = this.createBtn(ICONS.save, 'Save');
		saveBtn.style.background = '#d1acae';
        saveBtn.style.borderColor = '#606a6e';
        saveBtn.style.color = '#333';
        saveBtn.onclick = () => this.pad.saveImage();
        this.container.appendChild(saveBtn);
        
        this.addSeparator();
        
        const undoBtn = this.createBtn(ICONS.undo, 'Undo (Ctrl+Z)');
        undoBtn.onclick = () => this.pad.undo();
        this.container.appendChild(undoBtn);
        
        const redoBtn = this.createBtn(ICONS.redo, 'Redo (Ctrl+Y)');
        redoBtn.onclick = () => this.pad.redo();
        this.container.appendChild(redoBtn);
        
        this.addSeparator();
        
        const zoomOut = this.createBtn(ICONS.zoomOut, 'Zoom Out (-)');
        zoomOut.onclick = () => this.pad.adjustZoom(-0.25);
        this.container.appendChild(zoomOut);
        
        const zoomIn = this.createBtn(ICONS.zoomIn, 'Zoom In (+)');
        zoomIn.onclick = () => this.pad.adjustZoom(0.25);
        this.container.appendChild(zoomIn);
        
        const fitBtn = this.createBtn(ICONS.fitToView, 'Fit to View');
		fitBtn.style.background = '#d6dadb';
        fitBtn.style.borderColor = '#606a6e';
        fitBtn.style.color = '#333';
        fitBtn.onclick = () => this.pad.fitToView();
        this.container.appendChild(fitBtn);
        
        this.addSeparator();
        
        this.mirrorHBtn = this.createBtn(ICONS.mirrorDrawH, 'Mirror H');
        this.mirrorHBtn.onclick = () => { this.pad.mirrorDrawH = !this.pad.mirrorDrawH; this.updateMirrorButtons(); };
        this.container.appendChild(this.mirrorHBtn);
        
        this.mirrorVBtn = this.createBtn(ICONS.mirrorDrawV, 'Mirror V');
        this.mirrorVBtn.onclick = () => { this.pad.mirrorDrawV = !this.pad.mirrorDrawV; this.updateMirrorButtons(); };
        this.container.appendChild(this.mirrorVBtn);
        
        this.addSeparator();
        
        const flipH = this.createBtn(ICONS.flipH, 'Flip H');
        flipH.onclick = () => this.pad.mirrorHorizontal();
        this.container.appendChild(flipH);
        
        const flipV = this.createBtn(ICONS.flipV, 'Flip V');
        flipV.onclick = () => this.pad.mirrorVertical();
        this.container.appendChild(flipV);
        
        this.addSeparator();
        
        this.themeBtn = this.createBtn(ICONS.moon, 'Toggle Dark/Light Theme');
        this.themeBtn.onclick = () => this.pad.toggleTheme();
        this.container.appendChild(this.themeBtn);
        
        this.addSeparator();
        
        const doneBtn = this.createBtn(ICONS.check, 'Done');
        doneBtn.style.background = '#6e857f';
        doneBtn.style.borderColor = '#606a6e';
        doneBtn.style.color = '#333';
        doneBtn.onclick = () => this.pad.closeFullscreen();
        this.container.appendChild(doneBtn);
    }
    
    updateTheme(isDark) {
        this.isDark = isDark;
        this.themeBtn.innerHTML = isDark ? ICONS.sun : ICONS.moon;
        
        this.container.style.background = isDark ? 'rgba(45,45,45,0.98)' : 'rgba(249,249,249,0.95)';
        this.container.style.borderColor = isDark ? '#555' : '#ccc';
        
        this.container.querySelectorAll('button').forEach(btn => {
            const isAccent = btn.style.background === 'rgb(169, 213, 255)';
            if (!isAccent) {
                btn.style.background = isDark ? '#3a3a3a' : '#e8e8e8';
                btn.style.borderColor = isDark ? '#555' : '#ccc';
                btn.style.color = isDark ? '#eee' : '#444';
            }
        });
        
        // Update separators
        this.container.querySelectorAll('div').forEach(el => {
            if (el.style.width === '1px') {
                el.style.background = isDark ? '#555' : '#ccc';
            }
        });
    }
    
    addSeparator() {
        const sep = document.createElement('div');
        sep.style.cssText = `width: 1px; background: ${this.isDark ? '#555' : '#ccc'}; margin: 0 2px;`;
        this.container.appendChild(sep);
    }
    
    createBtn(icon, title) {
        const btn = document.createElement('button');
        btn.innerHTML = icon;
        btn.title = title;
        btn.style.cssText = `
            width: 29px; height: 29px; border-radius: 4px;
            border: 1px solid #ccc; background: #e8e8e8;
            color: #444; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
        `;
        return btn;
    }
    
    createTextBtn(text, title) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.title = title;
        btn.style.cssText = `
            padding: 0 8px; height: 26px; border-radius: 4px;
            border: 1px solid #ccc; background: #e8e8e8;
            color: #444; cursor: pointer; font-size: 10px; font-weight: 500;
        `;
        return btn;
    }
    
    updateMirrorButtons() {
        const updateBtn = (btn, isActive) => {
            btn.style.background = isActive ? '#d6dadb' : '#e8e8e8';
            btn.style.borderColor = isActive ? '#606a6e' : '#ccc';
        };
        updateBtn(this.mirrorHBtn, this.pad.mirrorDrawH);
        updateBtn(this.mirrorVBtn, this.pad.mirrorDrawV);
    }
    
    getElement() { return this.container; }
}


// ==================== DRAWING PAD ====================
class DrawingPad {
    constructor(node, canvasDataWidget) {
        this.node = node;
        this.canvasDataWidget = canvasDataWidget;
        
        this.canvasWidth = 512;
        this.canvasHeight = 768;
        
        this.color = '#000000';
        this.bgColor = '#FFFFFF';
        this.brushSize = 8;
        this.brushType = 'round';
        this.opacity = 100;
        this.tool = 'draw';
        
        // Brush properties
        this.brushRoundness = 100;
        this.brushAngle = 0;
        this.brushHardness = 100;
        this.sprayDensity = 50;
        this.airbrushFlow = 20;
        this.airbrushSoftness = 80;
        
        // Mirror draw mode
        this.mirrorDrawH = false;
        this.mirrorDrawV = false;
        
        // UI state
        this.uiHidden = false;
        
        this.isDrawing = false;
        this.lastPoint = null;
        this.lastPressure = 0.5;
        
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.isPanning = false;
        this.lastPanPoint = null;
        
        this.layers = [];
        this.activeLayerIndex = 0;
        
        this.history = [];
        this.historyIndex = -1;
        this.snapshot = null;
        
        this.container = null;
        this.previewCanvas = null;
        this.fullscreenOverlay = null;
        this.displayCanvas = null;
        this.isFullscreen = false;
        
        // Panels
        this.toolbarPanel = null;
        this.colorPanel = null;
        this.sizeWidget = null;
        this.layersPanel = null;
        
        this.createUI();
    }
    
    createUI() {
        this.container = document.createElement('div');
        this.container.style.cssText = `
            display: flex; flex-direction: column; gap: 8px;
            padding: 8px; background: transparent; border-radius: 8px;
            width: 100%; height: 100%; box-sizing: border-box;
        `;
        
        // Preview wrapper to maintain aspect ratio
        this.previewWrapper = document.createElement('div');
        this.previewWrapper.style.cssText = `
            flex: 1; display: flex; align-items: center; justify-content: center;
            min-height: 50px; overflow: hidden;
        `;
        
        this.previewCanvas = document.createElement('canvas');
        this.previewCanvas.style.cssText = `
            border-radius: 6px; cursor: pointer; 
            max-width: 100%; max-height: 100%;
            object-fit: contain;
        `;
        this.previewCanvas.title = 'Click to edit';
        this.previewCanvas.onclick = () => this.openFullscreen();
        this.previewWrapper.appendChild(this.previewCanvas);
        this.container.appendChild(this.previewWrapper);
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Sketch';
        editBtn.style.cssText = `
            width: 100%; padding: 8px; border-radius: 4px; border: none;
            background: #8e999d; color: #fff; cursor: pointer;
            font-size: 12px; font-weight: 500; flex-shrink: 0;
        `;
        editBtn.onclick = () => this.openFullscreen();
        this.container.appendChild(editBtn);
        
        this.updateCanvasSize();
        this.clear(false);
    }
    
    updateCanvasSize() {
        const presetWidget = this.node.widgets?.find(w => w.name === 'preset_size');
        if (presetWidget?.value) {
            if (presetWidget.value === 'Custom') {
                const customW = this.node.widgets?.find(w => w.name === 'custom_width');
                const customH = this.node.widgets?.find(w => w.name === 'custom_height');
                if (customW && customH) {
                    this.canvasWidth = customW.value;
                    this.canvasHeight = customH.value;
                }
            } else {
                const sizes = {
                    '512 x 512': [512, 512], '512 x 768': [512, 768], '768 x 512': [768, 512],
                    '768 x 1024': [768, 1024], '1024 x 768': [1024, 768], '1024 x 1024': [1024, 1024],
                    '1080 x 1920': [1080, 1920], '1920 x 1080': [1920, 1080],
                };
                if (sizes[presetWidget.value]) {
                    [this.canvasWidth, this.canvasHeight] = sizes[presetWidget.value];
                }
            }
        }
        
        this.previewCanvas.width = this.canvasWidth;
        this.previewCanvas.height = this.canvasHeight;
    }
    
    getBackgroundColor() {
        const bgWidget = this.node.widgets?.find(w => w.name === 'background_color');
        return bgWidget?.value === 'white' ? '#FFFFFF' : bgWidget?.value === 'gray' ? '#808080' : '#000000';
    }
    
    clear(saveHistory = true) {
        const bg = this.getBackgroundColor();
        this.previewCanvas.getContext('2d').fillStyle = bg;
        this.previewCanvas.getContext('2d').fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.layers = [];
        this.addLayer(false);
        if (saveHistory) { this.history = []; this.historyIndex = -1; this.saveToHistory(); this.saveCanvasData(); }
    }
    
    resizeCanvas() {
        this.updateCanvasSize();
        this.clear(false);
        this.history = [];
        this.historyIndex = -1;
        this.saveToHistory();
        this.saveCanvasData();
    }
    
    // File operations
    newCanvas() {
        this.layers = [];
        this.addLayer(false);
        this.activeLayerIndex = 0;
        this.renderLayers();
        this.layersPanel?.update();
        this.history = [];
        this.historyIndex = -1;
        this.saveToHistory();
        this.saveCanvasData();
    }
    
    loadImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const layer = this.getActiveLayer();
                    if (layer) {
                        const ctx = layer.canvas.getContext('2d');
                        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                        const scale = Math.min(this.canvasWidth / img.width, this.canvasHeight / img.height);
                        const w = img.width * scale, h = img.height * scale;
                        const x = (this.canvasWidth - w) / 2, y = (this.canvasHeight - h) / 2;
                        ctx.drawImage(img, x, y, w, h);
                        this.renderLayers();
                        this.layersPanel?.update();
                        this.saveToHistory();
                        this.saveCanvasData();
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }
    
    saveImage() {
        this.renderLayers();
        const link = document.createElement('a');
        link.download = `sketch_${Date.now()}.png`;
        link.href = this.displayCanvas.toDataURL('image/png');
        link.click();
    }
    
    // Transform
    mirrorHorizontal() {
        const layer = this.getActiveLayer();
        if (!layer) return;
        const ctx = layer.canvas.getContext('2d');
        const temp = document.createElement('canvas');
        temp.width = this.canvasWidth; temp.height = this.canvasHeight;
        temp.getContext('2d').drawImage(layer.canvas, 0, 0);
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.save(); ctx.scale(-1, 1);
        ctx.drawImage(temp, -this.canvasWidth, 0);
        ctx.restore();
        this.renderLayers(); this.layersPanel?.update(); this.saveToHistory(); this.saveCanvasData();
    }
    
    mirrorVertical() {
        const layer = this.getActiveLayer();
        if (!layer) return;
        const ctx = layer.canvas.getContext('2d');
        const temp = document.createElement('canvas');
        temp.width = this.canvasWidth; temp.height = this.canvasHeight;
        temp.getContext('2d').drawImage(layer.canvas, 0, 0);
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.save(); ctx.scale(1, -1);
        ctx.drawImage(temp, 0, -this.canvasHeight);
        ctx.restore();
        this.renderLayers(); this.layersPanel?.update(); this.saveToHistory(); this.saveCanvasData();
    }
    
    // Layers
    addLayer(updatePanel = true) {
        const canvas = document.createElement('canvas');
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        this.layers.push({ canvas, name: `Layer ${this.layers.length + 1}`, visible: true, opacity: 1 });
        this.activeLayerIndex = this.layers.length - 1;
        if (updatePanel) { this.renderLayers(); this.layersPanel?.update(); }
    }
    
    deleteLayer() {
        if (this.layers.length <= 1) return;
        this.layers.splice(this.activeLayerIndex, 1);
        this.activeLayerIndex = Math.min(this.activeLayerIndex, this.layers.length - 1);
        this.renderLayers(); this.layersPanel?.update(); this.saveToHistory();
    }
    
    mergeDown() {
        if (this.activeLayerIndex === 0) return;
        const upper = this.layers[this.activeLayerIndex];
        const lower = this.layers[this.activeLayerIndex - 1];
        const ctx = lower.canvas.getContext('2d');
        ctx.globalAlpha = upper.opacity;
        ctx.drawImage(upper.canvas, 0, 0);
        ctx.globalAlpha = 1;
        this.layers.splice(this.activeLayerIndex, 1);
        this.activeLayerIndex--;
        this.renderLayers(); this.layersPanel?.update(); this.saveToHistory();
    }
    
    getActiveLayer() { return this.layers[this.activeLayerIndex]; }
    
    clearCurrentLayer() {
        const layer = this.getActiveLayer();
        if (layer) {
            layer.canvas.getContext('2d').clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.renderLayers(); this.saveToHistory();
        }
    }
    
    renderLayers() {
        if (!this.displayCanvas) return;
        const ctx = this.displayCanvas.getContext('2d');
        ctx.fillStyle = this.getBackgroundColor();
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            if (!layer.visible) continue;
            ctx.globalAlpha = layer.opacity;
            ctx.drawImage(layer.canvas, 0, 0);
            
            // Draw stroke buffer on top of active layer while drawing
            if (i === this.activeLayerIndex && this.strokeBuffer) {
                ctx.globalAlpha = (this.opacity / 100) * layer.opacity;
                ctx.drawImage(this.strokeBuffer, 0, 0);
            }
        }
        ctx.globalAlpha = 1;
        this.previewCanvas.getContext('2d').drawImage(this.displayCanvas, 0, 0);
    }
    
    // History
    saveToHistory() {
        const state = this.layers.map(l => ({
            imageData: l.canvas.toDataURL(),
            name: l.name, visible: l.visible, opacity: l.opacity
        }));
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push({ layers: state, activeIndex: this.activeLayerIndex });
        if (this.history.length > 30) this.history.shift();
        this.historyIndex = this.history.length - 1;
    }
    
    undo() { if (this.historyIndex > 0) { this.historyIndex--; this.loadFromHistory(); } }
    redo() { if (this.historyIndex < this.history.length - 1) { this.historyIndex++; this.loadFromHistory(); } }
    
    loadFromHistory() {
        const state = this.history[this.historyIndex];
        if (!state) return;
        this.layers = [];
        let loaded = 0;
        state.layers.forEach((ld) => {
            const canvas = document.createElement('canvas');
            canvas.width = this.canvasWidth; canvas.height = this.canvasHeight;
            const img = new Image();
            img.onload = () => {
                canvas.getContext('2d').drawImage(img, 0, 0);
                loaded++;
                if (loaded === state.layers.length) {
                    this.renderLayers(); this.layersPanel?.update(); this.saveCanvasData();
                }
            };
            img.src = ld.imageData;
            this.layers.push({ canvas, name: ld.name, visible: ld.visible, opacity: ld.opacity });
        });
        this.activeLayerIndex = state.activeIndex;
    }
    
    saveCanvasData() {
        this.renderLayers();
        if (this.canvasDataWidget) this.canvasDataWidget.value = this.previewCanvas.toDataURL('image/png');
        this.node.setDirtyCanvas(true, true);
    }
    
    // Fullscreen
    openFullscreen() {
        this.isFullscreen = true;
        this.zoom = 1; this.panX = 0; this.panY = 0;
        if (this.layers.length === 0) this.addLayer(false);
        
        this.fullscreenOverlay = document.createElement('div');
        this.fullscreenOverlay.style.cssText = `
            position: fixed; top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: #e0e0e0; z-index: 99999;
        `;
        
        this.canvasContainer = document.createElement('div');
        this.canvasContainer.style.cssText = `
            width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
            overflow: hidden;
        `;
        
        this.displayCanvas = document.createElement('canvas');
        this.displayCanvas.width = this.canvasWidth;
        this.displayCanvas.height = this.canvasHeight;
        this.displayCanvas.style.cssText = 'box-shadow: 0 0 40px rgba(0,0,0,0.3); touch-action: none;';
        this.renderLayers();
        
        this.canvasContainer.appendChild(this.displayCanvas);
        this.fullscreenOverlay.appendChild(this.canvasContainer);
        
        // Brush cursor
        this.brushCursor = document.createElement('div');
        this.brushCursor.style.cssText = `
            position: fixed; pointer-events: none;
            border: 2px solid rgba(0,0,0,0.5); border-radius: 50%;
            transform: translate(-50%, -50%); z-index: 100002; display: none;
        `;
        this.fullscreenOverlay.appendChild(this.brushCursor);
        
        this.topBar = new TopBar(this);
        if (this.savedPositions?.topBar) {
            this.topBar.getElement().style.left = this.savedPositions.topBar.x + 'px';
            this.topBar.getElement().style.top = this.savedPositions.topBar.y + 'px';
            this.topBar.getElement().style.transform = 'none';
        }
        this.fullscreenOverlay.appendChild(this.topBar.getElement());
        
        this.toolbarPanel = new ToolbarPanel(this);
        this.toolbarPanel.setPosition(this.savedPositions?.toolbar?.x ?? 20, this.savedPositions?.toolbar?.y ?? 60);
        this.fullscreenOverlay.appendChild(this.toolbarPanel.getElement());
        
        this.colorPanel = new ColorWheelPanel(this);
        this.colorPanel.setPosition(this.savedPositions?.color?.x ?? window.innerWidth - 160, this.savedPositions?.color?.y ?? 60);
        this.fullscreenOverlay.appendChild(this.colorPanel.getElement());
        
        this.sizeWidget = new SizeOpacityWidget(this);
        this.sizeWidget.setPosition(this.savedPositions?.size?.x ?? window.innerWidth / 2 - 35, this.savedPositions?.size?.y ?? window.innerHeight - 100);
        this.fullscreenOverlay.appendChild(this.sizeWidget.getElement());
        
        this.layersPanel = new LayersPanel(this);
        this.layersPanel.setPosition(this.savedPositions?.layers?.x ?? window.innerWidth - 160, this.savedPositions?.layers?.y ?? 280);
        this.fullscreenOverlay.appendChild(this.layersPanel.getElement());
        this.layersPanel.update();
        
        this.setupFullscreenEvents();
        this.updateCanvasTransform();
        this.updateCursor();
        
        this.keyHandler = (e) => this.handleKeyboard(e);
        document.addEventListener('keydown', this.keyHandler);
        
        document.body.appendChild(this.fullscreenOverlay);
        this.saveToHistory();
    }
    
    toggleColorPanel() {
        if (this.colorPanel) {
            this.colorPanel.toggleCollapse();
        }
    }
    
    updateCursor() {
        if (!this.displayCanvas) return;
        if (this.tool === 'eyedropper') {
            this.displayCanvas.style.cursor = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/></svg>') 0 24, crosshair`;
        } else if (this.tool === 'pencil') {
            this.displayCanvas.style.cursor = 'crosshair';
        } else {
            const cursors = { draw: 'none', line: 'crosshair', circle: 'crosshair', square: 'crosshair', fill: 'cell', erase: 'none' };
            this.displayCanvas.style.cursor = cursors[this.tool] || 'crosshair';
        }
        this.updateBrushCursor();
    }
    
    updateBrushCursor() {
        if (!this.brushCursor) return;
        if (this.tool === 'draw' || this.tool === 'erase') {
            const size = this.brushSize * this.zoom;
            this.brushCursor.style.width = `${size}px`;
            this.brushCursor.style.height = `${size}px`;
            this.brushCursor.style.display = 'block';
            this.brushCursor.style.background = this.tool === 'erase'
                ? 'rgba(255,255,255,0.3)'
                : this.hexToRgba(this.color, this.opacity / 100 * 0.4);
            this.brushCursor.style.borderColor = this.tool === 'erase' ? 'rgba(255,0,0,0.6)' : 'rgba(0,0,0,0.6)';
        } else {
            this.brushCursor.style.display = 'none';
        }
    }
    
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }
    
    updateCanvasTransform() {
        if (!this.displayCanvas) return;
        this.displayCanvas.style.transform = `scale(${this.zoom}) translate(${this.panX}px, ${this.panY}px)`;
    }
    
    adjustZoom(delta) {
        this.zoom = Math.max(0.25, Math.min(8, this.zoom + delta));
        this.updateCanvasTransform();
        this.updateBrushCursor();
    }
    
    fitToView() {
        if (!this.canvasContainer) return;
        const containerW = this.canvasContainer.clientWidth - 40;
        const containerH = this.canvasContainer.clientHeight - 40;
        const scaleX = containerW / this.canvasWidth;
        const scaleY = containerH / this.canvasHeight;
        this.zoom = Math.min(scaleX, scaleY, 1);
        this.panX = 0;
        this.panY = 0;
        this.updateCanvasTransform();
        this.updateBrushCursor();
    }
    
    showSizeLabel() {
        if (this.sizeLabelTimeout) clearTimeout(this.sizeLabelTimeout);
        
        if (!this.sizeLabel) {
            this.sizeLabel = document.createElement('div');
            this.sizeLabel.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                padding: 8px 16px; background: rgba(0,0,0,0.6); color: #fff;
                font-size: 14px; border-radius: 6px; z-index: 100010;
                pointer-events: none; font-family: sans-serif;
            `;
            document.body.appendChild(this.sizeLabel);
        }
        
        this.sizeLabel.textContent = `Size: ${this.brushSize}px`;
        this.sizeLabel.style.display = 'block';
    }
    
    hideSizeLabelDelayed() {
        this.sizeLabelTimeout = setTimeout(() => {
            if (this.sizeLabel) this.sizeLabel.style.display = 'none';
        }, 800);
    }
    
    showOpacityLabel() {
        if (this.opacityLabelTimeout) clearTimeout(this.opacityLabelTimeout);
        
        if (!this.opacityLabel) {
            this.opacityLabel = document.createElement('div');
            this.opacityLabel.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                padding: 8px 16px; background: rgba(0,0,0,0.6); color: #fff;
                font-size: 14px; border-radius: 6px; z-index: 100010;
                pointer-events: none; font-family: sans-serif;
            `;
            document.body.appendChild(this.opacityLabel);
        }
        
        this.opacityLabel.textContent = `Opacity: ${this.opacity}%`;
        this.opacityLabel.style.display = 'block';
    }
    
    hideOpacityLabelDelayed() {
        this.opacityLabelTimeout = setTimeout(() => {
            if (this.opacityLabel) this.opacityLabel.style.display = 'none';
        }, 800);
    }
    
    setupFullscreenEvents() {
        const canvas = this.displayCanvas;
        
        canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
        canvas.addEventListener('pointerup', (e) => this.onPointerUp(e));
        canvas.addEventListener('pointerleave', (e) => this.onPointerUp(e));
        
        // S + drag for brush size
        this.sizeAdjustMode = false;
        this.sizeAdjustStart = null;
        this.sizeAdjustStartSize = 0;
        this.sizeLabel = null;
        this.sizeLabelTimeout = null;
        
        // O + drag for opacity
        this.opacityAdjustMode = false;
        this.opacityAdjustStart = null;
        this.opacityAdjustStartVal = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT') {
                this.sizeAdjustMode = true;
                this.showSizeLabel();
            }
            if (e.key.toLowerCase() === 'o' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT') {
                this.opacityAdjustMode = true;
                this.showOpacityLabel();
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() === 's') {
                this.sizeAdjustMode = false;
                this.sizeAdjustStart = null;
                this.hideSizeLabelDelayed();
            }
            if (e.key.toLowerCase() === 'o') {
                this.opacityAdjustMode = false;
                this.opacityAdjustStart = null;
                this.hideOpacityLabelDelayed();
            }
        });
        
        this.canvasContainer.addEventListener('mousedown', (e) => {
            if (this.sizeAdjustMode && e.button === 0) {
                e.preventDefault();
                this.sizeAdjustStart = { x: e.clientX, y: e.clientY };
                this.sizeAdjustStartSize = this.brushSize;
            }
            if (this.opacityAdjustMode && e.button === 0) {
                e.preventDefault();
                this.opacityAdjustStart = { x: e.clientX, y: e.clientY };
                this.opacityAdjustStartVal = this.opacity;
            }
        });
        
        this.canvasContainer.addEventListener('mousemove', (e) => {
            if (this.sizeAdjustMode && this.sizeAdjustStart) {
                const deltaX = e.clientX - this.sizeAdjustStart.x;
                this.brushSize = Math.max(1, Math.min(100, this.sizeAdjustStartSize + Math.round(deltaX / 2)));
                this.sizeWidget?.update();
                this.updateBrushCursor();
                this.showSizeLabel();
            } else if (this.opacityAdjustMode && this.opacityAdjustStart) {
                const deltaX = e.clientX - this.opacityAdjustStart.x;
                this.opacity = Math.max(1, Math.min(100, this.opacityAdjustStartVal + Math.round(deltaX / 2)));
                this.sizeWidget?.update();
                this.showOpacityLabel();
            } else if (this.tool === 'draw' || this.tool === 'erase') {
                this.brushCursor.style.left = `${e.clientX}px`;
                this.brushCursor.style.top = `${e.clientY}px`;
                this.brushCursor.style.display = 'block';
            } else {
                this.brushCursor.style.display = 'none';
            }
        });
        this.canvasContainer.addEventListener('mouseleave', () => { this.brushCursor.style.display = 'none'; });
        
        this.canvasContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.adjustZoom(e.deltaY > 0 ? -0.1 : 0.1);
        }, { passive: false });
        
        this.canvasContainer.addEventListener('mousedown', (e) => {
            if (e.button === 1) { e.preventDefault(); this.isPanning = true; this.lastPanPoint = { x: e.clientX, y: e.clientY }; }
        });
        
        this.panMoveHandler = (e) => {
            if (this.isPanning && this.lastPanPoint) {
                this.panX += (e.clientX - this.lastPanPoint.x) / this.zoom;
                this.panY += (e.clientY - this.lastPanPoint.y) / this.zoom;
                this.lastPanPoint = { x: e.clientX, y: e.clientY };
                this.updateCanvasTransform();
            }
        };
        this.panUpHandler = (e) => { 
            if (e.button === 1) this.isPanning = false;
            if (e.button === 0) {
                this.sizeAdjustStart = null;
                this.opacityAdjustStart = null;
            }
        };
        
        document.addEventListener('mousemove', this.panMoveHandler);
        document.addEventListener('mouseup', this.panUpHandler);
    }
    
    getCanvasPos(e) {
        const rect = this.displayCanvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (this.canvasWidth / rect.width),
            y: (e.clientY - rect.top) * (this.canvasHeight / rect.height)
        };
    }
    
    onPointerDown(e) {
        if (e.button === 1) return;
        if (this.sizeAdjustMode) return;
        if (this.opacityAdjustMode) return;
        e.preventDefault();
        const pos = this.getCanvasPos(e);
        this.shiftKey = e.shiftKey;
        
        if (this.tool === 'eyedropper') { this.pickColor(pos); return; }
        if (this.tool === 'fill') { this.floodFill(pos); return; }
        
        this.isDrawing = true;
        this.lastPoint = pos;
        this.lastPressure = e.pressure || 0.5;
        this.strokePoints = [{ ...pos, pressure: this.lastPressure }];
        
        // Create stroke buffer for opacity accumulation fix
        if (this.tool === 'draw' && this.brushType !== 'spray') {
            this.strokeBuffer = document.createElement('canvas');
            this.strokeBuffer.width = this.canvasWidth;
            this.strokeBuffer.height = this.canvasHeight;
            this.strokeCtx = this.strokeBuffer.getContext('2d');
            this.strokeCtx.globalAlpha = 1;
        } else {
            this.strokeBuffer = null;
        }
        
        if (this.tool === 'draw' || this.tool === 'erase' || this.tool === 'pencil') {
            this.drawDot(pos, this.lastPressure);
            this.renderLayers();
        } else {
            this.saveSnapshot();
        }
    }
    
    onPointerMove(e) {
        if (!this.isDrawing) return;
        const pos = this.getCanvasPos(e);
        const pressure = e.pressure || 0.5;
        this.shiftKey = e.shiftKey;
        
        if (this.tool === 'draw' || this.tool === 'erase' || this.tool === 'pencil') {
            this.strokePoints.push({ ...pos, pressure });
            this.drawLine(this.lastPoint, pos, this.lastPressure, pressure);
            this.lastPoint = pos;
            this.lastPressure = pressure;
            this.renderLayers();
        } else {
            this.restoreSnapshot();
            if (this.tool === 'line') this.drawStraightLine(this.lastPoint, pos);
            else if (this.tool === 'circle') this.drawCircle(this.lastPoint, pos, this.shiftKey);
            else if (this.tool === 'square') this.drawSquare(this.lastPoint, pos, this.shiftKey);
            this.renderLayers();
        }
    }
    
    onPointerUp(e) {
        if (!this.isDrawing) return;
        if (e && (this.tool === 'line' || this.tool === 'circle' || this.tool === 'square')) {
            const pos = this.getCanvasPos(e);
            this.shiftKey = e.shiftKey;
            this.restoreSnapshot();
            if (this.tool === 'line') this.drawStraightLine(this.lastPoint, pos);
            else if (this.tool === 'circle') this.drawCircle(this.lastPoint, pos, this.shiftKey);
            else if (this.tool === 'square') this.drawSquare(this.lastPoint, pos, this.shiftKey);
        }
        
        // Apply stroke buffer with correct opacity (opacity accumulation fix)
        if (this.strokeBuffer && this.tool === 'draw') {
            const layer = this.getActiveLayer();
            if (layer) {
                const ctx = layer.canvas.getContext('2d');
                ctx.globalAlpha = this.opacity / 100;
                ctx.drawImage(this.strokeBuffer, 0, 0);
                ctx.globalAlpha = 1;
            }
            this.strokeBuffer = null;
            this.strokeCtx = null;
        }
        
        this.isDrawing = false;
        this.lastPoint = null;
        this.strokePoints = [];
        this.renderLayers();
        this.saveToHistory();
        this.layersPanel?.update();
        this.saveCanvasData();
    }
    
    pickColor(pos) {
        const pixel = this.displayCanvas.getContext('2d').getImageData(Math.floor(pos.x), Math.floor(pos.y), 1, 1).data;
        this.color = '#' + [pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
        this.colorPanel?.setFromHex(this.color);
        this.colorPanel?.updateFgBg();
        this.tool = 'draw';
        this.toolbarPanel?.updateToolButtons();
        this.updateCursor();
    }
    
    drawDot(pos, pressure) {
        const layer = this.getActiveLayer();
        if (!layer) return;
        
        // Use stroke buffer if available (for opacity accumulation fix)
        const ctx = this.strokeBuffer ? this.strokeCtx : layer.canvas.getContext('2d');
        const size = this.tool === 'erase' ? this.brushSize * 2 : 
                     this.tool === 'pencil' ? 1 : 
                     this.brushSize * (0.3 + pressure * 0.7);
        
        if (!this.strokeBuffer) ctx.globalAlpha = this.opacity / 100;
        
        this._drawDotAt(ctx, pos.x, pos.y, size);
        
        if (this.mirrorDrawH) {
            this._drawDotAt(ctx, this.canvasWidth - pos.x, pos.y, size);
        }
        if (this.mirrorDrawV) {
            this._drawDotAt(ctx, pos.x, this.canvasHeight - pos.y, size);
        }
        if (this.mirrorDrawH && this.mirrorDrawV) {
            this._drawDotAt(ctx, this.canvasWidth - pos.x, this.canvasHeight - pos.y, size);
        }
        
        if (!this.strokeBuffer) ctx.globalAlpha = 1;
    }
    
    _drawDotAt(ctx, x, y, size) {
        if (this.tool === 'erase') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath(); ctx.arc(x, y, size / 2, 0, Math.PI * 2); ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
        } else if (this.tool === 'pencil') {
            // Anti-aliased pixel with sub-pixel positioning
            ctx.fillStyle = this.color;
            const fx = Math.floor(x), fy = Math.floor(y);
            const ax = x - fx, ay = y - fy;
            
            // Wu's anti-aliasing weights
            ctx.globalAlpha = (this.opacity / 100) * (1 - ax) * (1 - ay);
            ctx.fillRect(fx, fy, 1, 1);
            ctx.globalAlpha = (this.opacity / 100) * ax * (1 - ay);
            ctx.fillRect(fx + 1, fy, 1, 1);
            ctx.globalAlpha = (this.opacity / 100) * (1 - ax) * ay;
            ctx.fillRect(fx, fy + 1, 1, 1);
            ctx.globalAlpha = (this.opacity / 100) * ax * ay;
            ctx.fillRect(fx + 1, fy + 1, 1, 1);
            ctx.globalAlpha = this.opacity / 100;
        } else {
            this.drawBrushStroke(ctx, x, y, size);
        }
    }
    
    drawLine(from, to, pFrom, pTo) {
        const layer = this.getActiveLayer();
        if (!layer) return;
        
        // Use stroke buffer if available (for opacity accumulation fix)
        const ctx = this.strokeBuffer ? this.strokeCtx : layer.canvas.getContext('2d');
        const dist = Math.hypot(to.x - from.x, to.y - from.y);
        
        // Smaller spacing to eliminate gaps - use fraction of brush size
        const spacing = this.tool === 'pencil' ? 0.5 : Math.max(0.5, this.brushSize * 0.15);
        const steps = Math.max(1, Math.ceil(dist / spacing));
        
        if (!this.strokeBuffer) ctx.globalAlpha = this.opacity / 100;
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = from.x + (to.x - from.x) * t;
            const y = from.y + (to.y - from.y) * t;
            const p = pFrom + (pTo - pFrom) * t;
            const size = this.tool === 'erase' ? this.brushSize * 2 : 
                         this.tool === 'pencil' ? 1 :
                         this.brushSize * (0.3 + p * 0.7);
            
            this._drawDotAt(ctx, x, y, size);
            
            if (this.mirrorDrawH) {
                this._drawDotAt(ctx, this.canvasWidth - x, y, size);
            }
            if (this.mirrorDrawV) {
                this._drawDotAt(ctx, x, this.canvasHeight - y, size);
            }
            if (this.mirrorDrawH && this.mirrorDrawV) {
                this._drawDotAt(ctx, this.canvasWidth - x, this.canvasHeight - y, size);
            }
        }
        if (!this.strokeBuffer) ctx.globalAlpha = 1;
    }
    
    drawBrushStroke(ctx, x, y, size) {
        ctx.fillStyle = this.color;
        const roundness = (this.brushRoundness || 100) / 100;
        const angle = ((this.brushAngle || 0) * Math.PI) / 180;
        
        switch (this.brushType) {
            case 'round':
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                
                // Apply hardness (falloff) - 100 = hard edge, 0 = very soft
                const hardness = (this.brushHardness || 100) / 100;
                if (hardness < 1) {
                    // Create gradient for soft edges
                    const rr = parseInt(this.color.slice(1, 3), 16);
                    const rg = parseInt(this.color.slice(3, 5), 16);
                    const rb = parseInt(this.color.slice(5, 7), 16);
                    const roundGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2);
                    const coreSize = hardness * 0.8; // Hard core percentage
                    roundGrad.addColorStop(0, this.color);
                    roundGrad.addColorStop(coreSize, this.color);
                    roundGrad.addColorStop(coreSize + (1 - coreSize) * 0.5, `rgba(${rr},${rg},${rb},0.5)`);
                    roundGrad.addColorStop(1, `rgba(${rr},${rg},${rb},0)`);
                    ctx.fillStyle = roundGrad;
                }
                
                ctx.beginPath();
                ctx.ellipse(0, 0, size / 2, (size / 2) * roundness, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            case 'square':
                ctx.fillRect(x - size / 2, y - size / 2, size, size);
                break;
            case 'soft':
                // Use lighter composite for soft brush to avoid harsh overlaps
                const prevComposite = ctx.globalCompositeOperation;
                ctx.globalCompositeOperation = 'lighter';
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.scale(1, roundness);
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2);
                // Parse color and use very low alpha for smooth accumulation
                const r = parseInt(this.color.slice(1, 3), 16);
                const g = parseInt(this.color.slice(3, 5), 16);
                const b = parseInt(this.color.slice(5, 7), 16);
                gradient.addColorStop(0, `rgba(${r},${g},${b},0.08)`);
                gradient.addColorStop(0.5, `rgba(${r},${g},${b},0.04)`);
                gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
                ctx.fillStyle = gradient;
                ctx.beginPath(); 
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2); 
                ctx.fill();
                ctx.restore();
                ctx.globalCompositeOperation = prevComposite;
                break;
            case 'airbrush':
                // Very soft airbrush with flow control
                const flow = (this.airbrushFlow || 20) / 100;
                const softness = (this.airbrushSoftness || 80) / 100;
                const ar = parseInt(this.color.slice(1, 3), 16);
                const ag = parseInt(this.color.slice(3, 5), 16);
                const ab = parseInt(this.color.slice(5, 7), 16);
                
                // Create very soft gradient with multiple stops
                const airGradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
                const baseAlpha = flow * 0.15;
                const innerAlpha = baseAlpha * (1 - softness * 0.5);
                airGradient.addColorStop(0, `rgba(${ar},${ag},${ab},${innerAlpha})`);
                airGradient.addColorStop(0.2, `rgba(${ar},${ag},${ab},${baseAlpha * 0.8})`);
                airGradient.addColorStop(0.5, `rgba(${ar},${ag},${ab},${baseAlpha * 0.4})`);
                airGradient.addColorStop(0.8, `rgba(${ar},${ag},${ab},${baseAlpha * 0.1})`);
                airGradient.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
                
                ctx.fillStyle = airGradient;
                ctx.beginPath();
                ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'spray':
                const density = Math.floor(size * 2 * ((this.sprayDensity || 50) / 50));
                for (let i = 0; i < density; i++) {
                    const a = Math.random() * Math.PI * 2;
                    const rad = Math.random() * size / 2;
                    ctx.fillRect(x + Math.cos(a) * rad, y + Math.sin(a) * rad, 1, 1);
                }
                break;
            case 'marker':
                ctx.save();
                ctx.beginPath();
                ctx.ellipse(x, y, size / 2, size / 3, Math.PI / 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
        }
    }
    
    drawStraightLine(from, to) {
        const layer = this.getActiveLayer();
        if (!layer) return;
        const ctx = layer.canvas.getContext('2d');
        ctx.globalAlpha = this.opacity / 100;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.brushSize;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    drawCircle(center, edge, perfectCircle = false) {
        const layer = this.getActiveLayer();
        if (!layer) return;
        const ctx = layer.canvas.getContext('2d');
        ctx.globalAlpha = this.opacity / 100;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.brushSize;
        ctx.beginPath();
        let rx = Math.abs(edge.x - center.x);
        let ry = Math.abs(edge.y - center.y);
        if (perfectCircle) {
            const r = Math.max(rx, ry);
            rx = ry = r;
        }
        ctx.ellipse(center.x, center.y, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    drawSquare(start, end, perfectSquare = false) {
        const layer = this.getActiveLayer();
        if (!layer) return;
        const ctx = layer.canvas.getContext('2d');
        ctx.globalAlpha = this.opacity / 100;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.brushSize;
        let w = end.x - start.x;
        let h = end.y - start.y;
        if (perfectSquare) {
            const size = Math.max(Math.abs(w), Math.abs(h));
            w = w < 0 ? -size : size;
            h = h < 0 ? -size : size;
        }
        ctx.strokeRect(start.x, start.y, w, h);
        ctx.globalAlpha = 1;
    }
    
    floodFill(pos) {
        const layer = this.getActiveLayer();
        if (!layer) return;
        const ctx = layer.canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        const data = imageData.data;
        const startX = Math.floor(pos.x), startY = Math.floor(pos.y);
        const startIdx = (startY * this.canvasWidth + startX) * 4;
        const startR = data[startIdx], startG = data[startIdx + 1], startB = data[startIdx + 2], startA = data[startIdx + 3];
        const fillR = parseInt(this.color.slice(1, 3), 16);
        const fillG = parseInt(this.color.slice(3, 5), 16);
        const fillB = parseInt(this.color.slice(5, 7), 16);
        const fillA = Math.round((this.opacity / 100) * 255);
        if (startR === fillR && startG === fillG && startB === fillB && startA === fillA) return;
        const tolerance = 32;
        const stack = [[startX, startY]];
        const visited = new Set();
        const matchesStart = (idx) => Math.abs(data[idx] - startR) <= tolerance && Math.abs(data[idx + 1] - startG) <= tolerance && Math.abs(data[idx + 2] - startB) <= tolerance && Math.abs(data[idx + 3] - startA) <= tolerance;
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const key = `${x},${y}`;
            if (visited.has(key) || x < 0 || x >= this.canvasWidth || y < 0 || y >= this.canvasHeight) continue;
            const idx = (y * this.canvasWidth + x) * 4;
            if (!matchesStart(idx)) continue;
            visited.add(key);
            data[idx] = fillR; data[idx + 1] = fillG; data[idx + 2] = fillB; data[idx + 3] = fillA;
            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
        ctx.putImageData(imageData, 0, 0);
        this.renderLayers(); this.saveToHistory(); this.layersPanel?.update(); this.saveCanvasData();
    }
    
    saveSnapshot() {
        const layer = this.getActiveLayer();
        if (layer) this.snapshot = layer.canvas.getContext('2d').getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    }
    
    restoreSnapshot() {
        const layer = this.getActiveLayer();
        if (this.snapshot && layer) layer.canvas.getContext('2d').putImageData(this.snapshot, 0, 0);
    }
    
    handleKeyboard(e) {
        if (e.target.tagName === 'INPUT') return;
        switch(e.key.toLowerCase()) {
            case 'escape': this.closeFullscreen(); break;
            case ' ': e.preventDefault(); this.toggleUI(); break;
            case 'b': this.tool = 'draw'; this.toolbarPanel?.updateToolButtons(); this.updateCursor(); break;
            case 'p': this.tool = 'pencil'; this.toolbarPanel?.updateToolButtons(); this.updateCursor(); break;
            case 'l': this.tool = 'line'; this.toolbarPanel?.updateToolButtons(); this.updateCursor(); break;
            case 'c': this.tool = 'circle'; this.toolbarPanel?.updateToolButtons(); this.updateCursor(); break;
            case 'g': this.tool = 'fill'; this.toolbarPanel?.updateToolButtons(); this.updateCursor(); break;
            case 'e': this.tool = 'erase'; this.toolbarPanel?.updateToolButtons(); this.updateCursor(); break;
            case 'i': this.tool = 'eyedropper'; this.toolbarPanel?.updateToolButtons(); this.updateCursor(); break;
            case 'r': this.tool = 'square'; this.toolbarPanel?.updateToolButtons(); this.updateCursor(); break;
            case 'x':
                const temp = this.color; this.color = this.bgColor; this.bgColor = temp;
                this.colorPanel?.setFromHex(this.color); this.colorPanel?.updateFgBg();
                break;
            case 'd':
                this.color = '#FFFFFF'; this.bgColor = '#000000';
                this.colorPanel?.setFromHex(this.color); this.colorPanel?.updateFgBg();
                break;
            case 'z': if (e.ctrlKey || e.metaKey) { e.preventDefault(); this.undo(); } break;
            case 'y': if (e.ctrlKey || e.metaKey) { e.preventDefault(); this.redo(); } break;
            case '0': this.zoom = 1; this.panX = 0; this.panY = 0; this.updateCanvasTransform(); break;
            case '-': case '_': this.adjustZoom(-0.25); break;
            case '=': case '+': this.adjustZoom(0.25); break;
            case '[': this.brushSize = Math.max(1, this.brushSize - 2); this.sizeWidget?.update(); this.updateBrushCursor(); break;
            case ']': this.brushSize = Math.min(100, this.brushSize + 2); this.sizeWidget?.update(); this.updateBrushCursor(); break;
        }
    }
    
    toggleUI() {
        this.uiHidden = !this.uiHidden;
        const display = this.uiHidden ? 'none' : 'block';
        const displayFlex = this.uiHidden ? 'none' : 'flex';
        if (this.topBar) this.topBar.getElement().style.display = displayFlex;
        if (this.toolbarPanel) this.toolbarPanel.getElement().style.display = display;
        if (this.colorPanel) this.colorPanel.getElement().style.display = display;
        if (this.layersPanel) this.layersPanel.getElement().style.display = display;
        if (this.sizeWidget) this.sizeWidget.getElement().style.display = display;
    }
    
    toggleTheme() {
        this.darkTheme = !this.darkTheme;
        if (this.fullscreenOverlay) {
            this.fullscreenOverlay.style.background = this.darkTheme ? '#2a2a2a' : '#e0e0e0';
        }
        this.topBar?.updateTheme(this.darkTheme);
        this.toolbarPanel?.updateTheme(this.darkTheme);
        this.colorPanel?.updateTheme(this.darkTheme);
        this.layersPanel?.updateTheme(this.darkTheme);
    }
    
    closeFullscreen() {
        if (!this.fullscreenOverlay) return;
        
        this.savedPositions = {
            topBar: this.topBar ? { x: parseInt(this.topBar.getElement().style.left), y: parseInt(this.topBar.getElement().style.top) } : null,
            toolbar: this.toolbarPanel ? { x: parseInt(this.toolbarPanel.getElement().style.left), y: parseInt(this.toolbarPanel.getElement().style.top) } : null,
            color: this.colorPanel ? { x: parseInt(this.colorPanel.getElement().style.left), y: parseInt(this.colorPanel.getElement().style.top) } : null,
            size: this.sizeWidget ? { x: parseInt(this.sizeWidget.getElement().style.left), y: parseInt(this.sizeWidget.getElement().style.top) } : null,
            layers: this.layersPanel ? { x: parseInt(this.layersPanel.getElement().style.left), y: parseInt(this.layersPanel.getElement().style.top) } : null,
        };
        
        this.isFullscreen = false;
        this.renderLayers();
        this.saveCanvasData();
        document.removeEventListener('keydown', this.keyHandler);
        document.removeEventListener('mousemove', this.panMoveHandler);
        document.removeEventListener('mouseup', this.panUpHandler);
        document.body.removeChild(this.fullscreenOverlay);
        this.fullscreenOverlay = null;
        this.displayCanvas = null;
        this.topBar = null;
        this.toolbarPanel = null;
        this.colorPanel = null;
        this.sizeWidget = null;
        this.layersPanel = null;
    }
    
    getElement() { return this.container; }
}


// ==================== REGISTER ====================
app.registerExtension({
    name: "ComfySketch",
    
    async nodeCreated(node) {
        if (node.comfyClass === "ComfySketch") {
            // Set initial size but allow user to resize
            if (!node.size || node.size[0] < 300) {
                node.size = [350, 400];
            }
            
            const canvasDataWidget = node.widgets?.find(w => w.name === 'canvas_data');
            if (canvasDataWidget) {
                canvasDataWidget.type = 'hidden';
                canvasDataWidget.computeSize = () => [0, 0];
            }
            
            setTimeout(() => {
                if (node._drawingPad) return;
                const pad = new DrawingPad(node, canvasDataWidget);
                node._drawingPad = pad;
                
                // Add widget with height that fills available space
                const widget = node.addDOMWidget('sketch_preview', 'preview', pad.getElement(), { 
                    serialize: false,
                    hideOnZoom: false
                });
                
                // Make widget fill available height
                if (widget) {
                    widget.computeSize = function(width) {
                        const height = Math.max(150, node.size[1] - 180);
                        return [width, height];
                    };
                }
                
                const presetWidget = node.widgets?.find(w => w.name === 'preset_size');
                if (presetWidget) {
                    const orig = presetWidget.callback;
                    presetWidget.callback = function(v) { if (orig) orig.call(this, v); pad.resizeCanvas(); };
                }
                
                const bgWidget = node.widgets?.find(w => w.name === 'background_color');
                if (bgWidget) {
                    const orig = bgWidget.callback;
                    bgWidget.callback = function(v) { if (orig) orig.call(this, v); pad.clear(true); };
                }
            }, 100);
        }
    }
});

console.log("ComfySketch loaded!");