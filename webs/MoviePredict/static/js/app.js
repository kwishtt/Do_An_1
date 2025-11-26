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
    this.setupStoryCharts();
    this.setupCounters();
  },

  setupCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseFloat(target.getAttribute('data-target'));
          this.animateValue(target, 0, endValue, 2000);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.count-up').forEach(el => observer.observe(el));
  },

  animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const current = start + (end - start) * easeOutQuart;

      if (end % 1 !== 0) {
        obj.innerHTML = current.toFixed(1);
      } else {
        obj.innerHTML = Math.floor(current);
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        if (end % 1 !== 0) {
          obj.innerHTML = end.toFixed(1);
        } else {
          obj.innerHTML = end;
        }
      }
    };
    window.requestAnimationFrame(step);
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
              '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
              '#98D8C8', '#F7DC6F', '#BB8FCE', '#F1948A'
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
                color: '#a0a0b0',
                font: { family: "'Inter', sans-serif", size: 11 },
                boxWidth: 12
              }
            }
          },
          cutout: '70%'
        }
      });
    }

    // Budget vs Revenue Scatter Plot
    const scatterCtx = document.getElementById('scatterChart');
    if (scatterCtx) {
      // Generate simulated data points
      const scatterData = [];
      for (let i = 0; i < 50; i++) {
        const budget = Math.random() * 200 + 10; // 10M - 210M
        // Revenue correlates with budget but with high variance
        const multiplier = Math.random() * 5 + 0.5; // 0.5x - 5.5x
        const revenue = budget * multiplier;
        scatterData.push({ x: budget, y: revenue });
      }

      new Chart(scatterCtx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Phim (Triệu USD)',
            data: scatterData,
            backgroundColor: 'rgba(0, 195, 255, 0.6)',
            borderColor: 'rgba(0, 195, 255, 1)',
            borderWidth: 1,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: { display: true, text: 'Ngân Sách (Triệu $)', color: '#8f90a0' },
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#8f90a0' }
            },
            y: {
              title: { display: true, text: 'Doanh Thu (Triệu $)', color: '#8f90a0' },
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#8f90a0' }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(10, 10, 15, 0.9)',
              titleColor: '#fff',
              callbacks: {
                label: function (context) {
                  return `Budget: $${context.parsed.x}M - Revenue: $${context.parsed.y.toFixed(1)}M`;
                }
              }
            }
          }
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
      title: "Tuần 1: Khởi Động & Thu Thập Dữ Liệu",
      details: "Bắt đầu với việc xác định bài toán và thu thập dữ liệu. Chúng em đã tải bộ dữ liệu <strong>Movies.csv</strong> từ Kaggle (nguồn gốc từ TMDB/IMDb) và tiến hành kiểm tra cấu trúc của hơn 2,000 bộ phim. Các trường quan trọng như Budget, Revenue, Cast, và Genres được rà soát kỹ lưỡng.",
      issues: "Dữ liệu thô ban đầu chứa nhiều nhiễu và định dạng không đồng nhất, đặc biệt là các cột tiền tệ và ngày tháng.",
      solutions: "Thống nhất quy trình xử lý dữ liệu và xác định các cột quan trọng cần giữ lại cho mô hình."
    },
    2: {
      title: "Tuần 2-3: Làm Sạch & Định Nghĩa Thành Công",
      details: "Giai đoạn quan trọng để chuẩn hóa dữ liệu. Chúng em đã xử lý <strong>1,173 hàng</strong> có Budget/Revenue bằng 0 và điền giá trị thiếu cho Director/Stars. Quan trọng nhất, nhóm đã định nghĩa tiêu chí <strong>Thành Công</strong>: Phim phải có <strong>ROI ≥ 1</strong> (không lỗ) VÀ <strong>Vote Average ≥ 6.5</strong> (được khán giả đón nhận).",
      issues: "Việc định nghĩa 'Thành công' là thách thức lớn nhất. Nếu chỉ dựa vào doanh thu sẽ bỏ qua phim nghệ thuật, nếu chỉ dựa vào điểm số sẽ bỏ qua yếu tố thương mại.",
      solutions: "Quyết định sử dụng tiêu chí kép (ROI + Rating) để đảm bảo tính toàn diện, cân bằng giữa yếu tố kinh tế và chất lượng nội dung."
    },
    3: {
      title: "Tuần 4: Feature Engineering - Biến Số Mới",
      details: "Từ dữ liệu thô, chúng em đã tạo ra <strong>47 đặc trưng mới</strong>. Các đặc trưng nổi bật bao gồm: <em>roi_vs_vote</em> (tương tác giữa lợi nhuận và điểm số), <em>num_main_cast</em> (số lượng diễn viên chính), và các đặc trưng thời gian như <em>release_quarter</em> (quý phát hành).",
      issues: "Dữ liệu có nhiều biến phân loại (Categorical) như Thể loại và Quốc gia, khó đưa trực tiếp vào mô hình.",
      solutions: "Sử dụng kỹ thuật <strong>One-Hot Encoding</strong> cho Top 15 Genres và Top 10 Countries, đồng thời Log-transform các biến số lớn như Budget/Revenue."
    },
    4: {
      title: "Tuần 5-8: Huấn Luyện & Tối Ưu Mô Hình",
      details: "Cuộc đua giữa <strong>Logistic Regression</strong> (Accuracy 84.8%) và <strong>Random Forest</strong>. Kết quả: Random Forest chiến thắng áp đảo với <strong>Accuracy 99.51%</strong> và F1-Score 99.52%. Phân tích Feature Importance cho thấy <strong>Vote Average</strong> (41.56%) là yếu tố quan trọng nhất.",
      issues: "Mô hình ban đầu có thể bị Overfitting nếu không kiểm soát tốt các tham số.",
      solutions: "Áp dụng <strong>5-Fold Cross-Validation</strong> để kiểm chứng độ ổn định và tinh chỉnh tham số (Hyperparameter Tuning) cho Random Forest."
    },
    5: {
      title: "Tuần 9-10: Hoàn Thiện Sản Phẩm",
      details: "Xây dựng Web App hoàn chỉnh sử dụng <strong>Flask</strong> và giao diện <strong>Glassmorphism</strong>. Tích hợp biểu đồ phân tích dữ liệu thực tế và đóng gói báo cáo chi tiết về toàn bộ quá trình nghiên cứu.",
      issues: "Thách thức trong việc trình bày các kết quả phân tích phức tạp một cách trực quan và dễ hiểu trên giao diện web.",
      solutions: "Sử dụng thư viện <strong>Chart.js</strong> để vẽ biểu đồ tương tác và thiết kế Dashboard khoa học, giúp người dùng dễ dàng nắm bắt thông tin."
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
    const movieTitle = document.getElementById('title').value;
    const resultTitleEl = document.getElementById('result-movie-title');
    if (resultTitleEl) {
      resultTitleEl.textContent = movieTitle ? `Phim: ${movieTitle}` : 'Phim: (Chưa đặt tên)';
    }

    const prediction = data.prediction;
    const metrics = data.metrics;

    // Main Status
    const statusEl = document.getElementById('prediction-status');
    const descEl = document.getElementById('prediction-desc');
    const badgeEl = document.getElementById('confidence-badge');

    const prob = prediction.success_probability;

    if (prob >= 0.6) {
      statusEl.innerHTML = '<i class="fas fa-check-circle"></i> <span>THÀNH CÔNG</span>';
      statusEl.className = 'prediction-status text-success';
      descEl.textContent = `Phim có tiềm năng thành công cao với xác suất ${prediction.confidence}% `;
    } else if (prob <= 0.4) {
      statusEl.innerHTML = '<i class="fas fa-times-circle"></i> <span>RỦI RO CAO</span>';
      statusEl.className = 'prediction-status text-danger';
      descEl.textContent = `Dự án có rủi ro cao, xác suất thành công chỉ ${prediction.confidence}% `;
    } else {
      statusEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>TRUNG BÌNH</span>';
      statusEl.className = 'prediction-status text-warning';
      descEl.textContent = `Phim có tiềm năng trung bình, cần cân nhắc kỹ các yếu tố. Xác suất: ${prediction.confidence}%`;
    }
    badgeEl.textContent = `${prediction.confidence}% `;

    // Metrics
    document.getElementById('roi-value').textContent = metrics.predictedROI + 'x';

    const riskEl = document.getElementById('risk-value');
    riskEl.textContent = metrics.riskLevel;
    riskEl.className = 'value'; // Reset class

    if (['Cao', 'Rất cao'].includes(metrics.riskLevel)) {
      riskEl.classList.add('text-danger');
    } else if (['Trung bình', 'Trung bình cao'].includes(metrics.riskLevel)) {
      riskEl.classList.add('text-warning');
    } else {
      riskEl.classList.add('text-success');
    }

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
