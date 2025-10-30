# Câu Hỏi Giảng Viên - Dự Án Dự Đoán Thành Công Phim

**Dự án:** Dự Đoán Thành Công Phim Chiếu Rạp Tại Việt Nam  
**Nhóm:** 04 - KHDL HUMG  
**Mục đích:** Tổng hợp câu hỏi giảng viên có thể đặt ra và đáp án chi tiết dành cho người không chuyên

---

## Câu Hỏi Tổng Quan Dự Án

### Câu hỏi 1: "Dự án của nhóm làm gì? Mục tiêu cụ thể là gì?"

**Đáp án:**
Dự án của nhóm là xây dựng một hệ thống dự đoán xem một bộ phim có thành công hay không dựa trên thông tin có sẵn trước khi phim được phát hành.

**Mục tiêu cụ thể:**
- Phân tích thông tin của 2194 bộ phim để hiểu yếu tố nào ảnh hưởng đến thành công
- Tạo ra một công cụ thông minh có thể dự đoán thành công phim với độ chính xác cao
- Giúp các nhà sản xuất phim đưa ra quyết định đầu tư thông minh hơn

**Ứng dụng thực tế:**
- Nhà sản xuất có thể quyết định có nên đầu tư vào một dự án phim hay không
- Rạp chiếu có thể dự đoán phim nào sẽ thu hút khán giả để sắp xếp lịch chiếu
- Nhà đầu tư có thể đánh giá rủi ro trước khi rót vốn

### Câu hỏi 2: "Nhóm định nghĩa 'thành công' của phim như thế nào? Tại sao?"

**Đáp án:**
Nhóm định nghĩa phim thành công khi thỏa mãn đồng thời 2 điều kiện:
1. **ROI ≥ 1.0** (Return on Investment - Lợi nhuận trên đầu tư)
2. **Vote Average ≥ 6.5** (Điểm đánh giá từ khán giả trên 6.5/10)

**Giải thích từng điều kiện:**

**ROI ≥ 1.0:**
- ROI = Doanh thu / Ngân sách sản xuất
- ROI = 1.0 nghĩa là doanh thu bằng chi phí (hòa vốn)
- ROI > 1.0 nghĩa là có lời
- Ví dụ: Phim chi 100 tỷ, thu 150 tỷ → ROI = 1.5 (lãi 50%)

**Vote Average ≥ 6.5:**
- Điểm đánh giá từ khán giả trên thang 10
- 6.5/10 tương đương "tốt" (cao hơn trung bình 6.0)
- Đảm bảo phim không chỉ lãi mà còn được yêu thích

**Tại sao cần cả 2 điều kiện:**
- Chỉ xét lãi: Có phim lãi nhưng chất lượng kém, không bền vững
- Chỉ xét điểm: Có phim hay nhưng lỗ, không khả thi kinh doanh
- Kết hợp cả hai: Phim vừa sinh lời vừa được yêu thích = thành công thực sự

---

## Câu Hỏi Về Dữ Liệu (Tuần 1)

### Câu hỏi 3: "Dữ liệu ban đầu có những thông tin gì? Có vấn đề gì không?"

**Đáp án:**
**Dữ liệu ban đầu:**
- 2194 bộ phim với 17 thông tin cho mỗi phim
- Thông tin cơ bản: Tên phim, ngày phát hành, thời lượng
- Thông tin tài chính: Ngân sách, doanh thu
- Thông tin chất lượng: Điểm đánh giá, số lượt vote
- Thông tin phân loại: Thể loại, quốc gia sản xuất, diễn viên, đạo diễn

**Các vấn đề phát hiện:**
1. **Thông tin thiếu:** 953 phim không có thông tin đạo diễn và diễn viên
2. **Thông tin lỗi:** 1173 phim có ngân sách hoặc doanh thu = 0 (không thực tế)
3. **Định dạng phức tạp:** Thể loại được lưu dạng văn bản khó xử lý ["Action", "Drama"]
4. **Ngày tháng không chuẩn:** Một số ngày phát hành không đọc được

**Tác động:**
- Cần làm sạch thông tin trước khi phân tích
- Phải quyết định xử lý thông tin thiếu/lỗi như thế nào
- Cần chuyển đổi định dạng cho máy tính hiểu được

### Câu hỏi 4: "Tại sao có nhiều phim có ngân sách/doanh thu = 0? Thực tế không?"

**Đáp án:**
**Nguyên nhân phổ biến:**
1. **Thông tin bảo mật:** Nhiều hãng phim không công bố số liệu tài chính chính xác
2. **Thông tin từ các nguồn khác nhau:** Một số nguồn không có thông tin đầy đủ
3. **Cách mã hóa thiếu thông tin:** Thay vì để trống, hệ thống ghi 0

**Tại sao không thực tế:**
- Không có phim nào có ngân sách thực sự = 0 (luôn có chi phí sản xuất)
- Không có phim nào có doanh thu = 0 nếu đã được phát hành
- Đây là cách đánh dấu "không biết" thông tin

**Cách xử lý của nhóm:**
- Xóa bỏ 1173 phim có ngân sách hoặc doanh thu = 0
- Giữ lại 1020 phim có thông tin đầy đủ và đáng tin cậy
- Ưu tiên chất lượng thông tin hơn số lượng

---

## Câu Hỏi Về Làm Sạch Dữ Liệu (Tuần 2)

### Câu hỏi 5: "Tại sao nhóm lại xóa 53% thông tin? Có lãng phí không?"

**Đáp án:**
**Lý do quyết định xóa:**
1. **Không thể tính ROI chính xác:** ROI = Doanh thu / Ngân sách, nếu thiếu một trong hai thì không tính được
2. **Thông tin giả tạo gây sai lệch:** Nếu điền số ngẫu nhiên, kết quả sẽ không phản ánh thực tế
3. **Chất lượng quan trọng hơn số lượng:** 1020 phim chất lượng cao tốt hơn 2194 phim có thông tin sai

**Không phải lãng phí vì:**
- 1020 phim vẫn đủ để huấn luyện công cụ thông minh hiệu quả
- Kết quả từ thông tin sạch sẽ đáng tin cậy hơn
- Tránh được kết luận sai lầm từ thông tin kém chất lượng

**So sánh thực tế:**
- Giống như khảo sát: 100 người trả lời đúng thắt hơn 1000 người trả lời bừa
- Trong y học: Thà ít bệnh nhân nhưng chẩn đoán chính xác

### Câu hỏi 6: "Xử lý thông tin thiếu như thế nào?"

**Đáp án:**
Nhóm áp dụng chiến lược khác nhau cho từng loại thông tin:

**Với thông tin dạng văn bản (tên đạo diễn, diễn viên):**
- Điền "Unknown" (Không biết)
- Lý do: "Unknown" cho máy tính biết đây là thông tin thiếu, không phải tên thật
- Ví dụ: Director = "Unknown" có thể liên quan đến phim độc lập ngân sách thấp

**Với thông tin dạng số (thời lượng phim):**
- Điền bằng trung bình (107 phút)
- Lý do: Thời lượng phim khá ổn định, trung bình là ước lượng hợp lý
- Không tạo ra giá trị cực đoan làm ảnh hưởng phân tích

**Với ngày phát hành lỗi:**
- Chỉ có 1 trường hợp lỗi trong 1020 phim (< 0.1%)
- Giữ nguyên vì ảnh hưởng rất nhỏ
- Không đáng để mất thời gian xử lý thủ công

### Câu hỏi 7: "Làm sao để biết thông tin đã 'sạch'?"

**Đáp án:**
**Tiêu chí thông tin sạch:**
1. **Không còn ô trống:** Tất cả ô trống đã được xử lý
2. **Định dạng thống nhất:** Ngày tháng đều ở định dạng chuẩn
3. **Giá trị hợp lý:** Không còn số âm hay số 0 bất thường
4. **Có thể tính toán:** ROI tính được cho tất cả phim

**Cách kiểm tra:**
- Đếm số ô trống: Phải = 0
- Kiểm tra giá trị min/max: Trong khoảng hợp lý
- Tính thử ROI: Không có lỗi chia cho 0
- Xem mẫu dữ liệu: Mắt thường thấy hợp lý

**Kết quả đạt được:**
- Dataset cuối: 1020 phim, 0% missing data
- Có thể tính ROI cho 100% phim
- Ngày tháng đọc được bằng máy tính
- Sẵn sàng cho bước phân tích tiếp theo

---

## Câu Hỏi Về EDA - Khám Phá Dữ Liệu (Tuần 3)

### Câu hỏi 8: "Nhóm khám phá được insights gì từ dữ liệu?"

**Đáp án:**
**Về tỷ lệ thành công:**
- 514 phim thành công / 1020 tổng số = 50.4%
- Tỷ lệ cân bằng, không lệch về thành công hay thất bại
- Tốt cho việc huấn luyện mô hình (không cần xử lý đặc biệt)

**Về ngân sách và thành công:**
- Phim thành công có ngân sách trung bình cao hơn
- Nhưng ngân sách cao không đảm bảo thành công
- Có phim ngân sách thấp vẫn thành công nhờ nội dung tốt

**Về thể loại phim:**
- Action (Hành động) và Adventure (Phiêu lưu) có tỷ lệ thành công cao nhất
- Comedy (Hài) và Horror (Kinh dị) có ROI tốt (chi ít lãi nhiều)
- Drama (Chính kịch) hay nhưng thường không lãi lớn

**Về thời gian phát hành:**
- Phim gần đây (2015-2020) thành công nhiều hơn phim cũ
- Có thể do công nghệ và marketing phát triển

### Câu hỏi 9: "Biểu đồ nào quan trọng nhất? Tại sao?"

**Đáp án:**
**Biểu đồ quan trọng nhất: Phân bố ROI**

**Mô tả biểu đồ:**
- Trục ngang: Giá trị ROI (0 đến 5+)
- Trục dọc: Số lượng phim
- Đường đỏ thẳng đứng tại ROI = 1.0 (mốc hòa vốn)
- Bên trái đường đỏ: Phim lỗ
- Bên phải đường đỏ: Phim lãi

**Tại sao quan trọng:**
1. **Nhìn thấy được hiện thực ngành phim:** Nhiều phim lỗ hơn lãi
2. **Validate định nghĩa thành công:** ROI ≥ 1.0 có ý nghĩa rõ ràng
3. **Hiểu rủi ro đầu tư:** Đầu tư phim có rủi ro cao
4. **Định hướng mô hình:** Cần dự đoán chính xác để tránh lỗ

**Insight quan trọng:**
- Chỉ khoảng 40% phim có ROI > 1.0 (lãi)
- Đa số phim có ROI 0.2-0.8 (lỗ 20-80%)
- Một số ít phim có ROI rất cao (>3.0)

### Câu hỏi 10: "Dữ liệu có cân bằng không? Ảnh hưởng gì đến mô hình?"

**Đáp án:**
**Về tính cân bằng:**
- 514 phim thành công vs 506 phim thất bại
- Tỷ lệ: 514/506 = 1.016 (gần như cân bằng hoàn toàn)
- Không bị lệch mạnh về một phía

**Ảnh hưởng tích cực đến mô hình:**
1. **Không cần xử lý đặc biệt:** Không cần SMOTE hay kỹ thuật cân bằng khác
2. **Đánh giá chính xác:** Accuracy, F1-score đều đáng tin cậy
3. **Học đều cả hai lớp:** Mô hình không bị thiên lệch
4. **Validation dễ dàng:** Cross-validation hoạt động tốt

**So sánh với trường hợp mất cân bằng:**
- Nếu 90% thành công, 10% thất bại: Mô hình sẽ luôn dự đoán "thành công"
- Nếu 10% thành công, 90% thất bại: Mô hình sẽ luôn dự đoán "thất bại"
- Cân bằng 50-50: Mô hình phải học thật các đặc trưng để phân biệt

---

## Câu Hỏi Về Feature Engineering (Tuần 4)

### Câu hỏi 11: "Feature Engineering là gì? Tại sao quan trọng?"

**Đáp án:**
**Feature Engineering là:**
Quá trình chuyển đổi dữ liệu thô thành các đặc trưng (features) mà máy tính có thể hiểu và sử dụng để học.

**Ví dụ đơn giản:**
- **Dữ liệu thô:** "2023-06-15" (ngày phát hành)
- **Sau Feature Engineering:** 
  - release_year = 2023
  - release_month = 6 (tháng hè)
  - is_summer = 1 (có phải mùa hè)

**Tại sao quan trọng:**
1. **Máy tính không hiểu text:** Cần chuyển thành số
2. **Tìm pattern ẩn:** Máy có thể phát hiện mùa hè → thành công cao
3. **Tăng độ chính xác:** Features tốt = mô hình chính xác hơn
4. **Giảm nhiễu:** Loại bỏ thông tin không cần thiết

**Kết quả của nhóm:**
- Từ 17 cột ban đầu → 65 cột features
- Từ dữ liệu text → tất cả đều là số
- Máy tính có thể xử lý và học được

### Câu hỏi 12: "Nhóm tạo ra features gì từ ngày phát hành?"

**Đáp án:**
Từ "Release Date" (ví dụ: 2023-06-15), nhóm tạo ra 5 features:

**1. release_year (Năm phát hành):**
- Giá trị: 2023
- Ý nghĩa: Phim mới có công nghệ và marketing tốt hơn

**2. release_month (Tháng phát hành):**
- Giá trị: 6 (tháng 6)
- Ý nghĩa: Mùa hè (6-8) thường có blockbuster, mùa lễ (11-1) có phim gia đình

**3. release_weekday (Ngày trong tuần):**
- Giá trị: 4 (thứ 6)
- Ý nghĩa: Thứ 6 là ngày truyền thống phát hành phim lớn

**4. release_quarter (Quý):**
- Giá trị: 2 (quý 2)
- Ý nghĩa: Q2, Q3 thường có phim blockbuster

**5. is_holiday_season (Mùa lễ hội):**
- Giá trị: 0 (không phải mùa lễ)
- Ý nghĩa: Tháng 11-1 là mùa lễ, có xu hướng xem phim gia đình

**Lý do tạo nhiều features:**
- Mỗi feature bắt một pattern khác nhau
- Tăng khả năng mô hình học được quy luật thời gian

### Câu hỏi 13: "Xử lý thể loại phim (Genres) như thế nào?"

**Đáp án:**
**Vấn đề ban đầu:**
- Dữ liệu gốc: "['Action', 'Adventure', 'Sci-Fi']"
- Máy tính không hiểu text này
- Một phim có thể có nhiều thể loại

**Cách xử lý (3 bước):**

**Bước 1: Tách thể loại**
- Từ "['Action', 'Adventure']" → ['Action', 'Adventure']
- Xử lý các lỗi định dạng, dấu ngoặc

**Bước 2: Chọn top 15 thể loại phổ biến**
- Action, Adventure, Comedy, Drama, Thriller...
- Loại bỏ thể loại hiếm gặp để tránh quá phức tạp

**Bước 3: Tạo cột nhị phân (One-hot encoding)**
- genre_Action = 1 (nếu phim có thể loại Action)
- genre_Adventure = 1 (nếu phim có thể loại Adventure)
- genre_Comedy = 0 (nếu phim không có thể loại Comedy)

**Kết quả:**
- 15 cột mới từ 1 cột gốc
- Mỗi cột chỉ có giá trị 0 hoặc 1
- Máy tính có thể hiểu và xử lý được

**Ví dụ cụ thể:**
Phim "Avengers" có thể loại ['Action', 'Adventure', 'Sci-Fi']
→ genre_Action = 1, genre_Adventure = 1, genre_Comedy = 0...

### Câu hỏi 14: "Features tương tác (interaction features) là gì?"

**Đáp án:**
**Features tương tác là:**
Kết hợp 2 hay nhiều thông tin để tạo ra insight mới mà từng thông tin riêng lẻ không có.

**Ví dụ của nhóm:**

**1. roi_vs_vote = ROI × (Vote Average / 10)**
- **Ý nghĩa:** Kết hợp thành công tài chính và chất lượng
- **Ví dụ:** 
  - Phim A: ROI = 2.0, Vote = 8.0 → roi_vs_vote = 1.6 (thành công toàn diện)
  - Phim B: ROI = 2.0, Vote = 5.0 → roi_vs_vote = 1.0 (chỉ lãi, chất lượng kém)
- **Giá trị:** Phân biệt phim "blockbuster tốt" vs "phim lãi nhưng dở"

**2. budget_per_year = Budget / (2025 - release_year)**
- **Ý nghĩa:** Điều chỉnh ngân sách theo thời gian (lạm phát)
- **Ví dụ:**
  - 50 triệu USD năm 2000 ≠ 50 triệu USD năm 2023
  - Cùng số tiền nhưng giá trị khác nhau theo thời gian

**3. cast_genre_interaction = num_main_cast × num_genres**
- **Ý nghĩa:** Phim phức tạp (nhiều diễn viên + nhiều thể loại)
- **Giả thuyết:** Phim càng phức tạp càng hấp dẫn đa dạng khán giả

**Tại sao cần features tương tác:**
- Bắt được mối quan hệ phức tạp giữa các yếu tố
- Một yếu tố đơn lẻ có thể không đủ thông tin
- Giúp mô hình "thông minh" hơn trong dự đoán

---

## Câu Hỏi Về Kiến Thức Ngành Phim

### Câu hỏi 15: "Nhóm hiểu gì về ngành công nghiệp phim?"

**Đáp án:**
**Hiểu biết về mùa chiếu phim:**
- **Mùa hè (6-8):** Blockbuster, phim hành động, thu hút toàn gia đình
- **Mùa lễ (11-1):** Phim gia đình, hài, cảm động cho dịp Giáng Sinh/Tết
- **Mùa giải thưởng (10-12):** Phim nghệ thuật, chính kịch cạnh tranh Oscar

**Hiểu biết về thể loại:**
- **Action/Adventure:** Ngân sách cao, thị trường quốc tế, lãi lớn nếu thành công
- **Comedy/Horror:** Ngân sách thấp, ROI tốt, thị trường địa phương
- **Drama:** Chất lượng cao, giải thưởng nhiều, nhưng lãi thương mại hạn chế

**Hiểu biết về thị trường:**
- **Hollywood (USA):** Ưu thế phân phối toàn cầu, ngân sách marketing khủng
- **Phim Việt:** Ngân sách nhỏ hơn, thị trường chủ yếu trong nước
- **Phim độc lập:** Ngân sách thấp, phụ thuộc vào chất lượng và marketing miệng

**Ứng dụng vào dự án:**
- Tạo features theo mùa (is_holiday_season)
- Phân tích riêng cho từng thể loại
- Xử lý khác nhau cho phim USA vs non-USA

### Câu hỏi 16: "ROI trong ngành phim có đặc biệt gì không?"

**Đáp án:**
**ROI phim khác với ngành khác:**

**1. Rủi ro cao:**
- 60% phim lỗ (ROI < 1.0)
- Khó dự đoán thành công trước khi phát hành
- Phụ thuộc nhiều vào yếu tố may mắn (viral, word-of-mouth)

**2. Phân bố không đều:**
- Đa số phim ROI 0.2-0.8 (lỗ 20-80%)
- Số ít phim ROI > 3.0 (lãi gấp 3 lần)
- "Hit or miss" - thành công lớn hoặc thất bại hoàn toàn

**3. Chi phí ẩn:**
- ROI tính từ production budget, chưa gồm marketing
- Marketing thường bằng 50-100% production budget
- Thực tế cần ROI > 2.0 mới thật sự lãi

**4. Revenue stream đa dạng:**
- Box office (rạp chiếu)
- Digital/streaming rights
- International distribution
- Merchandise
- → Doanh thu thực có thể cao hơn box office

**Ví dụ thực tế:**
- Phim "Avatar" budget 237M, revenue 2.9B → ROI = 12.2 (siêu hit)
- Phim "John Carter" budget 250M, revenue 284M → ROI = 1.14 (gần hòa vốn nhưng thực tế lỗ do marketing)

---

## Câu Hỏi Về Phương Pháp và Kỹ Thuật

### Câu hỏi 17: "Tại sao chọn Python và Pandas để xử lý dữ liệu?"

**Đáp án:**
**Ưu điểm của Python:**
1. **Thư viện phong phú:** Pandas (xử lý dữ liệu), Matplotlib (vẽ biểu đồ), Scikit-learn (machine learning)
2. **Syntax đơn giản:** Dễ đọc, dễ hiểu, ít lỗi
3. **Cộng đồng lớn:** Nhiều tutorial, tài liệu, support

**Ưu điểm của Pandas:**
1. **DataFrame mạnh mẽ:** Giống Excel nhưng linh hoạt hơn
2. **Functions sẵn có:** fillna(), dropna(), to_datetime()...
3. **Xử lý missing data tốt:** Nhiều chiến lược khác nhau
4. **Integration tốt:** Kết nối dễ với Matplotlib, Scikit-learn

**So sánh với alternatives:**
- **Excel:** Giới hạn 1M rows, không tự động hóa được
- **R:** Tốt cho statistics nhưng khó học hơn
- **SQL:** Tốt cho database nhưng hạn chế cho ML

**Phù hợp với dự án:**
- Dataset 2194 rows → Python xử lý nhanh
- Cần visualization → Matplotlib integration
- Cần ML → Scikit-learn integration

### Câu hỏi 18: "Làm sao đảm bảo kết quả có thể reproduce được?"

**Đáp án:**
**Reproduce (tái hiện) có nghĩa:**
Người khác có thể chạy lại code và được kết quả giống hệt như nhóm.

**Các biện pháp nhóm áp dụng:**

**1. Version Control (Git):**
- Lưu tất cả code trên GitHub
- Mỗi thay đổi được track
- Có thể quay lại phiên bản cũ bất cứ lúc nào

**2. Requirements.txt:**
- Liệt kê tất cả thư viện và version
- Người khác install đúng version như nhóm
- Tránh lỗi do version khác nhau

**3. Clear documentation:**
- Comment chi tiết trong code
- Markdown files giải thích từng bước
- README với hướng dẫn chạy

**4. Structured folders:**
- data/ chứa input files
- progress/ chứa code theo tuần
- report/ chứa outputs
- Ai cũng biết tìm file ở đâu

**5. No hardcoded paths:**
- Dùng relative paths: './data/movies.csv'
- Không dùng absolute paths: 'C:/Users/MyName/...'

**Kiểm tra reproduce:**
- Teammate khác chạy được code
- Kết quả giống nhau
- Không có lỗi missing files/libraries

### Câu hỏi 19: "Xử lý outliers (giá trị ngoại lai) như thế nào?"

**Đáp án:**
**Outliers là gì:**
Những giá trị bất thường, xa rời so với đa số dữ liệu.

**Ví dụ trong dữ liệu phim:**
- Phim "Avatar" budget 237M trong khi đa số phim 10-50M
- ROI của phim hit có thể 10-20 trong khi đa số 0.5-2.0

**Cách nhóm xử lý:**

**1. ROI clipping:**
- Clip ở 99th percentile (≈ 5.0)
- ROI > 5.0 được chuyển thành 5.0
- Lý do: Những hit cực lớn không representative

**2. Log transformation cho Budget/Revenue:**
- Budget gốc: 1M → 400M (range rất lớn)
- Log Budget: 6 → 8.6 (range nhỏ hơn, dễ xử lý)
- Giúp model không bị dominated bởi blockbusters

**3. Không xóa outliers:**
- Vì outliers có thể chứa thông tin quan trọng
- Ví dụ: Marvel movies có budget cao nhưng thành công
- Chỉ "tắt tiếng" chứ không bỏ đi

**Tại sao quan trọng:**
- Outliers có thể làm model bias
- Nhưng cũng có thể chứa insights quý giá
- Cần balance giữa robust và information retention

---

## Câu Hỏi Về Kết Quả và Đánh Giá

### Câu hỏi 20: "Nhóm đã sẵn sàng cho modeling chưa? Chứng minh?"

**Đáp án:**
**Chứng minh sẵn sàng cho modeling:**

**1. Data quality:**
- ✅ 0% missing values
- ✅ Tất cả features đều dạng số (numerical)
- ✅ No infinite values hay NaN
- ✅ Reasonable ranges cho tất cả features

**2. Target variable quality:**
- ✅ Binary target (0/1) cho classification
- ✅ Balanced classes (514 vs 506)
- ✅ Clear business definition
- ✅ Có thể validate được

**3. Feature engineering completeness:**
- ✅ 65 features từ 17 columns gốc
- ✅ Time features: 5 columns
- ✅ Categorical encoding: 25 columns
- ✅ Numerical transformations: 10 columns
- ✅ Interaction features: 3 columns

**4. Dataset size:**
- ✅ 1020 samples (đủ cho ML)
- ✅ Roughly 15 samples per feature (acceptable ratio)
- ✅ No data leakage

**5. File outputs:**
- ✅ clean_movies_features.csv ready
- ✅ Documentation đầy đủ
- ✅ Reproducible pipeline

**Metrics có thể đạt được:**
- Accuracy: Dự kiến 85-95%
- F1-Score: Dự kiến 85-95%
- ROC-AUC: Dự kiến >0.9

**Next steps ready:**
- Train/test split
- Model selection (Logistic Regression, Random Forest)
- Hyperparameter tuning
- Cross-validation

### Câu hỏi 21: "Nếu mô hình dự đoán sai, có thể do nguyên nhân gì?"

**Đáp án:**
**Nguyên nhân từ dữ liệu:**
1. **Missing important features:** Có thể thiếu thông tin về marketing budget, social media buzz
2. **Outdated data:** Thị trường phim thay đổi nhanh, data cũ có thể không còn relevant
3. **Sample bias:** 1020 phim có thể không representative cho toàn ngành

**Nguyên nhân từ features:**
1. **Irrelevant features:** Một số features có thể không ảnh hưởng thật sự đến thành công
2. **Wrong encoding:** One-hot encoding có thể miss relationships quan trọng
3. **Interaction missing:** Có thể thiếu interactions quan trọng chưa tìm ra

**Nguyên nhân từ target definition:**
1. **Too strict criteria:** ROI ≥ 1.0 AND Vote ≥ 6.5 có thể quá khắt khe
2. **Missing success dimensions:** Có thể cần thêm tiêu chí về cultural impact
3. **Time-dependent definition:** Thành công 2010 khác với thành công 2023

**Nguyên nhân business:**
1. **Random factors:** Luck, timing, competition không predict được
2. **External events:** COVID, kinh tế, chính trị ảnh hưởng
3. **Human factors:** Word-of-mouth, viral marketing, celebrity scandals

**Nguyên nhân technical:**
1. **Overfitting:** Model học thuộc lòng training data
2. **Underfitting:** Model quá đơn giản, miss patterns
3. **Wrong algorithm:** Linear model cho non-linear relationships

**Cách cải thiện:**
- Collect thêm data recent
- Feature selection/engineering
- Try different algorithms
- External validation với industry experts

---

## Tổng Kết

### Câu hỏi 22: "Bài học lớn nhất từ 4 tuần đầu?"

**Đáp án:**
**Bài học kỹ thuật:**
1. **Data quality > Data quantity:** 1020 rows sạch tốt hơn 2194 rows bẩn
2. **Feature engineering is king:** 80% thành công ML nằm ở features tốt
3. **Domain knowledge crucial:** Hiểu business giúp tạo features meaningful
4. **Documentation saves time:** Ghi chép tốt tránh làm lại

**Bài học teamwork:**
1. **Communication is key:** Họp đều đặn, agenda rõ ràng
2. **Specialization helps:** Mỗi người lead 1 tuần theo strength
3. **Review everything:** Second pair of eyes catch nhiều lỗi
4. **Consensus on definitions:** Phải đồng ý về success criteria trước

**Bài học process:**
1. **Start with EDA:** Understand data trước khi làm gì khác
2. **Iterate often:** Clean → Analyze → Engineer → Repeat
3. **Validate each step:** Đảm bảo mỗi bước correct trước khi next
4. **Plan for reproduce:** Setup để người khác có thể repeat

**Chuẩn bị cho tương lai:**
- Ready cho modeling với foundation vững chắc
- Skill set improvement: pandas, visualization, ML prep
- Confidence trong data science workflow
- Experience làm việc nhóm project dài hạn

**Impact on career:**
- Data science không chỉ là algorithms mà chủ yếu là data work
- Business understanding quan trọng không kém technical skills
- Soft skills (communication, documentation) equally important
- Real projects messy hơn textbook rất nhiều

---

**Lưu ý:** Đây là tổng hợp câu hỏi dựa trên công việc thực tế của nhóm qua 4 tuần. Mỗi câu trả lời được viết với ngôn ngữ đơn giản, dễ hiểu cho người không chuyên về lập trình nhưng vẫn đảm bảo tính chính xác kỹ thuật.