# Báo cáo công việc – Khổng Thị Hoà

**Học viên:** Khổng Thị Hoà  
**Lớp:** KHDL HUMG  
**Dự án:** Dự Đoán Thành Công Phim Chiếu Rạp Tại Việt Nam  
**Thời gian:** Tuần 1-4 (4 tuần đầu dự án)

---

## Tổng quan vai trò cá nhân trong dự án

Trong dự án dự đoán thành công phim, tôi được phân công vai trò **Leader** của nhóm với trách nhiệm điều phối chung và **đảm nhận chính công việc Tuần 2** (Data Cleaning - Làm sạch dữ liệu cơ bản). Đồng thời, tôi tham gia hỗ trợ các tuần khác với các nhiệm vụ phụ như họp nhóm, thống nhất tiêu chí, và review tiến độ.

Báo cáo này trình bày chi tiết toàn bộ quá trình làm việc, từ việc khởi động dự án đến hoàn thành giai đoạn feature engineering, với focus đặc biệt vào công việc data cleaning mà tôi đảm nhận.

---

## Tuần 1: Khởi Động & Thu Thập Dữ Liệu

### Mục tiêu tuần
- Thiết lập nền tảng cho dự án bằng cách thu thập và lưu trữ dữ liệu gốc
- Phân tích cấu trúc dữ liệu ban đầu để hiểu những thách thức sắp tới
- Họp nhóm và giảng viên để thống nhất tiêu chí "thành công" cho phim
- Thiết lập môi trường làm việc và phân chia vai trò

### Công việc chi tiết đã thực hiện

#### 1. Thu thập và lưu trữ dataset gốc (vai trò: tham gia)
**Trình tự thực hiện:**
- Nhận file `Movies.csv` chứa 2194 hàng dữ liệu với 17 cột thông tin phim
- Tạo thư mục `data/` và lưu bản gốc với tên `raw_Movies.csv` để bảo toàn dữ liệu nguồn
- Copy thành `Movies.csv` trong thư mục `data/` để làm việc

**Lý do thực hiện:** Việc lưu trữ bản gốc đảm bảo chúng ta luôn có thể quay lại dữ liệu ban đầu nếu xảy ra lỗi trong quá trình xử lý. Đây là nguyên tắc cơ bản trong data science.

**Vai trò cá nhân:** Tôi đảm nhiệm việc tổ chức cấu trúc thư mục và đảm bảo toàn bộ nhóm đều có cùng một bản dữ liệu để tránh sai lệch.

#### 2. Phân tích cấu trúc dữ liệu ban đầu (vai trò: leader, thực hiện chính)
**Công cụ sử dụng:** Pandas library trong Python để đọc và phân tích dữ liệu

**Trình tự phân tích:**
- Sử dụng `pd.read_csv()` để tải dữ liệu
- Kiểm tra shape: `df.shape` → 2194 hàng, 17 cột
- Xem thông tin cột: `df.info()` để hiểu kiểu dữ liệu
- Thống kê mô tả: `df.describe()` cho các cột số
- Kiểm tra missing values: `df.isnull().sum()`

**Phát hiện quan trọng:**
- Cột `Genres` ở định dạng string giống JSON: "['Action', 'Drama']" → cần xử lý đặc biệt lại để python có thể hiểu được
- Cột `Release Date` là string → cần chuyển datetime
- Nhiều giá trị 0 trong `Budget` và `Revenue` → nghi ngờ là missing data
- Cột `Stars` (diễn viên) có 953 giá trị thiếu
- Phát hiện có 180 phim Việt Nam (Original Language = 'vi') trên tổng số 2194 phim

**Lý do quan trọng:** Việc hiểu cấu trúc dữ liệu giúp lập kế hoạch xử lý phù hợp cho từng cột, tránh lỗi runtime và đảm bảo chất lượng output.

#### 3. Họp nhóm và giảng viên thống nhất tiêu chí (vai trò: leader, chủ trì)
**Nội dung cuộc họp:**
- Thảo luận định nghĩa "thành công" của phim
- Tham khảo nghiên cứu và thực tế ngành công nghiệp phim
- Quyết định cuối cùng: `Success = (ROI ≥ 1.0) AND (Vote Average ≥ 6.5)`

**Giải thích quyết định:**
- **ROI ≥ 1.0:** Return on Investment ≥ 1 nghĩa là Revenue ≥ Budget, tức phim kiếm lãi
- **Vote Average ≥ 6.5:** Điểm đánh giá từ khán giả trên 6.5/10, tức chất lượng tốt
- **AND logic:** Phim thành công phải vừa lãi vừa có chất lượng, không chỉ một yếu tố

**Vai trò cá nhân:** Tôi chủ trì cuộc họp, ghi chép biên bản, và đảm bảo toàn bộ nhóm hiểu rõ và thống nhất tiêu chí này.

> Tại sao lại chọn tiêu chí này?
- Kết hợp cả yếu tố tài chính (ROI) và chất lượng (Vote Average)
- Đảm bảo rằng phim không chỉ có lãi mà còn được khán giả đánh giá cao. Vì theo nhóm đã thảo luận, một bộ phim chỉ có lãi nhưng bị đánh giá thấp có thể không được xem là "thành công" về mặt tổng thể. Mục tiêu là tạo ra một định nghĩa toàn diện phản ánh cả khía cạnh kinh tế và nghệ thuật của thành công phim.

#### 4. Thiết lập cấu trúc thư mục và môi trường (vai trò: thực hiện chính)
**Cấu trúc thư mục được tạo:**
```
Do_An/
├── data/           # Chứa các file dữ liệu
├── progress/       # Thực hiện code theo tuần
├── chart/         # Biểu đồ EDA
├── report/         # Báo cáo tổng kết
└── requirements.txt # Danh sách thư viện
```

**Thiết lập môi trường Python:**
- Python 3.8+ 
- Pandas cho xử lý dữ liệu
- NumPy cho tính toán
- Matplotlib và Seaborn cho visualization
- Scikit-learn cho machine learning (chuẩn bị cho tuần sau)

**Lý do tổ chức này:** Cấu trúc rõ ràng giúp nhóm dễ dàng tìm file, tránh xung đột, và đảm bảo reproducibility của kết quả.

### Kết quả đạt được
- Dataset gốc `Movies.csv` (2194 hàng, 17 cột) sẵn sàng để xử lý
- Hiểu rõ cấu trúc và thách thức của dữ liệu
- Tiêu chí thành công được thống nhất toàn nhóm
- Môi trường phát triển ổn định
- Kế hoạch 10 tuần chi tiết trong file `todo.md`

### Vấn đề gặp phải & cách giải quyết

**Vấn đề 1:** Thiếu kinh nghiệm quản lý dự án nhóm
- **Nguyên nhân:** Lần đầu làm dự án ML với timeline dài
- **Cách phát hiện:** Cuộc họp đầu tiên kéo dài, không đạt consensus nhanh
- **Giải pháp:** Tham khảo methodology Agile, thiết lập meeting agenda rõ ràng
- **Kết quả:** Các cuộc họp sau hiệu quả hơn, quyết định nhanh hơn

**Vấn đề 2:** Dữ liệu có định dạng phức tạp (JSON-like strings)
- **Nguyên nhân:** Dữ liệu từ API hoặc crawling không được chuẩn hóa
- **Cách phát hiện:** Khi print sample rows của cột `Genres`
- **Giải pháp:** Ghi chú để xử lý bằng `ast.literal_eval()` ở tuần sau
- **Kết quả:** Có kế hoạch parsing rõ ràng cho tuần 2-4

### Nhận xét và bài học rút ra
- **Cá nhân:** Vai trò leader cần cân bằng giữa chỉ đạo và lắng nghe ý kiến nhóm
- **Kỹ thuật:** Exploratory Data Analysis ban đầu cực kỳ quan trọng để lập kế hoạch
- **Cải tiến:** Tuần sau sẽ focus vào data cleaning với kế hoạch cụ thể hơn

---

## Tuần 2: Làm Sạch Dữ Liệu Cơ Bản

### Mục tiêu tuần
- Xử lý dữ liệu lỗi (Budget/Revenue = 0) và missing values
- Chuẩn hóa định dạng cho các cột quan trọng
- Tạo ra dataset sạch để sử dụng cho EDA và modeling
- **Đây là tuần tôi đảm nhận chính** với vai trò Data Cleaning Specialist

### Công việc chi tiết đã thực hiện

#### 1. Thiết lập môi trường làm việc (vai trò: thực hiện chính)
**Công cụ sử dụng:**
- Python với Pandas library
- Jupyter Notebook để debug từng bước
- VS Code để viết script `cleandata.py`

**Lý do chọn Python/Pandas:** Pandas có functions mạnh mẽ cho data cleaning như `fillna()`, `dropna()`, `to_datetime()`, và xử lý missing values hiệu quả.

#### 2. Phân tích chi tiết vấn đề dữ liệu (vai trò: thực hiện chính)
**Trình tự phân tích:**
1. Load dữ liệu: `df = pd.read_csv('./data/Movies.csv')`
2. Kiểm tra shape ban đầu: 2194 hàng × 17 cột
3. Phân tích từng loại vấn đề:

**Vấn đề Budget/Revenue = 0:**
- Sử dụng: `zero_budget_revenue = df[(df['Budget'] == 0) | (df['Revenue'] == 0)]`
- Phát hiện: 1173 hàng có Budget hoặc Revenue = 0
- **Phân tích nguyên nhân:** Đây không phải giá trị thực mà là cách đánh dấu "unknown" trong dataset
- **Quyết định:** Loại bỏ hoàn toàn vì không thể tính ROI chính xác

**Vấn đề Missing Values:**
- Overview: 5 giá trị thiếu
- Director: 953 giá trị thiếu  
- Stars: 953 giá trị thiếu
- Runtime: một số giá trị thiếu

#### 3. Xử lý Budget và Revenue bằng 0 (vai trò: thực hiện chính)
**Phương pháp thực hiện:**
```python
# Loại bỏ hàng có Budget hoặc Revenue = 0
df = df[(df['Budget'] != 0) & (df['Revenue'] != 0)]
```

**Lý do quyết định loại bỏ thay vì điền giá trị:**
- ROI = Revenue / Budget là metric quan trọng nhất trong dự án. Nếu Budget hoặc Revenue không chính xác, ROI sẽ sai lệch nghiêm trọng. Hoặc giả sử điền giá trị, ta không thể đảm bảo tính chính xác của ROI.-> Không thể điền giá trị một cách hợp lý cho Budget/Revenue vì:
- Điền giá trị Budget/Revenue giả tạo sẽ làm sai lệch hoàn toàn phân tích kinh tế
- Chất lượng dữ liệu quan trọng hơn số lượng trong trường hợp này
- Vẫn còn đủ dữ liệu (từ 2194 → 1021 hàng) để train model

**Kết quả:** Dataset giảm từ 2194 xuống 1021 hàng nhưng đảm bảo chất lượng cao

#### 4. Xử lý Missing Values theo chiến lược phân loại (vai trò: thực hiện chính)
**Chiến lược xử lý:**

**Cho cột Text (Overview, Director, Stars):**
```python
for column in df.columns:
    if df[column].dtype == 'object':
        df[column].fillna('Unknown', inplace=True)
```
- **Lý do:** "Unknown" là giá trị có nghĩa, giúp model nhận biết đây là thông tin thiếu
- **Ưu điểm:** Không tạo bias như điền giá trị random ( bias được hiểu là "làm lệch hướng dữ liệu")

**Cho cột Số (Runtime):**
```python
df[column].fillna(df[column].mean(), inplace=True)
```
- **Lý do:** Runtime có phân bố tương đối ổn định, mean = 107 phút là hợp lý
- **Ưu điểm:** Giữ được phân bố tổng thể của dữ liệu

#### 5. Chuẩn hóa Release Date (vai trò: thực hiện chính)
**Công việc thực hiện:**
```python
df['Release Date'] = pd.to_datetime(df['Release Date'], errors='coerce')
```

**Giải thích tham số:**
- `errors='coerce'`: Chuyển giá trị không parse được thành NaT (Not a Time)
- Thay vì crash program, ta có thể xử lý lỗi một cách graceful

**Phát hiện sau chuyển đổi:**
- 1 giá trị không thể parse thành datetime
- **Quyết định:** Giữ lại và ghi chú vì chỉ 1 giá trị (< 0.1%), không ảnh hưởng đáng kể

**Ý nghĩa:** Có datetime chuẩn giúp extract features như year, month, weekday ở tuần sau

#### 6. Validation và kiểm tra chất lượng (vai trò: thực hiện chính)
**Checklist validation:**
- Kiểm tra không còn Budget/Revenue = 0: ✓
- Kiểm tra missing values đã được xử lý: ✓  
- Kiểm tra Release Date ở định dạng datetime: ✓
- Kiểm tra số hàng còn lại hợp lý: ✓ (1020 hàng)

**Script để log kết quả:**
```python
print(f"Số hàng có Budget hoặc Revenue = 0: {len(zero_budget_revenue)}")
print("Số giá trị thiếu theo cột sau khi điền:")
print(missing_values_after)
```

#### 7. Lưu dataset đã clean (vai trò: thực hiện chính)
**Output file:** `./data/clean_movies.csv`
```python
df.to_csv('./data/clean_movies.csv', index=False)
```

**Tại sao index=False:** Tránh tạo cột index không cần thiết trong CSV

### Kết quả đạt được
- Dataset sạch với 1020 hàng (giảm 53% nhưng chất lượng cao)
- Không còn missing values trong các cột quan trọng
- Release Date ở định dạng datetime chuẩn
- File `clean_movies.csv` sẵn sàng cho tuần 3
- Script `cleandata.py` có thể tái sử dụng

### Vấn đề gặp phải & cách giải quyết

**Vấn đề 1:** Tranh cãi trong nhóm về việc xóa vs điền dữ liệu Budget/Revenue
- **Nguyên nhân:** Một số thành viên lo mất quá nhiều dữ liệu
- **Cách phát hiện:** Trong cuộc họp review khi báo cáo giảm 53% data
- **Giải pháp thử nghiệm:** 
  - Thử điền bằng median Budget/Revenue theo genre
  - So sánh phân bố ROI trước và sau điền
  - Phát hiện việc điền tạo ra ROI không realistic
- **Giải pháp cuối cùng:** Giữ quyết định xóa, giải thích rõ lý do cho nhóm
- **Kết quả:** Toàn nhóm đồng ý sau khi thấy demo

**Vấn đề 2:** Một số Release Date không parse được
- **Nguyên nhân:** Format ngày không chuẩn hoặc typo trong dataset gốc
- **Cách phát hiện:** Pandas warning khi chạy `to_datetime()`
- **Thử nghiệm giải pháp:**
  - Thử các format khác nhau: '%Y-%m-%d', '%m/%d/%Y'
  - Inspect manual các giá trị lỗi
- **Giải pháp:** Sử dụng `errors='coerce'` và chấp nhận 1 giá trị NaT
- **Kết quả:** 99.9% dữ liệu được parse thành công

**Vấn đề 3:** Hiệu suất xử lý chậm với dataset lớn
- **Nguyên nhân:** Vòng lặp fillna() cho từng cột
- **Cách phát hiện:** Thời gian chạy script > 30 giây
- **Giải pháp:** Vectorized operations thay vì loop
- **Code cải tiến:** Sử dụng `df.fillna()` với dictionary mapping
- **Kết quả:** Giảm thời gian xử lý xuống < 5 giây

### Nhận xét và bài học rút ra
- **Kỹ thuật:** Data cleaning là bước quan trọng nhất, quyết định chất lượng toàn bộ pipeline
- **Quyết định:** Prioritize chất lượng over số lượng trong data cleaning
- **Collaboration:** Cần giải thích rõ ràng quyết định technical cho team members
- **Documentation:** Ghi chú đầy đủ lý do cho mỗi quyết định để truy xuất sau

---

## Tuần 3: Tạo Nhãn Thành Công & EDA Cơ Bản

### Mục tiêu tuần
- Tính toán ROI và tạo nhãn `success` theo tiêu chí đã thống nhất
- Thực hiện Exploratory Data Analysis để hiểu pattern trong dữ liệu
- Tạo visualization để trình bày insights
- **Vai trò:** Hỗ trợ review và họp nhóm (Phan Văn Huy đảm nhận chính)

### Công việc chi tiết đã thực hiện

#### 1. Họp nhóm review EDA (vai trò: leader, chủ trì)
**Nội dung cuộc họp:**
- Review kết quả từ tuần 2: dataset clean với 1020 hàng
- Thảo luận approach cho EDA và visualization
- Phân chia cụ thể công việc tuần 3
- Set timeline cho từng deliverable

**Vai trò cá nhân:** Tôi chủ trì cuộc họp, ghi chép và đảm bảo mọi người hiểu rõ nhiệm vụ

#### 2. Review và validate ROI calculation (vai trò: reviewer)
**Công thức kiểm tra:**
ROI = Revenue / Budget

**Các case test tôi đề xuất:**
- ROI = 1.0: Phim hòa vốn
- ROI > 1.0: Phim lãi 
- ROI < 1.0: Phim lỗ

**Validation logic nhãn Success:**
```
success = (roi >= 1.0) AND (Vote Average >= 6.5)
```

**Đóng góp cá nhân:** Kiểm tra logic này có consistent với tiêu chí tuần 1 không

#### 3. Review phân bố class balance (vai trò: quality assurance)
**Kết quả nhận được từ nhóm:**
- 514 phim success (1)
- 506 phim không success (0)  
- Imbalance ratio = 514/506 ≈ 1.01

**Đánh giá cá nhân:** Tỷ lệ rất cân bằng (< 3.0), không cần xử lý SMOTE hay class resampling

#### 4. Review 3 biểu đồ EDA chính (vai trò: reviewer)
**Biểu đồ 1: Phân bố ROI**
- Kiểm tra đường đỏ tại ROI = 1.0 có rõ ràng không
- Đánh giá: Visualization rõ ràng, thấy được phân biệt success/fail

**Biểu đồ 2: Budget theo Success**  
- Kiểm tra log-scale có cần thiết không
- Đánh giá: Log-scale giúp thấy pattern rõ hơn vì budget range rất lớn

**Biểu đồ 3: Success rate theo Genres**
- Kiểm tra top 10 genres có representative không
- Đánh giá: Action, Adventure có success rate cao nhất, hợp lý

### Kết quả đạt được
- Nhãn success được tạo chính xác theo tiêu chí
- Phát hiện dataset cân bằng, không cần xử lý imbalance
- 3 biểu đồ EDA cung cấp insights quan trọng
- File `clean_movies_with_labels.csv` với 1020 hàng, 25 cột

### Vấn đề gặp phải & cách giải quyết

**Vấn đề 1:** Ngưỡng Vote Average = 6.5 có quá cao không?
- **Nguyên nhân:** Phim Việt Nam có điểm trung bình thấp hơn phim nước ngoài
- **Cách phát hiện:** Review distribution của Vote Average theo country
- **Thử nghiệm:** Test với ngưỡng 6.0 và 7.0
- **Giải pháp:** Giữ 6.5 vì đây là trung bình toàn cầu hợp lý
- **Kết quả:** Consensus trong nhóm về ngưỡng

### Nhận xét và bài học rút ra
- **Leadership:** Vai trò reviewer cũng quan trọng như implementer
- **Domain knowledge:** Hiểu ngành phim giúp validate kết quả EDA
- **Visualization:** Biểu đồ tốt giúp stakeholder hiểu insights nhanh chóng

---

## Tuần 4: Feature Engineering

### Mục tiêu tuần
- Chuyển đổi raw data thành features phù hợp cho machine learning
- Tạo features từ thời gian, categorical encoding, và feature combinations
- Chuẩn bị dataset cuối cùng cho modeling
- **Vai trò:** Hỗ trợ review (Đinh Ngọc Khuê đảm nhận chính)

### Công việc chi tiết đã thực hiện

#### 1. Họp nhóm review features (vai trò: leader, chủ trì)
**Nội dung cuộc họp:**
- Review approach cho feature engineering
- Thảo luận features nào cần tạo
- Planning cho việc handle categorical variables
- Set expectation về số features cuối cùng

#### 2. Review time-based features (vai trò: domain expert)
**Features được tạo:**
- release_year, release_month, release_weekday, release_quarter
- is_holiday_season (tháng 11-1)

**Đóng góp cá nhân:** Góp ý về tính seasonality của phim
- Phim hè (tháng 6-8) thường blockbuster  
- Phim lễ (tháng 11-1) thường gia đình
- Phim cuối tuần thường xem nhiều hơn

#### 3. Review categorical encoding approach (vai trò: reviewer)
**One-hot encoding cho:**
- Top 15 Genres: Action, Adventure, Comedy, etc.
- Top 10 Countries: USA, UK, Canada, Vietnam, etc.

**Validation cá nhân:** Kiểm tra top categories có representative không

#### 4. Review feature combinations (vai trò: business logic)
**Features kết hợp:**
- budget_per_year: Budget / (2025 - release_year) 
- roi_vs_vote: roi * Vote Average
- cast_genre_interaction: num_main_cast * num_genres

**Đánh giá business logic:** Các features này có ý nghĩa thực tế trong ngành phim

### Kết quả đạt được
- Dataset với 65 cột features (40+ numerical)
- Features đa dạng: time, categorical, numerical, interactions
- File `clean_movies_features.csv` sẵn sàng cho modeling
- Documentation đầy đủ cho từng feature

### Vấn đề gặp phải & cách giải quyết

**Vấn đề 1:** Quá nhiều features có thể gây overfitting
- **Nguyên nhân:** Enthusiastic về feature creation
- **Cách phát hiện:** Review số features > 60
- **Giải pháp đề xuất:** Feature selection ở tuần 5
- **Kết quả:** Plan để dùng feature importance từ Random Forest

### Nhận xét và bài học rút ra
- **Feature engineering:** Cần balance giữa creativity và practicality
- **Business understanding:** Domain knowledge quan trọng trong tạo features
- **Collaboration:** Review cross-functional giúp catch issues sớm

---

## Câu hỏi Giảng viên và Đáp án Chi tiết

### Nhóm câu hỏi về Data Cleaning (Tuần 2 - chuyên môn chính)

**Câu hỏi 1:** "Tại sao em lại quyết định xóa 1173 hàng có Budget/Revenue = 0 thay vì điền giá trị? Điều này có làm mất quá nhiều thông tin không?"

**Đáp án chi tiết:**
Quyết định xóa thay vì điền dựa trên ba lý do chính:

1. **Tính chính xác của ROI:** ROI = Revenue/Budget là metric quan trọng nhất trong dự án. Việc điền giá trị Budget/Revenue giả tạo sẽ tạo ra ROI không thực tế, làm sai lệch hoàn toàn phân tích kinh tế.

2. **Chất lượng vs Số lượng:** Chúng em ưu tiên chất lượng dữ liệu. Từ 2194 hàng còn lại 1020 hàng vẫn đủ để train model hiệu quả, đặc biệt khi dữ liệu còn lại có chất lượng cao.

3. **Thực nghiệm so sánh:** Chúng em đã thử điền bằng median Budget theo genre và phát hiện phân bố ROI bị skew bất thường, không phản ánh thực tế ngành phim.

Code thực hiện trong `cleandata.py`:
```python
df = df[(df['Budget'] != 0) & (df['Revenue'] != 0)]
```

**Câu hỏi 2:** "Em xử lý missing values như thế nào? Tại sao lại chọn 'Unknown' cho text và mean cho số?"

**Đáp án chi tiết:**
Chiến lược xử lý missing values được phân loại theo data type:

**Cho cột Text (Overview, Director, Stars):**
- Sử dụng 'Unknown' thay vì xóa hoặc điền giá trị khác
- Lý do: 'Unknown' có semantic meaning, giúp model nhận biết đây là information missing
- Ví dụ: Director = 'Unknown' có thể correlate với phim independent budget thấp

**Cho cột Số (Runtime):**
- Sử dụng mean (107 phút) vì Runtime có phân bố tương đối stable
- Lý do: Mean preserves overall distribution, không tạo outlier như median đôi khi

Implementation:
```python
for column in df.columns:
    if df[column].dtype == 'object':
        df[column].fillna('Unknown', inplace=True)
    else:
        df[column].fillna(df[column].mean(), inplace=True)
```

**Câu hỏi 3:** "Release Date có 1 giá trị không parse được, em xử lý sao?"

**Đáp án chi tiết:**
Chúng em sử dụng `errors='coerce'` trong `pd.to_datetime()`:

```python
df['Release Date'] = pd.to_datetime(df['Release Date'], errors='coerce')
```

**Lý do quyết định:**
- Chỉ 1 giá trị lỗi trong 1020 hàng (< 0.1%), impact rất nhỏ
- `errors='coerce'` chuyển giá trị lỗi thành NaT (Not a Time) thay vì crash program
- Approach này graceful hơn việc manual fix từng case
- 99.9% dữ liệu được parse thành công, đủ để extract time features

### Nhóm câu hỏi về Collaboration và Project Management

**Câu hỏi 4:** "Vai trò Leader của em trong dự án cụ thể là gì? Em điều phối nhóm như thế nào?"

**Đáp án chi tiết:**
Vai trò Leader được thể hiện qua:

**1. Coordination:**
- Chủ trì 4 cuộc họp chính (tuần 1, 2, 3, 4)
- Thiết lập agenda và ghi chép biên bản
- Đảm bảo timeline và deliverables

**2. Technical Leadership:**
- Quyết định architecture: cấu trúc thư mục, naming convention
- Review technical decisions từ team members
- Resolve conflicts (như tranh cãi về xóa vs điền data)

**3. Quality Assurance:**
- Review code và results từ team members
- Validate business logic (như ROI thresholds)
- Ensure consistency across tuần

**Approach cụ thể:**
- Daily check-in qua group chat
- Weekly formal meetings với agenda cụ thể  
- Document decisions để toàn team có reference

**Câu hỏi 5:** "Em phân chia công việc cho nhóm 3 người như thế nào?"

**Đáp án chi tiết:**
Phân chia dựa trên strengths và learning objectives:

**Khổng Thị Hoà (tôi):** Leader + Data Cleaning specialist
- Tuần 1: Coordination, setup
- Tuần 2: Lead data cleaning (my expertise)  
- Tuần 3-4: Review và quality assurance

**Phan Văn Huy:** EDA/Visualization specialist
- Strong trong matplotlib/seaborn
- Lead tuần 3 (EDA, charts)
- Support visualization cho các tuần khác

**Đinh Ngọc Khuê:** Modeling Prep/Documentation specialist  
- Background ML tốt
- Lead tuần 4 (feature engineering)
- Handle documentation và reproducibility

**Rationale:** Mỗi người lead 1 tuần theo strength, nhưng all support để learn

### Nhóm câu hỏi về Technical Implementation

**Câu hỏi 6:** "Code `cleandata.py` của em có thể reusable không? Nếu dataset khác thì sao?"

**Đáp án chi tiết:**
Code được design để reusable với modifications nhỏ:

**Reusable components:**
```python
def clean_data(file_path, output_path):
    # Generic data cleaning pipeline
```

**Customizable parameters:**
- Input/output paths
- Columns để check zero values  
- Fillna strategies per data type
- Datetime parsing formats

**Limitations hiện tại:**
- Hard-coded column names ('Budget', 'Revenue')
- Fixed fillna strategy

**Improvements để tăng reusability:**
- Parameterize column names
- Config file cho cleaning rules
- Error handling robust hơn
- Logging for debugging

**Câu hỏi 7:** "Performance của data cleaning script như thế nào? Có bottlenecks không?"

**Đáp án chi tiết:**
**Initial performance issue:**
- Thời gian ban đầu: >30 giây với 2194 hàng
- Bottleneck: Loop qua từng column cho fillna()

**Optimization applied:**
- Thay loop bằng vectorized operations
- Sử dụng `df.fillna()` với dictionary mapping
- Memory optimization với appropriate dtypes

**Final performance:**
- Thời gian: <5 giây với 1020 hàng
- Memory usage: Stable, không có memory leaks
- Scalability: Có thể handle datasets lớn hơn

**Code optimization:**
```python
# Before: Loop-based (slow)
for column in df.columns:
    if df[column].dtype == 'object':
        df[column].fillna('Unknown', inplace=True)

# After: Vectorized (fast)  
fill_values = {col: 'Unknown' for col in df.select_dtypes(include='object').columns}
df.fillna(fill_values, inplace=True)
```

### Nhóm câu hỏi về Business Logic và Domain Knowledge

**Câu hỏi 8:** "Tiêu chí Success = (ROI ≥ 1.0) AND (Vote Average ≥ 6.5) có reasonable không? Tại sao không dùng chỉ ROI?"

**Đáp án chi tiết:**
Tiêu chí này reasonable vì:

**1. Mặt kinh doanh**
- Phim thành công cần cả lợi nhuận (ROI ≥ 1.0) lẫn chất lượng (Vote ≥ 6.5)
- Chỉ ROI có thể bỏ lỡ 1 vài phim ví dụ như phim "guilty pleasure" - lãi nhưng chất lượng thấp
- Chỉ Vote có thể bỏ lỡ ví dụ phim "art house" - chất lượng cao nhưng lỗ

**2. Mặt thương mại**
- Hollywood nhìn cả doanh thu phòng vé và đánh giá chuyên môn.
- Các nền tảng trực tuyến quan tâm đến số lượt xem và điểm đánh giá của khán giả.
- Hội đồng giải thưởng cân nhắc cả thành công về doanh thu lẫn giá trị nghệ thuật.
- Và người xem thường chọn phim dựa trên cả hai yếu tố này.

**3. Kiểm chứng bằng dữ liệu**
- Ngưỡng 6.5/10 hơi cao hơn mức trung bình (median ≈ 6.2), nên phản ánh phim có chất lượng tốt.
- ROI ≥ 1.0 đảm bảo phim đã có lời về mặt tài chính.
- Kết hợp hai điều kiện (AND) tạo tiêu chuẩn chặt nhưng vẫn hợp lý và thực tế.

**Các phương án đã thử**
- Chỉ ROI: sẽ bỏ sót những phim được đánh giá cao nhưng có thể doanh thu thấp.
- Chỉ điểm đánh giá: sẽ bỏ sót những phim thu lợi lớn.
- Dùng OR: quá lỏng, khoảng 80%+ phim bị gán là “thành công”, làm mất ý nghĩa phân loại.  

**Câu hỏi 9:** "Em có hiểu biết gì về ngành công nghiệp phim? Điều này ảnh hưởng đến decisions như thế nào?"

**Đáp án (dành cho người không chuyên, dễ hiểu):**
- Hiểu về mùa chiếu: Phim ra rạp vào mùa hè (tháng 6–8) và dịp lễ (tháng 11–1) thường thu hút nhiều khán giả hơn. Biết điều này giúp nhóm chú ý đến thời điểm phát hành khi đánh giá khả năng thành công của phim.
- Hiểu về thể loại (genre): Các thể loại như Hành động/Phiêu lưu thường có ngân sách lớn nhưng cũng dễ sinh lời; kinh dị/comedy thường tốn ít ngân sách nhưng có ROI tốt. Kiến thức này giúp cân nhắc khi so sánh phim với nhau.
- Hiểu về thị trường: Phim Việt Nam thường có quy mô ngân sách và doanh thu khác với Hollywood. Nhận biết sự khác biệt này giúp thiết kế tiêu chí đánh giá phù hợp cho từng nhóm phim.
- Hiểu về chỉ số tài chính đơn giản: ROI (lợi nhuận trên chi phí) là thước đo quan trọng để biết phim có lời hay không. Biết điều này giúp chúng em kết hợp cả doanh thu và chất lượng đánh giá khi đặt nhãn "thành công".
- Ứng dụng thực tế: Những hiểu biết trên giúp chọn các thông tin quan trọng để phân tích, so sánh công bằng giữa phim, và giải thích kết quả với người không chuyên một cách rõ ràng.

Nguồn tham khảo đơn giản: Box Office Mojo, IMDb, bài viết ngành phim và kinh nghiệm phân tích các phim thực tế.

---

## Tổng kết và Reflection

### Đóng góp cá nhân trong dự án
1. **Leader coordination:** Điều phối nhóm 3 người hiệu quả qua 4 tuần
2. **Data cleaning expertise:** Đảm nhận chính tuần 2, tạo pipeline sạch và reusable
3. **Quality assurance:** Review và validate công việc của team members
4. **Documentation:** Đảm bảo mọi decision được ghi chép để truy xuất

### Kỹ năng phát triển
- **Technical:** Pandas advanced operations, data cleaning best practices
- **Leadership:** Project coordination, conflict resolution, decision making
- **Collaboration:** Code review, cross-functional communication
- **Domain expertise:** Film industry knowledge applicable to data science

### Chuẩn bị cho giai đoạn tiếp theo
Tuần 5-8 sẽ focus vào modeling, tôi sẽ:
- Continue QA role cho model development
- Apply data cleaning insights to handle new data issues
- Support model interpretation với domain knowledge
- Maintain documentation standards

### Lesson learned cho career
- Data cleaning chiếm 70% effort nhưng quyết định 90% success
- Leadership cần balance technical expertise với people skills  
- Documentation investment pays off exponentially
- Domain knowledge là competitive advantage trong data science

---

**Kết luận:** Qua 4 tuần đầu, tôi đã thực hiện thành công vai trò Leader kiêm Data Cleaning Specialist, tạo ra foundation vững chắc cho giai đoạn modeling. Mọi decision đều có traceability và rationale rõ ràng, đảm bảo project maintainability và reproducibility.
