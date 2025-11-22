/**
 * MoviePredict - Cinematic Dark Theme Logic
 */

const App = {
  init() {
    this.setupEventListeners();
    this.setupCharts();
    this.renderGenreChips();
    this.setupScrollAnimations();
    this.setupModal();
    this.setupParticles();
    this.setupNavbar();
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

    // Active link tracking on scroll
    const sections = document.querySelectorAll('section[id]');

    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-100px 0px -66%'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

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
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = 'rgba(0, 242, 255, 0.3)'; // Neon Cyan
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = Math.min(window.innerWidth / 10, 100); // Responsive count
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

        // Draw connections
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(112, 0, 255, ${0.1 - distance / 1500})`; // Purple lines
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  },

  journeyData: {
    1: {
      title: "Giai Đoạn 1: Thu Thập Dữ Liệu",
      details: "Sử dụng thư viện <strong>BeautifulSoup</strong> để crawl dữ liệu từ IMDb và <strong>TMDB API</strong> để lấy thông tin chi tiết. Tổng hợp được dataset gồm 2,000+ bộ phim với 15 trường thông tin.",
      issues: "Gặp vấn đề về <strong>Rate Limit</strong> của API và cấu trúc HTML không đồng nhất trên IMDb.",
      solutions: "Sử dụng kỹ thuật <strong>Backoff Strategy</strong> (đợi 1s sau mỗi request) và viết các hàm parser linh hoạt để xử lý ngoại lệ."
    },
    2: {
      title: "Giai Đoạn 2: Xử Lý & Làm Sạch",
      details: "Thực hiện Data Cleaning: Xử lý missing values (điền trung vị cho budget), loại bỏ các phim có doanh thu = 0. Feature Engineering: Tạo cột <strong>ROI</strong> và chuẩn hóa đơn vị tiền tệ.",
      issues: "Dữ liệu bị nhiễu (Outliers) ở các phim bom tấn và phim độc lập kinh phí thấp.",
      solutions: "Sử dụng phương pháp <strong>IQR (Interquartile Range)</strong> để phát hiện và xử lý ngoại lai, đồng thời log-transform các biến số lớn."
    },
    3: {
      title: "Giai Đoạn 3: Huấn Luyện Mô Hình",
      details: "Chia tập dữ liệu Train/Test (80/20). Thử nghiệm các thuật toán: Linear Regression, SVM, Random Forest. Sử dụng <strong>GridSearchCV</strong> để tối ưu tham số.",
      issues: "Mô hình ban đầu bị <strong>Overfitting</strong> trên tập train (99%) nhưng thấp trên tập test.",
      solutions: "Điều chỉnh độ sâu của cây (max_depth), tăng số lượng cây (n_estimators) và sử dụng Cross-Validation để đánh giá khách quan."
    },
    4: {
      title: "Giai Đoạn 4: Xây Dựng Ứng Dụng",
      details: "Backend: Flask API để serve model. Frontend: HTML5/CSS3 với thiết kế Glassmorphism. Tích hợp Chart.js để vẽ biểu đồ Feature Importance.",
      issues: "Giao diện ban đầu chưa responsive và thiếu tính tương tác.",
      solutions: "Áp dụng <strong>Mobile-First Design</strong>, sử dụng CSS Grid/Flexbox và thêm các hiệu ứng Animation/Glow để tăng trải nghiệm người dùng."
    }
  },

  setupModal() {
    const modal = document.getElementById('journey-modal');
    const closeBtn = document.querySelector('.modal-close');
    const overlay = document.querySelector('.modal-overlay');

    if (!modal) return;

    // Open Modal
    document.querySelectorAll('.clickable[data-stage]').forEach(item => {
      item.addEventListener('click', () => {
        const stageId = item.getAttribute('data-stage');
        const data = this.journeyData[stageId];

        if (data) {
          document.getElementById('modal-title').textContent = data.title;
          document.getElementById('modal-details').innerHTML = data.details;
          document.getElementById('modal-issues').innerHTML = data.issues;
          document.getElementById('modal-solutions').innerHTML = data.solutions;

          modal.classList.remove('hidden');
          // Small delay to allow display:flex to apply before adding active class for transition
          requestAnimationFrame(() => {
            modal.classList.add('active');
          });
        }
      });
    });

    // Close Modal Function
    const closeModal = () => {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300); // Wait for transition
    };

    // Close Events
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Escape Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  },

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('scroll-hidden');
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('.timeline-item');
    items.forEach(el => {
      el.classList.add('scroll-hidden'); // Hide initially via JS
      observer.observe(el);
    });
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

    // Mouse Glow Effect
    document.querySelectorAll('.glass-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
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
      descEl.textContent = `Phim có tiềm năng thành công cao với xác suất ${prediction.confidence}% `;
    } else {
      statusEl.innerHTML = '<i class="fas fa-times-circle"></i> <span>RỦI RO CAO</span>';
      statusEl.className = 'prediction-status danger';
      descEl.textContent = `Dự án có rủi ro cao, xác suất thành công chỉ ${prediction.confidence}% `;
    }
    badgeEl.textContent = `${prediction.confidence}% `;

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
