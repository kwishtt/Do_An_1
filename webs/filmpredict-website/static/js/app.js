// ========== GLOBAL STATE MANAGEMENT ==========
const App = {
  isLoading: false,
  currentTheme: 'light',
  currentPage: 'input', // 'input' or 'results'
  charts: {},
  formData: {},
  predictionResult: null,
  
  // Initialize application
  init() {
    this.setupTheme();
    this.setupEventListeners();
    this.setupTwoPageFlow();
    // Don't setup charts on init - they will be created when needed
    // this.setupFormValidation(); // ❌ REMOVED - Method không tồn tại, validation handled by setupRealTimeValidation()
    this.updateDashboardPreview();
    console.log('FilmPredict App initialized successfully');
  },
  
  // Two-Page Flow Management
  setupTwoPageFlow() {
    // Show input page by default
    this.showPage('input');
    
    // Setup page navigation
    const backBtn = document.getElementById('back-to-form');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.showPage('input'));
    }
    
    // Setup "Try Again" button
    const tryAgainBtn = document.getElementById('try-again-btn');
    if (tryAgainBtn) {
      tryAgainBtn.addEventListener('click', () => {
        this.showPage('input');
        // Reset form
        const form = document.getElementById('prediction-form');
        if (form) form.reset();
        // Clear genre chips selection
        document.querySelectorAll('.genre-chip.active').forEach(chip => {
          chip.classList.remove('active');
        });
        document.getElementById('genres').value = '';
      });
    }
  },
  
  showPage(pageType) {
    const inputPage = document.getElementById('input-page');
    const resultsPage = document.getElementById('results-page');
    
    if (pageType === 'input') {
      if (inputPage) inputPage.classList.add('active');
      if (resultsPage) resultsPage.classList.remove('active');
      this.currentPage = 'input';
      this.updateProgressIndicator('input');
      // Scroll to top when going back to input
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else if (pageType === 'results') {
      if (inputPage) inputPage.classList.remove('active');
      if (resultsPage) {
        resultsPage.classList.add('active');
      }
      this.currentPage = 'results';
      this.updateProgressIndicator('results');
    }
  },
  
  updateProgressIndicator(activePage) {
    // Get all progress indicators in both pages
    const inputSteps = document.querySelectorAll('.progress-indicator .step:first-child');
    const resultsSteps = document.querySelectorAll('.progress-indicator .step:last-child');
    
    if (activePage === 'input') {
      inputSteps.forEach(step => {
        step.className = 'step active';
        const icon = step.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-edit';
        }
      });
      resultsSteps.forEach(step => {
        step.className = 'step';
        const icon = step.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-chart-line';
        }
      });
    } else if (activePage === 'results') {
      inputSteps.forEach(step => {
        step.className = 'step completed';
        const icon = step.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-check-circle';
        }
      });
      resultsSteps.forEach(step => {
        step.className = 'step active';
        const icon = step.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-chart-line';
        }
      });
    }
  },
  
  // Genre Chips Selection Handler
  setupGenreChips() {
    const genreChips = document.querySelectorAll('.genre-chip');
    const genresInput = document.getElementById('genres');
    const selectedGenres = new Set();
    
    genreChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const genre = chip.dataset.genre;
        
        // Toggle selection
        if (chip.classList.contains('active')) {
          chip.classList.remove('active');
          selectedGenres.delete(genre);
        } else {
          chip.classList.add('active');
          selectedGenres.add(genre);
        }
        
        // Update hidden input value
        if (genresInput) {
          genresInput.value = Array.from(selectedGenres).join(',');
        }
        
        console.log('Selected genres:', Array.from(selectedGenres));
      });
    });
  },
  
  // Theme management
  setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  },
  
  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
      } else {
        themeToggle.innerHTML = `<span class="theme-icon">${theme === 'light' ? '🌙' : '☀️'}</span>`;
      }
    }
    
    // Update chart colors for theme
    this.updateChartsTheme();
  },
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    console.log(`Switching theme from ${this.currentTheme} to ${newTheme}`);
    this.setTheme(newTheme);
  },
  
  // Event listeners setup
  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    console.log('Theme toggle element:', themeToggle);
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        console.log('Theme toggle clicked');
        this.toggleTheme();
      });
      console.log('Theme toggle event listener added');
    } else {
      console.error('Theme toggle button not found!');
    }
    
    // Genre chips selection
    this.setupGenreChips();
    
    // Header scroll effect
    let lastScrollY = 0;
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScrollY = scrollY;
    });
    
    // Prediction form
    const predictionForm = document.getElementById('prediction-form');
    if (predictionForm) {
      predictionForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
    
    // Range sliders
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(input => {
      input.addEventListener('input', (e) => this.updateRangeValue(e));
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    
    // Intersection Observer for animations
    this.setupScrollAnimations();
  },
  
  // Setup scroll animations
  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, { threshold: 0.1 });
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .step-card, .chart-card').forEach(el => {
      observer.observe(el);
    });
  },
  
  // Form handling
  updateRangeValue(event) {
    const input = event.target;
    const valueDisplay = input.parentElement.querySelector('.range-value');
    if (valueDisplay) {
      const value = parseFloat(input.value);
      
      // Format based on input type
      if (input.id === 'budget') {
        valueDisplay.textContent = `${value} tỷ`;
      } else if (input.id === 'runtime') {
        valueDisplay.textContent = `${value} phút`;
      } else if (input.id === 'vote_average') {
        valueDisplay.textContent = value.toFixed(1);
      } else if (input.id === 'vote_count') {
        valueDisplay.textContent = this.formatNumber(value);
      } else {
        valueDisplay.textContent = value;
      }
    }
  },
  
  formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  },
  
  formatCurrency(amount) {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount}`;
    }
  },
  
  // Form submission and prediction
  async handleFormSubmit(event) {
    event.preventDefault();
    
    if (this.isLoading) return;
    
    try {
      this.showLoading();
      
      // Collect form data
      const formData = new FormData(event.target);
      const data = this.processFormData(formData);
      
      // Validate form data
      if (!this.validateFormData(data)) {
        throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
      }
      
      // Send prediction request
      const result = await this.makePrediction(data);
      
      // Display results
      this.displayPredictionResult(result);
      
      // Update charts with new data
      this.updateChartsWithPrediction(result);
      
      // Switch to results page instead of scrolling
      this.showPage('results');
      
    } catch (error) {
      console.error('Prediction error:', error);
      this.showError(error.message || 'Có lỗi xảy ra khi dự đoán. Vui lòng thử lại.');
    } finally {
      this.hideLoading();
    }
  },
  
  processFormData(formData) {
    const data = {};
    
    // Basic information
    data.title = formData.get('title') || 'Untitled Movie';
    data.budget = parseFloat(formData.get('budget')) || 0;
    data.runtime = parseInt(formData.get('runtime')) || 90;
    data.voteAverage = parseFloat(formData.get('vote_average')) || 5.0;
    data.voteCount = parseInt(formData.get('vote_count')) || 5000;
    data.releaseMonth = parseInt(formData.get('release_month')) || 1;
    
    // Genres from hidden input (comma-separated string)
    const genresInput = document.getElementById('genres');
    if (genresInput && genresInput.value) {
      data.genres = genresInput.value.split(',').filter(g => g.trim());
    } else {
      data.genres = [];
    }
    
    // These selects might not exist in current form, so we'll set defaults
    data.productionCompanies = [];
    data.countries = ['Vietnam'];
    data.languages = ['Vietnamese'];
    
    return data;
  },
  
  validateFormData(data) {
    // Basic validation
    if (!data.title || data.title.trim() === '') return false;
    if (data.budget < 0 || data.budget > 1000) return false; // Vietnam budget in billions VND
    if (data.runtime < 30 || data.runtime > 300) return false;
    if (data.voteAverage < 0 || data.voteAverage > 10) return false;
    if (!data.genres || data.genres.length === 0) return false;
    
    return true;
  },
  
  async makePrediction(data) {
    // Simulate API call (replace with actual backend call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock prediction logic based on heuristics
    const success = this.calculateMockPrediction(data);
    const confidence = this.calculateConfidence(data);
    
    return {
      success,
      confidence,
      data,
      timestamp: new Date(),
      metrics: this.generateMockMetrics(data, success)
    };
  },
  
  calculateMockPrediction(data) {
    let score = 0;
    
    // Budget impact
    if (data.budget > 50000000) score += 20;
    else if (data.budget > 20000000) score += 15;
    else if (data.budget > 5000000) score += 10;
    else score += 5;
    
    // Vote average impact
    if (data.voteAverage >= 8.0) score += 25;
    else if (data.voteAverage >= 7.0) score += 20;
    else if (data.voteAverage >= 6.5) score += 15;
    else if (data.voteAverage >= 6.0) score += 10;
    
    // Runtime impact
    if (data.runtime >= 90 && data.runtime <= 150) score += 15;
    else if (data.runtime >= 120 && data.runtime <= 180) score += 10;
    else score += 5;
    
    // Genre impact
    const popularGenres = ['Action', 'Adventure', 'Comedy', 'Drama'];
    const hasPopularGenre = data.genres.some(genre => popularGenres.includes(genre));
    if (hasPopularGenre) score += 20;
    
    // Random factor to simulate ML uncertainty
    score += Math.random() * 20 - 10;
    
    return score > 50;
  },
  
  calculateConfidence(data) {
    let confidence = 70;
    
    // Higher confidence for typical movie parameters
    if (data.budget > 1000000 && data.budget < 200000000) confidence += 10;
    if (data.voteAverage >= 6.0 && data.voteAverage <= 8.5) confidence += 10;
    if (data.runtime >= 90 && data.runtime <= 150) confidence += 10;
    if (data.genres.length >= 2 && data.genres.length <= 4) confidence += 5;
    
    // Add some randomness
    confidence += Math.random() * 10 - 5;
    
    return Math.max(60, Math.min(95, Math.round(confidence)));
  },
  
  generateMockMetrics(data, success) {
    const baseROI = success ? 2.5 + Math.random() * 2 : 0.3 + Math.random() * 0.7;
    const predictedRevenue = data.budget * baseROI;
    
    return {
      predictedROI: baseROI.toFixed(2),
      predictedRevenue: Math.round(predictedRevenue),
      breakEvenPoint: Math.round(data.budget * 1.1),
      marketPotential: success ? 'Cao' : 'Thấp',
      riskLevel: success ? 'Thấp' : 'Cao'
    };
  },
  
  // Display prediction results
  displayPredictionResult(result) {
    this.predictionResult = result;
    
    // Update movie title in results page
    const resultMovieTitle = document.getElementById('result-movie-title');
    if (resultMovieTitle) {
      resultMovieTitle.textContent = result.data.title;
    }
    
    // Update prediction badge in results page
    const predictionBadge = document.querySelector('#results-page .prediction-badge');
    if (predictionBadge) {
      predictionBadge.innerHTML = `
        <i class="fas fa-${result.success ? 'check-circle' : 'times-circle'}"></i>
        <span class="badge-text">${result.success ? 'THÀNH CÔNG' : 'THẤT BẠI'}</span>
      `;
      predictionBadge.className = `prediction-badge ${result.success ? 'success' : 'failure'}`;
    }
    
    // Update confidence gauge
    this.updateConfidenceGauge(result.confidence);
    
    // Update metrics with detailed information
    this.updateMetrics(result.metrics, result.data);
    
    // Update charts with prediction data
    this.updateChartsWithPrediction(result);
    
    console.log('Prediction result displayed:', result);
  },
  
  updateConfidenceGauge(confidence) {
    const progressCircle = document.querySelector('.progress-circle');
    const confidenceValue = document.getElementById('confidence-value');
    const confidenceCircle = document.querySelector('.confidence-circle');
    
    if (progressCircle && confidenceValue && confidenceCircle) {
      const circumference = 440; // 2 * π * 70
      const offset = circumference - (confidence / 100) * circumference;
      
      // Add glow effects based on confidence level
      setTimeout(() => {
        // Removed glowing class - no glow effect needed
        
        // Add high confidence class for visual distinction
        if (confidence >= 70) {
          confidenceCircle.classList.add('high-confidence');
        } else {
          confidenceCircle.classList.remove('high-confidence');
        }
        
        // Animate the progress circle
        progressCircle.style.strokeDashoffset = offset;
      }, 500);
      
      // Animate the confidence value
      let currentValue = 0;
      const increment = confidence / 50;
      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= confidence) {
          currentValue = confidence;
          clearInterval(timer);
        }
        confidenceValue.textContent = `${Math.round(currentValue)}%`;
      }, 30);
    }
  },
  
  updateMetrics(metrics, data) {
    // Update individual metrics với animation
    this.updateMetricValue('predicted-roi', `${metrics.predictedROI}x`);
    this.updateMetricValue('predicted-revenue', `${(metrics.predictedRevenue / 1000000000).toFixed(1)} tỷ`);
    this.updateMetricValue('break-even', `${((data.budget * 1.1) / 1000000000).toFixed(1)} tỷ`);
    this.updateMetricValue('market-potential', metrics.marketPotential);
    this.updateMetricValue('risk-level', metrics.riskLevel);
    this.updateMetricValue('rating-display', data.voteAverage.toFixed(1));
    
    // Update metric value colors based on success
    this.updateMetricColors(metrics);
    
    // Generate business insights
    this.generateBusinessInsights(metrics, data);
  },
  
  updateMetricColors(metrics) {
    const roi = document.getElementById('predicted-roi');
    const potential = document.getElementById('market-potential');
    const risk = document.getElementById('risk-level');
    
    if (roi) {
      roi.className = `metric-value ${parseFloat(metrics.predictedROI) > 1.5 ? 'success' : 
                                   parseFloat(metrics.predictedROI) > 1.0 ? 'warning' : 'danger'}`;
    }
    
    if (potential) {
      potential.className = `metric-value ${metrics.marketPotential === 'Cao' ? 'success' : 
                                         metrics.marketPotential === 'Trung bình' ? 'warning' : 'danger'}`;
    }
    
    if (risk) {
      risk.className = `metric-value ${metrics.riskLevel === 'Thấp' ? 'success' : 
                                     metrics.riskLevel === 'Trung bình' ? 'warning' : 'danger'}`;
    }
  },
  
  updateMetricValue(metricId, value) {
    const element = document.getElementById(metricId);
    if (element) {
      element.textContent = value;
    }
  },
  
  generateBusinessInsights(metrics, data) {
    const insightsContainer = document.getElementById('business-insights');
    if (!insightsContainer) return;
    
    const insights = [];
    const roi = parseFloat(metrics.predictedROI);
    
    // ROI Analysis
    if (roi > 2.0) {
      insights.push({
        type: 'positive',
        icon: '🎯',
        title: 'ROI Xuất Sắc',
        description: `Dự án có tiềm năng sinh lời rất cao với ROI ${roi.toFixed(1)}x. Đây là một cơ hội đầu tư tốt.`
      });
    } else if (roi > 1.0) {
      insights.push({
        type: 'positive',
        icon: '✅',
        title: 'ROI Khả Quan',
        description: `Dự án dự kiến sinh lời với ROI ${roi.toFixed(1)}x, đạt mức an toàn cho đầu tư.`
      });
    } else {
      insights.push({
        type: 'negative',
        icon: '⚠️',
        title: 'ROI Thấp',
        description: `ROI chỉ ${roi.toFixed(1)}x. Cần xem xét lại chiến lược marketing và phân phối.`
      });
    }
    
    // Budget Analysis
    if (data.budget < 30) {
      insights.push({
        type: 'warning',
        icon: '💰',
        title: 'Ngân Sách Hạn Chế',
        description: `Với ngân sách ${data.budget} tỷ, cần tập trung vào marketing hiệu quả và chọn lựa diễn viên phù hợp.`
      });
    } else if (data.budget > 100) {
      insights.push({
        type: 'positive',
        icon: '💎',
        title: 'Ngân Sách Lớn',
        description: `Ngân sách ${data.budget} tỷ cho phép sản xuất chất lượng cao và chiến dịch marketing rộng rãi.`
      });
    }
    
    // Genre Analysis
    if (data.genres && data.genres.length > 0) {
      const popularGenres = ['Action', 'Comedy', 'Drama'];
      const hasPopularGenre = data.genres.some(g => popularGenres.includes(g));
      
      if (hasPopularGenre) {
        insights.push({
          type: 'positive',
          icon: '🎬',
          title: 'Thể Loại Phổ Biến',
          description: `Thể loại ${data.genres.join(', ')} có lượng khán giả đông đảo, tăng cơ hội thành công.`
        });
      }
    }
    
    // Rating Analysis
    if (data.voteAverage >= 7.5) {
      insights.push({
        type: 'positive',
        icon: '⭐',
        title: 'Chất Lượng Cao',
        description: `Điểm đánh giá dự kiến ${data.voteAverage}/10 rất tốt, có thể tạo hiệu ứng truyền miệng mạnh mẽ.`
      });
    } else if (data.voteAverage < 6.0) {
      insights.push({
        type: 'warning',
        icon: '📝',
        title: 'Cần Cải Thiện Chất Lượng',
        description: `Điểm ${data.voteAverage}/10 còn thấp. Nên đầu tư thêm vào kịch bản và đạo diễn.`
      });
    }
    
    // Release Month Analysis
    const peakMonths = [1, 2, 4, 5, 12]; // Tết, Valentine, Giỗ Tổ, 30/4, Giáng sinh
    if (peakMonths.includes(data.releaseMonth)) {
      insights.push({
        type: 'positive',
        icon: '📅',
        title: 'Thời Điểm Ra Mắt Tốt',
        description: `Tháng ${data.releaseMonth} là mùa cao điểm, khán giả có xu hướng đi xem phim nhiều hơn.`
      });
    }
    
    // Risk Level Summary
    if (metrics.riskLevel === 'Thấp') {
      insights.push({
        type: 'positive',
        icon: '🛡️',
        title: 'Rủi Ro Thấp',
        description: 'Dự án có mức độ rủi ro thấp, phù hợp cho nhà đầu tư thận trọng.'
      });
    } else if (metrics.riskLevel === 'Cao') {
      insights.push({
        type: 'negative',
        icon: '🚨',
        title: 'Rủi Ro Cao',
        description: 'Cần có kế hoạch dự phòng và chiến lược marketing mạnh mẽ để giảm thiểu rủi ro.'
      });
    }
    
    // Render insights
    insightsContainer.innerHTML = insights.map(insight => `
      <div class="insight-card ${insight.type}">
        <div class="insight-icon">
          ${insight.icon}
        </div>
        <div class="insight-content">
          <div class="insight-title">${insight.title}</div>
          <div class="insight-description">${insight.description}</div>
        </div>
      </div>
    `).join('');
  },
  
  // Charts management
  setupCharts() {
    this.initializeFeatureImportanceChart();
    this.initializeGenrePerformanceChart();
    this.initializeBudgetROIChart();
    this.initializeCorrelationChart();
    this.initializeTimeSeriesChart();
    this.initializePredictionDistribution();
  },
  
  initializeFeatureImportanceChart() {
    const ctx = document.getElementById('featureImportanceChart');
    if (!ctx) return;
    
    const data = {
      labels: ['Budget', 'Vote Average', 'Runtime', 'Genre', 'Production Company', 'Release Date'],
      datasets: [{
        label: 'Importance Score',
        data: [0.35, 0.28, 0.15, 0.12, 0.08, 0.02],
        backgroundColor: this.getChartColors().primary,
        borderColor: this.getChartColors().primaryBorder,
        borderWidth: 1
      }]
    };
    
    this.charts.featureImportance = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Tầm quan trọng của các yếu tố',
            color: this.getTextColor()
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: this.getTextColor()
            },
            grid: {
              color: this.getGridColor()
            }
          },
          x: {
            ticks: {
              color: this.getTextColor()
            },
            grid: {
              color: this.getGridColor()
            }
          }
        }
      }
    });
  },
  
  initializeGenrePerformanceChart() {
    const ctx = document.getElementById('genrePerformanceChart');
    if (!ctx) return;
    
    const data = {
      labels: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi'],
      datasets: [{
        label: 'Success Rate (%)',
        data: [75, 68, 62, 45, 58, 72],
        backgroundColor: this.getChartColors().secondary,
        borderColor: this.getChartColors().secondaryBorder,
        borderWidth: 1
      }]
    };
    
    this.charts.genrePerformance = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: this.getTextColor()
            }
          },
          title: {
            display: true,
            text: 'Tỷ lệ thành công theo thể loại',
            color: this.getTextColor()
          }
        }
      }
    });
  },
  
  initializeBudgetROIChart() {
    const ctx = document.getElementById('budgetROIChart');
    if (!ctx) return;
    
    const data = {
      datasets: [{
        label: 'ROI vs Budget',
        data: this.generateScatterData(),
        backgroundColor: this.getChartColors().accent,
        borderColor: this.getChartColors().accentBorder,
        pointRadius: 5
      }]
    };
    
    this.charts.budgetROI = new Chart(ctx, {
      type: 'scatter',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: this.getTextColor()
            }
          },
          title: {
            display: true,
            text: 'Mối quan hệ Budget - ROI',
            color: this.getTextColor()
          }
        },
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Budget (Million $)',
              color: this.getTextColor()
            },
            ticks: {
              color: this.getTextColor()
            },
            grid: {
              color: this.getGridColor()
            }
          },
          y: {
            title: {
              display: true,
              text: 'ROI',
              color: this.getTextColor()
            },
            ticks: {
              color: this.getTextColor()
            },
            grid: {
              color: this.getGridColor()
            }
          }
        }
      }
    });
  },
  
  initializeCorrelationChart() {
    const ctx = document.getElementById('correlationChart');
    if (!ctx) return;
    
    const data = {
      labels: ['Budget', 'Revenue', 'Vote Avg', 'Runtime', 'Vote Count'],
      datasets: [{
        label: 'Correlation Matrix',
        data: [
          {x: 0, y: 0, v: 1.0},
          {x: 1, y: 0, v: 0.75},
          {x: 2, y: 0, v: 0.23},
          {x: 3, y: 0, v: 0.45},
          {x: 4, y: 0, v: 0.67},
          {x: 0, y: 1, v: 0.75},
          {x: 1, y: 1, v: 1.0},
          {x: 2, y: 1, v: 0.34},
          {x: 3, y: 1, v: 0.28},
          {x: 4, y: 1, v: 0.82}
        ],
        backgroundColor: function(context) {
          const value = context.parsed.v;
          const alpha = Math.abs(value);
          return value > 0 ? `rgba(37, 99, 235, ${alpha})` : `rgba(239, 68, 68, ${alpha})`;
        }
      }]
    };
    
    // Note: This would need a heatmap chart library or custom implementation
    // For now, creating a simple bar chart representation
    const correlationData = {
      labels: ['Budget-Revenue', 'Budget-Rating', 'Budget-Runtime', 'Rating-Revenue'],
      datasets: [{
        label: 'Correlation Strength',
        data: [0.75, 0.23, 0.45, 0.34],
        backgroundColor: this.getChartColors().mixed
      }]
    };
    
    this.charts.correlation = new Chart(ctx, {
      type: 'bar',
      data: correlationData,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Ma trận tương quan',
            color: this.getTextColor()
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 1,
            ticks: {
              color: this.getTextColor()
            },
            grid: {
              color: this.getGridColor()
            }
          },
          y: {
            ticks: {
              color: this.getTextColor()
            },
            grid: {
              color: this.getGridColor()
            }
          }
        }
      }
    });
  },
  
  initializeTimeSeriesChart() {
    const ctx = document.getElementById('timeSeriesChart');
    if (!ctx) return;
    
    const data = {
      labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
      datasets: [{
        label: 'Success Rate',
        data: [65, 42, 38, 55, 68, 72],
        borderColor: this.getChartColors().primary,
        backgroundColor: this.getChartColors().primary + '20',
        fill: true,
        tension: 0.4
      }]
    };
    
    this.charts.timeSeries = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: this.getTextColor()
            }
          },
          title: {
            display: true,
            text: 'Xu hướng thành công theo thời gian',
            color: this.getTextColor()
          }
        },
        scales: {
          x: {
            ticks: {
              color: this.getTextColor()
            },
            grid: {
              color: this.getGridColor()
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: this.getTextColor(),
              callback: function(value) {
                return value + '%';
              }
            },
            grid: {
              color: this.getGridColor()
            }
          }
        }
      }
    });
  },
  
  initializePredictionDistribution() {
    const ctx = document.getElementById('predictionDistributionChart');
    if (!ctx) return;
    
    const data = {
      labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
      datasets: [{
        label: 'Số lượng phim',
        data: [150, 280, 420, 380, 270],
        backgroundColor: this.getChartColors().gradient
      }]
    };
    
    this.charts.predictionDistribution = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Phân bố xác suất thành công',
            color: this.getTextColor()
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Khoảng xác suất thành công',
              color: this.getTextColor()
            },
            ticks: {
              color: this.getTextColor()
            },
            grid: {
              color: this.getGridColor()
            }
          },
          y: {
            title: {
              display: true,
              text: 'Số lượng phim',
              color: this.getTextColor()
            },
            ticks: {
              color: this.getTextColor()
            },
            grid: {
              color: this.getGridColor()
            }
          }
        }
      }
    });
  },
  
  // Chart utilities
  getChartColors() {
    const isDark = this.currentTheme === 'dark';
    return {
      primary: '#2563EB',
      primaryBorder: '#1D4ED8',
      secondary: '#7C3AED',
      secondaryBorder: '#6D28D9',
      accent: '#059669',
      accentBorder: '#047857',
      mixed: ['#2563EB', '#7C3AED', '#059669', '#EA580C', '#DC2626'],
      gradient: [
        'rgba(37, 99, 235, 0.8)',
        'rgba(124, 58, 237, 0.8)',
        'rgba(5, 150, 105, 0.8)',
        'rgba(234, 88, 12, 0.8)',
        'rgba(220, 38, 38, 0.8)'
      ]
    };
  },
  
  getTextColor() {
    return this.currentTheme === 'dark' ? '#F8FAFC' : '#111827';
  },
  
  getGridColor() {
    return this.currentTheme === 'dark' ? '#334155' : '#E5E7EB';
  },
  
  generateScatterData() {
    const data = [];
    for (let i = 0; i < 50; i++) {
      data.push({
        x: Math.random() * 200 + 1, // Budget in millions
        y: Math.random() * 5 + 0.5  // ROI
      });
    }
    return data;
  },
  
  updateChartsTheme() {
    Object.values(this.charts).forEach(chart => {
      if (chart && chart.options) {
        // Update chart colors for new theme
        this.updateChartThemeColors(chart);
        chart.update('none');
      }
    });
  },
  
  updateChartThemeColors(chart) {
    const textColor = this.getTextColor();
    const gridColor = this.getGridColor();
    
    // Update title color
    if (chart.options.plugins && chart.options.plugins.title) {
      chart.options.plugins.title.color = textColor;
    }
    
    // Update legend color
    if (chart.options.plugins && chart.options.plugins.legend) {
      chart.options.plugins.legend.labels.color = textColor;
    }
    
    // Update scale colors
    if (chart.options.scales) {
      Object.values(chart.options.scales).forEach(scale => {
        if (scale.ticks) scale.ticks.color = textColor;
        if (scale.grid) scale.grid.color = gridColor;
        if (scale.title) scale.title.color = textColor;
      });
    }
  },
  
  updateChartsWithPrediction(result) {
    // Generate genre performance chart
    this.generateGenrePerformanceChart(result.data.genres);
    
    // Generate budget vs success chart
    this.generateBudgetSuccessChart(result);
  },
  
  generateGenrePerformanceChart(selectedGenres) {
    const ctx = document.getElementById('genre-performance-chart');
    if (!ctx) return;
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not loaded yet');
      return;
    }
    
    // Sample data: Success rates by genre
    const genreSuccessRates = {
      'Action': 72,
      'Adventure': 68,
      'Animation': 75,
      'Comedy': 65,
      'Crime': 58,
      'Documentary': 45,
      'Drama': 62,
      'Family': 70,
      'Fantasy': 66,
      'Horror': 55,
      'Music': 60,
      'Mystery': 61,
      'Romance': 63,
      'Science Fiction': 68,
      'Thriller': 64,
      'War': 52,
      'Western': 48
    };
    
    const labels = selectedGenres && selectedGenres.length > 0 
      ? selectedGenres 
      : ['Action', 'Comedy', 'Drama'];
      
    const data = labels.map(genre => genreSuccessRates[genre] || 50);
    const colors = labels.map((_, i) => {
      const hue = (i * 360) / labels.length;
      return `hsl(${hue}, 70%, 60%)`;
    });
    
    if (this.charts.genrePerformance) {
      this.charts.genrePerformance.destroy();
    }
    
    this.charts.genrePerformance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: this.currentTheme === 'dark' ? '#1e293b' : '#ffffff',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: this.currentTheme === 'dark' ? '#e2e8f0' : '#334155',
              font: {
                size: 12,
                weight: 600
              },
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed}% tỷ lệ thành công`;
              }
            }
          }
        }
      }
    });
  },
  
  generateBudgetSuccessChart(result) {
    const ctx = document.getElementById('budget-success-chart');
    if (!ctx) return;
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not loaded yet');
      return;
    }
    
    // Sample data points: budget (tỷ VND) vs ROI
    const sampleData = [
      { x: 10, y: 3.5, success: true },
      { x: 25, y: 2.8, success: true },
      { x: 50, y: 2.2, success: true },
      { x: 75, y: 1.8, success: true },
      { x: 100, y: 1.5, success: true },
      { x: 150, y: 1.2, success: true },
      { x: 15, y: 0.8, success: false },
      { x: 30, y: 0.9, success: false },
      { x: 60, y: 0.7, success: false },
      { x: 90, y: 0.6, success: false }
    ];
    
    const successData = sampleData.filter(d => d.success);
    const failureData = sampleData.filter(d => !d.success);
    
    // Add current prediction
    const currentPrediction = {
      x: result.data.budget,
      y: parseFloat(result.metrics.predictedROI)
    };
    
    if (this.charts.budgetSuccess) {
      this.charts.budgetSuccess.destroy();
    }
    
    this.charts.budgetSuccess = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Phim Thành Công',
            data: successData,
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          },
          {
            label: 'Phim Thất Bại',
            data: failureData,
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          },
          {
            label: 'Dự Đoán Của Bạn',
            data: [currentPrediction],
            backgroundColor: 'rgba(37, 99, 235, 0.8)',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 3,
            pointRadius: 10,
            pointHoverRadius: 12,
            pointStyle: 'star'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: this.currentTheme === 'dark' ? '#e2e8f0' : '#334155',
              font: {
                size: 12,
                weight: 600
              },
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Ngân sách: ${context.parsed.x} tỷ, ROI: ${context.parsed.y.toFixed(1)}x`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Ngân Sách (tỷ VND)',
              color: this.currentTheme === 'dark' ? '#e2e8f0' : '#334155',
              font: {
                weight: 600
              }
            },
            ticks: {
              color: this.currentTheme === 'dark' ? '#94a3b8' : '#64748b'
            },
            grid: {
              color: this.currentTheme === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'ROI (lần)',
              color: this.currentTheme === 'dark' ? '#e2e8f0' : '#334155',
              font: {
                weight: 600
              }
            },
            ticks: {
              color: this.currentTheme === 'dark' ? '#94a3b8' : '#64748b'
            },
            grid: {
              color: this.currentTheme === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'
            }
          }
        }
      }
    });
  },
  
  updateInsights(result) {
    const insightsList = document.querySelector('.insights-list');
    if (!insightsList) return;
    
    // Clear existing insights
    insightsList.innerHTML = '';
    
    // Generate insights based on prediction
    const insights = this.generateInsights(result);
    
    insights.forEach(insight => {
      const insightElement = document.createElement('div');
      insightElement.className = 'insight-item';
      insightElement.innerHTML = `
        <div class="insight-title">${insight.title}</div>
        <div class="insight-description">${insight.description}</div>
      `;
      insightsList.appendChild(insightElement);
    });
  },
  
  generateInsights(result) {
    const insights = [];
    const { data, success, confidence, metrics } = result;
    
    // Budget analysis
    if (data.budget > 100000000) {
      insights.push({
        title: 'Ngân sách cao',
        description: `Với ngân sách ${this.formatCurrency(data.budget)}, phim thuộc nhóm blockbuster. Phim này cần doanh thu cao để có lời.`
      });
    } else if (data.budget < 5000000) {
      insights.push({
        title: 'Ngân sách thấp',
        description: 'Phim có ngân sách thấp thường có rủi ro thấp hơn nhưng tiềm năng lợi nhuận cũng hạn chế.'
      });
    }
    
    // Rating analysis
    if (data.voteAverage >= 8.0) {
      insights.push({
        title: 'Chất lượng xuất sắc',
        description: 'Điểm đánh giá cao (≥8.0) thường dẫn đến thành công tại phòng vé và giải thưởng.'
      });
    } else if (data.voteAverage < 6.0) {
      insights.push({
        title: 'Rủi ro chất lượng',
        description: 'Điểm đánh giá dưới 6.0 có thể ảnh hưởng tiêu cực đến doanh thu.'
      });
    }
    
    // Genre analysis
    const highPerformanceGenres = ['Action', 'Adventure', 'Animation'];
    const hasHighPerformanceGenre = data.genres.some(g => highPerformanceGenres.includes(g));
    
    if (hasHighPerformanceGenre) {
      insights.push({
        title: 'Thể loại phổ biến',
        description: 'Phim thuộc thể loại có tỷ lệ thành công cao trong thị trường hiện tại.'
      });
    }
    
    // Success prediction insight
    if (success) {
      insights.push({
        title: 'Dự đoán tích cực',
        description: `Model dự đoán phim sẽ thành công với độ tin cậy ${confidence}%. ROI dự kiến: ${metrics.predictedROI}.`
      });
    } else {
      insights.push({
        title: 'Cần cân nhắc',
        description: `Model cho thấy rủi ro cao. Nên xem xét điều chỉnh ngân sách hoặc chiến lược marketing.`
      });
    }
    
    return insights;
  },
  
  // Dashboard preview updates
  updateDashboardPreview() {
    // Animate preview bars
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
      const heights = ['20px', '35px', '25px', '40px', '30px'];
      bar.style.setProperty('--height', heights[index]);
      
      // Add animation delay
      bar.style.animationDelay = `${index * 0.2}s`;
    });
  },
  
  // Loading states
  showLoading() {
    this.isLoading = true;
    
    // Show loading overlay
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'loadingOverlay';
      overlay.className = 'loading-overlay';
      overlay.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Đang dự đoán...</p>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
    
    // Disable form
    const form = document.getElementById('predictionForm');
    if (form) {
      const inputs = form.querySelectorAll('input, select, button');
      inputs.forEach(input => input.disabled = true);
    }
  },
  
  hideLoading() {
    this.isLoading = false;
    
    // Hide loading overlay
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    
    // Enable form
    const form = document.getElementById('predictionForm');
    if (form) {
      const inputs = form.querySelectorAll('input, select, button');
      inputs.forEach(input => input.disabled = false);
    }
  },
  
  showError(message) {
    this.showNotification(message, 'error');
  },
  
  showSuccess(message) {
    this.showNotification(message, 'success');
  },
  
  showNotification(message, type = 'error') {
    // Simple notification
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#10B981' : '#DC2626';
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      max-width: 400px;
      font-weight: 600;
    `;
    notification.textContent = message;
    
    // Add slide in animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => {
        notification.remove();
        style.remove();
      }, 300);
    }, 4000);
  }
};

// ========== UTILITY FUNCTIONS ==========

// Format numbers for display
function formatNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Debounce function for input handling
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Reset form function
function resetForm() {
  const form = document.getElementById('prediction-form');
  if (form) {
    form.reset();
    
    // Reset range values
    document.querySelector('#vote_average + .range-value').textContent = '6.5';
    document.querySelector('#budget + .range-value').textContent = '50 tỷ';
    document.querySelector('#runtime + .range-value').textContent = '120 phút';
    document.querySelector('#vote_count + .range-value').textContent = '5,000';
    
    // Hide results
    const results = document.getElementById('results');
    if (results) {
      results.style.display = 'none';
      results.classList.remove('show');
    }
    
    // Scroll to form
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
  }
}

// Export results function
function exportResults() {
  if (!App.predictionResult) {
    App.showError('Chưa có kết quả để xuất. Vui lòng thực hiện dự đoán trước.');
    return;
  }
  
  const result = App.predictionResult;
  const data = result.data;
  
  // Create report content
  const reportContent = `
BÁOCÁO DỰ ĐOÁN THÀNH CÔNG PHIM
=====================================

THÔNG TIN PHIM:
- Tên phim: ${data.title}
- Ngân sách: ${data.budget} tỷ VND
- Thời lượng: ${data.runtime} phút
- Điểm đánh giá dự kiến: ${data.voteAverage}/10
- Thể loại: ${data.genres.join(', ')}

KẾT QUẢ DỰ ĐOÁN:
- Dự đoán: ${result.success ? 'THÀNH CÔNG' : 'THẤT BẠI'}
- Độ tin cậy: ${result.confidence}%
- ROI dự kiến: ${result.metrics.predictedROI}
- Doanh thu dự kiến: ${(result.metrics.predictedRevenue / 1000000000).toFixed(1)} tỷ VND
- Mức độ rủi ro: ${result.metrics.riskLevel}
- Tiềm năng thị trường: ${result.metrics.marketPotential}

Báo cáo được tạo lúc: ${new Date().toLocaleString('vi-VN')}
Được tạo bởi: FilmPredict AI System
  `;
  
  // Create and download file
  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FilmPredict_${data.title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Share results function
function shareResults() {
  if (!App.predictionResult) {
    App.showError('Chưa có kết quả để chia sẻ. Vui lòng thực hiện dự đoán trước.');
    return;
  }
  
  const result = App.predictionResult;
  const shareText = `🎬 Tôi vừa dự đoán thành công phim "${result.data.title}" bằng AI!
  
📊 Kết quả: ${result.success ? 'THÀNH CÔNG' : 'THẤT BẠI'} (Độ tin cậy ${result.confidence}%)
💰 ROI dự kiến: ${result.metrics.predictedROI}
🎯 Tiềm năng: ${result.metrics.marketPotential}

Thử dự đoán phim của bạn tại: ${window.location.href}

#FilmPredict #AI #MoviePrediction`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Kết quả dự đoán phim FilmPredict',
      text: shareText,
      url: window.location.href
    }).catch(err => console.log('Error sharing:', err));
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      App.showSuccess('Đã sao chép kết quả vào clipboard!');
    }).catch(() => {
      App.showError('Không thể sao chép. Vui lòng thử lại.');
    });
  }
}

// ❌ REMOVED: Old DOMContentLoaded listener - merged into new one at end of file
// This was causing duplicate App.init() calls

// ========== NEW FUNCTIONS FOR SIMPLIFIED FORM ==========

/**
 * Setup tooltip functionality (OLD VERSION - kept for backwards compatibility)
 * Note: setupEnhancedTooltips() is the new version with close button support
 */
function setupTooltips() {
  const tooltipBtns = document.querySelectorAll('.tooltip-btn');
  
  tooltipBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tooltipId = btn.getAttribute('data-tooltip');
      const tooltipContent = document.getElementById(`tooltip-${tooltipId}`);
      
      if (tooltipContent) {
        // Toggle tooltip
        const isVisible = tooltipContent.classList.contains('show');
        
        // Hide all tooltips first
        document.querySelectorAll('.tooltip-content').forEach(t => {
          t.classList.remove('show');
        });
        
        // Show this tooltip if it was hidden
        if (!isVisible) {
          tooltipContent.classList.add('show');
        }
      }
    });
  });
  
  // Close tooltips when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tooltip-btn') && !e.target.closest('.tooltip-content')) {
      document.querySelectorAll('.tooltip-content').forEach(t => {
        t.classList.remove('show');
      });
    }
  });
}

/**
 * Setup quick fill buttons with example data
 */
function setupQuickFillButtons() {
  const exampleData = {
    mai: {
      title: 'Mai (2024)',
      voteAverage: 6.8,
      revenue: 22119910,
      budget: 2503150,
      runtime: 133,
      genres: ['Drama', 'Comedy', 'Romance']
    },
    avengers: {
      title: 'Avengers: Endgame',
      voteAverage: 8.4,
      revenue: 2797800564,
      budget: 356000000,
      runtime: 181,
      genres: ['Action', 'Adventure', 'Science Fiction']
    },
    indie: {
      title: 'Independent Drama',
      voteAverage: 7.2,
      revenue: 3500000,
      budget: 2000000,
      runtime: 105,
      genres: ['Drama']
    }
  };
  
  const quickFillBtns = document.querySelectorAll('.quick-fill-btn');
  
  quickFillBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const exampleKey = btn.getAttribute('data-example');
      const data = exampleData[exampleKey];
      
      if (data) {
        // Fill form fields
        document.getElementById('title').value = data.title;
        document.getElementById('vote_average').value = data.voteAverage;
        document.querySelector('#vote_average + .range-value').textContent = data.voteAverage;
        
        document.getElementById('revenue').value = data.revenue;
        document.getElementById('budget').value = data.budget;
        document.getElementById('runtime').value = data.runtime;
        document.querySelector('#runtime + .range-value').textContent = `${data.runtime} phút`;
        
        // Clear all genre selections first
        document.querySelectorAll('.genre-chip').forEach(chip => {
          chip.classList.remove('active');
        });
        
        // Select genres
        data.genres.forEach(genre => {
          const chip = document.querySelector(`.genre-chip[data-genre="${genre}"]`);
          if (chip) {
            chip.classList.add('active');
          }
        });
        
        // Update hidden genres input
        document.getElementById('genres').value = JSON.stringify(data.genres);
        
        // Show success message
        App.showSuccess(`Đã điền thông tin cho "${data.title}"!`);
        
        // Scroll to top of form
        const formSection = document.querySelector('.form-section.featured');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

/**
 * Update form validation for simplified version
 */
function validateFormSimplified() {
  const title = document.getElementById('title').value.trim();
  const voteAverage = parseFloat(document.getElementById('vote_average').value);
  const revenue = parseFloat(document.getElementById('revenue').value);
  const budget = parseFloat(document.getElementById('budget').value);
  
  // Validate required fields
  if (!title) {
    App.showError('Vui lòng nhập tên phim');
    return false;
  }
  
  if (!voteAverage || voteAverage < 1 || voteAverage > 10) {
    App.showError('Vote Average phải từ 1-10');
    return false;
  }
  
  if (!revenue || revenue < 0) {
    App.showError('Revenue phải lớn hơn hoặc bằng 0');
    return false;
  }
  
  if (!budget || budget <= 0) {
    App.showError('Budget phải lớn hơn 0');
    return false;
  }
  
  // Calculate and show current ROI if revenue > 0
  if (revenue > 0 && budget > 0) {
    const roi = (revenue / budget).toFixed(2);
    console.log(`Current ROI: ${roi}x`);
  }
  
  return true;
}

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && App.charts) {
    // Refresh charts when page becomes visible
    Object.values(App.charts).forEach(chart => {
      if (chart && chart.resize) {
        chart.resize();
      }
    });
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}

// ==========================================
// 🚀 UX/UI ENHANCEMENTS - SENIOR DESIGN
// ==========================================

// ========== 1. REAL-TIME VALIDATION ==========
function setupRealTimeValidation() {
  const requiredFields = document.querySelectorAll('[data-required="true"] input');
  
  requiredFields.forEach(input => {
    // Validate on input change
    input.addEventListener('input', (e) => validateField(e.target));
    input.addEventListener('blur', (e) => validateField(e.target));
  });
}

function validateField(input) {
  const formGroup = input.closest('.form-group');
  const value = input.value.trim();
  let isValid = true;
  let errorMessage = '';
  
  // Check if field is empty
  if (input.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'Trường này là bắt buộc';
  }
  
  // Specific validations
  if (input.id === 'vote_average') {
    const vote = parseFloat(value);
    if (vote < 0 || vote > 10) {
      isValid = false;
      errorMessage = 'Vote Average phải từ 0 đến 10';
    }
  }
  
  if (input.id === 'revenue') {
    const revenue = parseFloat(value);
    if (revenue < 0) {
      isValid = false;
      errorMessage = 'Revenue không được âm';
    }
  }
  
  if (input.id === 'budget') {
    const budget = parseFloat(value);
    if (budget <= 0) {
      isValid = false;
      errorMessage = 'Budget phải lớn hơn 0';
    }
  }
  
  // Update UI
  if (isValid && value) {
    formGroup.classList.remove('error');
    formGroup.classList.add('valid');
  } else if (!isValid) {
    formGroup.classList.remove('valid');
    formGroup.classList.add('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = errorMessage;
    }
  } else {
    formGroup.classList.remove('valid', 'error');
  }
  
  // Update progress
  updateFormProgress();
  
  return isValid;
}

// ========== 2. FORM PROGRESS INDICATOR ==========
function updateFormProgress() {
  const requiredFields = document.querySelectorAll('[data-required="true"] input');
  let filledCount = 0;
  
  requiredFields.forEach(input => {
    const value = input.value.trim();
    if (value && validateField(input)) {
      filledCount++;
    }
  });
  
  const totalRequired = 3; // Vote Average, Revenue, Budget
  const percentage = (filledCount / totalRequired) * 100;
  
  // Update progress bar
  const progressBar = document.getElementById('progressBarFill');
  const progressCount = document.getElementById('progressCount');
  
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }
  
  if (progressCount) {
    progressCount.textContent = `${filledCount}/${totalRequired} fields bắt buộc`;
  }
}

// ========== 3. ENHANCED TOOLTIP SYSTEM ==========
function setupEnhancedTooltips() {
  const tooltipButtons = document.querySelectorAll('.tooltip-btn');
  const tooltipContents = document.querySelectorAll('.tooltip-content');
  
  tooltipButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const tooltipId = btn.getAttribute('data-tooltip');
      const content = document.getElementById(`tooltip-${tooltipId}`);
      
      // Close all other tooltips
      tooltipContents.forEach(t => {
        if (t !== content) {
          t.classList.remove('show');
        }
      });
      
      // Toggle this tooltip
      if (content) {
        content.classList.toggle('show');
      }
    });
  });
  
  // Close buttons
  const closeButtons = document.querySelectorAll('.tooltip-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tooltip = btn.closest('.tooltip-content');
      if (tooltip) {
        tooltip.classList.remove('show');
      }
    });
  });
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tooltip-btn') && !e.target.closest('.tooltip-content')) {
      tooltipContents.forEach(t => t.classList.remove('show'));
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      tooltipContents.forEach(t => t.classList.remove('show'));
    }
  });
}

// ========== 4. LOADING STATE MANAGEMENT ==========
function setupLoadingState() {
  const form = document.getElementById('prediction-form');
  const submitBtn = document.getElementById('submitBtn');
  
  if (form && submitBtn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate first
      if (!validateFormSimplified()) {
        return;
      }
      
      // Show loading state
      setLoadingState(submitBtn, true);
      
      // Prepare form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      try {
        // Submit prediction
        const response = await fetch('/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error('Prediction failed');
        }
        
        const result = await response.json();
        
        // Store result and show results page
        App.predictionResult = result;
        App.displayResults(result);
        App.showPage('results');
        
        // Scroll to top of results
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
        
      } catch (error) {
        console.error('Prediction error:', error);
        App.showError('Có lỗi xảy ra khi dự đoán. Vui lòng thử lại.');
      } finally {
        // Remove loading state
        setLoadingState(submitBtn, false);
      }
    });
  }
}

function setLoadingState(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.classList.add('btn-loading');
  } else {
    button.disabled = false;
    button.classList.remove('btn-loading');
  }
}

// ========== 5. DARK MODE TOGGLE ==========
function setupDarkModeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;
  
  // Load saved theme
  const savedTheme = localStorage.getItem('filmpredict-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(themeIcon, savedTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('filmpredict-theme', newTheme);
      updateThemeIcon(themeIcon, newTheme);
      
      // Update App state
      App.currentTheme = newTheme;
      
      // Show success message
      const themeName = newTheme === 'dark' ? 'tối' : 'sáng';
      App.showSuccess(`Đã chuyển sang chế độ ${themeName}`);
    });
  }
}

function updateThemeIcon(icon, theme) {
  if (icon) {
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }
}

// ========== 6. TRUST INDICATORS ANIMATION ==========
function animateTrustIndicators() {
  const trustNumbers = document.querySelectorAll('.trust-number');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const text = element.textContent;
        
        // Animate numbers (if numeric)
        if (text.includes('%') || text.includes(',')) {
          animateNumber(element, text);
        }
        
        observer.unobserve(element);
      }
    });
  }, observerOptions);
  
  trustNumbers.forEach(num => observer.observe(num));
}

function animateNumber(element, finalText) {
  const hasPercent = finalText.includes('%');
  const hasComma = finalText.includes(',');
  
  let finalNumber;
  if (hasPercent) {
    finalNumber = parseFloat(finalText.replace('%', ''));
  } else if (hasComma) {
    finalNumber = parseInt(finalText.replace(',', ''));
  } else {
    return; // Not a number, skip animation
  }
  
  const duration = 1500;
  const steps = 60;
  const stepValue = finalNumber / steps;
  let currentNumber = 0;
  let currentStep = 0;
  
  const interval = setInterval(() => {
    currentNumber += stepValue;
    currentStep++;
    
    let displayText;
    if (hasPercent) {
      displayText = currentNumber.toFixed(1) + '%';
    } else if (hasComma) {
      displayText = Math.floor(currentNumber).toLocaleString();
    }
    
    element.textContent = displayText;
    
    if (currentStep >= steps) {
      element.textContent = finalText;
      clearInterval(interval);
    }
  }, duration / steps);
}

// ========== 7. QUICK FILL ENHANCEMENTS ==========
function setupQuickFillEnhancements() {
  const quickFillButtons = document.querySelectorAll('.quick-fill-btn');
  
  quickFillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Add visual feedback
      btn.classList.add('filling');
      
      setTimeout(() => {
        btn.classList.remove('filling');
        
        // Update progress after quick fill
        setTimeout(() => {
          updateFormProgress();
        }, 100);
      }, 500);
    });
  });
}

// ========== 8. ACCESSIBILITY ENHANCEMENTS ==========
function setupAccessibility() {
  // Add ARIA labels
  const form = document.getElementById('prediction-form');
  if (form) {
    form.setAttribute('aria-label', 'Biểu mẫu dự đoán thành công phim');
  }
  
  // Ensure all interactive elements have proper focus indicators
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach(el => {
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
      // Add default aria-label if missing
      const text = el.textContent.trim() || el.placeholder || el.value;
      if (text) {
        el.setAttribute('aria-label', text);
      }
    }
  });
  
  // Announce page changes to screen readers
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
  
  // Store announcer in App
  App.announcer = announcer;
}

function announce(message) {
  if (App.announcer) {
    App.announcer.textContent = '';
    setTimeout(() => {
      App.announcer.textContent = message;
    }, 100);
  }
}

// ========== 9. INITIALIZE ALL ENHANCEMENTS ==========
function initializeEnhancements() {
  console.log('🚀 Initializing UX/UI enhancements...');
  
  // Setup all enhancements
  setupRealTimeValidation();
  setupEnhancedTooltips(); // ✅ FIXED: Use enhanced tooltips instead of old setupTooltips()
  setupLoadingState();
  setupDarkModeToggle();
  setupQuickFillEnhancements();
  setupAccessibility();
  
  // Initial progress update
  updateFormProgress();
  
  // Animate trust indicators when visible
  animateTrustIndicators();
  
  console.log('✅ All enhancements initialized successfully!');
}

// ========== 10. INITIALIZE WHEN DOM IS READY ==========
// ✅ FIXED: Merged duplicate DOMContentLoaded listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize original App
  App.init();
  
  // Initialize new enhancements (includes setupEnhancedTooltips)
  initializeEnhancements();
  
  // Setup old quick fill buttons (from original code)
  setupQuickFillButtons();
  
  console.log('🎬 FilmPredict App with Enhancements ready!');
});

// ==========================================
// END OF UX/UI ENHANCEMENTS
// ==========================================
