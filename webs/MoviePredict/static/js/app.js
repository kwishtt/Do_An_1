/**
 * MoviePredict - Cinematic Dark Theme Logic
 */

const App = {
  init() {
    this.setupEventListeners();
    this.setupCharts();
    this.renderGenreChips();
    this.setupParticles();
    this.setupStoryCharts();
    this.setupScrollAnimations();
  },

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .text-reveal, .timeline-item, .simulation-card');
    elements.forEach(el => observer.observe(el));
  },

  // --- Simulation Mode Logic ---
  initSimulationMode(originalData) {
    const panel = document.getElementById('simulationPanel');
    const simBudget = document.getElementById('simBudget');
    const simRevenue = document.getElementById('simRevenue');
    const simRuntime = document.getElementById('simRuntime');
    const simVote = document.getElementById('simVote');

    // Show panel
    panel.style.display = 'block';

    // Set initial values from original prediction
    simBudget.value = originalData.budget;
    simRevenue.value = originalData.revenue || 0;
    simRuntime.value = originalData.runtime;
    simVote.value = originalData.voteAverage;

    this.updateSimDisplay(originalData.budget, originalData.revenue || 0, originalData.runtime, originalData.voteAverage);

    // Store original probability for comparison
    this.originalProb = originalData.success_probability || 0;
    document.getElementById('simScore').innerText = Math.round(this.originalProb * 100) + '%';
    document.getElementById('simDelta').innerText = '';

    // Debounce function for API calls
    const debounce = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    // Event Listeners
    const handleUpdate = () => {
      const budget = parseFloat(simBudget.value);
      const revenue = parseFloat(simRevenue.value);
      const runtime = parseInt(simRuntime.value);
      const vote = parseFloat(simVote.value);

      this.updateSimDisplay(budget, revenue, runtime, vote);
      this.runSimulation(originalData, budget, revenue, runtime, vote);
    };

    const debouncedUpdate = debounce(handleUpdate, 500); // Wait 500ms after sliding stops

    simBudget.oninput = () => this.updateSimDisplay(simBudget.value, simRevenue.value, simRuntime.value, simVote.value);
    simRevenue.oninput = () => this.updateSimDisplay(simBudget.value, simRevenue.value, simRuntime.value, simVote.value);
    simRuntime.oninput = () => this.updateSimDisplay(simBudget.value, simRevenue.value, simRuntime.value, simVote.value);
    simVote.oninput = () => this.updateSimDisplay(simBudget.value, simRevenue.value, simRuntime.value, simVote.value);

    simBudget.onchange = debouncedUpdate;
    simRevenue.onchange = debouncedUpdate;
    simRuntime.onchange = debouncedUpdate;
    simVote.onchange = debouncedUpdate;
  },

  updateSimDisplay(budget, revenue, runtime, vote) {
    document.getElementById('simBudgetVal').innerText = '$' + parseInt(budget).toLocaleString();
    document.getElementById('simRevenueVal').innerText = '$' + parseInt(revenue).toLocaleString();
    document.getElementById('simRuntimeVal').innerText = runtime + ' min';
    document.getElementById('simVoteVal').innerText = parseFloat(vote).toFixed(1);
  },

  async runSimulation(baseData, newBudget, newRevenue, newRuntime, newVote) {
    // Show loading state
    const scoreEl = document.getElementById('simScore');
    scoreEl.style.opacity = '0.5';

    try {
      // Prepare simulation payload
      const payload = {
        ...baseData, // Copy all original fields (genres, etc.)
        budget: newBudget,
        revenue: newRevenue,
        runtime: newRuntime,
        voteAverage: newVote
      };

      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        const newProb = result.prediction.success_probability;
        const percent = Math.round(newProb * 100);

        scoreEl.innerText = percent + '%';
        scoreEl.style.opacity = '1';

        // Calculate Delta
        const delta = newProb - this.originalProb;
        const deltaEl = document.getElementById('simDelta');

        if (Math.abs(delta) < 0.001) {
          deltaEl.innerText = 'No Change';
          deltaEl.className = 'sim-delta';
        } else if (delta > 0) {
          deltaEl.innerText = `+${(delta * 100).toFixed(1)}% Boost`;
          deltaEl.className = 'sim-delta positive';
        } else {
          deltaEl.innerText = `${(delta * 100).toFixed(1)}% Drop`;
          deltaEl.className = 'sim-delta negative';
        }

        // Optional: Play sound effect here
      }
    } catch (error) {
      console.error('Simulation error:', error);
      scoreEl.style.opacity = '1';
    }
  },

  setupStoryCharts() {
    // Genre Distribution Chart (Doughnut)
    const genreCtx = document.getElementById('genreChart');
    if (genreCtx) {
      new Chart(genreCtx, {
        type: 'doughnut',
        data: {
          labels: ['Action', 'Drama', 'Comedy', 'Adventure', 'Horror', 'Thriller', 'Sci-Fi', 'Romance'],
          datasets: [{
            data: [25, 20, 18, 15, 8, 7, 5, 2],
            backgroundColor: [
              '#00f2ea', '#00c3ff', '#0080ff', '#e2b714',
              '#ff8c00', '#ff4d4d', '#bfa1a1', '#ffffff'
            ],
            borderWidth: 0,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: '#94a3b8',
                font: { family: "'JetBrains Mono', monospace", size: 11 },
                boxWidth: 12
              }
            }
          },
          cutout: '75%'
        }
      });
    }
  },

  setupNavbar() {
    const nav = document.querySelector('.glass-nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    let lastScroll = 0;

    // Scroll behavior
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        nav.classList.remove('hidden');
        return;
      }

      if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        nav.classList.add('hidden');
      } else {
        // Scrolling up
        nav.classList.remove('hidden');
      }

      lastScroll = currentScroll;
    });

    // Smooth scroll on click
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 100;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  },

  setupParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2;
        this.alpha = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = `rgba(0, 242, 234, ${this.alpha})`; // Electric Teal
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = Math.min(window.innerWidth / 15, 80);
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();
  },

  setupEventListeners() {
    this.setupNavbar();

    // Form Submission
    const form = document.getElementById('prediction-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handlePrediction(e));
    }

    // Random Data
    const randomBtn = document.getElementById('randomDataBtn');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => this.fillRandomData());
    }

    // Reset
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        document.getElementById('results').classList.add('hidden');
        document.getElementById('predict').scrollIntoView({ behavior: 'smooth' });
        form.reset();
      });
    }

    // Mouse Glow Effect
    document.querySelectorAll('.glass-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Update CSS variables for glow effect if implemented in CSS
      });
    });
  },

  renderGenreChips() {
    const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
    const container = document.getElementById('genre-selector');
    const input = document.getElementById('genres');
    let selected = [];

    if (!container) return;

    genres.forEach(genre => {
      const chip = document.createElement('div');
      chip.className = 'genre-chip';
      chip.textContent = genre;
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        if (selected.includes(genre)) {
          selected = selected.filter(g => g !== genre);
        } else {
          selected.push(genre);
        }
        input.value = selected.join(',');
      });
      container.appendChild(chip);
    });
  },

  async handlePrediction(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const btnText = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');

    // Show loading state
    btnText.style.display = 'none';
    loader.style.display = 'inline-block';
    btn.disabled = true;

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      // Convert types
      data.budget = parseFloat(data.budget);
      data.revenue = parseFloat(data.revenue);
      data.voteAverage = parseFloat(data.vote_average);
      data.runtime = parseInt(data.runtime);
      data.genres = data.genres ? data.genres.split(',') : [];

      // Call API
      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      // Show results section
      document.getElementById('results').style.display = 'block';
      document.getElementById('results').scrollIntoView({ behavior: 'smooth' });

      // Initialize Simulation Mode with input data + prediction result
      const simulationData = {
        ...data, // Original inputs (genres, etc.)
        success_probability: result.prediction.success_probability
      };
      this.initSimulationMode(simulationData);

      if (result.success) {
        this.showResults(result);
      } else {
        alert('Có lỗi xảy ra: ' + result.error);
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi dự đoán: ' + error.message);
    } finally {
      // Reset button state
      btnText.style.display = 'inline-block';
      loader.style.display = 'none';
      btn.disabled = false;
    }
  },

  showResults(data) {
    const resultsSection = document.getElementById('results');
    resultsSection.classList.remove('hidden');

    // Scroll to results
    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Update UI Elements
    const movieTitle = document.getElementById('title').value;
    const resultTitleEl = document.getElementById('result-movie-title');
    if (resultTitleEl) {
      resultTitleEl.textContent = movieTitle ? `PROJECT: ${movieTitle.toUpperCase()}` : 'PROJECT: UNTITLED';
    }

    const prediction = data.prediction;
    const metrics = data.metrics;
    const prob = prediction.success_probability;

    // Update Gauge
    this.renderGauge(prob);

    // Update Text
    const probPercent = Math.round(prob * 100);
    document.getElementById('confidence-value').innerText = probPercent + '%';

    // Status Text
    const statusEl = document.getElementById('prediction-status');
    const descEl = document.getElementById('prediction-desc');

    // Determine State
    let color = '#e2b714'; // Default warning
    if (prob >= 0.6) {
      color = '#00f2ea';
      statusEl.innerHTML = `<i class="fas fa-check-circle" style="color: ${color}"></i> <span style="color: ${color}">BLOCKBUSTER POTENTIAL</span>`;
      descEl.textContent = `Dự án có tín hiệu rất tích cực. Các chỉ số cho thấy khả năng sinh lời cao.`;
    } else if (prob <= 0.4) {
      color = '#ff4d4d';
      statusEl.innerHTML = `<i class="fas fa-times-circle" style="color: ${color}"></i> <span style="color: ${color}">HIGH RISK</span>`;
      descEl.textContent = `Cảnh báo: Dự án có rủi ro cao. Cần cân nhắc lại ngân sách hoặc chiến lược.`;
    } else {
      statusEl.innerHTML = `<i class="fas fa-exclamation-circle" style="color: ${color}"></i> <span style="color: ${color}">AVERAGE</span>`;
      descEl.textContent = `Tiềm năng ở mức trung bình. Thành công phụ thuộc vào yếu tố thị trường.`;
    }

    // Update Metrics Values
    const roi = metrics.roi_category || metrics.predictedROI || 'N/A';
    const risk = metrics.risk_level || metrics.riskLevel || 'N/A';
    const revenue = metrics.estimated_revenue || metrics.predictedRevenue || 0;

    document.getElementById('roi-value').textContent = roi;
    document.getElementById('risk-value').textContent = risk;

    // Format Revenue
    const formattedRevenue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(revenue);
    document.getElementById('revenue-value').textContent = formattedRevenue;

    // Render Charts
    this.renderFeatureChart(data.feature_importance);
    this.renderRadarChart(data.input_data);
  },

  renderRadarChart(inputData) {
    const ctx = document.getElementById('radarChart').getContext('2d');

    if (this.radarChartInstance) {
      this.radarChartInstance.destroy();
    }

    // Normalize data for chart (Scale 0-100)
    // Benchmarks (Approximate values for a "Blockbuster")
    const benchmark = {
      budget: 150000000, // $150M
      runtime: 130,      // 130 mins
      vote: 7.5,         // 7.5 stars
      revenue: 400000000 // $400M
    };

    const dataValues = [
      Math.min((inputData.budget / benchmark.budget) * 100, 100),
      Math.min((inputData.runtime / benchmark.runtime) * 100, 100),
      Math.min((inputData.vote_average / benchmark.vote) * 100, 100),
      Math.min((inputData.revenue / benchmark.revenue) * 100, 100),
      Math.min((inputData.vote_average * 10) + 20, 100) // Quality Score proxy
    ];

    this.radarChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Budget Power', 'Runtime Fit', 'Audience Rating', 'Revenue Potential', 'Quality Score'],
        datasets: [{
          label: 'Your Movie',
          data: dataValues,
          backgroundColor: 'rgba(0, 229, 255, 0.2)',
          borderColor: '#00E5FF',
          pointBackgroundColor: '#00E5FF',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#00E5FF'
        }, {
          label: 'Blockbuster Avg',
          data: [80, 85, 90, 85, 90], // Ideal shape
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          borderColor: '#FFD700',
          pointBackgroundColor: '#FFD700',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#FFD700',
          borderDash: [5, 5]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            pointLabels: {
              color: '#fff',
              font: { family: "'Outfit', sans-serif", size: 12 }
            },
            ticks: { display: false, backdropColor: 'transparent' },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: {
            labels: { color: '#fff', font: { family: "'Outfit', sans-serif" } }
          }
        }
      }
    });
  },

  renderGauge(probability) {
    const ctx = document.getElementById('predictionGauge').getContext('2d');

    if (this.gaugeChart) {
      this.gaugeChart.destroy();
    }

    const value = probability * 100;
    const color = probability >= 0.6 ? '#00f2ea' : (probability <= 0.4 ? '#ff4d4d' : '#e2b714');

    this.gaugeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Success', 'Remaining'],
        datasets: [{
          data: [value, 100 - value],
          backgroundColor: [
            color,
            'rgba(255, 255, 255, 0.05)'
          ],
          borderWidth: 0,
          borderRadius: 20,
          cutout: '85%',
          circumference: 360,
          rotation: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    });
  },

  renderFeatureChart(featureData) {
    const ctx = document.getElementById('featureChart').getContext('2d');

    if (this.featureChart) {
      this.featureChart.destroy();
    }

    // Process data
    const labels = featureData.top_features.map(f => f.name);
    const values = featureData.top_features.map(f => f.importance);

    this.featureChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Importance (%)',
          data: values,
          backgroundColor: 'rgba(0, 242, 234, 0.6)',
          borderColor: '#00f2ea',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10, 14, 23, 0.9)',
            titleColor: '#fff',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace" } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#ffffff', font: { family: "'JetBrains Mono', monospace" } }
          }
        }
      }
    });
  },

  setupCharts() {
    // Global Chart Defaults for Dark Theme
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
    Chart.defaults.font.family = "'JetBrains Mono', monospace";
  },

  fillRandomData() {
    document.getElementById('title').value = 'Project Alpha ' + Math.floor(Math.random() * 100);
    document.getElementById('budget').value = Math.floor(Math.random() * 5000000) + 1000000;
    document.getElementById('revenue').value = Math.floor(Math.random() * 10000000);
    document.getElementById('vote_average').value = (Math.random() * 5 + 4).toFixed(1);
    document.getElementById('runtime').value = Math.floor(Math.random() * 60) + 90;
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
