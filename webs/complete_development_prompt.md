# 🎬 PROMPT CHÍNH XÁC CHO PHÁT TRIỂN WEBSITE FILMPREDCIT.VN

**Tổng hợp từ 3 files blueprint hoàn chỉnh**  
**Ngày tạo:** November 3, 2025  
**Mục đích:** Prompt chính xác 100% để develop website

---

## 🎯 **1. THÔNG TIN DỰ ÁN**

### **Project Overview**
```
🎬 TÊN DỰ ÁN: Dự Đoán Độ Thành Công Của Phim Chiếu Rạp 
🎯 MỤC TIÊU: Website dự đoán thành công phim với AI (99.52% accuracy)
👥 TARGET USER: Nhà sản xuất phim, đầu tư viên, sinh viên điện ảnh
🚀 APPROACH: No-login required, instant prediction, UX-first design
```

### **Core Features**
```
✅ MAIN FEATURES:
1. Film Success Prediction (Binary: Success/Fail)
2. ROI Analysis & Risk Assessment  
3. Feature Importance Visualization
4. Business Insights & Recommendations
5. Dark/Light Theme Support
6. Mobile-first Responsive Design
7. Vietnamese Market Specific Analysis

✅ TECHNICAL SPECS:
- Backend: Python Flask + Random Forest Model
- Frontend: HTML5 + Modern CSS + Vanilla JavaScript
- Database: CSV files (1020 movies, 47 features)
- No authentication required
- Real-time predictions
```

---

## 🎨 **2. DESIGN SYSTEM CHÍNH XÁC**

### **Color Palette**
```css
/* LIGHT THEME (Default) */
:root {
  /* Brand Colors */
  --primary-blue: #2563EB;
  --secondary-purple: #7C3AED;
  --success-green: #059669;
  --warning-orange: #EA580C;
  --danger-red: #DC2626;
  
  /* Backgrounds */
  --bg-primary: #FAFAFA;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #F8FAFC;
  
  /* Text Colors */
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-tertiary: #9CA3AF;
  
  /* Borders & Shadows */
  --border-light: #E5E7EB;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.2);
}

/* DARK THEME */
[data-theme="dark"] {
  --primary-blue: #3B82F6;
  --secondary-purple: #8B5CF6;
  --success-green: #10B981;
  --warning-orange: #F59E0B;
  --danger-red: #EF4444;
  
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-tertiary: #334155;
  
  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --text-tertiary: #64748B;
  
  --border-light: #334155;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5);
  
  --glass-bg: rgba(15, 23, 42, 0.7);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

### **Typography System**
```css
/* Typography - Make10000Hours Inspired */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Font Sizes */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}

/* Heading Styles */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family);
  font-weight: 600;
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

.hero-title {
  font-size: var(--text-5xl);
  font-weight: 700;
  line-height: 1.1;
}

.section-title {
  font-size: var(--text-3xl);
  font-weight: 600;
}

.card-title {
  font-size: var(--text-xl);
  font-weight: 600;
}
```

---

## 🏗️ **3. LAYOUT STRUCTURE CHÍNH XÁC**

### **Responsive Breakpoints**
```css
/* Mobile First Design */
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}

/* Responsive Grid System */
.container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { padding: 0 1.5rem; }
}

@media (min-width: 1024px) {
  .container { padding: 0 2rem; }
}
```

### **Component Architecture**
```
📁 COMPONENT STRUCTURE:
├── Header Component
│   ├── Logo & Navigation
│   ├── Theme Toggle
│   └── CTA Button
├── Hero Section
│   ├── Main Headline
│   ├── Value Proposition
│   ├── CTA Buttons
│   └── Preview Dashboard
├── Features Section
│   ├── Feature Cards (6 total)
│   ├── Icons + Descriptions
│   └── Grid Layout
├── Prediction App Section
│   ├── Input Form
│   ├── Real-time Results
│   ├── Visualization Charts
│   ├── Analytics Dashboard
│   └── Business Insights
├── Data Analysis Section
│   ├── Feature Importance Chart
│   ├── Genre Performance Chart
│   ├── Budget vs Success Scatter Plot
│   ├── Release Timing Line Chart
│   ├── Correlation Heatmap
│   ├── Vote Distribution Chart
│   └── Market Statistics Cards
├── How It Works Section
│   ├── 3-Step Process
│   └── Screenshots
├── Pricing Section
│   ├── Free Tier
│   └── Premium Features
└── Footer
    ├── Links & Contact
    └── Copyright
```

### **Chart & Data Visualization CSS**
```css
/* Chart Container Styles */
.chart-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.chart-card h4 {
  font-size: var(--text-xl);
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Analytics Dashboard Grid */
.analysis-dashboard {
  margin: 2rem 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Chart Canvas Containers */
.chart-card canvas {
  max-height: 300px;
  width: 100% !important;
  height: auto !important;
}

.full-width {
  grid-column: 1 / -1;
}

.full-width canvas {
  max-height: 400px;
}

/* Chart Legends */
.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-color.vote-average {
  background: var(--primary-blue);
}

.legend-color.roi-factors {
  background: var(--secondary-purple);
}

/* Chart Insights */
.chart-insights {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  border-left: 4px solid var(--primary-blue);
}

.insight-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
  font-style: italic;
}

/* Heatmap Specific Styles */
.heatmap-container {
  position: relative;
  height: 400px;
  margin: 1rem 0;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.gradient-bar {
  width: 200px;
  height: 20px;
  background: linear-gradient(
    to right,
    rgba(220, 38, 38, 1) 0%,
    rgba(255, 255, 255, 1) 50%,
    rgba(37, 99, 235, 1) 100%
  );
  border-radius: 10px;
  border: 1px solid var(--border-light);
}

.legend-min,
.legend-max {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
}

/* Market Analysis Cards */
.market-analysis {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  border: 1px solid var(--border-light);
}

.market-analysis h4 {
  font-size: var(--text-2xl);
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--text-primary);
}

.market-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.market-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.market-card:hover {
  transform: translateY(-4px);
}

.market-stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-number {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--primary-blue);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

/* Tab System for Detailed Analysis */
.analysis-tabs {
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-light);
  overflow: hidden;
  margin: 2rem 0;
}

.tab-headers {
  display: flex;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-light);
  overflow-x: auto;
}

.tab-btn {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: fit-content;
}

.tab-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.tab-btn.active {
  background: var(--primary-blue);
  color: white;
}

.tab-content {
  padding: 2rem;
}

.tab-panel {
  display: none;
}

.tab-panel.active {
  display: block;
}

/* Insights Grid */
.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  background: var(--bg-tertiary);
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid var(--secondary-purple);
}

.insight-card h6 {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.insight-card p {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
  line-height: var(--leading-relaxed);
}

/* Factors Breakdown */
.factors-breakdown {
  space-y: 1rem;
}

.factor-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.factor-name {
  flex: 0 0 150px;
  font-weight: 600;
  color: var(--text-primary);
}

.factor-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
}

.factor-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-blue), var(--secondary-purple));
  transition: width 0.8s ease;
}

.factor-value {
  flex: 0 0 60px;
  text-align: right;
  font-weight: 600;
  color: var(--primary-blue);
}

/* Confidence Gauge Styles */
.confidence-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
}

.confidence-circle {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.confidence-circle svg {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-circle {
  fill: none;
  stroke: var(--primary-blue);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease;
}

.progress-bg {
  fill: none;
  stroke: var(--border-light);
  stroke-width: 8;
}

.confidence-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--primary-blue);
  z-index: 1;
}

.confidence-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  z-index: 1;
}

/* Responsive Design for Charts */
@media (max-width: 640px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .market-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tab-headers {
    flex-direction: column;
  }
  
  .chart-card {
    padding: 1rem;
  }
  
  .chart-card canvas {
    max-height: 250px;
  }
}

/* Animation for Chart Loading */
@keyframes chartFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chart-card {
  animation: chartFadeIn 0.6s ease-out;
}

/* Print Styles for Charts */
@media print {
  .chart-card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .analysis-dashboard {
    display: block;
  }
  
  .dashboard-grid {
    display: block;
  }
  
  .chart-card {
    margin-bottom: 2rem;
    page-break-inside: avoid;
  }
}
```

---

## 🚀 **4. TECHNICAL REQUIREMENTS CHÍNH XÁC**

### **Backend API Endpoints**
```python
# Flask Backend Structure
from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load trained model
model = joblib.load('models/random_forest_model.pkl')
preprocessor = joblib.load('models/preprocessor.pkl')

@app.route('/predict', methods=['POST'])
def predict_movie_success():
    """
    Input: Movie features JSON
    Output: Success prediction + confidence + insights
    """
    data = request.json
    
    # Feature engineering
    features = preprocess_features(data)
    
    # Prediction
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0]
    confidence = max(probability) * 100
    
    # Feature importance
    feature_importance = get_feature_importance(features)
    
    # Business insights
    insights = generate_business_insights(features, prediction)
    
    # Advanced analytics data
    analytics_data = {
        'genre_performance': get_genre_statistics(),
        'budget_analysis': get_budget_roi_analysis(),
        'release_timing': get_seasonal_performance(),
        'market_trends': get_vietnam_market_trends(),
        'correlation_matrix': get_feature_correlations(),
        'vote_distribution': get_vote_score_distribution(),
        'success_factors': get_top_success_factors()
    }
    
    return jsonify({
        'success': bool(prediction),
        'confidence': round(confidence, 1),
        'risk_level': calculate_risk_level(confidence),
        'key_factors': feature_importance[:5],
        'recommendations': insights,
        'prediction_details': {
            'vote_average_impact': feature_importance[0]['impact'],
            'roi_factors': get_roi_analysis(features),
            'genre_performance': get_genre_insights(features)
        },
        'analytics_data': analytics_data,
        'charts_data': {
            'feature_importance': prepare_feature_chart_data(feature_importance),
            'genre_performance': prepare_genre_chart_data(),
            'budget_success': prepare_budget_chart_data(),
            'release_timing': prepare_timing_chart_data(),
            'correlation_heatmap': prepare_correlation_data(),
            'vote_distribution': prepare_vote_distribution_data()
        }
    })

@app.route('/analytics', methods=['GET'])
def get_analytics_data():
    """
    Endpoint for loading analytics dashboard data
    """
    return jsonify({
        'market_overview': get_market_overview_stats(),
        'industry_trends': get_industry_trends(),
        'benchmark_data': get_benchmark_statistics()
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'model_loaded': True})
```

### **Frontend JavaScript Structure**
```javascript
// Main Application Class
class FilmPredictApp {
    constructor() {
        this.apiUrl = '/api';
        this.themeManager = new ThemeManager();
        this.chartManager = new ChartManager();
        this.formHandler = new FormHandler();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeCharts();
        this.loadDefaultDemo();
    }
    
    async predictMovie(movieData) {
        try {
            const response = await fetch(`${this.apiUrl}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieData)
            });
            
            const result = await response.json();
            this.displayResults(result);
            this.updateCharts(result);
            this.updateAnalyticsDashboard(result.analytics_data);
            this.renderDataVisualizations(result.charts_data);
            
        } catch (error) {
            this.showError('Lỗi kết nối. Vui lòng thử lại.');
        }
    }
    
    displayResults(result) {
        // Update prediction result card
        // Update confidence meter
        // Update risk assessment
        // Update recommendations list
    }
    
    updateAnalyticsDashboard(analyticsData) {
        // Update market statistics
        // Update trend indicators
        // Update benchmark comparisons
    }
    
    renderDataVisualizations(chartsData) {
        this.chartManager.createFeatureImportanceChart(chartsData.feature_importance);
        this.chartManager.createGenrePerformanceChart(chartsData.genre_performance);
        this.chartManager.createBudgetSuccessChart(chartsData.budget_success);
        this.chartManager.createReleaseTimingChart(chartsData.release_timing);
        this.chartManager.createCorrelationHeatmap(chartsData.correlation_heatmap);
        this.chartManager.createVoteDistributionChart(chartsData.vote_distribution);
    }
}

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme() || this.getSystemTheme();
        this.applyTheme(this.theme);
    }
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        localStorage.setItem('film-predict-theme', this.theme);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// Chart Visualization
class ChartManager {
    constructor() {
        this.charts = {};
        this.chartOptions = this.getChartOptions();
    }
    
    getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'var(--surface-secondary)',
                    titleColor: 'var(--text-primary)',
                    bodyColor: 'var(--text-secondary)',
                    borderColor: 'var(--border-light)',
                    borderWidth: 1
                }
            }
        };
    }
    
    createFeatureImportanceChart(data) {
        const ctx = document.getElementById('feature-importance-chart').getContext('2d');
        this.charts.featureImportance = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Mức độ quan trọng (%)',
                    data: data.values,
                    backgroundColor: 'var(--primary-blue)',
                    borderColor: 'var(--primary-blue)',
                    borderWidth: 1
                }]
            },
            options: {
                ...this.chartOptions,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    createGenrePerformanceChart(data) {
        const ctx = document.getElementById('genre-performance-chart').getContext('2d');
        this.charts.genrePerformance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.genres,
                datasets: [{
                    data: data.success_rates,
                    backgroundColor: [
                        'var(--primary-blue)',
                        'var(--secondary-purple)',
                        'var(--success-green)',
                        'var(--warning-orange)',
                        'var(--danger-red)'
                    ]
                }]
            },
            options: {
                ...this.chartOptions,
                plugins: {
                    ...this.chartOptions.plugins,
                    tooltip: {
                        ...this.chartOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '% thành công';
                            }
                        }
                    }
                }
            }
        });
    }
    
    createBudgetSuccessChart(data) {
        const ctx = document.getElementById('budget-success-chart').getContext('2d');
        this.charts.budgetSuccess = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Thành công',
                    data: data.successful_movies,
                    backgroundColor: 'var(--success-green)',
                    borderColor: 'var(--success-green)'
                }, {
                    label: 'Thất bại',
                    data: data.failed_movies,
                    backgroundColor: 'var(--danger-red)',
                    borderColor: 'var(--danger-red)'
                }]
            },
            options: {
                ...this.chartOptions,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Ngân sách (tỷ VND)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'ROI'
                        }
                    }
                }
            }
        });
    }
    
    createReleaseTimingChart(data) {
        const ctx = document.getElementById('release-timing-chart').getContext('2d');
        this.charts.releaseTiming = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: [{
                    label: 'Tỷ lệ thành công (%)',
                    data: data.success_rates,
                    borderColor: 'var(--primary-blue)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                ...this.chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    createCorrelationHeatmap(data) {
        const ctx = document.getElementById('correlation-heatmap').getContext('2d');
        // Implementation for correlation heatmap using Chart.js matrix plugin
        this.charts.correlationHeatmap = new Chart(ctx, {
            type: 'matrix',
            data: {
                datasets: [{
                    label: 'Correlation',
                    data: data.correlation_data,
                    backgroundColor: function(ctx) {
                        const value = ctx.parsed.v;
                        const alpha = Math.abs(value);
                        return value > 0 
                            ? `rgba(37, 99, 235, ${alpha})` 
                            : `rgba(220, 38, 38, ${alpha})`;
                    },
                    borderColor: 'var(--border-light)',
                    borderWidth: 1,
                    width: ({chart}) => (chart.chartArea || {}).width / data.features.length,
                    height: ({chart}) => (chart.chartArea || {}).height / data.features.length,
                }]
            },
            options: {
                ...this.chartOptions,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: 0,
                        max: data.features.length - 1,
                        ticks: {
                            callback: function(value) {
                                return data.features[value] || '';
                            }
                        }
                    },
                    y: {
                        type: 'linear',
                        min: 0,
                        max: data.features.length - 1,
                        ticks: {
                            callback: function(value) {
                                return data.features[value] || '';
                            }
                        }
                    }
                }
            }
        });
    }
    
    createVoteDistributionChart(data) {
        const ctx = document.getElementById('vote-distribution-chart').getContext('2d');
        this.charts.voteDistribution = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.vote_ranges,
                datasets: [{
                    label: 'Số lượng phim',
                    data: data.movie_counts,
                    backgroundColor: 'var(--secondary-purple)',
                    borderColor: 'var(--secondary-purple)',
                    borderWidth: 1
                }, {
                    label: 'Tỷ lệ thành công (%)',
                    data: data.success_rates,
                    type: 'line',
                    yAxisID: 'y1',
                    borderColor: 'var(--success-green)',
                    backgroundColor: 'transparent',
                    tension: 0.4
                }]
            },
            options: {
                ...this.chartOptions,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Số lượng phim'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Tỷ lệ thành công (%)'
                        },
                        max: 100,
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }
    
    createConfidenceGauge(confidence) {
        // Circular progress gauge implementation
        const gauge = document.getElementById('confidence-gauge');
        const value = document.getElementById('confidence-value');
        
        value.textContent = confidence + '%';
        
        // Animate the circular progress
        const circumference = 2 * Math.PI * 45; // radius = 45
        const progress = (confidence / 100) * circumference;
        
        const circle = gauge.querySelector('.progress-circle');
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference - progress;
    }
    
    updateTheme(theme) {
        // Update all charts when theme changes
        Object.values(this.charts).forEach(chart => {
            chart.options.plugins.legend.labels.color = 
                theme === 'dark' ? '#CBD5E1' : '#374151';
            chart.update();
        });
    }
    
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.charts = {};
    }
}
```

---

## 📝 **5. INPUT FORM CHÍNH XÁC**

### **Form Fields (Theo model ML)**
```html
<!-- Prediction Form -->
<form id="prediction-form" class="prediction-form">
    <!-- Basic Movie Info -->
    <div class="form-section">
        <h3>Thông tin cơ bản</h3>
        
        <div class="form-group">
            <label for="title">Tên phim</label>
            <input type="text" id="title" name="title" required>
        </div>
        
        <div class="form-group">
            <label for="genres">Thể loại</label>
            <select id="genres" name="genres" multiple>
                <option value="Action">Hành động</option>
                <option value="Comedy">Hài kịch</option>
                <option value="Drama">Chính kịch</option>
                <option value="Horror">Kinh dị</option>
                <option value="Romance">Tình cảm</option>
                <option value="Thriller">Ly kỳ</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="runtime">Thời lượng (phút)</label>
            <input type="number" id="runtime" min="60" max="300" value="120">
        </div>
    </div>
    
    <!-- Production Info -->
    <div class="form-section">
        <h3>Thông tin sản xuất</h3>
        
        <div class="form-group">
            <label for="budget">Ngân sách (tỷ VND)</label>
            <input type="number" id="budget" step="0.1" min="0.1" max="1000">
        </div>
        
        <div class="form-group">
            <label for="release_month">Tháng phát hành</label>
            <select id="release_month">
                <option value="1">Tháng 1</option>
                <option value="2">Tháng 2</option>
                <!-- ... tất cả 12 tháng -->
            </select>
        </div>
    </div>
    
    <!-- Quality Indicators -->
    <div class="form-section">
        <h3>Chỉ số chất lượng dự kiến</h3>
        
        <div class="form-group">
            <label for="vote_average">Điểm IMDB dự kiến (1-10)</label>
            <input type="range" id="vote_average" min="1" max="10" step="0.1" value="7.0">
            <span class="range-value">7.0</span>
        </div>
        
        <div class="form-group">
            <label for="vote_count">Số lượt đánh giá dự kiến</label>
            <input type="number" id="vote_count" min="100" max="50000" value="5000">
        </div>
    </div>
    
    <button type="submit" class="btn-primary">
        Dự đoán ngay
    </button>
</form>
```

---

## 📊 **6. OUTPUT VISUALIZATION CHÍNH XÁC**

### **Results Display Structure**
```html
<!-- Results Container -->
<div class="results-container" id="results">
    <!-- Main Prediction Card -->
    <div class="prediction-card">
        <div class="prediction-header">
            <h3 class="movie-title" id="result-title">Tên phim</h3>
            <div class="prediction-badge" id="result-badge">
                <!-- Success/Fail badge -->
            </div>
        </div>
        
        <!-- Confidence Meter -->
        <div class="confidence-section">
            <div class="confidence-circle" id="confidence-gauge">
                <div class="confidence-value" id="confidence-value">87%</div>
                <div class="confidence-label">Độ tin cậy</div>
            </div>
        </div>
        
        <!-- Key Metrics -->
        <div class="metrics-grid">
            <div class="metric-item">
                <span class="metric-label">ROI dự kiến</span>
                <span class="metric-value" id="roi-value">2.4x</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Mức rủi ro</span>
                <span class="metric-value" id="risk-level">Trung bình</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Điểm chất lượng</span>
                <span class="metric-value" id="quality-score">7.2/10</span>
            </div>
        </div>
    </div>
    
    <!-- Feature Importance Chart -->
    <div class="chart-card">
        <h4>Các yếu tố quan trọng nhất</h4>
        <canvas id="feature-importance-chart"></canvas>
        <div class="chart-legend">
            <div class="legend-item">
                <span class="legend-color vote-average"></span>
                <span>Vote Average (76.5%)</span>
            </div>
            <div class="legend-item">
                <span class="legend-color roi-factors"></span>
                <span>ROI Factors (23.5%)</span>
            </div>
        </div>
    </div>
    
    <!-- Data Analysis Dashboard -->
    <div class="analysis-dashboard">
        <div class="dashboard-grid">
            <!-- Genre Performance Chart -->
            <div class="chart-card">
                <h4>📊 Hiệu suất theo thể loại</h4>
                <canvas id="genre-performance-chart"></canvas>
                <div class="chart-insights">
                    <p class="insight-text">Drama và Action có tỷ lệ thành công cao nhất</p>
                </div>
            </div>
            
            <!-- Budget vs Success Chart -->
            <div class="chart-card">
                <h4>💰 Ngân sách vs Thành công</h4>
                <canvas id="budget-success-chart"></canvas>
                <div class="chart-insights">
                    <p class="insight-text">Sweet spot: 5-15 tỷ VND cho phim Việt</p>
                </div>
            </div>
            
            <!-- Release Timing Chart -->
            <div class="chart-card">
                <h4>📅 Thời điểm phát hành tối ưu</h4>
                <canvas id="release-timing-chart"></canvas>
                <div class="chart-insights">
                    <p class="insight-text">Q1 và Q4 có tỷ lệ thành công cao nhất</p>
                </div>
            </div>
            
            <!-- Vote Score Distribution -->
            <div class="chart-card">
                <h4>⭐ Phân bố điểm đánh giá</h4>
                <canvas id="vote-distribution-chart"></canvas>
                <div class="chart-insights">
                    <p class="insight-text">Điểm 7.0+ có 85% khả năng thành công</p>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Correlation Heatmap -->
    <div class="chart-card full-width">
        <h4>🔥 Ma trận tương quan các yếu tố</h4>
        <div class="heatmap-container">
            <canvas id="correlation-heatmap"></canvas>
        </div>
        <div class="heatmap-legend">
            <span class="legend-min">-1.0</span>
            <div class="gradient-bar"></div>
            <span class="legend-max">1.0</span>
        </div>
    </div>
    
    <!-- Market Analysis -->
    <div class="market-analysis">
        <h4>🎯 Phân tích thị trường Việt Nam</h4>
        <div class="market-grid">
            <div class="market-card">
                <div class="market-stat">
                    <span class="stat-number">1,020</span>
                    <span class="stat-label">Phim đã phân tích</span>
                </div>
            </div>
            <div class="market-card">
                <div class="market-stat">
                    <span class="stat-number">67%</span>
                    <span class="stat-label">Tỷ lệ thành công trung bình</span>
                </div>
            </div>
            <div class="market-card">
                <div class="market-stat">
                    <span class="stat-number">2.1x</span>
                    <span class="stat-label">ROI trung bình</span>
                </div>
            </div>
            <div class="market-card">
                <div class="market-stat">
                    <span class="stat-number">47</span>
                    <span class="stat-label">Yếu tố được phân tích</span>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Business Insights -->
    <div class="insights-card">
        <h4>💡 Khuyến nghị cho nhà sản xuất</h4>
        <div class="insights-list" id="business-insights">
            <!-- Dynamic recommendations -->
        </div>
    </div>
    
    <!-- Detailed Analysis -->
    <div class="analysis-tabs">
        <div class="tab-headers">
            <button class="tab-btn active" data-tab="overview">Tổng quan</button>
            <button class="tab-btn" data-tab="factors">Yếu tố ảnh hưởng</button>
            <button class="tab-btn" data-tab="data-insights">Phân tích dữ liệu</button>
            <button class="tab-btn" data-tab="market-trends">Xu hướng thị trường</button>
            <button class="tab-btn" data-tab="recommendations">Khuyến nghị</button>
        </div>
        
        <div class="tab-content">
            <!-- Overview Tab -->
            <div class="tab-panel active" id="overview-panel">
                <div class="overview-metrics">
                    <div class="metric-card">
                        <h5>Dự đoán chính</h5>
                        <div class="metric-display" id="main-prediction">
                            <!-- Main prediction result -->
                        </div>
                    </div>
                    <div class="metric-card">
                        <h5>Độ tin cậy</h5>
                        <div class="confidence-bar" id="confidence-bar">
                            <!-- Confidence visualization -->
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Factors Tab -->
            <div class="tab-panel" id="factors-panel">
                <div class="factors-breakdown">
                    <div class="factor-item">
                        <span class="factor-name">Vote Average</span>
                        <div class="factor-bar">
                            <div class="factor-fill" style="width: 76.5%"></div>
                        </div>
                        <span class="factor-value">76.5%</span>
                    </div>
                    <!-- More factor items -->
                </div>
            </div>
            
            <!-- Data Insights Tab -->
            <div class="tab-panel" id="data-insights-panel">
                <div class="insights-grid">
                    <div class="insight-card">
                        <h6>📈 Xu hướng thể loại</h6>
                        <p>Drama chiếm 28% thị phần với tỷ lệ thành công 72%</p>
                    </div>
                    <div class="insight-card">
                        <h6>💰 Phân tích ngân sách</h6>
                        <p>Phim có ngân sách 5-15 tỷ có ROI cao nhất (2.8x)</p>
                    </div>
                    <div class="insight-card">
                        <h6>⭐ Yếu tố chất lượng</h6>
                        <p>Vote Average > 7.0 tăng 340% khả năng thành công</p>
                    </div>
                    <div class="insight-card">
                        <h6>📅 Timing tối ưu</h6>
                        <p>Q1 (Tết) và Q4 (mùa lễ) có performance tốt nhất</p>
                    </div>
                </div>
            </div>
            
            <!-- Market Trends Tab -->
            <div class="tab-panel" id="market-trends-panel">
                <div class="trends-analysis">
                    <div class="trend-item">
                        <h6>🎬 Thị trường điện ảnh Việt 2024-2025</h6>
                        <ul>
                            <li>Tăng trưởng 15% so với năm trước</li>
                            <li>Phim Việt chiếm 25% thị phần</li>
                            <li>Streaming platforms ảnh hưởng 40% doanh thu</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Recommendations Tab -->
            <div class="tab-panel" id="recommendations-panel">
                <div class="recommendations-list">
                    <!-- Dynamic business recommendations -->
                </div>
            </div>
        </div>
    </div>
</div>
```

---

## 🎯 **7. DEVELOPMENT CHECKLIST**

### **Phase 1: Core Setup**
```
✅ TO-DO LIST:
□ Setup Flask backend với model loading
□ Install Chart.js và visualization libraries
□ Create HTML structure với responsive design  
□ Implement CSS với dark/light theme + chart styles
□ Setup JavaScript for form handling + chart management
□ Connect frontend với backend API
□ Test prediction functionality
□ Implement all 6 chart types với real data
```

### **Required Dependencies & Libraries**
```html
<!-- Required CSS/JS Libraries -->
<head>
    <!-- Chart.js for data visualization -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js"></script>
    
    <!-- Chart.js Matrix Plugin for correlation heatmap -->
    <script src="https://cdn.jsdelivr.net/npm/chartjs-chart-matrix@2.0.1/dist/chartjs-chart-matrix.min.js"></script>
    
    <!-- Chart.js Annotation Plugin for markers -->
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.0.1/dist/chartjs-plugin-annotation.min.js"></script>
    
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="styles.css">
</head>
```

```python
# Backend Python Dependencies
# requirements.txt
flask==2.3.3
scikit-learn==1.3.0
pandas==2.0.3
numpy==1.24.3
joblib==1.3.2
matplotlib==3.7.2
seaborn==0.12.2
plotly==5.15.0
flask-cors==4.0.0
gunicorn==21.2.0
```

### **Phase 2: UI/UX Polish & Data Visualization**
```
□ Add smooth animations và transitions
□ Implement glassmorphism effects
□ Perfect all 6 chart types với interactive features:
  - Feature Importance Horizontal Bar Chart
  - Genre Performance Doughnut Chart  
  - Budget vs Success Scatter Plot
  - Release Timing Line Chart
  - Correlation Heatmap Matrix
  - Vote Distribution Dual-Axis Chart
□ Add chart theming và responsive behavior
□ Add loading states và error handling
□ Optimize mobile responsiveness
□ Add accessibility features (WCAG 2.1)
□ Performance optimization
□ Add chart export functionality (PNG/PDF)
```

### **Phase 3: Advanced Features & Analytics**
```
□ Add real-time chart updates
□ Implement advanced data filtering
□ Add comparative analysis tools
□ Create analytics dashboard với market insights
□ Add example predictions showcase
□ Create how-it-works interactive demo
□ Add sharing functionality cho charts
□ SEO optimization
□ Add chart animation sequences
□ Implement data export features (CSV/Excel)
```

---

## 🚀 **8. DEPLOYMENT REQUIREMENTS**

### **Production Stack**
```
🌐 HOSTING: Vercel hoặc Heroku
🗄️ DATABASE: CSV files initially, PostgreSQL for scaling
🔒 SECURITY: HTTPS, input validation, rate limiting
📈 ANALYTICS: Google Analytics 4
⚡ PERFORMANCE: CDN for static assets, gzip compression
🔍 SEO: Meta tags, structured data, sitemap
```

### **Environment Variables**
```
FLASK_ENV=production
MODEL_PATH=./models/
DATA_PATH=./data/
API_RATE_LIMIT=100
CORS_ORIGINS=https://filmpredict.vn
```

---

**✅ PROMPT HOÀN CHỈNH VỚI BIỂU ĐỒ & PHÂN TÍCH DỮ LIỆU - SẴN SÀNG CHO DEVELOPMENT**

### **📊 ĐẶC BIỆT: REQUIREMENTS VỀ BIỂU ĐỒ & PHÂN TÍCH DỮ LIỆU**

```
🎯 VISUALIZATION REQUIREMENTS:
1. Feature Importance Chart - Horizontal bar chart hiện thị tầm quan trọng từng yếu tố
2. Genre Performance Chart - Doughnut chart tỷ lệ thành công theo thể loại  
3. Budget vs Success Chart - Scatter plot mối quan hệ ngân sách và ROI
4. Release Timing Chart - Line chart xu hướng theo tháng phát hành
5. Correlation Heatmap - Matrix hiển thị tương quan giữa 47 features
6. Vote Distribution Chart - Dual-axis chart phân bố điểm và tỷ lệ thành công
7. Market Statistics Cards - Key metrics của thị trường Việt Nam
8. Interactive Tabs - 5 tabs cho different analysis views
9. Real-time Updates - Charts update khi có prediction mới
10. Theme Support - All charts adapt theo dark/light mode
```

```
📊 DATA ANALYSIS FEATURES:
- Advanced correlation analysis với 47 features
- Genre performance breakdown cho từng thể loại phim
- Budget optimization recommendations 
- Seasonal timing analysis cho release strategy
- Vietnam market specific insights
- ROI projection scenarios
- Risk assessment với confidence intervals
- Competitive benchmarking data
- Success factor importance ranking
- Interactive filtering và drill-down capabilities
```

File này chứa **tất cả thông tin cần thiết** để phát triển website FilmPredict.vn với **complete data visualization system** theo đúng vision và requirements đã đề ra.

**✅ PROMPT HOÀN CHỈNH - SẴN SÀNG CHO DEVELOPMENT**

File này chứa tất cả thông tin cần thiết để phát triển website Dự Đoán Độ Thành Công Của Phim Chiếu Rạp theo đúng vision và requirements đã đề ra.