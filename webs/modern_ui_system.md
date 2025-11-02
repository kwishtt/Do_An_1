# 🎨 MODERN UI/UX DESIGN SYSTEM

**File:** Advanced UI Components & Theme System  
**Dự án:** FilmPredict.vn  
**Ngày tạo:** November 3, 2025  
**Focus:** Giao diện hiện đại với Dark/Light Theme

---

## 🌙 **THEME SYSTEM ARCHITECTURE**

### **Theme Configuration**
```css
/* CSS Custom Properties cho Theme System */
:root {
  /* Light Theme (Default) */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-900: #1e3a8a;
  
  --surface-primary: #ffffff;
  --surface-secondary: #f8fafc;
  --surface-tertiary: #f1f5f9;
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  
  --border-primary: #e2e8f0;
  --border-secondary: #cbd5e1;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.2);
}

[data-theme="dark"] {
  /* Dark Theme */
  --primary-50: #1e3a8a;
  --primary-500: #3b82f6;
  --primary-600: #60a5fa;
  --primary-900: #bfdbfe;
  
  --surface-primary: #0f172a;
  --surface-secondary: #1e293b;
  --surface-tertiary: #334155;
  
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #64748b;
  
  --border-primary: #334155;
  --border-secondary: #475569;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5);
  
  --glass-bg: rgba(15, 23, 42, 0.7);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

### **Theme Toggle Implementation**
```javascript
// Theme Management System
class ThemeManager {
  constructor() {
    this.theme = this.getStoredTheme() || this.getSystemTheme();
    this.initializeTheme();
    this.setupEventListeners();
  }
  
  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' : 'light';
  }
  
  getStoredTheme() {
    return localStorage.getItem('film-predict-theme');
  }
  
  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('film-predict-theme', theme);
    this.updateThemeIcon();
    this.updateChartThemes();
  }
  
  toggleTheme() {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }
  
  updateThemeIcon() {
    const icon = document.querySelector('.theme-toggle-icon');
    icon.innerHTML = this.theme === 'light' 
      ? '<i class="icon-moon"></i>' 
      : '<i class="icon-sun"></i>';
  }
}
```

---

## 🎯 **MODERN UI COMPONENTS**

### **1. Input Components**

#### **Floating Label Input:**
```html
<div class="input-group">
  <input type="text" id="movie-title" class="floating-input" placeholder=" ">
  <label for="movie-title" class="floating-label">Tên phim</label>
  <div class="input-decoration"></div>
</div>
```

```css
.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.floating-input {
  width: 100%;
  padding: 1rem 1rem 0.5rem;
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  background: var(--surface-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.floating-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.floating-label {
  position: absolute;
  left: 1rem;
  top: 1rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  pointer-events: none;
}

.floating-input:focus ~ .floating-label,
.floating-input:not(:placeholder-shown) ~ .floating-label {
  top: 0.25rem;
  font-size: 0.75rem;
  color: var(--primary-500);
}
```

#### **Quality Score Slider:**
```html
<div class="quality-slider">
  <label class="slider-label">Điểm chất lượng dự kiến</label>
  <div class="slider-container">
    <input type="range" min="1" max="10" value="7" class="quality-range" id="quality">
    <div class="slider-track-fill"></div>
    <div class="slider-value">7.0</div>
  </div>
  <div class="slider-labels">
    <span>Kém</span>
    <span>Xuất sắc</span>
  </div>
</div>
```

```css
.quality-range {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    #ef4444 0%,
    #f59e0b 50%,
    #10b981 100%
  );
  outline: none;
  -webkit-appearance: none;
}

.quality-range::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--surface-primary);
  border: 3px solid var(--primary-500);
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
}

.quality-range::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}
```

### **2. Results Components**

#### **Animated Success Meter:**
```html
<div class="success-meter">
  <div class="meter-container">
    <svg class="progress-ring" width="200" height="200">
      <circle class="progress-ring-background" 
              cx="100" cy="100" r="90"
              fill="transparent"
              stroke="var(--border-primary)"
              stroke-width="8"/>
      <circle class="progress-ring-progress" 
              cx="100" cy="100" r="90"
              fill="transparent"
              stroke="url(#successGradient)"
              stroke-width="8"
              stroke-linecap="round"
              stroke-dasharray="565.48"
              stroke-dashoffset="113.1"/>
      <defs>
        <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#10b981"/>
          <stop offset="100%" style="stop-color:#3b82f6"/>
        </linearGradient>
      </defs>
    </svg>
    <div class="meter-content">
      <span class="success-percentage">87%</span>
      <span class="success-label">Thành công</span>
    </div>
  </div>
</div>
```

#### **Insight Cards:**
```html
<div class="insights-grid">
  <div class="insight-card roi-card">
    <div class="card-icon">
      <i class="icon-trend-up"></i>
    </div>
    <div class="card-content">
      <span class="card-label">ROI Dự kiến</span>
      <span class="card-value">2.4x</span>
      <span class="card-change positive">+140%</span>
    </div>
  </div>
  
  <div class="insight-card risk-card">
    <div class="card-icon">
      <i class="icon-shield-alert"></i>
    </div>
    <div class="card-content">
      <span class="card-label">Mức độ rủi ro</span>
      <span class="card-value">Trung bình</span>
      <span class="card-change warning">65%</span>
    </div>
  </div>
</div>
```

```css
.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.insight-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.insight-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  margin-bottom: 1rem;
}
```

### **3. Interactive Elements**

#### **Theme Toggle Button:**
```html
<button class="theme-toggle" onclick="themeManager.toggleTheme()">
  <div class="toggle-track">
    <div class="toggle-thumb">
      <i class="toggle-icon icon-sun"></i>
    </div>
  </div>
</button>
```

```css
.theme-toggle {
  position: relative;
  width: 60px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
}

.toggle-track {
  width: 100%;
  height: 100%;
  background: var(--border-primary);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 28px;
  height: 28px;
  background: var(--surface-primary);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

[data-theme="dark"] .toggle-thumb {
  transform: translateX(28px);
  background: var(--primary-500);
  color: white;
}

[data-theme="dark"] .toggle-track {
  background: var(--primary-600);
}
```

---

## 📱 **RESPONSIVE BREAKPOINTS**

```css
/* Mobile First Approach */
.container {
  max-width: 100%;
  padding: 0 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .prediction-layout {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    padding: 0 3rem;
  }
}

/* Large Desktop */
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }
}
```

---

## ⚡ **ANIMATION SYSTEM**

### **Micro-interactions:**
```css
/* Button hover effects */
.btn-primary {
  transform: translateY(0);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Loading animation */
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.loading {
  animation: pulse 2s infinite;
}

/* Success animation */
@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

.success-appear {
  animation: bounceIn 0.6s ease;
}
```

---

## 🎨 **DESIGN TOKENS**

```javascript
// Design System Tokens
const designTokens = {
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['SF Pro Display', 'Inter', 'sans-serif'],
    },
    fontSize: {
      xs: ['0.75rem', '1rem'],
      sm: ['0.875rem', '1.25rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.125rem', '1.75rem'],
      xl: ['1.25rem', '1.75rem'],
      '2xl': ['1.5rem', '2rem'],
      '3xl': ['1.875rem', '2.25rem'],
    },
  },
  
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    },
  },
};
```

---

## 🛠️ **IMPLEMENTATION PRIORITY**

### **Phase 1: Core Theme System (Week 1)**
- [ ] CSS custom properties setup
- [ ] Theme toggle functionality
- [ ] Local storage persistence
- [ ] System preference detection

### **Phase 2: Essential Components (Week 2)**
- [ ] Input components với floating labels
- [ ] Button system với hover states
- [ ] Success meter với animations
- [ ] Basic card layouts

### **Phase 3: Advanced Features (Week 3)**
- [ ] Glassmorphism effects
- [ ] Advanced animations
- [ ] Chart theme integration
- [ ] Mobile optimizations

### **Phase 4: Polish & Performance (Week 4)**
- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Cross-browser testing
- [ ] Final responsive adjustments

---

*🎨 "Great design is invisible. Users should feel the quality, not see the effort." - FilmPredict.vn Design Team*