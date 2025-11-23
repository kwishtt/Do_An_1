# BÁO CÁO ĐỒ ÁN MÔN HỌC

**TRƯỜNG ĐẠI HỌC MỎ - ĐỊA CHẤT**  
**KHOA CÔNG NGHỆ THÔNG TIN**  
**BỘ MÔN KHOA HỌC DỮ LIỆU**

---

**ĐỀ TÀI:**

# DỰ ĐOÁN ĐỘ THÀNH CÔNG CỦA PHIM CHIẾU RẠP TẠI VIỆT NAM

---

**Giảng viên hướng dẫn:** ThS. Nguyễn Thị Mai Dung  
**Nhóm sinh viên thực hiện:**
1. Khổng Thị Hoà - 2321050043
2. Phan Văn Huy - 2321050069
3. Đinh Ngọc Khuê - 2321050065

**Hà Nội, 2025**

---

## LỜI CẢM ƠN

Lời đầu tiên, chúng em xin gửi lời cảm ơn chân thành đến Ban Giám hiệu Trường Đại học Mỏ - Địa chất và các thầy cô trong Khoa Công nghệ Thông tin đã tạo điều kiện thuận lợi cho chúng em trong quá trình học tập và nghiên cứu.

Đặc biệt, chúng em xin bày tỏ lòng biết ơn sâu sắc đến cô **Nguyễn Thị Mai Dung**, người đã tận tình hướng dẫn, chỉ bảo và định hướng cho chúng em trong suốt quá trình thực hiện đồ án này. Những kiến thức và kinh nghiệm quý báu mà cô truyền đạt là hành trang vô giá giúp chúng em hoàn thành tốt đề tài.

Cuối cùng, chúng em xin cảm ơn gia đình, bạn bè đã luôn động viên, hỗ trợ chúng em trong suốt thời gian qua. Mặc dù đã rất cố gắng, nhưng do kiến thức và kinh nghiệm còn hạn chế nên bài báo cáo khó tránh khỏi những thiếu sót. Chúng em rất mong nhận được sự đóng góp ý kiến của quý thầy cô và các bạn để đề tài được hoàn thiện hơn.

Chúng em xin chân thành cảm ơn!

---

## MỤC LỤC

1. [MỞ ĐẦU](#mở-đầu)
2. [CHƯƠNG 1: CƠ SỞ LÝ THUYẾT](#chương-1-cơ-sở-lý-thuyết)
3. [CHƯƠNG 2: DỮ LIỆU VÀ TIỀN XỬ LÝ](#chương-2-dữ-liệu-và-tiền-xử-lý)
4. [CHƯƠNG 3: XÂY DỰNG VÀ ĐÁNH GIÁ MÔ HÌNH](#chương-3-xây-dựng-và-đánh-giá-mô-hình)
5. [CHƯƠNG 4: KẾT QUẢ VÀ THẢO LUẬN](#chương-4-kết-quả-và-thảo-luận)
6. [KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN](#kết-luận-và-hướng-phát-triển)
7. [TÀI LIỆU THAM KHẢO](#tài-liệu-tham-khảo)

---

## DANH MỤC HÌNH ẢNH VÀ BẢNG BIỂU

*(Sinh viên tự bổ sung số trang sau khi hoàn thiện in ấn)*

- Hình 1: Quy trình thực hiện dự án Machine Learning
- Hình 2: Phân phối doanh thu và ngân sách
- Hình 3: Ma trận tương quan (Correlation Matrix)
- Hình 4: Biểu đồ Feature Importance của Random Forest
- Bảng 1: Mô tả các đặc trưng dữ liệu
- Bảng 2: Kết quả đánh giá mô hình Logistic Regression
- Bảng 3: Kết quả đánh giá mô hình Random Forest
- Bảng 4: So sánh hiệu suất hai mô hình

---

# MỞ ĐẦU

### 1. Lý do chọn đề tài
Ngành công nghiệp điện ảnh là một thị trường đầy tiềm năng nhưng cũng chứa đựng rủi ro tài chính cực lớn. Hàng năm, hàng trăm bộ phim được sản xuất với kinh phí khổng lồ, nhưng không phải tác phẩm nào cũng đạt được thành công như mong đợi. Việc dự đoán trước khả năng thành công của một bộ phim không chỉ giúp các nhà sản xuất tối ưu hóa nguồn vốn, giảm thiểu rủi ro mà còn hỗ trợ các rạp chiếu phim trong việc phân bổ suất chiếu hợp lý.

Trong kỷ nguyên dữ liệu lớn (Big Data), việc áp dụng các kỹ thuật Học máy (Machine Learning) để phân tích dữ liệu lịch sử và đưa ra dự báo đã trở thành xu hướng tất yếu. Đề tài **"Dự đoán độ thành công của phim chiếu rạp"** được lựa chọn nhằm mục đích áp dụng các kiến thức đã học về Khoa học Dữ liệu để giải quyết bài toán thực tế này.

### 2. Mục tiêu nghiên cứu
- Xây dựng quy trình thu thập, làm sạch và xử lý dữ liệu điện ảnh chuẩn hóa.
- Phân tích các yếu tố ảnh hưởng đến sự thành công của một bộ phim.
- Xây dựng và so sánh các mô hình học máy (Logistic Regression, Random Forest) để dự đoán nhãn "Thành công" của phim.
- Đánh giá hiệu quả mô hình thông qua các chỉ số kỹ thuật và đưa ra kiến nghị thực tiễn.

### 3. Đối tượng và phạm vi nghiên cứu
- **Đối tượng:** Dữ liệu về các bộ phim chiếu rạp (Việt Nam và quốc tế) từ năm 1990 đến 2024.
- **Phạm vi:** Tập trung vào các chỉ số tài chính (Doanh thu, Ngân sách), đánh giá (Vote Average, Vote Count) và nội dung (Thể loại, Diễn viên, Đạo diễn).

---

# CHƯƠNG 1: CƠ SỞ LÝ THUYẾT

## 1.1. Tổng quan về Học máy (Machine Learning)
Học máy là một nhánh của Trí tuệ nhân tạo (AI), tập trung vào việc xây dựng các hệ thống có khả năng tự học hỏi từ dữ liệu thay vì được lập trình rõ ràng cho từng tác vụ cụ thể.

Trong đề tài này, chúng tôi sử dụng phương pháp **Học có giám sát (Supervised Learning)**, cụ thể là bài toán **Phân loại (Classification)**. Mô hình sẽ học từ tập dữ liệu đã được gán nhãn (biết trước phim nào thành công, phim nào thất bại) để dự đoán nhãn cho các bộ phim mới.

## 1.2. Các thuật toán sử dụng

### 1.2.1. Hồi quy Logistic (Logistic Regression)
Là thuật toán cơ bản dùng cho bài toán phân loại nhị phân. Mô hình ước lượng xác suất một điểm dữ liệu thuộc vào một lớp nhất định bằng cách sử dụng hàm Sigmoid.
- **Ưu điểm:** Đơn giản, dễ cài đặt, dễ giải thích, ít tốn tài nguyên tính toán.
- **Nhược điểm:** Giả định mối quan hệ tuyến tính giữa các biến độc lập và log-odds của biến mục tiêu, thường không hoạt động tốt với dữ liệu phức tạp.

### 1.2.2. Rừng ngẫu nhiên (Random Forest)
Là một thuật toán học tổ hợp (Ensemble Learning) dựa trên việc xây dựng nhiều Cây quyết định (Decision Trees). Kết quả dự đoán cuối cùng được quyết định bằng cách lấy đa số (majority vote) từ các cây con.
- **Ưu điểm:** Độ chính xác cao, chống hiện tượng quá khớp (overfitting) tốt hơn cây quyết định đơn lẻ, xử lý tốt dữ liệu phi tuyến và dữ liệu thiếu.
- **Nhược điểm:** Tốn nhiều tài nguyên tính toán hơn, khó giải thích trực quan hơn so với cây quyết định đơn.

## 1.3. Các chỉ số đánh giá (Evaluation Metrics)
Để đánh giá hiệu quả của mô hình phân loại, chúng tôi sử dụng các chỉ số sau:
- **Accuracy (Độ chính xác):** Tỷ lệ dự đoán đúng trên tổng số mẫu.
- **Precision (Độ chính xác dương tính):** Tỷ lệ số mẫu dự đoán là Positive thực sự là Positive.
- **Recall (Độ phủ):** Tỷ lệ số mẫu Positive thực tế được dự đoán đúng.
- **F1-Score:** Trung bình điều hòa của Precision và Recall, giúp đánh giá cân bằng hơn khi dữ liệu bị lệch.
- **Confusion Matrix (Ma trận nhầm lẫn):** Bảng thể hiện chi tiết các trường hợp True Positive, True Negative, False Positive, False Negative.

---

# CHƯƠNG 2: DỮ LIỆU VÀ TIỀN XỬ LÝ

## 2.1. Nguồn dữ liệu
Dữ liệu được thu thập từ các nguồn uy tín công khai, bao gồm:
- **The Movie Database (TMDb):** Cơ sở dữ liệu phim lớn và phổ biến nhất thế giới.
- **BoxOfficeVietnam:** Dữ liệu doanh thu phim tại thị trường Việt Nam.
- **Kaggle:** Bộ dữ liệu "Cinema Movies in Vietnam 1990-2024".

Tổng số lượng dữ liệu thô ban đầu: **2.194 bộ phim**.

## 2.2. Mô tả dữ liệu (Data Description)
Bộ dữ liệu bao gồm các trường thông tin (features) chính sau:

| Tên trường | Ý nghĩa | Kiểu dữ liệu |
|---|---|---|
| `id` | Mã định danh phim | Số nguyên |
| `title` | Tên phim | Chuỗi ký tự |
| `budget` | Ngân sách sản xuất (USD) | Số thực |
| `revenue` | Doanh thu toàn cầu (USD) | Số thực |
| `genres` | Thể loại phim | Danh sách |
| `runtime` | Thời lượng (phút) | Số nguyên |
| `vote_average` | Điểm đánh giá trung bình (0-10) | Số thực |
| `vote_count` | Số lượng lượt đánh giá | Số nguyên |
| `release_date` | Ngày phát hành | Ngày tháng |
| `production_countries` | Quốc gia sản xuất | Danh sách |

## 2.3. Quy trình làm sạch dữ liệu (Data Cleaning)
Dữ liệu thô thường chứa nhiều nhiễu và sai sót. Quy trình làm sạch được thực hiện nghiêm ngặt như sau:

1.  **Xử lý dữ liệu thiếu và sai lệch:**
    - Loại bỏ các bộ phim có `Budget = 0` hoặc `Revenue = 0`. Đây là bước quan trọng vì các phim thiếu thông tin tài chính không thể dùng để tính toán lợi nhuận (ROI).
    - **Kết quả:** Số lượng phim giảm từ 2.194 xuống còn **1.020 phim** chất lượng cao.

2.  **Xử lý giá trị khuyết (Missing Values):**
    - Các trường văn bản (Overview, Tagline) thiếu được điền giá trị "Unknown".
    - Các trường số thiếu được điền bằng giá trị trung bình (Mean) hoặc trung vị (Median) tùy theo phân phối dữ liệu.

3.  **Chuẩn hóa định dạng:**
    - Chuyển đổi `release_date` sang định dạng Datetime chuẩn.
    - Chuyển đổi danh sách `genres` và `production_countries` từ dạng chuỗi JSON sang danh sách Python để xử lý.

## 2.4. Kỹ thuật đặc trưng (Feature Engineering)
Đây là bước quan trọng nhất để nâng cao hiệu suất mô hình.

### 2.4.1. Định nghĩa "Thành công" (Target Variable)
Chúng tôi xây dựng biến mục tiêu `success` (0 hoặc 1) dựa trên hai tiêu chí khắt khe:
1.  **Tiêu chí tài chính:** `ROI (Return on Investment) >= 1.0`. Tức là doanh thu phải ít nhất bằng ngân sách bỏ ra (hòa vốn hoặc có lãi).
    $$ROI = \frac{Revenue}{Budget}$$
2.  **Tiêu chí chất lượng:** `Vote Average >= 6.5`. Phim phải được khán giả đón nhận tích cực.

**Lý do:** Một bộ phim chỉ có lãi mà bị chê bai thậm tệ (phim "rác") hoặc phim hay nhưng lỗ nặng đều không được coi là thành công trọn vẹn trong bối cảnh nghiên cứu này.

**Phân bố nhãn:**
- Thành công (1): 514 phim (50.4%)
- Thất bại (0): 506 phim (49.6%)
-> **Nhận xét:** Dữ liệu rất cân bằng, không cần áp dụng các kỹ thuật cân bằng dữ liệu (như SMOTE).

### 2.4.2. Trích xuất đặc trưng mới
- **Thời gian:** Tách `release_year`, `release_month`, `release_day_of_week` từ ngày phát hành. Tạo biến `is_weekend` (phát hành cuối tuần).
- **One-Hot Encoding:** Mã hóa biến định danh `genres` (Action, Comedy, Drama...) và `production_countries` (US, VN, UK...) thành các vector nhị phân.
- **Tương tác:** Tạo đặc trưng `roi_vs_vote` để bắt mối quan hệ giữa lợi nhuận và điểm đánh giá.

Tổng số đặc trưng đưa vào mô hình: **47 đặc trưng**.

---

# CHƯƠNG 3: XÂY DỰNG VÀ ĐÁNH GIÁ MÔ HÌNH

## 3.1. Thiết lập thực nghiệm
- **Chia tập dữ liệu:** 80% Huấn luyện (Train) - 20% Kiểm thử (Test).
- **Phương pháp chia:** Stratified Sampling (đảm bảo tỷ lệ nhãn Success/Failure ở hai tập là như nhau).
- **Chuẩn hóa:** Sử dụng `MinMaxScaler` để đưa tất cả các biến số về khoảng [0, 1], giúp thuật toán hội tụ nhanh hơn.
- **Kiểm chứng:** Sử dụng kỹ thuật **5-Fold Cross-Validation** để đánh giá độ ổn định của mô hình.

## 3.2. Huấn luyện mô hình

### 3.2.1. Mô hình Logistic Regression (Baseline)
- Tham số: `max_iter=1000`, `random_state=42`.
- Mục đích: Làm mốc chuẩn (baseline) để so sánh hiệu quả của các mô hình phức tạp hơn.

### 3.2.2. Mô hình Random Forest
- Tham số: `n_estimators=100` (số cây), `random_state=42`.
- Mục đích: Tận dụng khả năng học phi tuyến để cải thiện độ chính xác.

---

# CHƯƠNG 4: KẾT QUẢ VÀ THẢO LUẬN

## 4.1. So sánh hiệu suất mô hình

| Chỉ số | Logistic Regression | Random Forest | Cải thiện |
|---|---|---|---|
| **Accuracy** | 84.80% | **99.51%** | +14.71% |
| **Precision** | 85.29% | **99.04%** | +13.75% |
| **Recall** | 84.47% | **100.00%** | +15.53% |
| **F1-Score** | 84.88% | **99.52%** | +14.64% |

**Nhận xét:**
- Mô hình **Random Forest** vượt trội hoàn toàn so với Logistic Regression ở mọi chỉ số.
- Đặc biệt, chỉ số **Recall đạt 100%**, nghĩa là mô hình không bỏ sót bất kỳ bộ phim thành công nào. Điều này cực kỳ quan trọng đối với các nhà đầu tư muốn tối đa hóa cơ hội.

## 4.2. Đánh giá độ ổn định (Cross-Validation)
Kết quả kiểm chứng chéo 5 lần (5-Fold CV) cho thấy:
- Logistic Regression: 84.16% ± 0.33%
- **Random Forest: 99.88% ± 0.14%**

Độ lệch chuẩn (Standard Deviation) rất thấp (0.14%) chứng tỏ mô hình Random Forest hoạt động rất ổn định, không phụ thuộc vào cách chia dữ liệu.

## 4.3. Phân tích tầm quan trọng của đặc trưng (Feature Importance)
Mô hình Random Forest cho phép trích xuất mức độ ảnh hưởng của từng yếu tố đến kết quả dự đoán. Top 5 yếu tố quan trọng nhất:

1.  **Vote Average (41.56%):** Điểm đánh giá chất lượng phim là yếu tố tiên quyết.
2.  **ROI vs Vote (10.70%):** Sự tương tác giữa lợi nhuận và điểm số.
3.  **ROI (7.05%):** Tỷ suất lợi nhuận.
4.  **Vote Count (5.14%):** Số lượng người quan tâm/đánh giá.
5.  **Budget (< 1%):** Ngân sách không phải là yếu tố quyết định thành công.

**Kết luận thú vị:** Một bộ phim thành công không nhất thiết phải có kinh phí "khủng" (bom tấn), mà quan trọng nhất là **chất lượng nội dung** (thể hiện qua Vote Average) và sự đón nhận của khán giả.

## 4.4. Phân tích lỗi (Error Analysis)
Trên tập kiểm thử (204 phim):
- **Logistic Regression:** Dự đoán sai 31 trường hợp.
- **Random Forest:** Chỉ dự đoán sai **1 trường hợp duy nhất** (False Positive).
    - *Trường hợp sai:* Dự đoán phim thành công, nhưng thực tế thất bại.
    - *Nguyên nhân:* Có thể do phim có điểm đánh giá cao nhưng doanh thu chỉ ở mức tiệm cận hòa vốn (ROI xấp xỉ 1.0), gây nhiễu cho mô hình.

---

# KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

## 1. Kết luận
Đồ án đã hoàn thành xuất sắc các mục tiêu đề ra:
- Xây dựng được bộ dữ liệu chuẩn hóa với 1.020 phim và 47 đặc trưng.
- Mô hình **Random Forest** đạt độ chính xác **99.51%**, chứng minh tính khả thi cao trong việc dự đoán thành công của phim chiếu rạp.
- Xác định được **Chất lượng nội dung (Vote Average)** là yếu tố quan trọng nhất, thay đổi tư duy "cứ nhiều tiền là thắng" trong sản xuất phim.

## 2. Hạn chế
- Dữ liệu chủ yếu từ TMDb, số lượng phim Việt Nam thuần túy còn chưa nhiều.
- Chưa tích hợp các yếu tố mạng xã hội (Social Listening) như lượng thảo luận trên Facebook, TikTok trước khi phim ra mắt.

## 3. Hướng phát triển
- Mở rộng thu thập dữ liệu từ các nguồn nội địa (BoxOfficeVietnam, Moveek) để tăng tính địa phương hóa.
- Thử nghiệm các mô hình Deep Learning (Neural Networks) để xử lý dữ liệu văn bản (Overview, Review) nhằm trích xuất thêm đặc trưng cảm xúc (Sentiment Analysis).
- Xây dựng ứng dụng Web hoàn chỉnh để người dùng có thể nhập thông số và nhận dự đoán theo thời gian thực.

---

# TÀI LIỆU THAM KHẢO

1.  Mishra, S., & Pandey, A. (2017). *Movie Success Prediction using Machine Learning*.
2.  Scikit-learn Documentation. *Ensemble Methods: Random Forests*.
3.  The Movie Database (TMDb) API Documentation.
4.  BoxOfficeVietnam - Dữ liệu doanh thu phòng vé Việt Nam.
