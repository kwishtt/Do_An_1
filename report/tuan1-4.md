# Báo Cáo Tóm Tắt Tuần 1-4: Dự Án Dự Đoán Thành Công Phim

**Nhóm 04 - KHDL HUMG**  

## Giới Thiệu Tổng Quan
Dự án "Dự Đoán Độ Thành Công Phim Chiếu Rạp Tại Việt Nam" nhằm xây dựng mô hình Machine Learning để dự đoán thành công của phim dựa trên các đặc trưng như ngân sách, thể loại, diễn viên và quốc gia sản xuất. Báo cáo này tóm tắt những gì nhóm đã thực hiện trong 4 tuần đầu, từ thu thập dữ liệu gốc đến hoàn thành feature engineering, cùng với các kết quả, bất cập và hướng giải quyết.

---

## Tuần 1: Khởi Động & Thu Thập Dữ Liệu

### Những gì đã làm
- **Thu thập dataset:** Nhận file `Movies.csv` chứa 2194 bộ phim với 17 thông tin cơ bản (tên phim, ngân sách, doanh thu, thể loại, diễn viên, đạo diễn, ngày phát hành, điểm đánh giá)
- **Phân tích dữ liệu ban đầu:** Sử dụng pandas để kiểm tra cấu trúc, kiểu dữ liệu, và phát hiện các vấn đề tiềm ẩn
- **Thống nhất tiêu chí thành công:** Họp nhóm và giảng viên để định nghĩa phim "thành công" = (ROI ≥ 1.0) AND (Vote Average ≥ 6.5)
- **Thiết lập môi trường:** Tạo cấu trúc thư mục dự án, cài đặt Python và các thư viện cần thiết

### Kết quả đạt được
- **Dataset sẵn sàng:** File `Movies.csv` với 2194 hàng × 17 cột, không có lỗi đọc file
- **Hiểu rõ dữ liệu:** Phát hiện 1173 phim có Budget/Revenue = 0, định dạng Genres phức tạp, 953 phim thiếu thông tin diễn viên/đạo diễn
- **Tiêu chí rõ ràng:** Toàn nhóm thống nhất định nghĩa thành công dựa trên cả yếu tố tài chính (ROI) và chất lượng (Vote Average)
- **Môi trường ổn định:** Cấu trúc thư mục có tổ chức, requirements.txt sẵn sàng

### Bất cập gặp phải
- **Thiếu kinh nghiệm quản lý nhóm:** Cuộc họp đầu tiên kéo dài, khó đạt consensus
- **Dữ liệu phức tạp:** Genres ở dạng string list "['Action', 'Drama']" khó xử lý
- **Chưa rõ hướng xử lý:** Chưa biết cách handle 1173 hàng có giá trị 0

### Hướng giải quyết
- **Áp dụng Agile:** Thiết lập agenda rõ ràng cho các cuộc họp tiếp theo
- **Ghi chú chi tiết:** Document tất cả quyết định để tham khảo sau
- **Lên kế hoạch preprocessing:** Chuẩn bị strategy cho tuần 2

---

## Tuần 2: Làm Sạch Dữ Liệu Cơ Bản

### Những gì đã làm
- **Xử lý giá trị 0:** Loại bỏ 1173 hàng có Budget hoặc Revenue = 0 vì không thể tính ROI chính xác
- **Xử lý missing values:** Điền 'Unknown' cho cột text (Director, Stars), điền mean cho cột số (Runtime)
- **Chuẩn hóa datetime:** Chuyển Release Date sang định dạng datetime chuẩn
- **Tạo script tự động:** Viết `cleandata.py` để có thể reproduce quá trình cleaning

### Kết quả đạt được
- **Dataset sạch:** File `clean_movies.csv` với 1020 hàng (giảm 53% nhưng chất lượng cao)
- **Không còn missing values:** 100% dữ liệu đầy đủ trong các cột quan trọng
- **Định dạng thống nhất:** Release Date ở dạng datetime, có thể extract features thời gian
- **Process reproducible:** Script `cleandata.py` có thể chạy lại với dataset khác

### Lưu ý quan trọng
- **Chất lượng > Số lượng:** Quyết định xóa 53% dữ liệu để đảm bảo tính chính xác của ROI
- **Strategy điền missing:** 'Unknown' cho text giúp model biết đây là thông tin thiếu
- **Graceful error handling:** Sử dụng `errors='coerce'` để xử lý datetime lỗi

### Bất cập gặp phải
- **Tranh cãi trong nhóm:** Một số thành viên lo ngại mất quá nhiều dữ liệu
- **Performance chậm:** Script ban đầu chạy >30 giây do loop không tối ưu
- **Datetime parsing lỗi:** 1 giá trị không parse được

### Hướng giải quyết
- **Demo thực nghiệm:** So sánh kết quả khi điền vs xóa dữ liệu, chứng minh xóa là đúng
- **Tối ưu code:** Thay loop bằng vectorized operations, giảm thời gian xuống <5 giây
- **Accept minimal loss:** 1 giá trị lỗi (<0.1%) không đáng kể, giữ nguyên

---

## Tuần 3: Tạo Nhãn Thành Công & EDA Cơ Bản

### Những gì đã làm
- **Tính ROI:** ROI = Revenue / Budget cho 1020 phim còn lại
- **Tạo nhãn success:** Áp dụng công thức (ROI ≥ 1.0) AND (Vote Average ≥ 6.5)
- **Extract time features:** Tạo release_year, release_month, release_weekday từ Release Date
- **EDA visualization:** Vẽ 3 biểu đồ chính - phân bố ROI, budget theo success, success rate theo genres

### Kết quả đạt được
- **Target variable cân bằng:** 514 phim success vs 506 phim fail (tỷ lệ 1.01:1)
- **Dataset với nhãn:** File `clean_movies_with_labels.csv` với 1020 hàng × 25 cột
- **Insights quan trọng:** Action/Adventure có success rate cao nhất, phim gần đây thành công hơn
- **Time features:** 3 cột thời gian mới để phân tích seasonal patterns

### Lưu ý quan trọng
- **Class balance tuyệt vời:** Không cần SMOTE hay class resampling techniques
- **ROI distribution:** Đa số phim có ROI 0.2-0.8, chỉ 40% phim thực sự lãi
- **Seasonal insights:** Mùa hè và lễ hội có xu hướng thành công cao hơn

### Bất cập gặp phải
- **Ngưỡng Vote Average:** Tranh luận về 6.5 có quá cao so với phim Việt Nam
- **Outlier trong ROI:** Một số phim có ROI cực cao làm skew distribution
- **Genre analysis phức tạp:** Khó so sánh vì mỗi phim có nhiều genres

### Hướng giải quyết
- **Test multiple thresholds:** Thử 6.0, 6.5, 7.0 và chọn 6.5 vì balanced nhất
- **Log-scale visualization:** Sử dụng log cho budget để thấy pattern rõ hơn
- **Top genres focus:** Chỉ phân tích top 10 genres phổ biến nhất

---

## Tuần 4: Feature Engineering

### Những gì đã làm
- **Time features mở rộng:** Thêm release_quarter, is_holiday_season (5 features từ Release Date)
- **Runtime processing:** Nhóm thành 5 categories, tạo runtime_minutes, runtime_hours
- **Cast counting:** Parse cột Stars để đếm số diễn viên chính (num_main_cast)
- **Categorical encoding:** One-hot encode top 15 genres và top 10 countries
- **Numerical transformations:** Log-transform Budget/Revenue, clip ROI outliers
- **Interaction features:** Tạo budget_per_year, roi_vs_vote, cast_genre_interaction

### Kết quả đạt được
- **Dataset modeling-ready:** File `clean_movies_features.csv` với 1020 hàng × 65 cột
- **Feature diversity:** 40+ numerical features covering time, categorical, interactions
- **Robust parsing:** Xử lý thành công 100% dữ liệu genres/countries phức tạp
- **Quality validated:** Không missing values, distributions hợp lý, ready cho ML algorithms

### Lưu ý quan trọng
- **Dimensionality control:** 65 features với 1020 samples = ratio 15:1 (acceptable)
- **Feature selection needed:** Sẽ dùng Random Forest feature importance ở tuần 5
- **Business logic driven:** Mỗi feature đều có justification từ domain knowledge

### Bất cập gặp phải
- **Complex string parsing:** Multiple formats cho genres/countries gây khó khăn
- **Curse of dimensionality risk:** 65 features có thể gây overfitting
- **Interaction features questionable:** Một số interactions không có business logic rõ ràng
- **Memory usage:** Processing 65 features cần optimize memory

### Hướng giải quyết
- **Hybrid parsing approach:** Try JSON parsing trước, fallback to regex splitting
- **Plan feature selection:** Random Forest feature importance cho tuần 5
- **Validate interactions:** Sẽ check correlation với target, remove nếu không significant
- **Memory optimization:** Sử dụng appropriate dtypes (int8 cho binary features)

---

## Đánh Giá Tiến Độ
- **Hoàn thành:** 100% Tuần 1-4 (4/10 tuần), đúng kế hoạch. Pipeline từ data thô → features sạch, không delay.
- **Điểm mạnh:** Chất lượng dữ liệu cao, visualization tốt, documentation chi tiết.
- **Điểm yếu:** Mất thời gian cho preprocessing (40% effort), cần tối ưu automation.

---

## Bài Học Rút Ra
- **Preprocessing quan trọng:** 80% success của ML nằm ở data quality; xử lý NaN/outlier sớm tránh lỗi sau.
- **Domain knowledge:** Hiểu phim (ROI, genres) giúp feature engineering hiệu quả hơn random.
- **Collaboration:** Git/PR giúp tránh conflict, họp định kỳ tăng hiệu quả.
- **Visualization:** Biểu đồ không chỉ đẹp, mà phát hiện insights (vd: genres impact).

---

## Định Hướng Cho Giai Đoạn Tiếp Theo (Tuần 5-8)
- **Tuần 5:** Modeling baseline (Logistic Regression: dự kiến Accuracy ~85%, F1 ~85%) và chính (Random Forest: mục tiêu Accuracy >95%, F1 >95%), đánh giá với metrics chính: Accuracy, F1-Score, ROC-AUC.
- **Tuần 6:** Feature importance từ RF, so sánh models.
- **Tuần 7:** Xử lý imbalance nếu cần, error analysis.
- **Tuần 8:** Cross-validation, ổn định model.
- **Mục tiêu:** Hoàn thành model cuối với Accuracy >95%, F1 >95%, ROC-AUC >0.95, vượt baseline Logistic ~85%.
- **Rủi ro:** Overfitting với nhiều features; giải pháp: CV, regularization.
- **Kế hoạch:** Tăng automation (scripts), test trên unseen data, review weekly.

---

## Quản Lý Nhóm: Phân Công Công Việc Tuần 1-4

| Thành Viên | Vai Trò Chính | Công Việc Tuần 1 | Công Việc Tuần 2 | Công Việc Tuần 3 | Công Việc Tuần 4 |
|------------|---------------|-------------------|-------------------|-------------------|-------------------|
| Khổng Thị Hoà | Leader | Họp nhóm, thống nhất tiêu chí | Thiết lập môi trường, Xử lý missing, clean data, Lưu dataset sạch | EDA | Họp nhóm review features |
| Phan Văn Huy | EDA/Visualization | Phân tích data gốc | Điền NaN, chuyển datetime | Vẽ biểu đồ, thống kê, Tổng hợp EDA | Parse strings, one-hot |
| Đinh Ngọc Khuê | Modeling Prep/Documentation | Viết báo cáo tuần 1, Ghi chú quyết định | | Tạo nhãn, Tính ROI, thêm features | Feature engineering, Tạo features kết hợp, Kiểm tra reproducibility |

**Người đảm nhận chính từng tuần:** Tuần 2 - Khổng Thị Hoà, Tuần 3 - Phan Văn Huy, Tuần 4 - Đinh Ngọc Khuê.

---

---

## Quản Lý Nhóm & Phân Công

### Cơ Cấu Nhóm
**Thành viên:** 2 người với vai trò rõ ràng

**Khổng Thị Hoà** - Team Leader & Data Cleaning Specialist
- **Vai trò chính:** Quản lý tiến độ, điều phối cuộc họp, chuyên trách data cleaning
- **Tuần 2 đảm nhận:** Viết và tối ưu `cleandata.py`, xử lý missing values và outliers
- **Kết quả:** Dataset từ 2194 → 1020 hàng với chất lượng cao

**Đinh Ngọc Khuê** - Modeling Prep & Feature Engineering Specialist  
- **Vai trò chính:** Chuẩn bị dữ liệu cho modeling, chuyên trách feature engineering
- **Tuần 4 đảm nhận:** Phát triển `feature_engineering.ipynb`, tạo 65 features
- **Kết quả:** Dataset modeling-ready với features đa dạng

### Phương Pháp Quản Lý
- **Daily standups:** Check-in ngắn 15 phút qua Discord
- **Weekly review:** Họp 1 giờ để review kết quả và plan tuần tiếp theo
- **Documentation:** Mỗi tuần có file .md tổng kết trong progress/
- **Code review:** Sử dụng GitHub PR để review code trước khi merge

### Thành Tựu Quản Lý
- **100% deadline:** Không trễ hạn bài tập nào trong 4 tuần
- **Quality assurance:** Mỗi output đều được review bởi cả 2 thành viên
- **Knowledge sharing:** Thành viên khác luôn hiểu được công việc của đồng đội

---

## Kế Hoạch Tương Lai (Tuần 5-10)

### Tuần 5: Data Splitting & Cross-Validation
**Mục tiêu:** Chia dataset train/test và thiết lập K-fold CV
- **Deliverables:** Train/test split 80/20, 5-fold CV setup, baseline metrics
- **Timeline:** 7 ngày, đã có foundation từ tuần 1-4

### Tuần 6-8: Model Training & Evaluation
**Approach:** So sánh 3 algorithms chính
- **Logistic Regression:** Baseline interpretable model
- **Random Forest:** Tree-based ensemble method  
- **Support Vector Machine:** Non-linear classification
- **Evaluation:** Accuracy, Precision, Recall, F1-score, ROC-AUC

### Tuần 9: Model Selection & Optimization
**Focus:** Hyperparameter tuning và feature selection
- **Grid Search:** Tối ưu hyperparameters cho model tốt nhất
- **Feature importance:** Chọn features quan trọng nhất
- **Final model:** Production-ready classifier

### Tuần 10: Deployment & Documentation
**Deliverables:** Complete project với báo cáo cuối
- **Model deployment:** Streamlit app cho demo
- **Final report:** Comprehensive documentation
- **Presentation:** 15-minute team presentation

---

## Tổng Kết 4 Tuần Đầu

### Achievements Chính
✅ **Dataset chất lượng cao:** 1020 hàng × 65 features, sẵn sàng cho ML
✅ **Team coordination:** Phân công rõ ràng, không trễ deadline
✅ **Technical foundation:** Codebase clean, reproducible, well-documented  
✅ **Domain understanding:** Hiểu rõ business logic và movie industry insights

### Lessons Learned
- **Quality > Quantity:** Xóa 53% dữ liệu nhưng đảm bảo chính xác của ROI
- **Team communication:** Daily standups ngắn hiệu quả hơn weekly meetings dài
- **Domain knowledge important:** Understanding movie success factors giúp engineer features tốt hơn
- **Documentation crucial:** Ghi chép chi tiết giúp trace back decisions

### Confidence Level cho Tuần 5-10
**High confidence (90%):** Data pipeline solid, team đã sync tốt
**Medium confidence (70%):** Model performance - dataset nhỏ có thể limit accuracy
**Planning mitigation:** Sẽ focus vào feature engineering thêm và ensemble methods nếu single models không đủ tốt

---

## Appendix: Technical Specifications

### Data Pipeline Summary
```
Movies.csv (2194×17) 
→ cleandata.py → clean_movies.csv (1020×17)
→ EDA + labeling → clean_movies_with_labels.csv (1020×25) 
→ feature_engineering.ipynb → clean_movies_features.csv (1020×65)
```

### Key Features Engineered (65 total)
- **Time features (5):** year, month, weekday, quarter, holiday_season
- **Runtime features (3):** category, minutes, hours  
- **Cast feature (1):** num_main_cast
- **Genre encoding (15):** Binary columns for top genres
- **Country encoding (10):** Binary columns for top countries
- **Financial features (4):** budget_log, revenue_log, roi, roi_clipped
- **Interaction features (3):** budget_per_year, roi_vs_vote, cast_genre_interaction
- **Original features (24):** Retained từ clean dataset

### Success Criteria Validation
- **ROI ≥ 1.0:** Phim sinh lời (business perspective)
- **Vote Average ≥ 6.5:** Chất lượng trên trung bình (audience perspective)  
- **Result:** 514 success vs 506 fail (balanced classes)

**Kết Luận:** Tuần 1-4 đã xây dựng nền tảng vững chắc, với dataset sạch và features phong phú. Nhóm sẵn sàng cho modeling, kỳ vọng model tốt cho dự đoán phim. Nếu cần chỉnh sửa, liên hệ nhóm.