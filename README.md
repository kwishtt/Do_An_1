# 🎬 Dự Đoán Độ Thành Công Phim Chiếu Rạp (Movie Success Prediction)

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-orange.svg?style=for-the-badge&logo=jupyter&logoColor=white)](https://jupyter.org/)
[![Pandas](https://img.shields.io/badge/Pandas-Data%20Analysis-150458.svg?style=for-the-badge&logo=pandas&logoColor=white)](https://pandas.pydata.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit_Learn-Machine%20Learning-orange.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Flask](https://img.shields.io/badge/Flask-Web%20App-red.svg?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📖 Giới Thiệu (Introduction)

Dự án này là một giải pháp **Khoa học Dữ liệu (Data Science)** toàn diện nhằm giải quyết bài toán dự đoán khả năng thành công của các bộ phim chiếu rạp. Bằng cách phân tích dữ liệu lịch sử từ **The Movie Database (TMDb)**, chúng tôi xây dựng các mô hình Học máy (Machine Learning) để hỗ trợ các nhà sản xuất, nhà đầu tư và rạp chiếu phim đưa ra các quyết định kinh doanh dựa trên dữ liệu.

### 🎯 Mục Tiêu
- **Phân tích dữ liệu:** Tìm ra các yếu tố cốt lõi ảnh hưởng đến doanh thu và đánh giá của khán giả.
- **Dự đoán:** Xây dựng mô hình phân loại (Classification) để dự đoán phim sẽ "Thành công" hay "Thất bại" với độ chính xác cao.
- **Ứng dụng:** Triển khai mô hình lên giao diện Web (Web App) để người dùng dễ dàng tương tác.

---

## 📊 Dữ Liệu & Phương Pháp (Data & Methodology)

### 1. Nguồn Dữ Liệu
- **Nguồn:** TMDb API.
- **Quy mô:** 2.194 phim gốc, sau khi làm sạch còn **1.020 phim** chất lượng cao.
- **Đặc trưng (Features):** Bao gồm Ngân sách (Budget), Doanh thu (Revenue), Thể loại (Genres), Diễn viên (Cast), Đạo diễn (Crew), và đặc biệt là Điểm đánh giá (Vote Average).

### 2. Quy Trình Xử Lý
1.  **Data Cleaning:** Xử lý giá trị thiếu, loại bỏ nhiễu (phim không có doanh thu/ngân sách).
2.  **Feature Engineering:** Tạo các biến mới như ROI (Return on Investment), chuẩn hóa dữ liệu số, One-hot encoding cho dữ liệu phân loại.
3.  **Modeling:** Thử nghiệm và so sánh hai thuật toán:
    - **Logistic Regression:** Mô hình cơ sở (Baseline).
    - **Random Forest Classifier:** Mô hình chính (Ensemble Learning).

---

## 🏆 Kết Quả Đạt Được (Results)

Chúng tôi đã đạt được hiệu suất vượt trội với mô hình **Random Forest**, chứng minh tính khả thi của việc sử dụng AI trong công nghiệp điện ảnh.

| Chỉ Số (Metric) | Logistic Regression | Random Forest | Đánh Giá |
|-----------------|---------------------|---------------|----------|
| **Accuracy** | 84.80% | **99.51%** | ✅ Xuất sắc |
| **Precision** | 85.29% | **99.04%** | ✅ Rất cao |
| **Recall** | 84.47% | **100.00%** | ✅ Tuyệt đối |
| **F1-Score** | 84.88% | **99.52%** | ✅ Cân bằng |

**🔍 Insight quan trọng:**
- **Chất lượng nội dung (Vote Average)** là yếu tố quan trọng nhất (chiếm ~76% tầm quan trọng).
- **Hiệu quả tài chính (ROI)** đứng thứ hai.
- Các yếu tố như *Thể loại* hay *Thời lượng* có ảnh hưởng ít hơn dự kiến.

---

## 📂 Cấu Trúc Dự Án (Project Structure)

```
Do_An/
├── 📂 data/                  # Dữ liệu (Raw, Processed, Features)
├── 📂 docs/                  # Tài liệu báo cáo & Phân tích chi tiết
├── 📂 progress/              # Source code theo tiến độ tuần
│   ├── week02/               # Data Cleaning
│   ├── week03/               # Labeling & EDA
│   ├── week04/               # Feature Engineering
│   └── week05/               # Model Training & Evaluation
├── 📂 webs/                  # Ứng dụng Web (Flask)
│   └── MoviePredict/
├── 📜 requirements.txt       # Danh sách thư viện phụ thuộc
└── 📜 README.md              # Tài liệu hướng dẫn này
```

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng (Installation & Usage)

### Yêu cầu hệ thống
- Python 3.8 trở lên.
- Các thư viện: pandas, numpy, scikit-learn, flask, matplotlib, seaborn.

### Các bước thực hiện

1.  **Clone dự án và cài đặt thư viện:**
    ```bash
    git clone https://github.com/kwishtt/Do_An_1.git
    cd Do_An_1
    pip install -r requirements.txt
    ```

2.  **Tái lập quy trình xử lý dữ liệu (Tùy chọn):**
    ```bash
    python progress/week02/cleandata.py
    # Chạy các notebook trong folder progress/week03 và week04 để xem chi tiết EDA
    ```

3.  **Huấn luyện mô hình:**
    ```bash
    python progress/week05/Random_Forest_Model/random_forest.py
    ```

4.  **Khởi chạy Web App:**
    ```bash
    cd webs/MoviePredict
    python app.py
    ```
    Truy cập địa chỉ: `http://localhost:8000` trên trình duyệt.

---

## 👥 Thông Tin Liên Hệ (Contact)

Dự án được thực hiện bởi **Nhóm 04 - Khoa Học Dữ Liệu - HUMG**.

- **Email:** kforwork04@gmail.com
- **Repository:** [GitHub Link](https://github.com/kwishtt/Do_An_1)

---
<div align="center">
  Copyright © 2025 Team 04. All rights reserved.
</div>
