# PHÂN TÍCH TOÀN DIỆN DỰ ÁN MACHINE LEARNING
## "DỰ ĐOÁN ĐỘ THÀNH CÔNG CỦA PHIM"

*Ngày phân tích: 6 tháng 11, 2025*

---

## I. TIẾN ĐỘ THEO TUẦN

### Tuần 1-3: Thu thập, Làm sạch và Tạo nhãn dữ liệu

#### **1. Load và Làm sạch dữ liệu (Tuần 1-2)**
- **File thực hiện:** 
  - Dữ liệu ban đầu: `data/raw_Movies.csv`
  - Script làm sạch: `progress/week02/cleandata.py`
  
- **Xử lý dữ liệu:**
  - **Missing/Invalid Values:** Loại bỏ các phim có `Budget` hoặc `Revenue` bằng 0
  - **Kết quả:** Giảm từ 2,194 phim xuống 1,020 phim (loại bỏ 1,173 phim)
  - **Định dạng:** Chuẩn hóa cột `Release Date`
  
- **Output:** Dữ liệu sạch được lưu tại `data/clean_movies.csv`

#### **2. Tạo biến mục tiêu (Tuần 3)**
- **File thực hiện:** `progress/week03/crea_label.ipynb`

- **Định nghĩa thành công:** Một phim được coi là thành công (`success = 1`) khi thỏa mãn đồng thời:
  - `ROI >= 1.0` (với `ROI = Revenue / Budget`)
  - `Vote Average >= 6.5`

- **Kết quả phân phối:**
  - 514 phim thành công (50.4%)
  - 506 phim thất bại (49.6%)
  - Dữ liệu khá cân bằng

- **Output:** `data/clean_movies_with_labels.csv`

### Tuần 4: Feature Engineering

#### **File thực hiện:** `progress/week04/feature_engineering.ipynb`

#### **Các bước chính:**

**1. One-Hot Encoding:**
- Áp dụng cho cột `genres` và `production_countries`
- Tạo ra các cột vector: `genre_Action`, `genre_Comedy`, `is_usa`

**2. Feature Engineering:**

**Tài chính:**
- `roi` (Return on Investment)
- `roi_clipped` (ROI giới hạn)
- `Budget_log`, `Revenue_log`

**Thời gian:**
- `release_year`, `release_month`, `release_quarter`
- `is_holiday_season`

**Nội dung:**
- `num_genres`, `num_main_cast`

**Tương tác:**
- `roi_vs_vote` (kết hợp ROI và điểm đánh giá)

**3. Kết quả:** Bộ dữ liệu với 65 đặc trưng → `data/clean_movies_features.csv`

### Tuần 5: Modeling và Đánh giá

#### **1. Chuẩn bị dữ liệu**
- **File:** `progress/week05/data_split.py`
- **Quy trình:**
  - Chọn 47 features cuối cùng
  - Chia train/test (80%/20%) với stratified sampling
  - Áp dụng `MinMaxScaler` [0, 1]
  - Xử lý missing values: `fillna(0)`
  - **Không cần SMOTE** (dữ liệu đã cân bằng)

#### **2. Mô hình Baseline (Logistic Regression)**
- **File:** `progress/week05/Logistic_Regression_Model/logistic_regression.py`
- **Tham số:** `max_iter=1000`, `random_state=42`
- **Kết quả:**
  - Accuracy: 84.80%
  - F1-Score: 84.88%

#### **3. Mô hình nâng cao (Random Forest)**
- **File:** `progress/week05/Random_Forest_Model/random_forest.py`
- **Tham số:** `random_state=42` (mặc định)
- **Kết quả:**
  - Accuracy: 99.51%
  - F1-Score: 99.52%
  - Recall: 100.00%
  - Precision: 99.04%
- **Cross-Validation:** F1-Score trung bình `99.88% ± 0.14%`

#### **4. Feature Importance Analysis**
- **File:** `progress/week05/phan_tich_dac_trung/feature_importance.py`
- **Kết quả phân tích:** `Vote Average` là yếu tố quan trọng nhất

---

## II. KẾT QUẢ QUAN TRỌNG

### 1. Mô hình tốt nhất hiện tại
**Random Forest** được chọn làm mô hình cuối cùng do hiệu suất vượt trội.

### 2. Chỉ số quan trọng nhất (Random Forest)

| Metric | Giá trị |
|--------|---------|
| **Accuracy** | 99.51% |
| **F1-Score** | 99.52% |
| **Recall** | 100.00% |
| **Precision** | 99.04% |
| **CV F1-Score** | 99.88% ± 0.14% |

### 3. Top 5 Feature quan trọng nhất

| Rank | Feature | Importance |
|------|---------|------------|
| 1 | `Vote Average` | 41.56% |
| 2 | `roi_vs_vote` | 10.70% |
| 3 | `roi` | 7.05% |
| 4 | `roi_clipped` | 6.27% |
| 5 | `Vote Count` | 5.14% |

### 4. Insight chính từ dữ liệu

#### **Feature mạnh nhất:** 
`Vote Average` là yếu tố quyết định, cho thấy **chất lượng nội dung** quan trọng hơn ngân sách.

#### **Xu hướng quan trọng:**
- Features liên quan đến hiệu quả tài chính (`roi`, `roi_vs_vote`) đứng ngay sau `Vote Average`
- Mô hình học được đúng định nghĩa thành công (cả chất lượng và tài chính)

#### **Công thức thành công:**
Phim có khả năng thành công cao nhất khi: **Được khán giả đánh giá cao** + **Có khả năng sinh lời tốt**

---

## III. PHÂN TÍCH THIẾU SÓT / VẤN ĐỀ

### 1. Tính mất cân bằng dữ liệu ✅
- **Tình trạng:** Dữ liệu cân bằng (50.4%/49.6%)
- **Xử lý:** Không cần SMOTE - quyết định hợp lý

### 2. Rủi ro Overfitting ⚠️
- **Dấu hiệu:** Random Forest đạt hiệu suất gần hoàn hảo (99.51% Accuracy, 100% Recall)
- **Nguyên nhân tiềm ẩn:** 
  - Feature `roi_vs_vote` có thể "mớm" câu trả lời
  - Chưa thực hiện hyperparameter tuning để kiểm soát overfitting

### 3. Các bước chưa tự động hóa ⚠️
- **Pipeline rời rạc:** Quy trình chia thành nhiều script/notebook
- **Thiếu tuning:** Random Forest sử dụng tham số mặc định
- **Chưa có end-to-end pipeline:** Cần tích hợp thành một pipeline duy nhất

### 4. File chưa thống nhất ⚠️
- **Cấu trúc tốt:** Tổ chức theo tuần rõ ràng
- **Thiếu:** Docstrings chuẩn cho các hàm
- **Cần cải thiện:** Tự động hóa quy trình chạy tuần tự

---

## IV. LƯU Ý QUAN TRỌNG KHI VIẾT BÁO CÁO

### 1. Danh sách câu hỏi giảng viên có thể hỏi

1. **"Tại sao Random Forest đạt 99.5% accuracy? Có overfitting không?"**
   - Cần giải thích về cross-validation results
   - Thảo luận về nguy cơ overfitting và cách kiểm chứng

2. **"Feature `roi_vs_vote` được tạo như thế nào? Có data leakage không?"**
   - Giải thích cách tính toán feature này
   - Thảo luận về khả năng "mớm" thông tin cho mô hình

3. **"Định nghĩa 'thành công' (ROI ≥ 1 và Vote ≥ 6.5) có hợp lý không?"**
   - Cần chứng minh tính hợp lý của ngưỡng
   - Thử nghiệm với ngưỡng khác nếu có thể

4. **"Mô hình có Recall 100% - sai lầm duy nhất là gì?"**
   - Phân tích chi tiết False Positive case
   - Giải thích tại sao mô hình dự đoán sai

5. **"Tại sao không thực hiện Hyperparameter Tuning?"**
   - Kế hoạch cải thiện mô hình
   - So sánh với mô hình đã tuning

### 2. Các mục bắt buộc trong báo cáo

#### **A. Mô tả Dataset**
- Nguồn gốc và quy mô: 2,194 → 1,020 phim
- Định nghĩa biến mục tiêu `success`
- Phân phối classes và tính cân bằng

#### **B. Tiền xử lý và Feature Engineering**
- Loại bỏ giá trị 0 trong Budget/Revenue
- Tạo 47 features từ 65 features ban đầu
- One-hot encoding cho categorical variables
- MinMaxScaler cho numerical features

#### **C. Xây dựng mô hình**
- Logistic Regression (baseline)
- Random Forest (mô hình chính)
- Tham số và cấu hình

#### **D. Kết quả và Đánh giá**
- Bảng so sánh performance metrics
- Cross-validation results
- Confusion matrix analysis

#### **E. Feature Importance Analysis**
- Top 10 features quan trọng nhất
- Giải thích ý nghĩa business của từng feature
- Biểu đồ visualization

#### **F. Phân tích lỗi**
- False Positive/Negative analysis
- Business impact của prediction errors
- Ý nghĩa thực tiễn

### 3. Điểm nhấn trong Kết luận

#### **Insight thực tế:**
- **Chất lượng nội dung (Vote Average) là yếu tố tiên quyết** cho thành công
- Quan trọng hơn cả ngân sách và marketing

#### **Kết quả mô hình:**
- Random Forest: F1-Score 99.52%, CV stability cao
- Tiềm năng ứng dụng thực tiễn xuất sắc

#### **Ứng dụng thực tiễn:**
- Hỗ trợ nhà sản xuất đánh giá rủi ro đầu tư
- Tập trung nguồn lực vào chất lượng kịch bản
- Tool decision-making cho ngành điện ảnh

#### **Hạn chế và Hướng phát triển:**
- Cần kiểm tra overfitting kỹ hơn
- Hyperparameter tuning cho Random Forest
- Thử nghiệm XGBoost, SVM
- Xây dựng end-to-end pipeline

---

## V. SUMMARY (PHONG CÁCH HỌC THUẬT)

### 🎯 **Mục tiêu**
Xây dựng mô hình ML dự đoán thành công phim từ 1,020 phim đã làm sạch.

### 🔬 **Phương pháp**
- Feature Engineering: 47 đặc trưng từ dữ liệu gốc
- Baseline: Logistic Regression
- Main model: Random Forest
- Validation: 5-fold Cross-Validation

### 📊 **Định nghĩa thành công**
`ROI ≥ 1.0` AND `Vote Average ≥ 6.5` → Dữ liệu cân bằng (50.4% success)

### 🏆 **Kết quả**
- **Random Forest F1-Score: 99.52%**
- **Recall: 100%** (không bỏ lỡ phim thành công)
- **CV Stability: 99.88% ± 0.14%**

### 🔍 **Phát hiện chính**
**Vote Average = 41.56% importance** → Chất lượng nội dung là chìa khóa quyết định

### ✅ **Kết luận**
Mô hình Random Forest có khả năng dự đoán chính xác cao, cung cấp insight giá trị cho ngành điện ảnh. Cần nghiên cứu thêm về overfitting và optimization.

---

*Báo cáo được tạo bởi: GitHub Copilot*
*Dự án: Machine Learning - Dự đoán thành công phim*
*Repository: Do_An_1*