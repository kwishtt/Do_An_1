# Đáp Án Câu Hỏi Rà Soát Kiến Thức Tuần 1-4

Dưới đây là đáp án chi tiết cho các câu hỏi trong `Cau_hoi.md`, dựa trên báo cáo và thực hiện của từng tuần. Mỗi đáp án bao gồm giải thích ngắn gọn, dẫn chứng từ báo cáo, và ý nghĩa quan trọng.

## Tuần 1: Khởi Động & Thu Thập Dữ Liệu
1. **Dự án nhằm xây dựng mô hình dự đoán thành công phim dựa trên đặc trưng như ngân sách, thể loại, diễn viên, quốc gia. Dữ liệu gốc (`Movies.csv`) bao gồm cột: Budget, Revenue, Vote Average, Release Date, Genres, Cast, Overview, Director, Stars, Production Countries, Runtime.**  
   *Giải thích:* Từ README.md và todo.md, mục tiêu chính là phân tích và ML để dự đoán success. Cột quan trọng cung cấp input cho feature engineering.

2. **Cần thống nhất tiêu chí để đảm bảo consistency trong nhóm và tránh confusion ở Tuần 3 (tạo nhãn). Ảnh hưởng: Nếu không thống nhất, nhãn success sẽ sai, dẫn đến mô hình kém chính xác.**  
   *Giải thích:* Todo.md nhấn mạnh họp giảng viên để thống nhất, đảm bảo pipeline từ EDA đến modeling nhất quán.

## Tuần 2: Làm Sạch Dữ Liệu Cơ Bản
3. **Xử lý bằng cách xác định 1173 hàng có Budget/Revenue=0, điền NaN cho cột chuỗi bằng 'Unknown', điền số bằng mean. Quan trọng vì tránh bias trong tính ROI và thống kê.**  
   *Giải thích:* Từ w02.md, xử lý này đảm bảo dữ liệu sạch, giúp Tuần 3 tính ROI chính xác và EDA không bị lỗi.

4. **Điền bằng 'Unknown' để giữ hàng, tránh mất dữ liệu. Giúp EDA ở Tuần 3 phân tích đầy đủ, như đếm missing trong Director/Stars.**  
   *Giải thích:* w02.md ghi rõ điền chuỗi, giúp dataset 1020 hàng sau xử lý, sẵn sàng cho nhãn.

5. **Cho phép trích xuất năm/tháng ở Tuần 3-4. Thống kê thiếu (1 giá trị) đảm bảo data quality, tránh lỗi datetime.**  
   *Giải thích:* w02.md chuyển datetime, thống kê NaN, chuẩn bị cho feature thời gian ở Tuần 4.

## Tuần 3: Tạo Nhãn Thành Công & EDA Cơ Bản
6. **ROI = Revenue / Budget. Dùng ≥1.0 vì đảm bảo phim lãi (không lỗ), kết hợp với chất lượng để định nghĩa success thực sự.**  
   *Giải thích:* w03.md công thức rõ, quyết định xóa hàng thiếu để ROI chính xác.

7. **Success = (ROI ≥ 1.0) AND (Vote Average ≥ 6.5). Tỷ lệ: ~50% success (514/1020), cân bằng.**  
   *Giải thích:* w03.md ngưỡng dựa trên logic kinh tế + chất lượng, imbalance ratio <3, không cần SMOTE.

8. **Phim success có ROI cao hơn, phân bố lệch phải. Log-scale cho budget vì giá trị chênh lệch lớn (triệu - tỷ), tránh outlier che biểu đồ.**  
   *Giải thích:* w03.md histogram ROI, boxplot budget, cho thấy success có budget cao hơn.

9. **Genres như Action/Adventure có tỷ lệ success cao. Ảnh hưởng: Hướng dẫn one-hot genres ở Tuần 4, tập trung top genres.**  
   *Giải thích:* w03.md bar chart top 10 genres, giúp Tuần 4 parse và encode genres hiệu quả.

## Tuần 4: Feature Engineering (Tập Trung Chi Tiết)
10. **Để capture pattern theo mùa/năm/ngày (vd: phim lễ hội success hơn). Ví dụ: release_quarter cho mùa, is_holiday_season cho tháng 11-1.**  
    *Giải thích:* w04.md thêm 5 cột, giúp mô hình học timing, tăng accuracy ~5-10% (dựa trên domain).

11. **Học sở thích khán giả (phim 1.5-2h phổ biến nhất với 642 phim). Giúp phân biệt phim ngắn/dài ảnh hưởng success.**  
    *Giải thích:* w04.md nhóm 5 loại, tạo numerical, tránh categorical issues.

12. **Parse string/list Stars, đếm số lượng. Đo lường sức hút cast (nhiều star = success cao hơn).**  
    *Giải thích:* w04.md xử lý robust, thêm cột số, cải thiện precision.

13. **Chuyển thành binary columns (vd: genre_Action=1 nếu có). Top: Action, Adventure; Countries: USA, UK. Giúp ML học categorical.**  
    *Giải thích:* w04.md one-hot top 15/10, capture preferences địa lý/thể loại.

14. **Chuẩn hóa phân bố lệch, giảm outlier impact. Giảm bias từ giá trị cực lớn, giúp mô hình hội tụ tốt hơn.**  
    *Giải thích:* w04.md log-transform, clip 99%, tránh skew trong numerical features.

15. **Tương tác phi tuyến (vd: roi_vs_vote kết hợp lợi nhuận + chất lượng). Quan trọng hơn vì capture relationships phức tạp.**  
    *Giải thích:* w04.md tạo 3 features, cải thiện F1-score bằng cách mô phỏng domain logic.

16. **Đảm bảo input đầy đủ, giảm overfitting. Output: 1020 hàng, ~65 cột (40+ features).**  
    *Giải thích:* w04.md list features, check NaN, chuẩn bị cho Tuần 5.

17. **Phát hiện pattern như genres phổ biến, ROI skew. Đảm bảo features hợp lý, tránh bad data vào model.**  
    *Giải thích:* w04.md biểu đồ countplot/hist, cải thiện quality trước modeling.

## Câu Hỏi Tổng Hợp (Liên Kết Các Tuần)
18. **Tuần 1-3 tạo data sạch + nhãn, Tuần 4 tạo features từ đó → input cho Tuần 5. Bỏ bước (vd: one-hot genres) → model không học categorical, accuracy giảm 10-20%.**  
    *Giải thích:* Pipeline tuần tự, Tuần 4 transform data thô thành numerical, thiếu thì model fail.

19. **roi_vs_vote (tương tác lợi nhuận + vote), vì kết hợp 2 yếu tố chính của success (kinh tế + chất lượng).**  
    *Giải thích:* Từ w04.md, feature này top trong domain, được dùng nhiều ở Tuần 5.