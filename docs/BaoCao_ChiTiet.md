# Báo Cáo Dự Án: Dự Đoán Độ Thành Công Phim Chiếu Rạp

**Nhóm 04 - Khoa Học Dữ Liệu HUMG**  
**Thời gian thực hiện:** Tuần 1-5 (10/2024 - 11/2024)  
**Mục tiêu:** Xây dựng mô hình Machine Learning dự đoán thành công của phim

---

## TỔNG QUAN DỰ ÁN

### Mục Tiêu Nghiên Cứu
Phát triển mô hình dự đoán nhị phân để xác định khả năng thành công của một bộ phim, hỗ trợ các nhà sản xuất và nhà đầu tư đưa ra quyết định kinh doanh thông minh.

### Thống Kê Dataset
- **Tổng số phim:** 1,020 bộ phim (quốc tế + Việt Nam)
- **Số features:** 47 đặc trưng (sau feature engineering)
- **Phân phối target:** Cân bằng giữa thành công/không thành công
- **Tiêu chí thành công:** ROI ≥ 1.0 VÀ Vote Average ≥ 6.5

---

## QUY TRÌNH THỰC HIỆN

### Giai Đoạn 1: Phân Tích Dữ Liệu (Tuần 1-4)

**Công việc đã hoàn thành:**
- **Làm sạch dữ liệu:** Xử lý missing values, outliers, chuẩn hóa định dạng
- **Feature Engineering:** Tạo 47 features từ dữ liệu gốc
  - Thời gian: `release_year`, `release_month`, `release_quarter`
  - Tài chính: `roi`, `roi_clipped`, `budget_per_year`
  - Nội dung: `num_genres`, `num_main_cast`
  - Features độc đáo: `roi_vs_vote`, `cast_genre_interaction`

**Bài học rút ra được:**
- **Chất lượng hơn số lượng:** Focus vào features có ý nghĩa thay vì tạo nhiều features
- **Học cách đọc dữ liệu:** Biết dữ liệu nào là quan trọng, hiểu domain knowledge về ngành phim
- **Làm rõ định nghĩa "thế nào là phim thành công":** Định nghĩa rõ ràng tiêu chí thành công là nền tảng
- **Tạo các đặc trưng mới từ dữ liệu thô:** Phân tích dữ liệu gốc và tạo các feature phục vụ cho bước test mô hình

### Giai Đoạn 2: Xây Dựng Mô Hình (Tuần 5)

**Mục tiêu:** Dự đoán tỷ lệ phim thành công/không thành công bằng ROI và Vote Average.

**Lựa chọn mô hình:**

1. **Logistic Regression (Baseline)**
   - Phân loại nhị phân (thành công/không thành công)
   - Mô hình đơn giản, dễ hiểu và triển khai
   - Tham khảo: Sparviero, Sergio (2015) – "The Business Model of the Media Industries", Media Industries Journal, Vol. 2(1); Zhang & Luo (2011) – "Predicting Movie Box Office with Machine Learning Techniques", International Journal of Computer Applications

2. **Random Forest (Main Model)**
   - Mạnh mẽ hơn Logistic Regression
   - Xử lý tốt dữ liệu phi tuyến tính và tương tác phức tạp giữa các biến (phù hợp với các feature có mối quan hệ phi tuyến, tương tác chéo đã tạo ra)
   - Tham khảo: Mishra, Singh & Pandey (2017), Ramesh & Venkatesan (2019) đã chỉ ra Random Forest là "best performer" cho dữ liệu IMDb + TMDB

**Phương pháp đánh giá:**
- Chia dữ liệu: 80% Train / 20% Test
- Metrics chính: 
  - **Accuracy:** Đánh giá tổng thể độ chính xác của mô hình
  - **F1-Score:** Đánh giá mô hình có thực sự nhận diện tốt "phim thành công" trong dữ liệu mất cân bằng hay không
  - Nguồn: Sergio Sparviero (2015), Media Industries Journal, Vol. 2(1); Sundaram & Murthy (2018)
- Validation: 5-Fold Cross-Validation

---

## KẾT QUẢ CHI TIẾT

### Hiệu Suất Mô Hình

| Metric | Logistic Regression | Random Forest | Cải Thiện |
|--------|-------------------|---------------|-----------|
| Accuracy | 84.80% | **99.51%** | +14.71% |
| Precision | 85.29% | **99.04%** | +13.75% |
| Recall | 84.47% | **100.00%** | +15.53% |
| F1-Score | 84.88% | **99.52%** | +14.64% |

### Confusion Matrix - Random Forest
```
Predicted
           0    1
Actual 0 [100]  [1]   ← Chỉ 1 False Positive
Actual 1  [0] [103]   ← 0 False Negative
```

### Cross-Validation Results
- Random Forest CV F1-Score: 99.88% ± 0.14%
- Logistic Regression CV F1-Score: 84.16% ± 0.33%
- Train-Test gap: 0.48% (Không overfitting)

---

## PHÂN TÍCH FEATURE IMPORTANCE

### Top 10 Yếu Tố Quyết Định Thành Công Phim

| Rank | Feature | Importance | Ý Nghĩa |
|------|---------|------------|---------|
| 1 | Vote Average | 41.56% | Phản ánh chất lượng phim qua đánh giá của khán giả |
| 2 | roi_vs_vote | 10.70% | Biểu diễn tương quan giữa lợi nhuận và đánh giá, thể hiện yếu tố "vừa lời vừa được lòng công chúng" |
| 3 | ROI | 7.05% | Chỉ báo lợi nhuận trực tiếp của phim |
| 4 | roi_clipped | 6.27% | ROI được chuẩn hóa |
| 5 | Vote Count | 5.14% | Mức độ phổ biến |
| 6 | Revenue_log | 4.88% | Doanh thu (log scale) |
| 7 | Revenue | 3.27% | Doanh thu thô |
| 8 | runtime_minutes | 2.24% | Độ dài phim |
| 9 | budget_per_year | 1.95% | Ngân sách theo năm |
| 10 | runtime_hours | 1.88% | Độ dài phim (giờ) |

### Business Insights

Phân tích feature importance cho thấy ba đặc trưng có đóng góp cao nhất:

1. **Vote Average (41.56%):** Chất lượng phim qua đánh giá của khán giả là yếu tố quyết định quan trọng nhất
2. **roi_vs_vote (10.70%):** Tương quan giữa ROI và chất lượng thể hiện sự cân bằng lý tưởng - "vừa lời vừa được lòng công chúng"
3. **ROI (7.05%):** Lợi nhuận trực tiếp vẫn là chỉ báo quan trọng của sự thành công

---

## ĐÁNH GIÁ VÀ KẾT LUẬN

### Điểm Mạnh Của Mô Hình
- Hiệu suất xuất sắc: F1-Score 99.52%
- Không overfitting: Train-test gap chỉ 0.48%
- Ổn định cao: CV standard deviation 0.14%
- Có thể giải thích được thông qua feature importance

### Business Value
- Độ chính xác cao giúp đưa ra quyết định đầu tư chính xác
- Feature insights hướng dẫn chiến lược sản xuất
- Model robust có thể ứng dụng trong thực tế

### Khuyến Nghị

**Cho Nhà Sản Xuất:**
- Ưu tiên chất lượng script và diễn xuất (Vote Average chiếm 41.56%)
- Cân bằng giữa budget và chất lượng (roi_vs_vote = 10.70%)
- Đầu tư marketing để tăng engagement (Vote Count = 5.14%)

**Cho Nhà Đầu Tư:**
- Focus vào ROI thay vì revenue tuyệt đối
- Đánh giá tiềm năng viral của nội dung
- Xem xét track record chất lượng của team sản xuất

---

## THAM KHẢO

1. Sparviero, Sergio (2015) - "The Business Model of the Media Industries", Media Industries Journal, Vol. 2(1)
2. Zhang & Luo (2011) - "Predicting Movie Box Office with Machine Learning Techniques", International Journal of Computer Applications
3. Mishra, Singh & Pandey (2017) - Random Forest applications for IMDb data
4. Ramesh & Venkatesan (2019) - "Best performer analysis for TMDB datasets"
5. Sundaram & Murthy (2018) - Evaluation metrics for imbalanced classification

---

## THÔNG TIN NHÓM

**Nhóm 04 - Khoa Học Dữ Liệu HUMG**
- Repository: [Do_An_1](https://github.com/kwishtt/Do_An_1)
- Tech Stack: Python, Scikit-learn, Pandas, Matplotlib
- Methodology: CRISP-DM