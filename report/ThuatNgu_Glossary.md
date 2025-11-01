# Từ Điển Thuật Ngữ - Dự Án Dự Đoán Thành Công Phim

**Danh sách thuật ngữ được sử dụng xuyên suốt trong dự án và báo cáo**

---

## A. THUẬT NGỮ MACHINE LEARNING

### **Accuracy (Độ Chính Xác)**
- **Định nghĩa:** Tỷ lệ số dự đoán đúng trên tổng số dự đoán
- **Công thức:** (TP + TN) / (TP + TN + FP + FN)
- **Trong dự án:** Logistic Regression: 84.80%, Random Forest: 99.51%
- **Ý nghĩa:** Đánh giá tổng thể hiệu suất mô hình

### **Baseline Model (Mô Hình Cơ Sở)**
- **Định nghĩa:** Mô hình đơn giản được dùng làm mốc so sánh
- **Trong dự án:** Logistic Regression làm baseline
- **Mục đích:** Đánh giá xem mô hình phức tạp có thực sự tốt hơn không

### **Cross-Validation (Kiểm Định Chéo)**
- **Định nghĩa:** Kỹ thuật chia dữ liệu thành nhiều phần để đánh giá mô hình
- **Trong dự án:** 5-Fold Cross-Validation
- **Ý nghĩa:** Đảm bảo mô hình ổn định, không phụ thuộc vào cách chia train/test

### **F1-Score**
- **Định nghĩa:** Trung bình điều hòa của Precision và Recall
- **Công thức:** 2 × (Precision × Recall) / (Precision + Recall)
- **Trong dự án:** Random Forest: 99.52%, Logistic: 84.88%
- **Ý nghĩa:** Metric quan trọng cho dữ liệu không cân bằng

### **Feature Engineering (Kỹ Thuật Đặc Trưng)**
- **Định nghĩa:** Quá trình tạo ra các features mới từ dữ liệu thô
- **Trong dự án:** Tạo 47 features từ dữ liệu gốc
- **Ví dụ:** `roi_vs_vote`, `cast_genre_interaction`, `budget_per_year`

### **Feature Importance (Tầm Quan Trọng Đặc Trưng)**
- **Định nghĩa:** Đo lường mức độ đóng góp của từng feature vào kết quả dự đoán
- **Trong dự án:** Vote Average (41.56%), roi_vs_vote (10.70%), ROI (7.05%)
- **Ý nghĩa:** Hiểu yếu tố nào ảnh hưởng nhất đến thành công phim

### **Hyperparameter Tuning (Tối Ưu Siêu Tham Số)**
- **Định nghĩa:** Quá trình tìm kiếm tham số tối ưu cho mô hình
- **Trong dự án:** Sử dụng RandomizedSearchCV với 50 combinations
- **Kết quả:** max_depth=5, n_estimators=100

### **Overfitting (Quá Khớp)**
- **Định nghĩa:** Mô hình học quá chi tiết trên dữ liệu training, kém generalization
- **Đánh giá:** Train-Test gap
- **Trong dự án:** Gap chỉ 0.48% (không overfitting)

### **Precision (Độ Chính Xác Dương)**
- **Định nghĩa:** Tỷ lệ dự đoán đúng trong các trường hợp dự đoán positive
- **Công thức:** TP / (TP + FP)
- **Trong dự án:** Random Forest: 99.04%

### **Recall (Độ Nhạy)**
- **Định nghĩa:** Tỷ lệ các trường hợp positive thực tế được dự đoán đúng
- **Công thức:** TP / (TP + FN)
- **Trong dự án:** Random Forest: 100.00% (Perfect Recall)

### **Random Forest**
- **Định nghĩa:** Thuật toán ensemble kết hợp nhiều decision trees
- **Ưu điểm:** Xử lý tốt dữ liệu phi tuyến, tránh overfitting
- **Trong dự án:** Main model với hiệu suất vượt trội

### **Stratified Sampling (Lấy Mẫu Phân Tầng)**
- **Định nghĩa:** Chia dữ liệu train/test giữ nguyên tỷ lệ các class
- **Trong dự án:** Đảm bảo tỷ lệ success/failure đồng đều trong train và test

---

## B. THUẬT NGỮ DOMAIN PHIM ẢNH

### **Box Office (Phòng Vé)**
- **Định nghĩa:** Doanh thu từ bán vé xem phim
- **Trong dự án:** Được đo bằng Revenue

### **Budget (Ngân Sách)**
- **Định nghĩa:** Tổng chi phí sản xuất phim
- **Trong dự án:** Feature quan trọng để tính ROI
- **Biến thể:** `Budget_log`, `budget_per_year`

### **Cast (Diễn Viên)**
- **Định nghĩa:** Danh sách diễn viên tham gia phim
- **Trong dự án:** `num_main_cast`, `cast_genre_interaction`

### **Genre (Thể Loại)**
- **Định nghĩa:** Phân loại phim theo nội dung (Action, Comedy, Drama...)
- **Trong dự án:** Tạo genre dummies, `num_genres`
- **Ví dụ:** `genre_Comedy`, `genre_Action`, `genre_Drama`

### **IMDb & TMDB**
- **Định nghĩa:** Internet Movie Database & The Movie Database
- **Vai trò:** Nguồn dữ liệu chính cho nghiên cứu phim
- **Trong dự án:** Dataset gốc từ những nguồn này

### **Revenue (Doanh Thu)**
- **Định nghĩa:** Tổng thu nhập từ phim
- **Trong dự án:** Feature chính để tính ROI
- **Biến thể:** `Revenue_log`

### **ROI (Return on Investment - Lợi Nhuận Đầu Tư)**
- **Định nghĩa:** Tỷ lệ lợi nhuận so với vốn đầu tư
- **Công thức:** Revenue / Budget
- **Trong dự án:** Tiêu chí chính để định nghĩa "thành công"
- **Biến thể:** `roi_clipped`, `roi_vs_vote`

### **Runtime (Thời Lượng)**
- **Định nghĩa:** Độ dài phim tính bằng phút hoặc giờ
- **Trong dự án:** `runtime_minutes`, `runtime_hours`, `runtime_group`

### **Vote Average (Điểm Đánh Giá Trung Bình)**
- **Định nghĩa:** Điểm đánh giá trung bình từ khán giả (thường 1-10)
- **Trong dự án:** Feature quan trọng nhất (41.56% importance)
- **Ý nghĩa:** Phản ánh chất lượng phim

### **Vote Count (Số Lượt Đánh Giá)**
- **Định nghĩa:** Tổng số người đã đánh giá phim
- **Trong dự án:** Feature thứ 5 quan trọng (5.14%)
- **Ý nghĩa:** Phản ánh mức độ phổ biến/viral

---

## C. THUẬT NGỮ DATA SCIENCE

### **Confusion Matrix (Ma Trận Nhầm Lẫn)**
- **Định nghĩa:** Bảng hiển thị kết quả dự đoán so với thực tế
- **Cấu trúc:** TP, TN, FP, FN
- **Trong dự án:** Random Forest chỉ có 1 False Positive

### **CRISP-DM**
- **Định nghĩa:** Cross-Industry Standard Process for Data Mining
- **Vai trò:** Methodology được sử dụng trong dự án
- **Các giai đoạn:** Business Understanding → Data Understanding → Data Preparation → Modeling → Evaluation → Deployment

### **EDA (Exploratory Data Analysis)**
- **Định nghĩa:** Phân tích thăm dò dữ liệu
- **Trong dự án:** Thực hiện ở tuần 3
- **Mục đích:** Hiểu phân phối, pattern, outliers trong data

### **False Negative (FN - Âm Tính Giả)**
- **Định nghĩa:** Dự đoán "không thành công" nhưng thực tế "thành công"
- **Trong dự án:** Random Forest có 0 FN (Perfect Recall)
- **Tác động:** Bỏ lỡ cơ hội đầu tư vào phim thành công

### **False Positive (FP - Dương Tính Giả)**
- **Định nghĩa:** Dự đoán "thành công" nhưng thực tế "không thành công"
- **Trong dự án:** Random Forest chỉ có 1 FP
- **Tác động:** Đầu tư nhầm vào phim thất bại

### **Min-Max Scaler**
- **Định nghĩa:** Kỹ thuật chuẩn hóa dữ liệu về khoảng [0,1]
- **Công thức:** (x - min) / (max - min)
- **Trong dự án:** Chuẩn hóa 47 features trước khi training

### **Missing Values**
- **Định nghĩa:** Giá trị bị thiếu trong dataset
- **Xử lý:** fillna(0), loại bỏ records không hợp lệ
- **Trong dự án:** Xử lý Budget=0, Revenue=0

### **Outliers**
- **Định nghĩa:** Các giá trị bất thường, khác biệt lớn so với phần còn lại
- **Xử lý:** Phát hiện và loại bỏ/điều chỉnh
- **Trong dự án:** Xử lý trong giai đoạn data cleaning

### **Train/Test Split**
- **Định nghĩa:** Chia dataset thành tập huấn luyện và tập kiểm tra
- **Trong dự án:** 80% Train / 20% Test
- **Mục đích:** Đánh giá khả năng generalization của mô hình

---

## D. THUẬT NGỮ BUSINESS

### **Business Value (Giá Trị Kinh Doanh)**
- **Định nghĩa:** Lợi ích thực tế mà mô hình mang lại cho doanh nghiệp
- **Trong dự án:** Giúp nhà sản xuất đưa ra quyết định đầu tư chính xác

### **Domain Knowledge**
- **Định nghĩa:** Hiểu biết chuyên môn về lĩnh vực cụ thể
- **Trong dự án:** Hiểu biết về ngành phim để tạo features hiệu quả

### **Engagement**
- **Định nghĩa:** Mức độ tương tác của khán giả với phim
- **Đo lường:** Vote Count, social media buzz
- **Tác động:** Ảnh hưởng đến viral marketing

### **Production Environment**
- **Định nghĩa:** Môi trường thực tế để deploy mô hình
- **Yêu cầu:** Model phải robust, stable, có thể explain được

### **Viral Marketing**
- **Định nghĩa:** Chiến lược marketing dựa trên lan truyền tự nhiên
- **Liên quan:** Vote Count feature (5.14% importance)

---

## E. THUẬT NGỮ THỐNG KÊ

### **Confidence Interval (Khoảng Tin Cậy)**
- **Định nghĩa:** Khoảng giá trị ước lượng tham số với độ tin cậy nhất định
- **Trong dự án:** CV F1-Score: 99.88% ± 0.14%

### **Standard Deviation (Độ Lệch Chuẩn)**
- **Định nghĩa:** Đo lường độ phân tán của dữ liệu
- **Trong dự án:** Random Forest có std thấp (0.14%) → ổn định

### **Stratified (Phân Tầng)**
- **Định nghĩa:** Chia dữ liệu theo tỷ lệ đại diện của từng nhóm
- **Ứng dụng:** Train/test split, Cross-validation

---

## F. THUẬT NGỮ EVALUATION

### **GridSearchCV**
- **Định nghĩa:** Tìm kiếm hyperparameters tốt nhất bằng grid search với CV
- **Trong dự án:** Thử 50 combinations trong 49.78 giây

### **RandomizedSearchCV**
- **Định nghĩa:** Tìm kiếm random trong không gian hyperparameters
- **Ưu điểm:** Nhanh hơn GridSearch, hiệu quả tương đương

### **Learning Curve**
- **Định nghĩa:** Đồ thị hiển thị hiệu suất mô hình theo kích thước training data
- **Mục đích:** Phát hiện overfitting, underfitting

### **Validation Curve**
- **Định nghĩa:** Đồ thị hiệu suất theo từng hyperparameter
- **Mục đích:** Tìm giá trị optimal cho từng parameter

---

*Danh sách này bao gồm tất cả thuật ngữ chính được sử dụng trong dự án từ tuần 1-5, giúp hiểu rõ nội dung báo cáo và kết quả nghiên cứu.*