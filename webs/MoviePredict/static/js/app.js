/**
 * MoviePredict - Cinematic Dark Theme Logic
 */

const App = {
  init() {
    this.setupEventListeners();
    this.setupCharts();
    this.renderGenreChips();
  },

  setupEventListeners() {
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

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
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

      if (result.success) {
        this.showResults(result);
      } else {
        alert('Có lỗi xảy ra: ' + result.error);
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Đã có lỗi xảy ra khi kết nối tới server.');
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
    const prediction = data.prediction;
    const metrics = data.metrics;

    // Main Status
    const statusEl = document.getElementById('prediction-status');
    const descEl = document.getElementById('prediction-desc');
    const badgeEl = document.getElementById('confidence-badge');

    if (prediction.will_succeed) {
      statusEl.innerHTML = '<i class="fas fa-check-circle"></i> <span>THÀNH CÔNG</span>';
      statusEl.className = 'prediction-status success';
      descEl.textContent = `Phim có tiềm năng thành công cao với xác suất ${prediction.confidence}%`;
    } else {
      statusEl.innerHTML = '<i class="fas fa-times-circle"></i> <span>RỦI RO CAO</span>';
      statusEl.className = 'prediction-status danger';
      descEl.textContent = `Dự án có rủi ro cao, xác suất thành công chỉ ${prediction.confidence}%`;
    }
    badgeEl.textContent = `${prediction.confidence}%`;

    // Metrics
    document.getElementById('roi-value').textContent = metrics.predictedROI + 'x';
    document.getElementById('risk-value').textContent = metrics.riskLevel;

    // Render Chart
    this.renderFeatureChart(data.feature_importance);
  },

  setupCharts() {
    // Global Chart Defaults for Dark Theme
    Chart.defaults.color = '#a0a0b0';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    Chart.defaults.font.family = "'Inter', sans-serif";
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
          label: 'Mức Độ Ảnh Hưởng (%)',
          data: values,
          backgroundColor: 'rgba(0, 242, 255, 0.6)',
          borderColor: '#00f2ff',
          borderWidth: 1,
          borderRadius: 5
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10, 10, 15, 0.9)',
            titleColor: '#fff',
            bodyColor: '#a0a0b0',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          y: {
            grid: { display: false }
          }
        }
      }
    });
  },

  fillRandomData() {
    document.getElementById('title').value = 'Phim Test ' + Math.floor(Math.random() * 100);
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
