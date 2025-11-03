# 🎬 FilmPredict - Movie Success Prediction Website

## Tổng quan
FilmPredict là một ứng dụng web dự đoán thành công của phim sử dụng Machine Learning. Website được thiết kế theo phong cách Make10000Hours với hiệu ứng glassmorphism và giao diện hiện đại.

## ✨ Tính năng chính

### 🎯 Dự đoán thành công phim
- **Độ chính xác cao**: 99.52% với mô hình Random Forest
- **Phân tích đa chiều**: Budget, Rating, Runtime, Genre, và nhiều yếu tố khác
- **Kết quả chi tiết**: ROI, Revenue dự kiến, Risk Level, Market Potential

### 📊 Dashboard trực quan
- **6 loại biểu đồ tương tác**: Feature Importance, Genre Performance, Budget-ROI Correlation
- **Phân tích xu hướng**: Time Series và Distribution Analysis
- **Insights thông minh**: Gợi ý dựa trên dữ liệu đầu vào

### 🎨 Giao diện Make10000Hours-inspired
- **Glassmorphism effects**: Backdrop blur và transparent layers
- **Dark/Light theme**: Chuyển đổi theme mượt mà
- **Interactive elements**: Floating animations và hover effects
- **Mobile-first design**: Responsive hoàn toàn

## 🚀 Cài đặt và chạy

### Bước 1: Clone và cài đặt dependencies
```bash
cd /home/ktmjin/Documents/Do_An/webs/filmpredict-website
pip install -r requirements.txt
```

### Bước 2: Chạy ứng dụng
```bash
python app.py
```

### Bước 3: Truy cập website
Mở trình duyệt và truy cập: `http://localhost:5000`

## 📁 Cấu trúc dự án

```
filmpredict-website/
├── app.py                 # Flask application chính
├── requirements.txt       # Python dependencies
├── README.md             # Tài liệu dự án
├── static/
│   ├── css/
│   │   └── styles.css    # CSS với glassmorphism effects
│   └── js/
│       └── app.js        # JavaScript cho tương tác và charts
├── templates/
│   └── index.html        # Template HTML chính
└── models/               # Thư mục cho trained models (tùy chọn)
```

## 🎯 Cách sử dụng

### 1. Nhập thông tin phim
- **Thông tin cơ bản**: Tên phim, Budget, Runtime, Vote Average
- **Thể loại**: Chọn 1 hoặc nhiều genres
- **Metadata**: Production companies, Countries, Languages (tùy chọn)

### 2. Xem kết quả dự đoán
- **Prediction Badge**: Thành công/Thất bại
- **Confidence Gauge**: Độ tin cậy của dự đoán
- **Business Metrics**: ROI, Revenue, Break-even point

### 3. Phân tích biểu đồ
- **Feature Importance**: Yếu tố nào quan trọng nhất
- **Genre Performance**: Thể loại nào thành công nhất
- **Budget-ROI Correlation**: Mối quan hệ ngân sách và lợi nhuận

## 🔧 Tích hợp Model

Website hỗ trợ tích hợp với trained models từ dự án:

```python
# Đặt models trong đường dẫn:
# /home/ktmjin/Documents/Do_An/data/pkl/
# - random_forest_model.pkl
# - scaler.pkl  
# - feature_columns.pkl
```

Nếu không có trained models, website sẽ sử dụng mock model với logic heuristic.

## 🎨 Design System

### Colors
- **Primary**: #2563EB (Brand Blue)
- **Secondary**: #7C3AED (Purple)
- **Success**: #059669 (Green)
- **Background**: #FAFAFA (Light) / #0F172A (Dark)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Sizes**: 12px - 48px với scale 1.25
- **Weights**: 400, 500, 600, 700

### Effects
- **Glassmorphism**: backdrop-filter: blur(10px)
- **Shadows**: Subtle với multiple layers
- **Animations**: Smooth transitions và floating effects

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px
- **Large**: > 1280px

## 🔍 API Endpoints

### POST /predict
Dự đoán thành công phim

**Request Body:**
```json
{
  "title": "Movie Name",
  "budget": 50000000,
  "runtime": 120,
  "voteAverage": 7.5,
  "genres": ["Action", "Adventure"]
}
```

**Response:**
```json
{
  "success": true,
  "prediction": {
    "will_succeed": true,
    "confidence": 85.3,
    "success_probability": 0.853
  },
  "metrics": {
    "predicted_roi": 2.45,
    "predicted_revenue": 122500000,
    "market_potential": "Cao"
  }
}
```

### GET /api/model-info
Thông tin về model đã load

### GET /api/sample-data  
Dữ liệu mẫu để test

## 🎯 Tính năng nâng cao

### Theme Management
- Tự động detect system preference
- Lưu theme choice trong localStorage
- Smooth transition giữa themes

### Chart Interactions
- Hover effects với tooltips
- Dynamic data updates
- Theme-aware color schemes

### Form Validation
- Real-time validation
- Custom error messages
- Progressive enhancement

## 🔮 Roadmap

- [ ] **Advanced Analytics**: Thêm more chart types
- [ ] **Export Features**: PDF reports, CSV data
- [ ] **Comparison Mode**: So sánh multiple movies
- [ ] **Historical Data**: Trend analysis over time
- [ ] **User Accounts**: Save predictions, favorites
- [ ] **API Keys**: Rate limiting và authentication

## 🤝 Contributing

Dự án là part của academic coursework. Để contribute:

1. Fork the repository
2. Create feature branch
3. Commit changes với Vietnamese comments
4. Submit pull request

## 📄 License

Academic project - all rights reserved.

## 💬 Support

Để hỗ trợ hoặc báo lỗi, tạo issue trong repository hoặc liên hệ team development.

---

**Made with ❤️ by Nhóm 04 - Data Science Course**
