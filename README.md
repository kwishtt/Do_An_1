# 🎬 Dự Đoán Độ Thành Công Phim Chiếu Rạp Tại Việt Nam

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-orange.svg)](https://jupyter.org/)
[![Pandas](https://img.shields.io/badge/Pandas-Data%20Analysis-green.svg)](https://pandas.pydata.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-blueviolet.svg)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Phần 1: Giới Thiệu

### 🎯 Vấn Đề Cần Giải Quyết

Trong ngành điện ảnh, **dự đoán thành công của một bộ phim là bài toán phức tạp** nhưng rất quan trọng. Các nhà sản xuất, nhà đầu tư và rạp chiếu cần biết:

- 💰 Liệu phim có khả năng sinh lợi?
- ⭐ Phim sẽ nhận được độ đánh giá cao từ khán giả không?
- 📊 Những yếu tố nào thực sự ảnh hưởng đến sự thành công?

**Chúng tôi giải quyết vấn đề này bằng cách:**
- Thu thập dữ liệu từ **1.020 bộ phim** (sau làm sạch)
- Xây dựng **mô hình học máy** để dự đoán khả năng thành công
- Cung cấp **công cụ trực quan** giúp quyết định dễ dàng

---

### 🎯 Mục Tiêu Dự Án

| Mục Tiêu | Kết Quả Đạt Được |
|----------|------------------|
| **Độ chính xác (Accuracy)** | ✅ **99.51%** (Vượt mục tiêu 90%) |
| **Chỉ số F1-Score** | ✅ **99.52%** (Cân bằng hoàn hảo) |
| **Ổn định mô hình (CV)** | ✅ **99.88% ± 0.14%** (Rất ổn định) |
| **Tránh overfitting** | ✅ **Train-Test gap: 0.48%** (Lý tưởng) |
| **Giải thích mô hình** | ✅ **Feature Importance rõ ràng** |

---

### 🌟 Ứng Dụng Thực Tiễn

| Người Dùng | Lợi Ích |
|-----------|---------|
| 🎬 **Nhà sản xuất** | Đánh giá khả năng thành công trước khi đầu tư |
| 💼 **Nhà đầu tư** | Quyết định chi trả dựa trên dự đoán khoa học |
| 🎪 **Rạp chiếu** | Lên kế hoạch phân phối phim phù hợp |
| 📈 **Nhà phân tích** | Hiểu rõ yếu tố nào thực sự quan trọng |

**Định nghĩa "Thành Công":**
- ✅ **Tiêu chí tài chính:** ROI ≥ 1.0 (Doanh thu ≥ Ngân sách)
- ✅ **Tiêu chí chất lượng:** Điểm đánh giá ≥ 6.5/10

---

## 📊 Phần 2: Dữ Liệu

### 📥 Nguồn Dữ Liệu

| Thông Tin | Chi Tiết |
|-----------|----------|
| **Nguồn** | The Movie Database (TMDb) - Cơ sở dữ liệu phim lớn nhất |
| **Thời gian** | Phim được phát hành từ 1990 đến 2024 |
| **Phạm vi** | Phim Việt Nam và quốc tế có liên quan thị trường Việt Nam |
| **API** | https://www.themoviedb.org/settings/api |

---

### 📈 Mô Tả Dữ Liệu

#### Kích Thước

| Giai Đoạn | Số Phim | Số Đặc Trưng |
|-----------|--------|--------------|
| Dữ liệu gốc | 2.194 | 17 |
| Sau làm sạch | 1.020 | 17 |
| Sau gắn nhãn | 1.020 | 25 |
| Sau tạo đặc trưng | 1.020 | 65 |
| **Cho mô hình** | **1.020** | **47** |

#### Các Biến Chính

**📌 Biến Mục Tiêu:**
- `success`: Phim thành công (1) hay thất bại (0)

**💰 Biến Tài Chính:**
- `budget`: Ngân sách sản xuất (triệu USD)
- `revenue`: Doanh thu toàn cầu (triệu USD)
- `roi`: Tỷ suất lợi nhuận (Revenue / Budget)

**⭐ Biến Chất Lượng:**
- `vote_average`: Điểm đánh giá trung bình (0-10)
- `vote_count`: Số lượng người đánh giá

**🎬 Biến Nội Dung:**
- `genres`: Thể loại phim (Hành động, Hài kịch, Tình cảm...)
- `runtime`: Thời lượng phim (phút)
- `production_countries`: Quốc gia sản xuất

**📅 Biến Thời Gian:**
- `release_date`: Ngày phát hành
- `release_year`: Năm phát hành
- `release_month`: Tháng phát hành

---

### 🧹 Tiền Xử Lý Dữ Liệu

| Bước | Mô Tả | Kết Quả |
|------|-------|---------|
| **Xử lý giá trị 0** | Loại bỏ phim có Budget = 0 hoặc Revenue = 0 | Giảm từ 2.194 → 1.020 phim |
| **Xử lý giá trị thiếu** | Điền 'Unknown' cho cột văn bản, trung bình cho cột số | 100% đầy đủ |
| **Chuẩn hóa ngày tháng** | Chuyển đổi sang định dạng chuẩn | Trích xuất năm/tháng/ngày |
| **Mã hóa phân loại** | One-hot encoding cho Genres, Countries | 43 cột mới |
| **Tạo đặc trưng tương tác** | `roi_vs_vote_interaction` | 3 đặc trưng mới |
| **Chuẩn hóa số liệu** | Min-Max Scaler [0, 1] | Mọi đặc trưng trong [0,1] |
| **Chia tập dữ liệu** | Stratified split 80% train / 20% test | Giữ tỷ lệ lớp |

**✅ Kết quả:** 1.020 phim × 47 đặc trưng, hoàn toàn sạch, không lỗi.

---

## 🔬 Phần 3: Phương Pháp

### 🤖 Các Mô Hình Được Thử Nghiệm

#### 1️⃣ Logistic Regression - Mô Hình Cơ Sở

**Tại sao chọn:**
- ✅ Đơn giản, dễ giải thích
- ✅ Phù hợp cho bài toán phân loại nhị phân
- ✅ Dùng làm baseline để so sánh

**Tham số chính:**
```python
LogisticRegression(
    max_iter=1000,
    random_state=42
)
```

**Kết quả:**
- Accuracy: **84.80%**
- Precision: **85.29%**
- Recall: **84.47%**
- F1-Score: **84.88%**

---

#### 2️⃣ Random Forest - Mô Hình Chính ⭐

**Tại sao chọn:**
- ✅ **Hiệu suất vượt trội** - xử lý dữ liệu phi tuyến tốt
- ✅ **Tránh overfitting** hiệu quả nhờ cơ chế ensemble
- ✅ **Cung cấp Feature Importance** - giải thích yếu tố quan trọng
- ✅ **Tốc độ tính toán chấp nhận được** cho ứng dụng thực tiễn

**Tham số chính:**
```python
RandomForestClassifier(
    n_estimators=100,      # 100 cây quyết định
    max_depth=5,           # Độ sâu tối đa của mỗi cây
    random_state=42        # Tái tạo kết quả
)
```

**Kết quả:**
- Accuracy: **99.51%**
- Precision: **99.04%**
- Recall: **100.00%** (Không bỏ lỡ phim thành công)
- F1-Score: **99.52%**

---

### 🎓 Kỹ Thuật Huấn Luyện

| Thành Phần | Chi Tiết |
|-----------|----------|
| **Hàm Mất Mát** | Gini Impurity (tối ưu phân chia trong cây) |
| **Tối Ưu Hóa** | Tối ưu hóa tự động theo thuật toán |
| **Kiểm Định Chéo** | 5-Fold Cross-Validation |
| **Chuẩn Hóa Đặc Trưng** | Min-Max Scaler [0, 1] |
| **Xử Lý Mất Cân Bằng** | Dữ liệu đã cân bằng (50.4% success) |
| **Tỷ Lệ Train/Test** | 80% huấn luyện / 20% kiểm tra |

---

## 📈 Phần 4: Kết Quả & Đánh Giá

### 🏆 So Sánh Hiệu Suất Hai Mô Hình

| Chỉ Số | Logistic Regression | Random Forest | Cải Thiện |
|-------|------------------|-----------------|----------|
| **Accuracy** | 84.80% | **99.51%** | ✅ +14.71% |
| **Precision** | 85.29% | **99.04%** | ✅ +13.75% |
| **Recall** | 84.47% | **100.00%** | ✅ +15.53% |
| **F1-Score** | 84.88% | **99.52%** | ✅ +14.64% |

---

### 📊 Ma Trận Nhầm Lẫn - Random Forest (204 phim kiểm tra)

```
                 Dự Đoán Thất Bại   |   Dự Đoán Thành Công
Thực Tế Thất Bại       100          |          1
Thực Tế Thành Công      0           |         103
```

**Phân Tích:**
- ✅ **True Negatives: 100** - Dự đoán đúng phim thất bại
- ✅ **True Positives: 103** - Dự đoán đúng phim thành công
- ⚠️ **False Positives: 1** - Dự đoán sai (nói thành công nhưng thực tế thất bại)
- ✅ **False Negatives: 0** - HOÀN HẢO! Không bỏ lỡ phim thành công

---

### 🔄 Kiểm Định Chéo (Cross-Validation 5 Fold)

| Mô Hình | F1-Score CV | Độ Lệch Chuẩn | Đánh Giá |
|---------|-------------|--------------|----------|
| Logistic Regression | 84.16% | ± 0.33% | Ổn định trung bình |
| **Random Forest** | **99.88%** | **± 0.14%** | ✅ **Rất ổn định** |

**Kiểm Tra Overfitting:**
- Train Accuracy: 99.99%
- Test Accuracy: 99.51%
- **Train-Test Gap: 0.48%** ✅ **Lý tưởng** (< 5% là tốt)

---

### 🔍 Phân Tích Đặc Trưng Quan Trọng (Feature Importance)

**Top 5 Đặc Trưng Ảnh Hưởng Lớn Nhất:**

| Xếp Hạng | Đặc Trưng | Tầm Quan Trọng | Ý Nghĩa |
|---------|----------|--------------|---------|
| 🥇 | Vote Average | **76.53%** | ⭐ Chất lượng phim là yếu tố **quyết định nhất** |
| 🥈 | ROI (tương tác) | **23.47%** | 💰 Hiệu suất tài chính cũng **rất quan trọng** |
| 🥉 | Vote Count | < 0.01% | 📊 Số lượng người đánh giá không ảnh hưởng |
| 4️⃣ | Budget | < 0.01% | 💵 Ngân sách không quyết định thành công |
| 5️⃣ | Genres / Runtime | < 0.01% | 🎬 Thể loại, thời lượng không quan trọng |

**💡 Hiểu Biết Quan Trọng:**
- ✅ **Chất lượng nội dung (Vote Average) chiếm 76.53%** → Là yếu tố **"vua"** của thành công
- ✅ **ROI và điều kiện tài chính chiếm 23.47%** → Cơ hội tài chính vẫn **quan trọng**
- ✅ **Tất cả yếu tố khác < 0.1%** → Không ảnh hưởng đến dự đoán

---

### 🚨 Phân Tích Lỗi

#### Logistic Regression: 31 lỗi / 204 phim test

| Loại Lỗi | Số Lượng | Hệ Quả |
|---------|---------|-------|
| False Negatives | 15 | ❌ Bỏ lỡ phim thành công - mất cơ hội tốt |
| False Positives | 16 | ❌ Đầu tư nhầm vào phim thất bại |

#### Random Forest: 1 lỗi duy nhất / 204 phim test

| Loại Lỗi | Số Lượng | Hệ Quả |
|---------|---------|-------|
| False Negatives | 0 | ✅ **Hoàn hảo** - Không bỏ lỡ phim thành công |
| False Positives | 1 | ⚠️ Chỉ 0.49% - Rủi ro rất thấp |

**Kết Luận:** Random Forest **đáng tin cậy** để hỗ trợ quyết định.

---

## 📁 Phần 5: Cấu Trúc Dự Án

```
Do_An/
├── 📂 data/                                    # Dữ liệu gốc và đã xử lý
│   ├── raw_Movies.csv                         # Dữ liệu gốc (2.194 phim)
│   ├── clean_movies.csv                       # Sau làm sạch (1.020 phim)
│   ├── clean_movies_with_labels.csv           # Dữ liệu + nhãn thành công
│   ├── clean_movies_features.csv              # Dữ liệu + 65 đặc trưng
│   └── pkl/                                   # Mô hình lưu (pickle)
│
├── 📂 progress/                               # Tiến độ theo 10 tuần
│   ├── week01/                                # Tuần 1: Lập kế hoạch
│   ├── week02/                                # Tuần 2: Làm sạch dữ liệu
│   │   └── cleandata.py
│   ├── week03/                                # Tuần 3: Gắn nhãn & EDA
│   │   └── crea_label.ipynb
│   ├── week04/                                # Tuần 4: Tạo đặc trưng
│   │   └── feature_engineering.ipynb
│   ├── week05/                                # Tuần 5: Huấn luyện mô hình
│   │   ├── Logistic_Regression_Model/
│   │   ├── Random_Forest_Model/
│   │   └── so_sanh_models/
│   ├── week06/                                # Tuần 6: Phân tích chi tiết
│   └── ...                                    # Các tuần tiếp theo
│
├── 📂 webs/                                   # Website dự đoán (Flask)
│   └── MoviePredict/
│       ├── app.py
│       ├── templates/
│       └── static/
│
├── 📂 docs/                                   # Tài liệu & báo cáo
│   ├── BaoCaoDoAn1_Nhom04.md
│   ├── Nhiệm-Vụ-10-Tuần.md
│   └── Phan_Tich_Toan_Dien_Du_An.md
│
├── requirements.txt                            # Thư viện Python cần cài
├── README.md                                   # File này
└── .github/copilot-instructions.md             # Hướng dẫn AI
```

---

## 💻 Cài Đặt & Chạy

### ✅ Yêu Cầu Hệ Thống
- Python 3.8+
- pip (trình quản lý gói Python)

### 📦 Cài Đặt Thư Viện

```bash
# Cài đặt tất cả thư viện cần thiết
pip install -r requirements.txt
```

### 🚀 Chạy Dự Án

#### 1️⃣ Làm sạch dữ liệu (Tuần 2)
```bash
python progress/week02/cleandata.py
```
📤 Output: `data/clean_movies.csv`

#### 2️⃣ Tạo nhãn & EDA (Tuần 3)
```bash
jupyter notebook progress/week03/crea_label.ipynb
```
📤 Output: `data/clean_movies_with_labels.csv`

#### 3️⃣ Tạo đặc trưng (Tuần 4)
```bash
jupyter notebook progress/week04/feature_engineering.ipynb
```
📤 Output: `data/clean_movies_features.csv`

#### 4️⃣ Huấn luyện mô hình (Tuần 5)
```bash
# Chia tập dữ liệu
python progress/week05/data_split.py

# Logistic Regression
python progress/week05/Logistic_Regression_Model/logistic_regression.py

# Random Forest
python progress/week05/Random_Forest_Model/random_forest.py

# So sánh mô hình
python progress/week05/so_sanh_models/model_selection.py
```

#### 5️⃣ Chạy Website Dự Đoán
```bash
cd webs/MoviePredict
python app.py
```
🌐 Truy cập: `http://localhost:5000`

---

## 🎓 Hướng Dẫn Nhóm Phát Triển

### 📌 Quy Ước Mã Nguồn
- **Python scripts:** `snake_case.py` (ví dụ: `cleandata.py`)
- **Notebook:** `.ipynb` với tiêu đề rõ ràng
- **Dữ liệu:** Lưu trong `data/` với tên mô tả
- **Báo cáo:** Tiếng Việt, format Markdown

### 🔄 Git Workflow

```bash
# 1. Pull code mới
git pull origin main

# 2. Tạo branch cho công việc
git checkout -b feature/week05-modeling

# 3. Code và test
# ... chỉnh sửa file ...

# 4. Commit thường xuyên
git add .
git commit -m "Tuần 5: Hoàn thành Random Forest model"

# 5. Push lên GitHub
git push origin feature/week05-modeling

# 6. Tạo Pull Request để merge
```

---

## 🔑 Phần 6: Kết Luận & Công Việc Tương Lai

### 📌 Tóm Tắt Kết Quả

| Kết Quả | Nội Dung |
|---------|----------|
| **Độ Chính Xác** | Random Forest đạt **99.51%** (vượt mục tiêu 90%) |
| **Yếu Tố Quan Trọng** | Vote Average (76.53%) → Chất lượng phim là **yếu tố quyết định** |
| **Ổn Định Mô Hình** | Cross-validation **99.88% ± 0.14%** → **Rất ổn định** |
| **Overfitting** | Train-Test gap **0.48%** → **Không overfitting** |
| **Ứng Dụng** | Có thể dùng để hỗ trợ quyết định đầu tư phim |

---

### ⚠️ Hạn Chế Hiện Tại

| Hạn Chế | Tác Động |
|--------|----------|
| **Dữ liệu giới hạn** | ~1.000 phim - cần nhiều hơn để tổng quát tốt hơn |
| **Chưa tính marketing** | Yếu tố tiếp thị, distribution strategy chưa được xem xét |
| **Thiếu phim Việt Nam** | Tập trung vào thị trường quốc tế, cần thêm dữ liệu địa phương |
| **Dữ liệu có độ trễ** | Không real-time, cần cập nhật định kỳ |

---

### 🚀 Công Việc Tương Lai

| Giai Đoạn | Nhiệm Vụ | Lợi Ích |
|----------|---------|---------|
| **📊 Mở rộng dữ liệu** | Thu thập thêm phim Việt Nam mới | Tăng tính chính xác cho thị trường địa phương |
| **🤖 Thử mô hình phức tạp** | XGBoost, LightGBM, Neural Networks | Hiệu suất có thể tốt hơn |
| **🔧 Tinh chỉnh siêu tham số** | GridSearchCV, RandomizedSearchCV | Tối ưu hóa mô hình |
| **📱 Hoàn thiện website** | Thêm visualization, phân tích chi tiết | Giao diện tốt hơn, dễ sử dụng |
| **📡 Triển khai** | Deploy lên cloud (AWS, Heroku) | Công khai sử dụng |
| **🌐 Xây dựng API** | RESTful API cho ứng dụng bên thứ ba | Tích hợp dễ hơn |

---

## 📞 Thông Tin & Liên Hệ

**Nhóm 04 - Khoa Học Dữ Liệu HUMG**

- 📧 Email: kforwork04@gmail.com
- 🔗 GitHub: https://github.com/kwishtt/Do_An_1
- 📚 Tài liệu: Xem folder `docs/`

---

## 📖 Tham Khảo

- Mishra, Singh & Pandey (2017): "Movie Success Prediction using Machine Learning"
- Ramesh & Venkatesan (2019): "Random Forest vs SVM for IMDb Dataset"
- scikit-learn Documentation: https://scikit-learn.org
- The Movie Database (TMDb) API: https://www.themoviedb.org/settings/api

---

<div align="center">

## 🎉 Cảm Ơn Bạn Đã Theo Dõi Dự Án Này!

Nếu bạn thấy dự án hữu ích, vui lòng **⭐ Star** repository này.

---

**Đồ Án 1 — Nhóm 04 - Khoa Học Dữ Liệu - HUMG**

*Cập nhật lần cuối: Tháng 11, 2025*

</div>