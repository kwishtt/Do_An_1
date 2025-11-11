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
  
  // Theme management removed - app is now light-only
  
  // Event listeners setup
  setupEventListeners() {
    // Theme toggle removed (site is light-only)
    
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
    
    // ✅ NEW: Random Data Button Handler
    const randomDataBtn = document.getElementById('randomDataBtn');
    if (randomDataBtn) {
      randomDataBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showRandomDataModal();
      });
    }
    
    // ✅ NEW: Modal close button
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        this.hideRandomDataModal();
      });
    }
    
    // ✅ NEW: Modal test option buttons
    const testSuccessBtn = document.getElementById('test-success-btn');
    const testAverageBtn = document.getElementById('test-average-btn');
    const testFailureBtn = document.getElementById('test-failure-btn');
    
    if (testSuccessBtn) {
      testSuccessBtn.addEventListener('click', () => {
        this.fillRandomData('success');
      });
    }
    if (testAverageBtn) {
      testAverageBtn.addEventListener('click', () => {
        this.fillRandomData('average');
      });
    }
    if (testFailureBtn) {
      testFailureBtn.addEventListener('click', () => {
        this.fillRandomData('failure');
      });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('random-data-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideRandomDataModal();
        }
      });
    }
    
    // ✨ FIX: Auto-update budget and revenue inputs on typing
    const budgetInput = document.getElementById('budget');
    const revenueInput = document.getElementById('revenue');
    
    if (budgetInput) {
      // Update on both 'input' (typing) and 'change' (blur) events
      budgetInput.addEventListener('input', () => {
        console.log('💰 Budget updated:', budgetInput.value);
      });
    }
    
    if (revenueInput) {
      // Update on both 'input' (typing) and 'change' (blur) events
      revenueInput.addEventListener('input', () => {
        console.log('💵 Revenue updated:', revenueInput.value);
      });
    }
    
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

    // Mobile nav toggle (hamburger)
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', (e) => {
        const isOpen = navMenu.classList.toggle('open');
        // add a helper class to trigger animation
        if (isOpen) {
          // small delay to allow render
          setTimeout(() => navMenu.classList.add('show'), 10);
          navToggle.setAttribute('aria-expanded', 'true');
        } else {
          navMenu.classList.remove('show');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });

      // Close nav when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-menu') && !e.target.closest('#navToggle')) {
          if (navMenu.classList.contains('open')) {
            navMenu.classList.remove('show');
            // wait for animation then remove .open
            setTimeout(() => navMenu.classList.remove('open'), 220);
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }
    
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
      
      // Switch to results page với loading animation
      this.showPage('results');
      
      // ✅ NEW: Hiển thị loading animation khi chuyển trang
      this.showResultsLoading();
      
      // Scroll to prediction hero card after a short delay
      setTimeout(() => {
        const predictionHero = document.querySelector('.prediction-hero');
        if (predictionHero) {
          predictionHero.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Hide loading animation sau 2 giây hoặc khi scroll xong
        setTimeout(() => {
          this.hideResultsLoading();
        }, 1500);
      }, 300);
      
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
    data.revenue = parseFloat(formData.get('revenue')) || 0;  // ✅ FIXED: Add revenue field processing
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
    // ✅ IMPROVED: Enhanced validation with user-friendly messages
    const errors = [];
    
    // Title validation
    if (!data.title || data.title.trim() === '') {
      errors.push('Tên phim không được để trống');
    }
    
    // Budget validation
    if (data.budget <= 0) {
      errors.push('Ngân sách phải lớn hơn 0');
    } else if (data.budget > 1000000000) {
      errors.push('Ngân sách vượt quá giới hạn hợp lý (1 tỷ USD)');
    }
    
    // Revenue validation (✅ FIXED: Add revenue validation)
    if (data.revenue <= 0) {
      errors.push('Doanh thu phải lớn hơn 0');
    } else if (data.revenue > 5000000000) {
      errors.push('Doanh thu vượt quá giới hạn hợp lý (5 tỷ USD)');
    }
    
    // Runtime validation
    if (data.runtime < 30) {
      errors.push('Thời lượng phim phải ít nhất 30 phút');
    } else if (data.runtime > 300) {
      errors.push('Thời lượng phim không nên quá 300 phút (5 giờ)');
    }
    
    // Vote Average validation (CRITICAL - 76.53% importance!)
    if (data.voteAverage < 0 || data.voteAverage > 10) {
      errors.push('Điểm đánh giá phải từ 0 đến 10');
    } else if (data.voteAverage < 3) {
      errors.push('Cảnh báo: Điểm đánh giá dưới 3/10 rất khó thành công');
    }
    
    // Genres validation (OPTIONAL - only check if provided)
    if (data.genres && data.genres.length > 5) {
      errors.push('Không nên chọn quá 5 thể loại');
    }
    // Note: Genres is OPTIONAL - model still works without it (0% importance)
    
    // If there are errors, show them
    if (errors.length > 0) {
      this.showValidationErrors(errors);
      return false;
    }
    
    return true;
  },
  
  showValidationErrors(errors) {
    const errorHtml = `
      <div class="validation-errors">
        <h3>⚠️ Vui lòng kiểm tra lại:</h3>
        <ul>
          ${errors.map(err => `<li>${err}</li>`).join('')}
        </ul>
      </div>
    `;
    this.showError(errorHtml);
  },
  
  async makePrediction(data) {
    // ✅ FIXED: Call actual backend API instead of mock
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Lỗi khi gọi API dự đoán');
      }
      
      const result = await response.json();
      
      // ✅ FIXED: Use actual success_probability from model instead of calculated confidence
      // Convert probability (0-1) to percentage (0-100) with 2 decimal places
      const actualConfidence = Math.round(result.prediction.success_probability * 100 * 100) / 100;
      
      console.log('✅ API Response Success:', {
        success_probability: result.prediction.success_probability,
        actualConfidence: actualConfidence,
        will_succeed: result.prediction.will_succeed,
        is_real_model: result.model_info?.is_real_model
      });
      
      // Transform API response to match our display format
      return {
        success: result.prediction.will_succeed,
        confidence: actualConfidence,  // ✅ NOW using real model output instead of calculated value
        success_probability: result.prediction.success_probability,
        data: result.input_data,
        timestamp: new Date(result.model_info.prediction_timestamp),
        metrics: result.metrics,
        model_info: result.model_info,
        is_real_model: result.model_info.is_real_model || false,  // ✅ Check for real model
        model_accuracy: result.model_info?.accuracy || 0.9952,
        model_features: result.model_info?.features_count || 47
      };
      
    } catch (error) {
      console.error('❌ API call failed:', error);
      
      // Fallback to mock if API fails (for development)
      console.warn('⚠️ FALLBACK: Using mock prediction (API failed)');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = this.calculateMockPrediction(data);
      const mockConfidence = this.calculateConfidence(data);
      
      console.log('⚠️ Mock Prediction:', {
        success,
        confidence: mockConfidence,
        is_mock: true
      });
      
      return {
        success,
        confidence: mockConfidence,
        data,
        timestamp: new Date(),
        metrics: this.generateMockMetrics(data, success),
        is_mock: true
      };
    }
  },
  
  calculateMockPrediction(data) {
    // ✅ ENHANCED: More realistic prediction based on actual model insights
    let score = 0;
    
    // Vote Average - 76.53% importance (MOST CRITICAL)
    const voteAverage = parseFloat(data.voteAverage) || 6.5;
    if (voteAverage >= 8.5) score += 75;       // Excellent movies
    else if (voteAverage >= 8.0) score += 65;  // Very good movies  
    else if (voteAverage >= 7.5) score += 55;  // Good movies
    else if (voteAverage >= 7.0) score += 45;  // Above average
    else if (voteAverage >= 6.5) score += 30;  // Average
    else if (voteAverage >= 6.0) score += 15;  // Below average
    else if (voteAverage >= 5.5) score += 5;   // Poor
    else score -= 10; // Very poor (reduces success chance)
    
    // ROI if available - 23.47% importance
    const budget = parseFloat(data.budget) || 0;
    const revenue = parseFloat(data.revenue) || 0;
    if (revenue > 0 && budget > 0) {
      const roi = revenue / budget;
      if (roi >= 3.0) score += 23;       // Blockbuster success
      else if (roi >= 2.0) score += 18;  // Big success
      else if (roi >= 1.5) score += 15;  // Good success
      else if (roi >= 1.2) score += 10;  // Moderate success
      else if (roi >= 1.0) score += 5;   // Break-even
      else if (roi >= 0.8) score += 2;   // Close to break-even
      else score -= 5; // Loss
    } else if (budget > 0) {
      // Pre-release prediction based on budget level (minimal impact)
      if (budget >= 200000000) score += 5;     // Big budget confidence
      else if (budget >= 100000000) score += 3; // Medium-high budget
      else if (budget >= 50000000) score += 2;  // Medium budget
      else if (budget >= 10000000) score += 1;  // Low-medium budget
      // Independent films (< $10M) get no budget bonus
    }
    
    // Other factors (very minimal importance ~0%)
    const runtime = parseInt(data.runtime) || 120;
    if (runtime >= 90 && runtime <= 150) score += 1; // Optimal range
    else if (runtime > 180) score -= 1; // Too long
    else if (runtime < 80) score -= 1;  // Too short
    
    // Add some randomness to simulate real-world uncertainty
    const randomFactor = (Math.random() - 0.5) * 10; // ±5%
    score += randomFactor;
    
    // Convert to boolean (success/failure) - use 50 as threshold
    return score >= 50;
  },
  
  calculateConfidence(data) {
    // ✅ ENHANCED: Confidence based on data quality and completeness
    let confidence = 60; // Base confidence
    
    // Vote Average quality (primary factor - 76.53% importance)
    const voteAverage = parseFloat(data.voteAverage) || 6.5;
    if (voteAverage >= 8.5) {
      confidence += 25; // Excellent ratings
    } else if (voteAverage >= 8.0) {
      confidence += 22;
    } else if (voteAverage >= 7.5) {
      confidence += 18;
    } else if (voteAverage >= 7.0) {
      confidence += 15;
    } else if (voteAverage >= 6.5) {
      confidence += 10;
    } else if (voteAverage >= 6.0) {
      confidence += 5;
    } else if (voteAverage < 5.0) {
      confidence -= 8;
    }
    
    // Data completeness (Budget & Revenue - 23.47% importance)
    if (data.budget > 0) confidence += 8;
    if (data.revenue > 0) confidence += 12; // Revenue data significantly increases confidence
    if (data.runtime && data.runtime > 0) confidence += 4;
    if (data.genres && data.genres.length > 0) confidence += 3;
    
    // Realistic movie parameters
    if (data.budget >= 1000000 && data.budget <= 500000000) confidence += 6;
    if (data.voteAverage >= 1.0 && data.voteAverage <= 10.0) confidence += 4;
    if (data.runtime >= 60 && data.runtime <= 200) confidence += 5;
    
    // ROI data increases confidence significantly (only if we have both budget & revenue)
    if (data.revenue > 0 && data.budget > 0) {
      const roi = data.revenue / data.budget;
      if (roi >= 0.5 && roi <= 10.0) {
        confidence += 12; // Reasonable ROI range
      } else if (roi > 0) {
        confidence += 6; // Extreme but real ROI values
      }
    }
    
    // Seasonal/Month analysis
    try {
      const month = parseInt(data.releaseMonth) || new Date().getMonth() + 1;
      if ([6, 7, 12].includes(month)) {
        confidence += 3; // High season = slightly more data to compare
      }
    } catch(e) {}
    
    // ✅ NEW: Được cả 2 yếu tố chính = Rất tự tin
    const hasBothKeyFactors = voteAverage >= 6.5 && data.budget > 0 && data.revenue > 0;
    if (hasBothKeyFactors) {
      confidence += 8; // Bonus for having complete data
    }
    
    // Add controlled randomness but less than before (±1.5%)
    confidence += (Math.random() - 0.5) * 3;
    
    // Clamp confidence to realistic range (62-96)
    return Math.max(62, Math.min(96, Math.round(confidence)));
  },
  
  generateMockMetrics(data, success) {
    // ✅ IMPROVED: More realistic ROI calculation based on vote average and budget
    const voteAverage = parseFloat(data.voteAverage) || 6.5;
    const budget = parseFloat(data.budget) || 50000000;
    
    // Base ROI từ vote average (primary factor - 76.53% importance)
    let baseROI;
    if (voteAverage >= 8.5) {
      baseROI = 3.5 + Math.random() * 3;  // 3.5-6.5x for excellent films
    } else if (voteAverage >= 8.0) {
      baseROI = 2.8 + Math.random() * 2;  // 2.8-4.8x for very good films
    } else if (voteAverage >= 7.5) {
      baseROI = 2.0 + Math.random() * 1.5;  // 2.0-3.5x for good films
    } else if (voteAverage >= 7.0) {
      baseROI = 1.5 + Math.random() * 1;    // 1.5-2.5x for above average
    } else if (voteAverage >= 6.5) {
      baseROI = 1.2 + Math.random() * 0.8;  // 1.2-2.0x for average
    } else if (voteAverage >= 6.0) {
      baseROI = 0.8 + Math.random() * 0.6;  // 0.8-1.4x for below average
    } else if (voteAverage >= 5.5) {
      baseROI = 0.5 + Math.random() * 0.5;  // 0.5-1.0x for poor
    } else {
      baseROI = 0.2 + Math.random() * 0.5;  // 0.2-0.7x for very poor
    }
    
    // ROI adjustment based on budget (secondary factor - 23.47% importance)
    if (budget >= 100000000) {
      // High budget films need bigger revenue to succeed
      baseROI *= (0.7 + Math.random() * 0.3);  // Reduce ROI for big-budget films
    } else if (budget <= 10000000) {
      // Low budget films can have higher ROI
      baseROI *= (1.1 + Math.random() * 0.4);  // Increase ROI for indie films
    } else {
      baseROI *= (0.9 + Math.random() * 0.3);  // Mid-budget adjustment
    }
    
    const predictedRevenue = budget * baseROI;
    
    // ✅ ENHANCED: More realistic and detailed metrics
    return {
      predictedROI: Math.max(0.1, baseROI).toFixed(2),
      predictedRevenue: Math.round(predictedRevenue),
      breakEvenPoint: Math.round(budget * 1.1),
      marketPotential: this.calculateMarketPotential(voteAverage, baseROI),
      riskLevel: this.calculateRiskLevel(voteAverage, baseROI),
      profitMargin: this.calculateProfitMargin(baseROI),
      investmentGrade: this.calculateInvestmentGrade(voteAverage, baseROI),
      competitionLevel: data.voteAverage >= 7.5 ? 'Cạnh tranh cao' : 'Cạnh tranh vừa',
      targetAudience: this.analyzeTargetAudience(data),
      releaseStrategy: this.analyzeReleaseStrategy(data),
      financialBreakdown: {
        production: Math.round(budget * 0.7),
        marketing: Math.round(budget * 0.3),
        expectedProfit: Math.round(predictedRevenue - budget),
        breakEvenDays: this.estimateBreakEvenDays(baseROI, voteAverage)
      }
    };
  },
  
  // ✅ NEW: Calculate market potential based on realistic metrics
  calculateMarketPotential(voteAvg, roi) {
    if (voteAvg >= 8.0 && roi > 2.0) return 'Rất cao';
    if (voteAvg >= 7.5 && roi > 1.5) return 'Cao';
    if (voteAvg >= 7.0 || roi > 1.2) return 'Trung bình cao';
    if (voteAvg >= 6.5 || roi > 1.0) return 'Trung bình';
    if (roi > 0.8) return 'Thấp';
    return 'Rất thấp';
  },
  
  // ✅ NEW: Calculate risk level based on metrics
  calculateRiskLevel(voteAvg, roi) {
    if (voteAvg >= 8.0 && roi > 2.5) return 'Rất thấp';
    if (voteAvg >= 7.5 && roi > 1.8) return 'Thấp';
    if (voteAvg >= 7.0 && roi > 1.2) return 'Trung bình thấp';
    if (voteAvg >= 6.5 && roi > 1.0) return 'Trung bình';
    if (voteAvg >= 6.0 || roi > 0.8) return 'Trung bình cao';
    if (roi > 0.5) return 'Cao';
    return 'Rất cao';
  },
  
  // ✅ NEW: Calculate profit margin
  calculateProfitMargin(roi) {
    const margin = (roi - 1) * 100;
    if (margin > 150) return '150%+';
    if (margin > 100) return '100-150%';
    if (margin > 50) return '50-100%';
    if (margin > 20) return '20-50%';
    if (margin > 0) return '0-20%';
    if (margin > -20) return '-20-0%';
    return '-20%+';
  },
  
  // ✅ NEW: Calculate investment grade
  calculateInvestmentGrade(voteAvg, roi) {
    if (voteAvg >= 8.0 && roi > 3.0) return 'A+';
    if (voteAvg >= 7.5 && roi > 2.0) return 'A';
    if (voteAvg >= 7.0 && roi > 1.5) return 'A-';
    if (voteAvg >= 6.8 && roi > 1.2) return 'B+';
    if (voteAvg >= 6.5 && roi > 1.0) return 'B';
    if (voteAvg >= 6.0 || roi > 0.8) return 'B-';
    if (voteAvg >= 5.5 || roi > 0.5) return 'C+';
    if (roi > 0.2) return 'C';
    return 'C-';
  },
  
  // ✅ NEW: Estimate break-even days
  estimateBreakEvenDays(roi, voteAvg) {
    if (roi >= 3.0) return 8 + Math.floor(Math.random() * 5);   // 8-13 days
    if (roi >= 2.0) return 12 + Math.floor(Math.random() * 8);  // 12-20 days
    if (roi >= 1.5) return 18 + Math.floor(Math.random() * 12); // 18-30 days
    if (roi >= 1.0) return 25 + Math.floor(Math.random() * 15); // 25-40 days
    if (roi >= 0.7) return 35 + Math.floor(Math.random() * 25); // 35-60 days
    return 50 + Math.floor(Math.random() * 40); // 50-90 days
  },

  // ✅ NEW: Phân tích đối tượng mục tiêu
  analyzeTargetAudience(data) {
    if (data.voteAverage >= 8.5) return 'Khán giả cao cấp, yêu thích chất lượng 🎭';
    if (data.voteAverage >= 8.0) return 'Khán giả đại chúng, gia đình thích phim chất lượng 👨‍👩‍👧';
    if (data.voteAverage >= 7.0) return 'Khán giả đại chúng, gia đình 🎬';
    if (data.voteAverage >= 6.0) return 'Khán giả trẻ, giải trí nhẹ 🎉';
    return 'Khán giả thích thể loại đặc biệt 🎯';
  },

  // ✅ NEW: Phân tích chiến lược phát hành
  analyzeReleaseStrategy(data) {
    const month = data.releaseMonth;
    if ([6, 7, 12].includes(month)) return 'Mùa phim bom tấn - Cạnh tranh cao 💥';
    if ([3, 4, 9, 10].includes(month)) return 'Mùa vàng - Thuận lợi phát hành ⭐';
    return 'Mùa thấp điểm - Ít cạnh tranh 🎪';
  },
  
  // Display prediction results
  displayPredictionResult(result) {
    this.predictionResult = result;
    
    // ✅ NEW: Show warning if using mock prediction
    this.updateModelStatusWarning(result);
    
    // Update movie title in hero section
    const resultMovieTitle = document.getElementById('result-movie-title');
    if (resultMovieTitle) {
      resultMovieTitle.textContent = result.data.title;
    }
    
    // Update prediction badge
    const predictionBadge = document.querySelector('.prediction-badge');
    if (predictionBadge) {
      predictionBadge.innerHTML = `
        <i class="fas fa-${result.success ? 'check-circle' : 'times-circle'}"></i>
        <span class="badge-text">${result.success ? 'THÀNH CÔNG' : 'THẤT BẠI'}</span>
      `;
      predictionBadge.className = `prediction-badge ${result.success ? 'success' : 'failure'}`;
    }
    
    // Update confidence gauge (single source of truth)
    this.updateConfidenceGauge(result.confidence);
    
    // Update compact metrics
    this.updateCompactMetrics(result.metrics, result.data);
    
    // Update feature importance display
    this.updateFeatureImportanceDisplay(result);
    
    // Update business insights
    this.updateBusinessInsights(result.metrics);
    
    console.log('Full-screen prediction result displayed:', result);
  },
  
  // ✅ NEW: Update compact metrics for full-screen layout
  updateCompactMetrics(metrics, data) {
    const predictedROI = parseFloat(metrics.predictedROI) || 0;
    const predictedRevenue = parseFloat(metrics.predictedRevenue) || 0;
    
    // Update compact metric cards
    this.updateMetricValue('predicted-roi-compact', `${predictedROI.toFixed(2)}x`);
    this.updateMetricValue('predicted-revenue-compact', `${(predictedRevenue / 1000000000).toFixed(4)} tỷ`);
    this.updateMetricValue('risk-level-compact', metrics.riskLevel || 'N/A');
    this.updateMetricValue('market-potential-compact', metrics.marketPotential || 'N/A');
    
    // ✅ NEW: Apply color coding to metrics
    this.applyMetricColors();
  },
  
  // ✅ NEW: Apply color coding to metric values
  applyMetricColors() {
    const metrics = this.predictionResult?.metrics;
    if (!metrics) return;
    
    // ROI Color coding
    const roiElement = document.getElementById('predicted-roi-compact');
    if (roiElement) {
      const roi = parseFloat(metrics.predictedROI) || 0;
      if (roi > 1.5) {
        roiElement.className = 'metric-value-compact success';
      } else if (roi > 1.0) {
        roiElement.className = 'metric-value-compact warning';
      } else {
        roiElement.className = 'metric-value-compact danger';
      }
    }
    
    // Risk Level Color coding
    const riskElement = document.getElementById('risk-level-compact');
    if (riskElement) {
      const risk = metrics.riskLevel;
      if (risk === 'Thấp' || risk === 'Rất thấp') {
        riskElement.className = 'metric-value-compact success';
      } else if (risk === 'Trung bình') {
        riskElement.className = 'metric-value-compact warning';
      } else {
        riskElement.className = 'metric-value-compact danger';
      }
    }
    
    // Market Potential Color coding
    const potentialElement = document.getElementById('market-potential-compact');
    if (potentialElement) {
      const potential = metrics.marketPotential;
      if (potential === 'Cao' || potential === 'Rất cao') {
        potentialElement.className = 'metric-value-compact success';
      } else if (potential === 'Trung bình' || potential === 'Trung bình cao') {
        potentialElement.className = 'metric-value-compact warning';
      } else {
        potentialElement.className = 'metric-value-compact danger';
      }
    }
  },
  
  // ✅ NEW: Update feature importance display
  updateFeatureImportanceDisplay(result) {
    const container = document.getElementById('feature-importance-display');
    if (!container) return;
    
    const features = result.model_info?.feature_importance?.top_features || 
                    (result.feature_importance ? result.feature_importance.top_features : []);
    
    if (features.length > 0) {
      // When we have real feature importances, show them alongside actionable advice.
      const featuresHtml = features.slice(0, 8).map(feature => `
        <div class="feature-item">
          <span class="feature-name">${feature.name}</span>
          <span class="feature-importance">${feature.importance}%</span>
        </div>
      `).join('');

      // Reuse advice-generation logic (same as when no importances)
      const metrics = result.metrics || {};
      const data = result.data || {};
      let adviceTitle = 'Gợi ý hành động';
      let adviceLines = [];
      const risk = (metrics.riskLevel || '').toLowerCase();
      if (risk.includes('rất thấp') || risk.includes('thấp')) {
        adviceLines.push('Rủi ro thấp → Tăng đầu tư cho marketing để tối đa hoá lợi nhuận.');
      } else if (risk.includes('trung bình')) {
        adviceLines.push('Rủi ro trung bình → Tập trung tối ưu marketing và phân phối, thử A/B kênh quảng cáo.');
      } else if (risk.includes('cao')) {
        adviceLines.push('Rủi ro cao → Giảm quy mô chi tiêu, củng cố chất lượng (kịch bản, diễn xuất), rồi tái khởi động chiến dịch.');
      } else {
        adviceLines.push('Không đủ dữ liệu rủi ro — kiểm tra lại thông tin đầu vào (budget, revenue, voteAverage).');
      }
      const roi = parseFloat(metrics.predictedROI) || 0;
      if (roi > 1.5) {
        adviceLines.push('ROI dự kiến cao → Ưu tiên mở rộng phân phối tại nhiều rạp và thị trường.');
      } else if (roi > 1.0) {
        adviceLines.push('ROI ổn → Tối ưu chi phí marketing, tập trung kênh có hiệu suất cao.');
      } else {
        adviceLines.push('ROI thấp → Cân nhắc giảm chi phí hoặc thay đổi chiến lược phát hành.');
      }
      const voteAvg = parseFloat(data.vote_average || data.voteAverage || 0);
      if (voteAvg && voteAvg < 6.5) {
        adviceLines.push('Điểm đánh giá thấp → Đầu tư cải thiện chất lượng (kịch bản, hậu kỳ, PR chuyên sâu).');
      } else if (voteAvg && voteAvg >= 8.0) {
        adviceLines.push('Điểm đánh giá cao → Khai thác PR & review, đẩy tie-in với influencers để tăng vé.');
      }

      const adviceHtml = `
        <div class="feature-advice">
          <div class="advice-header">
            <strong>${adviceTitle}</strong>
            <span class="advice-sub">Dựa trên phân tích mô hình hiện thời</span>
          </div>
          <ul class="advice-list">
            ${adviceLines.map(line => `<li>${line}</li>`).join('')}
          </ul>
        </div>
      `;

      container.innerHTML = `
        <div class="feature-advice-and-list">
          <div class="feature-list">${featuresHtml}</div>
          <div class="advice-side">${adviceHtml}</div>
        </div>
      `;
    } else {
      // Nếu backend không trả feature importances, hiển thị một lời góp ý hành động dựa trên metrics
      const metrics = result.metrics || {};
      const data = result.data || {};

      // Simple advice rules
      let adviceTitle = 'Gợi ý hành động';
      let adviceLines = [];

      // Based on risk level
      const risk = (metrics.riskLevel || '').toLowerCase();
      if (risk.includes('rất thấp') || risk.includes('thấp')) {
        adviceLines.push('Rủi ro thấp → Tăng đầu tư cho marketing để tối đa hoá lợi nhuận.');
      } else if (risk.includes('trung bình')) {
        adviceLines.push('Rủi ro trung bình → Tập trung tối ưu marketing và phân phối, thử A/B kênh quảng cáo.');
      } else if (risk.includes('cao')) {
        adviceLines.push('Rủi ro cao → Giảm quy mô chi tiêu, củng cố chất lượng (kịch bản, diễn xuất), rồi tái khởi động chiến dịch.');
      } else {
        adviceLines.push('Không đủ dữ liệu rủi ro — kiểm tra lại thông tin đầu vào (budget, revenue, voteAverage).');
      }

      // Based on predictedROI
      const roi = parseFloat(metrics.predictedROI) || 0;
      if (roi > 1.5) {
        adviceLines.push('ROI dự kiến cao → Ưu tiên mở rộng phân phối tại nhiều rạp và thị trường.');
      } else if (roi > 1.0) {
        adviceLines.push('ROI ổn → Tối ưu chi phí marketing, tập trung kênh có hiệu suất cao.');
      } else {
        adviceLines.push('ROI thấp → Cân nhắc giảm chi phí hoặc thay đổi chiến lược phát hành.');
      }

      // Based on voteAverage (quality signal)
      const voteAvg = parseFloat(data.vote_average || data.voteAverage || 0);
      if (voteAvg && voteAvg < 6.5) {
        adviceLines.push('Điểm đánh giá thấp → Đầu tư cải thiện chất lượng (kịch bản, hậu kỳ, PR chuyên sâu).');
      } else if (voteAvg && voteAvg >= 8.0) {
        adviceLines.push('Điểm đánh giá cao → Khai thác PR & review, đẩy tie-in với influencers để tăng vé.');
      }

      // Compose HTML
      const adviceHtml = `
        <div class="feature-advice">
          <div class="advice-header">
            <strong>${adviceTitle}</strong>
            <span class="advice-sub">Dựa trên phân tích mô hình hiện thời</span>
          </div>
          <ul class="advice-list">
            ${adviceLines.map(line => `<li>${line}</li>`).join('')}
          </ul>
        </div>
      `;

      container.innerHTML = adviceHtml;
    }
  },
  
  // ✅ NEW: Update business insights
  updateBusinessInsights(metrics) {
    this.updateMetricValue('target-audience-insight', metrics.targetAudience || 'Khán giả đại chúng');
    this.updateMetricValue('release-strategy-insight', metrics.releaseStrategy || 'Cần phân tích thêm');
    this.updateMetricValue('investment-grade-insight', metrics.investmentGrade || 'B');
    this.updateMetricValue('profit-margin-insight', metrics.profitMargin || 'Cần tính toán');
  },
  
  // ✅ NEW: Show model status warning
  updateModelStatusWarning(result) {
    // Remove existing warnings
    const existingWarning = document.querySelector('.model-status-warning, .model-status-success');
    if (existingWarning) {
      existingWarning.remove();
    }
    
    // Check if using real model or mock
    if (result.is_mock) {
      const warningHtml = `
        <div class="model-status-warning alert-warning">
          <i class="fas fa-exclamation-triangle"></i>
          <div class="warning-content">
            <strong>⚠️ Cảnh báo:</strong> Hiện tại đang sử dụng thuật toán dự đoán đơn giản thay vì mô hình Random Forest.
            <details class="warning-details">
              <summary>Chi tiết thuật toán mock</summary>
              <ul>
                <li><strong>Vote Average:</strong> Tác động 76.53% (yếu tố quan trọng nhất)</li>
                <li><strong>ROI (nếu có):</strong> Tác động 23.47%</li>
                <li><strong>Budget, Runtime, Genre:</strong> Tác động minimal (~0%)</li>
                <li><strong>Độ chính xác:</strong> Khoảng 75-85% (ước tính)</li>
              </ul>
              <p><small>Để có kết quả chính xác nhất, cần khởi động server Flask với mô hình Random Forest đã training (Accuracy: 99.52%)</small></p>
            </details>
          </div>
        </div>
      `;
      
      // Insert warning at the top of results section
      const resultsSection = document.querySelector('.prediction-results-section');
      if (resultsSection) {
        resultsSection.insertAdjacentHTML('afterbegin', warningHtml);
      }
    } else {
      // Show success message for real Random Forest model
      const successHtml = `
        <div class="model-status-success alert-success">
          <i class="fas fa-check-circle"></i>
          <div class="success-content">
            <strong>✅ Random Forest Model:</strong> Sử dụng mô hình AI thực với độ chính xác 99.52%
            <div class="model-details">
              <span class="model-info">Trained trên 1,022 bộ phim từ TMDB</span>
              <span class="model-info">${result.model_info?.features_used || 47} features được sử dụng</span>
              <span class="model-info">Vote Average: 76.53% importance | ROI: 23.47% importance</span>
            </div>
          </div>
        </div>
      `;
      
      const resultsSection = document.querySelector('.prediction-results-section');
      if (resultsSection) {
        resultsSection.insertAdjacentHTML('afterbegin', successHtml);
      }
    }
  },
  
  updateConfidenceGauge(confidence) {
    const confidenceText = document.getElementById('confidence-text');
    // Find the card - could be either .confidence-card or .confidence-card-macos
    const confidenceCard = document.querySelector('.confidence-card-macos') || document.querySelector('.confidence-card');
    const confidenceStatus = document.getElementById('confidence-status');
    const confidenceLevel = document.getElementById('confidence-level');
    const confidenceRating = document.getElementById('confidence-rating');
    
    console.log('updateConfidenceGauge called with:', { confidence, confidenceText, confidenceCard, confidenceStatus });
    
    if (confidenceText && confidenceCard) {
      // Animate the confidence number with smooth counting effect
      let currentValue = 0;
      const startTime = Date.now();
      const duration = 2000; // 2 seconds
      
      const animateNumber = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing function for smooth animation
        const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        currentValue = easedProgress * confidence;
        
        // Display with 2 decimal places
        confidenceText.textContent = currentValue.toFixed(2);
        
        if (progress < 1) {
          requestAnimationFrame(animateNumber);
        } else {
          // Ensure exact final value with 2 decimal places
          confidenceText.textContent = confidence.toFixed(2);
          console.log('Confidence animation complete:', confidence.toFixed(2));
          
          // Update status, level, and rating based on final confidence
          updateConfidenceMetrics(confidence);
        }
      };
      
      // Function to update confidence metrics
      const updateConfidenceMetrics = (finalConfidence) => {
        if (finalConfidence >= 85) {
          // Very High Confidence
          confidenceText.style.color = '#059669'; // Success green
          if (confidenceStatus) {
            confidenceStatus.textContent = 'Rất tin cậy';
            confidenceStatus.className = 'status-badge success';
          }
          if (confidenceLevel) {
            confidenceLevel.textContent = 'Rất cao';
            confidenceLevel.className = 'metric-value high';
          }
          if (confidenceRating) {
            confidenceRating.textContent = 'A+';
          }
          confidenceCard.classList.add('high-confidence');
        } else if (finalConfidence >= 70) {
          // High Confidence  
          confidenceText.style.color = '#10B981'; // Success green
          if (confidenceStatus) {
            confidenceStatus.textContent = 'Tin cậy';
            confidenceStatus.className = 'status-badge good';
          }
          if (confidenceLevel) {
            confidenceLevel.textContent = 'Cao';
            confidenceLevel.className = 'metric-value high';
          }
          if (confidenceRating) {
            confidenceRating.textContent = 'A';
          }
          confidenceCard.classList.remove('high-confidence');
        } else if (finalConfidence >= 60) {
          // Medium Confidence
          confidenceText.style.color = '#4F46E5'; // Primary blue
          if (confidenceStatus) {
            confidenceStatus.textContent = 'Khá tin cậy';
            confidenceStatus.className = 'status-badge good';
          }
          if (confidenceLevel) {
            confidenceLevel.textContent = 'Trung bình';
            confidenceLevel.className = 'metric-value medium';
          }
          if (confidenceRating) {
            confidenceRating.textContent = 'B+';
          }
          confidenceCard.classList.remove('high-confidence');
        } else {
          // Low Confidence
          confidenceText.style.color = '#EA580C'; // Warning orange
          if (confidenceStatus) {
            confidenceStatus.textContent = 'Cần cân nhắc';
            confidenceStatus.className = 'status-badge medium';
          }
          if (confidenceLevel) {
            confidenceLevel.textContent = 'Thấp';
            confidenceLevel.className = 'metric-value low';
          }
          if (confidenceRating) {
            confidenceRating.textContent = 'C+';
          }
          confidenceCard.classList.remove('high-confidence');
        }
      };
      
      // Start number animation
      setTimeout(animateNumber, 300);
    } else {
      console.warn('updateConfidenceGauge: Missing elements', { confidenceText, confidenceCard, confidenceStatus, confidenceLevel, confidenceRating });
    }
  },
  
  updateMetrics(metrics, data) {
    // ✅ FIX: Safely handle undefined values with fallbacks
    const safeNumber = (value, defaultValue = 0) => {
      const num = parseFloat(value);
      return isNaN(num) ? defaultValue : num;
    };
    
    // Update individual metrics với animation
    const predictedROI = safeNumber(metrics.predictedROI, 0);
    const predictedRevenue = safeNumber(metrics.predictedRevenue, 0);
    const budget = safeNumber(data.budget, 0);
    const voteAverage = safeNumber(data.voteAverage, 7.5);
    
    // ✅ ENHANCED: Cập nhật đầy đủ tất cả metrics
    this.updateMetricValue('predicted-roi', `${predictedROI.toFixed(2)}x`);
    this.updateMetricValue('predicted-revenue', `${(predictedRevenue / 1000000000).toFixed(1)} tỷ`);
    this.updateMetricValue('break-even', `${((budget * 1.1) / 1000000000).toFixed(1)} tỷ`);
    this.updateMetricValue('market-potential', metrics.marketPotential || 'Trung bình');
    this.updateMetricValue('risk-level', metrics.riskLevel || 'Trung bình');
    this.updateMetricValue('rating-display', voteAverage.toFixed(1));
    
    // ✅ NEW: Cập nhật metrics bổ sung nếu elements tồn tại
    this.updateMetricValue('profit-margin', metrics.profitMargin || 'N/A');
    this.updateMetricValue('investment-grade', metrics.investmentGrade || 'N/A');
    this.updateMetricValue('competition-level', metrics.competitionLevel || 'N/A');
    this.updateMetricValue('target-audience', metrics.targetAudience || 'N/A');
    this.updateMetricValue('release-strategy', metrics.releaseStrategy || 'N/A');
    
    // ✅ NEW: Hiển thị chi tiết tài chính
    if (metrics.financialBreakdown) {
      this.updateMetricValue('production-cost', `${(metrics.financialBreakdown.production / 1000000).toFixed(1)}M`);
      this.updateMetricValue('marketing-cost', `${(metrics.financialBreakdown.marketing / 1000000).toFixed(1)}M`);
      this.updateMetricValue('expected-profit', `${(metrics.financialBreakdown.expectedProfit / 1000000).toFixed(1)}M`);
      this.updateMetricValue('break-even-days', `${metrics.financialBreakdown.breakEvenDays} ngày`);
    }
    
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
    
    // ✅ FIX: Safely parse ROI with fallback
    const roi = parseFloat(metrics.predictedROI) || 0;
    
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
    // ✅ FIX: Safely handle budget (already in USD from input)
    const budgetInBillions = (parseFloat(data.budget) || 0) / 1000000000;
    
    if (budgetInBillions > 0 && budgetInBillions < 0.03) {
      insights.push({
        type: 'warning',
        icon: '💰',
        title: 'Ngân Sách Hạn Chế',
        description: `Với ngân sách ${budgetInBillions.toFixed(2)} tỷ, cần tập trung vào marketing hiệu quả và chọn lựa diễn viên phù hợp.`
      });
    } else if (budgetInBillions > 0.1) {
      insights.push({
        type: 'positive',
        icon: '💎',
        title: 'Ngân Sách Lớn',
        description: `Ngân sách ${budgetInBillions.toFixed(2)} tỷ cho phép sản xuất chất lượng cao và chiến dịch marketing rộng rãi.`
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
  
  // ✅ NEW: Show results loading animation
  showResultsLoading() {
    const loadingOverlay = document.getElementById('results-loading-overlay');
    if (loadingOverlay) {
      // ✅ NEW: Update model info in loading screen
      this.updateModelInfoInLoading();
      
      loadingOverlay.style.display = 'flex';
      // Ensure it's visible and animated
      setTimeout(() => {
        loadingOverlay.classList.add('active');
      }, 10);
    }
  },

  // ✅ NEW: Update model information displayed during loading
  updateModelInfoInLoading() {
    const modelInfoSection = document.getElementById('model-info-loading');
    if (!modelInfoSection) return;
    
    // Display model information
    const html = `
      <div class="model-info-content">
        <div class="model-header">
          <span class="model-badge">🤖 Random Forest Model</span>
        </div>
        <div class="model-details">
          <div class="model-detail-item">
            <span class="detail-label">Độ chính xác:</span>
            <span class="detail-value">99.52%</span>
          </div>
          <div class="model-detail-item">
            <span class="detail-label">Features:</span>
            <span class="detail-value">47</span>
          </div>
          <div class="model-detail-item">
            <span class="detail-label">Trạng thái:</span>
            <span class="detail-value status-active">Đang xử lý...</span>
          </div>
        </div>
        <div class="model-note">
          <small>🔍 Mô hình phân tích Vote Average (76.53%), ROI (23.47%) và 45 features khác</small>
        </div>
      </div>
    `;
    
    modelInfoSection.innerHTML = html;
  },
  
  // ✅ NEW: Hide results loading animation
  hideResultsLoading() {
    const loadingOverlay = document.getElementById('results-loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.remove('active');
      // Delay hiding to allow fade-out animation
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 300);
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
// ⚠️ DISABLED: This was causing duplicate form submissions!
// The App.handleFormSubmit() already handles loading state.
// Keeping this function would add a second event listener.
function setupLoadingState() {
  // ❌ DISABLED - Duplicate event listener removed
  // This was causing 2 POST requests to /predict
  // The main App.handleFormSubmit() already handles this
  
  console.log('ℹ️ setupLoadingState() disabled - using App.handleFormSubmit() instead');
  
  /* ORIGINAL CODE (DISABLED):
  const form = document.getElementById('prediction-form');
  const submitBtn = document.getElementById('submitBtn');
  
  if (form && submitBtn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // ... duplicate logic ...
    });
  }
  */
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

// Dark mode functions removed — site enforces a single light theme now

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

// ========== 9A. RANDOM DATA & MODAL FUNCTIONS ==========
App.showRandomDataModal = function() {
  const modal = document.getElementById('random-data-modal');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }
};

App.hideRandomDataModal = function() {
  const modal = document.getElementById('random-data-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
};

// ✅ NEW: Fill form with random data based on scenario
App.fillRandomData = function(scenario) {
  console.log('🎲 Filling random data for scenario:', scenario);
  
  // Hide modal first
  this.hideRandomDataModal();
  
  // Generate random data based on scenario
  let randomData = {};
  
  if (scenario === 'success') {
    // High vote, high budget, high revenue = Success
    const voteAvg = 8.0 + Math.random() * 1.5; // 8.0-9.5
    const budget = 50000000 + Math.random() * 150000000; // $50M-$200M
    const revenue = budget * (2.5 + Math.random() * 2.5); // 2.5x-5.0x ROI
    
    randomData = {
      title: this.getRandomMovieTitle('success'),
      voteAverage: voteAvg,
      budget: Math.round(budget),
      revenue: Math.round(revenue),
      runtime: 100 + Math.floor(Math.random() * 60), // 100-160 mins
      releaseMonth: [6, 7, 12][Math.floor(Math.random() * 3)], // Summer or Christmas
    };
  } else if (scenario === 'average') {
    // Medium vote, medium budget, medium revenue
    const voteAvg = 6.5 + Math.random() * 0.8; // 6.5-7.3
    const budget = 30000000 + Math.random() * 50000000; // $30M-$80M
    const revenue = budget * (1.0 + Math.random() * 0.5); // 1.0x-1.5x ROI
    
    randomData = {
      title: this.getRandomMovieTitle('average'),
      voteAverage: voteAvg,
      budget: Math.round(budget),
      revenue: Math.round(revenue),
      runtime: 110 + Math.floor(Math.random() * 40), // 110-150 mins
      releaseMonth: [3, 4, 9, 10][Math.floor(Math.random() * 4)], // Spring or Fall
    };
  } else if (scenario === 'failure') {
    // Low vote, low budget, low revenue
    const voteAvg = 4.5 + Math.random() * 1.0; // 4.5-5.5
    const budget = 10000000 + Math.random() * 30000000; // $10M-$40M
    const revenue = budget * (0.3 + Math.random() * 0.6); // 0.3x-0.9x ROI
    
    randomData = {
      title: this.getRandomMovieTitle('failure'),
      voteAverage: voteAvg,
      budget: Math.round(budget),
      revenue: Math.round(revenue),
      runtime: 90 + Math.floor(Math.random() * 40), // 90-130 mins
      releaseMonth: [1, 2, 5, 8][Math.floor(Math.random() * 4)], // Off-season months
    };
  }
  
  // Randomly select 1-3 genres
  const allGenres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance'];
  const numGenres = 1 + Math.floor(Math.random() * 3);
  const selectedGenres = [];
  for (let i = 0; i < numGenres; i++) {
    selectedGenres.push(allGenres[Math.floor(Math.random() * allGenres.length)]);
  }
  randomData.genres = selectedGenres;
  
  // Fill form fields
  this.fillFormWithData(randomData);
  
  // Auto-submit after a short delay
  setTimeout(() => {
    const form = document.getElementById('prediction-form');
    if (form) {
      console.log('🎬 Auto-submitting form with random data...');
      form.dispatchEvent(new Event('submit'));
    }
  }, 300);
};

// Helper: Get random movie title based on scenario
App.getRandomMovieTitle = function(scenario) {
  const successTitles = [
    'Avengers Endgame', 'Avatar', 'Titanic', 'Lion King', 'Frozen',
    'The Hive', 'Dune', 'Top Gun', 'Barbie', 'Oppenheimer'
  ];
  
  const averageTitles = [
    'The Tourist', 'Goosebumps', 'The Ring', 'Insidious', 'Lucy',
    'Pixels', 'Battleship', 'Percy Jackson', 'City of Angels', 'Aquaman'
  ];
  
  const failureTitles = [
    'Cats', 'The Emoji Movie', 'Disaster Movie', 'Birdemic', 'Gigli',
    'Movie 43', 'Madea Express', 'The Room', 'Troll 2', 'Saving Christmas'
  ];
  
  const titles = scenario === 'success' ? successTitles : 
                 scenario === 'average' ? averageTitles : failureTitles;
  
  return titles[Math.floor(Math.random() * titles.length)];
};

// Helper: Fill form with random data
App.fillFormWithData = function(data) {
  // Title
  const titleInput = document.getElementById('title');
  if (titleInput) titleInput.value = data.title;
  
  // Vote Average (range slider)
  const voteAvgInput = document.getElementById('vote_average');
  if (voteAvgInput) {
    voteAvgInput.value = data.voteAverage.toFixed(1);
    const valueDisplay = voteAvgInput.parentElement.querySelector('.range-value');
    if (valueDisplay) valueDisplay.textContent = data.voteAverage.toFixed(1);
  }
  
  // Budget (number input)
  const budgetInput = document.getElementById('budget');
  if (budgetInput) {
    budgetInput.value = data.budget;
  }
  
  // Revenue (number input)
  const revenueInput = document.getElementById('revenue');
  if (revenueInput) {
    revenueInput.value = data.revenue;
  }
  
  // Runtime (range slider)
  const runtimeInput = document.getElementById('runtime');
  if (runtimeInput) {
    runtimeInput.value = data.runtime;
    const valueDisplay = runtimeInput.parentElement.querySelector('.range-value');
    if (valueDisplay) valueDisplay.textContent = data.runtime + ' phút';
  }
  
  // Release Month
  const releaseMonth = data.releaseMonth;
  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const releaseDate = document.getElementById('release_date');
  if (releaseDate) {
    const today = new Date();
    const year = today.getFullYear();
    const day = '01';
    const month = String(releaseMonth).padStart(2, '0');
    releaseDate.value = `${year}-${month}-${day}`;
  }
  
  // Genres - click genre chips to select them
  const genresInput = document.getElementById('genres');
  if (genresInput) {
    // Clear previous selections
    document.querySelectorAll('.genre-chip.active').forEach(chip => {
      chip.classList.remove('active');
    });
    
    // Select new genres
    data.genres.forEach(genreToSelect => {
      const genreChip = document.querySelector(`.genre-chip[data-genre="${genreToSelect}"]`);
      if (genreChip) {
        genreChip.classList.add('active');
      }
    });
    
    // Update hidden genres input
    genresInput.value = data.genres.join(',');
  }
  
  console.log('✅ Form filled with random data:', data);
};

// ========== 9. INITIALIZE ALL ENHANCEMENTS ==========
function initializeEnhancements() {
  console.log('🚀 Initializing UX/UI enhancements...');
  
  // Setup all enhancements
  setupRealTimeValidation();
  setupEnhancedTooltips(); // ✅ FIXED: Use enhanced tooltips instead of old setupTooltips()
  setupLoadingState();
  // Dark mode toggle removed - app now enforces light theme
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
