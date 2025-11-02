# Báo cáo công việc – Khổng Thị Hoà

> Người báo cáo (vai trò thực hiện chính tuần 3): Phan Văn Huy
>
> Lưu ý: tiêu đề theo yêu cầu là của Khổng Thị Hoà nhưng nội dung báo cáo này được viết bởi Phan Văn Huy — tôi liệt kê chi tiết công việc tuần 1→4, trong đó tuần 3 là phần tôi đảm nhiệm chính.

---

## Mục lục

1. Tổng quan ngắn
2. Tuần 1
3. Tuần 2
4. Tuần 3 (chi tiết — phần chính do tôi đảm nhiệm)
5. Tuần 4
6. Tổng hợp số liệu & kiểm chứng (bằng chứng, log, file sinh ra)
7. Kế hoạch tuần sau
8. Tài liệu tham khảo

---

## 1. Tổng quan ngắn

Mục tiêu chung của nhóm: thu thập, làm sạch và phân tích dataset phim (file gốc: `data/raw_Movies.csv`), tạo nhãn "success" cho phim dựa trên ROI và điểm đánh giá, thực hiện EDA, và chuẩn bị features cho mô hình dự báo.

Nhóm repo: https://github.com/kwishtt/Do_An_1 (branch làm việc chính của tôi: `huylamchan`)

Các file quan trọng do tôi hoặc nhóm tạo/điều chỉnh liên quan tuần 1–3:

- `progress/week02/week2.py` — script xử lý missing / annotate/impute (của tôi, Phan Văn Huy)
- `progress/week02/raw_movies_report.py` — script tạo báo cáo chi tiết cho `raw_Movies.csv` (tôi viết)
- `progress/week02/raw_movies_report.md` — kết quả báo cáo Markdown (sinh tự động bởi script)
- `progress/week02/raw_movies_missing.csv` — CSV thống kê missing counts (sinh bởi script)
- `progress/week03/crea_label.ipynb` — notebook tạo nhãn success, EDA (notebook nhóm; tôi thực hiện phần EDA và một phần tiền xử lý)

Đường dẫn trên máy (workspace): `/home/huy/Downloads/Do_An_1-main`

---

## 2. Tuần 1

### Mục tiêu tuần

- Họp nhóm, thống nhất tiêu chí (data, nhãn, timeline).
- Thiết lập repository, cấu trúc thư mục, tạo công cụ cơ bản để tải và inspect dữ liệu.

### Công việc chi tiết đã thực hiện

1. Họp nhóm (Leader: Khổng Thị Hoà) — tôi tham gia, thống nhất các đầu việc chính.
2. Tạo/clone repository ban đầu, đồng bộ nhánh làm việc.
   - Lệnh git cơ bản dùng:
     ```bash
     git clone https://github.com/kwishtt/Do_An_1.git
     git checkout -b feature/eda-success-labels
     ```
   - Giải thích: `git clone` tải repo; `git checkout -b` tạo nhánh mới cho công việc EDA để không ảnh hưởng nhánh chính.
3. Khảo sát sơ bộ dataset (số lượng, trường có sẵn) bằng pandas (`pd.read_csv`) trong một script nhanh.

### Kết quả đạt được

- Repository và cấu trúc thư mục rõ ràng.
- Danh sách nhiệm vụ tuần 1 được ghi lại trong `progress/week01/w01.md`.

### Vấn đề & giải pháp

- Không có vấn đề kỹ thuật nghiêm trọng tuần này.

### Kiểm chứng

- Commit lịch sử có trong Git (xem log trên GitHub/branch).

### Nhận xét

- Giai đoạn chuẩn bị trơn tru; các bước tiền xử lý cần chuẩn hoá tuần tiếp theo.

---

## 3. Tuần 2

### Mục tiêu tuần

- Thiết lập môi trường làm việc, cài đặt các thư viện cần thiết.
- Bắt đầu xử lý dữ liệu: fillna, parse datetime, thống kê missing.

### Công việc chi tiết đã thực hiện

1. Thiết lập môi trường ảo (venv) và cài package cơ bản: pandas, numpy, seaborn, matplotlib.
   - Lệnh minh họa:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     pip install -r requirements.txt
     ```
   - Giải thích: venv tạo môi trường cô lập; `requirements.txt` chứa danh sách thư viện cần dùng.

2. Viết script `progress/week02/week2.py` để load file `data/raw_Movies.csv`, kiểm tra và ghi chú các hàng có `Budget` hoặc `Revenue` bằng 0.
   - Đoạn code quan trọng (tôi đã viết hàm `check_finance_zeros`):
     ```python
     def check_finance_zeros(df: pd.DataFrame) -> pd.DataFrame:
         df = df.copy()
         for col in ["Revenue", "Budget"]:
             if col in df.columns:
                 df[col] = pd.to_numeric(df[col], errors="coerce")

         df["budget_is_zero"] = (df.get("Budget", pd.Series(0)) == 0) & df.get("Budget", pd.Series(0)).notna()
         df["revenue_is_zero"] = (df.get("Revenue", pd.Series(0)) == 0) & df.get("Revenue", pd.Series(0)).notna()
         df["budget_or_revenue_zero"] = df["budget_is_zero"] | df["revenue_is_zero"]
         return df
     ```
   - Giải thích: không tự động xóa hay điền các giá trị 0 cho `Budget`/`Revenue` vì cần thảo luận thêm; chỉ flag để báo cáo.

3. Chạy script test (trên một file nhỏ hoặc dataset thực tế) và in ra tỉ lệ missing, ví dụ:
   ```bash
   python3 progress/week02/week2.py
   ```

### Kết quả đạt được

- Script `week2.py` hoạt động và sinh file `data/huy_cleaned_Movies.csv` (bản lưu tạm nếu chạy pipeline đầy đủ).
- Tạo báo cáo missing sơ bộ (xuất phát từ hàm `annotate_and_impute_missing`).

### Vấn đề & giải pháp

- Quyết định giữ nguyên policy cho `Budget`/`Revenue` = 0 (flag, không impute) vì:
  - Nếu điền ngẫu nhiên sẽ làm sai phân phối doanh thu
  - Cần thảo luận với nhóm/giảng viên để chọn chiến lược (loại bỏ, giả định, hoặc mô hình hóa riêng)

### Kiểm chứng

- File `progress/week02/week2.py` có thể chạy và xuất `huy_cleaned_Movies.csv` (nếu chạy toàn pipeline). Xem file trong repo.

### Nhận xét

- Việc flag thay vì tự động điền là an toàn hơn; tuần sau sẽ dùng flag để quyết định lọc hoặc giữ mẫu.

---

## 4. Tuần 3 (PHẦN CHÍNH: Phan Văn Huy đảm nhiệm)

Tuần 3 là trọng tâm của báo cáo này — tôi chịu trách nhiệm chính cho EDA, thống kê, tạo nhãn success và chuẩn bị các biểu đồ minh họa.

### Mục tiêu tuần

1. Tạo nhãn `success` cho mỗi phim dựa trên ROI và điểm đánh giá.
2. Thực hiện EDA: phân bố ROI, quan hệ giữa Budget/Revenue và success, tỷ lệ thành công theo thể loại.
3. Sinh các file báo cáo để giảng viên có thể kiểm chứng (Markdown + hình ảnh).

### Công việc chi tiết đã thực hiện (từng bước)

1) Chuẩn bị dữ liệu

- Tập tin gốc: `data/raw_Movies.csv` (chi tiết thống kê: số hàng 2193, số cột 17). Tôi đã viết script `progress/week02/raw_movies_report.py` để kiểm tra sơ bộ dataset (xem phần kiểm chứng để mở file báo cáo tự động sinh).

- Lệnh chạy (để tái tạo):
  ```bash
  python3 progress/week02/raw_movies_report.py
  ```

2) Xử lý tiền đề cho EDA

- Chuyển `Release Date` sang datetime trong notebook `progress/week03/crea_label.ipynb`:
  ```python
  df_work['Release Date'] = pd.to_datetime(df_work['Release Date'], errors='coerce')
  df_work['release_year'] = df_work['Release Date'].dt.year
  df_work['release_month'] = df_work['Release Date'].dt.month
  df_work['release_weekday'] = df_work['Release Date'].dt.dayofweek
  ```

- Lý do: nhiều phân tích sẽ theo năm/tháng/weekday; `errors='coerce'` giúp chuyển các giá trị không hợp lệ thành `NaT` (và dễ đếm missing).

3) Tính ROI và tạo nhãn `success`

- Định nghĩa dùng: ROI = Revenue / Budget
- Ngưỡng success (quy ước nhóm):
  - ROI >= 1.0 (hòa vốn hoặc có lãi)
  - Vote Average >= 6.5 (điểm đánh giá khán giả/tổ chức)

- Code đã sử dụng (notebook `crea_label.ipynb`):
  ```python
  df_work['roi'] = df_work['Revenue'] / df_work['Budget']
  success_threshold_roi = 1.0
  success_threshold_rating = 6.5
  df_work['success'] = (
      (df_work['roi'] >= success_threshold_roi) &
      (df_work['Vote Average'] >= success_threshold_rating)
  ).astype(int)
  ```

- Lý do chọn: ROI thể hiện hiệu quả tài chính; kết hợp với đánh giá (Vote Average) để loại bỏ những phim tuy có lợi nhưng điểm thấp (ví dụ: phim rẻ tiền nhưng được đánh giá thấp).

4) EDA và biểu đồ chính

- Các biểu đồ được tạo bằng Seaborn/Matplotlib trong notebook:
  - Phân bố ROI (histogram with KDE)
  - Boxplot Budget theo nhãn `success` (đã log-scale)
  - Tỷ lệ thành công theo thể loại (top 10 genres)

- Ví dụ code (đoạn tạo histogram ROI):
  ```python
  roi_data = df_work['roi'].dropna()
  roi_data = roi_data[roi_data <= roi_data.quantile(0.95)]
  sns.histplot(roi_data, bins=50, kde=True, color='skyblue', edgecolor='black')
  plt.axvline(1.0, color='red', linestyle='--', linewidth=2, label='ROI = 1.0')
  ```

- Lý do: loại bỏ 5% outlier trên đỉnh (percentile 95) giúp biểu đồ hiển thị rõ ràng phân bố phần lớn dữ liệu.

5) Lưu kết quả

- Lưu file dữ liệu đã gắn nhãn: `data/clean_movies_with_labels.csv` (dòng cuối notebook).

6) Thực hiện các báo cáo hỗ trợ (tạo file Markdown/CSV)

- Trong tuần 3 tôi cũng viết script báo cáo `raw_movies_report.py` (xem tuần 2/kiểm chứng). Mục đích: cung cấp số liệu cơ bản để giảng viên xác minh (row count, missing %, top values, numeric stats).

### Kết quả đạt được (số liệu cụ thể)

1. Số lượng bản ghi gốc: 2193 (từ `raw_Movies.csv`).
2. Các cột có missing cao:
   - `Stars`: 1737 missing (~79.21%)
   - `Director`: 1730 missing (~78.89%)
   - `Overview`: 110 missing (~5.02%)

3. Thống kê numeric (tóm tắt):
   - `Revenue` mean ≈ 1.03e8, median 2,856,712 (các giá trị 0 tồn tại)
   - `Budget` mean ≈ 3.08e7, median 201,822 (các giá trị 0 tồn tại)
   - `Runtime` median ≈ 103

4. Nhãn `success` (kết quả sơ bộ):
   - Số phim success=1: (đếm tự động khi chạy notebook; ví dụ, notebook in ra vài chục phần trăm — vui lòng mở `crea_label.ipynb` để có số chính xác theo lúc chạy)

5. File và artifacts đã tạo:
   - `progress/week02/raw_movies_report.md` — báo cáo chi tiết dataset (đã sinh, xem phần kiểm chứng để đường dẫn file)
   - `progress/week02/raw_movies_missing.csv` — bảng missing counts
   - `data/clean_movies_with_labels.csv` — dữ liệu đã gắn nhãn (nếu bạn chạy notebook đến cuối)

### Vấn đề gặp phải & cách giải quyết (báo cáo chi tiết)

1) Thiếu package `tabulate` khi sinh Markdown report

- Triệu chứng: khi chạy `raw_movies_report.py` lần đầu, pandas `.to_markdown()` ném ImportError (missing 'tabulate').
- Log (trích):
  ```text
  ImportError: Missing optional dependency 'tabulate'.  Use pip or conda to install tabulate.
  ```
- Cách phát hiện: lỗi xuất ngay khi gọi `to_markdown()` trong script.
- Giải pháp: thêm fallback function `md_table()` để dùng `.to_string()` nếu `to_markdown()` không khả dụng; cũng bổ sung hướng dẫn cài đặt `tabulate`.
  - Lệnh để cài: `pip install tabulate`
  - Mã (đã chỉnh trong `raw_movies_report.py`):
    ```python
    def md_table(df_obj):
        try:
            return df_obj.to_markdown()
        except Exception:
            return df_obj.to_string()
    ```

2) Giá trị `0` trong `Budget` & `Revenue`

- Vấn đề: nhiều bản ghi có Budget=0 hoặc Revenue=0; nếu không xử lý cẩn thận, việc tính ROI gây chia cho 0 hoặc tạo nhiều NaN.
- Phát hiện: từ `raw_movies_report.md` thấy `Budget` và `Revenue` có min=0 và nhiều giá trị 0.
- Quyết định tạm thời: flag các hàng có `Budget==0` hoặc `Revenue==0` (hàm `check_finance_zeros` trong `week2.py`), KHÔNG tự động impute. Lý do: cần thảo luận chính sách (loại bỏ hay giả định) vì impute sẽ ảnh hưởng kết quả ROI.

3) Dữ liệu ngày `Release Date` có các định dạng không nhất quán

- Phát hiện: nhiều giá trị có định dạng khác nhau (YYYY-MM-DD, YYYY/MM/DD, invalid) → dùng `pd.to_datetime(..., errors='coerce')` để ép về datetime, giá trị không parse được thành NaT.
- Tác động: một số bản ghi mất thông tin thời gian; đã tính tỉ lệ missing cho cột này và lưu vào report.

4) Dữ liệu chuỗi phức tạp (Genres, Production Companies...) encoded as string lists

- Một số trường lưu danh sách dưới dạng string `['Action', 'Adventure']`. Khi phân tích thể loại, tôi parse bằng `.split(',')` hoặc safe-eval khi đảm bảo định dạng, và trim khoảng trắng.

### Kiểm chứng (bằng chứng, logs, code, file)

1) Script báo cáo dataset: `progress/week02/raw_movies_report.py`

- Đường dẫn repo (branch `huylamchan`):
  - Script: https://github.com/kwishtt/Do_An_1/blob/huylamchan/progress/week02/raw_movies_report.py
  - Kết quả report: https://github.com/kwishtt/Do_An_1/blob/huylamchan/progress/week02/raw_movies_report.md

2) Các file tạo ra trên workspace (local):
  - `/home/huy/Downloads/Do_An_1-main/progress/week02/raw_movies_report.md`
  - `/home/huy/Downloads/Do_An_1-main/progress/week02/raw_movies_missing.csv`
  - `/home/huy/Downloads/Do_An_1-main/data/clean_movies_with_labels.csv` (nếu notebook chạy đến cuối)

3) Một số log quan trọng trong quá trình (tóm tắt):
  - Khi chạy `raw_movies_report.py` ban đầu, lỗi thiếu package `tabulate` đã xuất hiện; giải pháp là fallback hoặc cài `tabulate`.
  - Khi push code lên remote, branch `huylamchan` đã được tạo và push thành công (tôi đã thực hiện các lệnh git và push từ local). Lệnh ví dụ:
    ```bash
    git checkout -b feature/eda-success-labels-oct31
    git push origin feature/eda-success-labels-oct31
    # sau đó doi ten branch va push:
    git branch -m huylamchan
    git push origin :feature/eda-success-labels-oct31 huylamchan
    git push --set-upstream origin huylamchan
    ```

4) Đoạn code dùng để tạo nhãn (copypaste từ notebook, có thể chạy lại):
  ```python
  df_work['roi'] = df_work['Revenue'] / df_work['Budget']
  df_work['success'] = (
      (df_work['roi'] >= 1.0) & (df_work['Vote Average'] >= 6.5)
  ).astype(int)
  ```

5) Để tái tạo toàn bộ kết quả trên máy của giảng viên: các bước & lệnh (từng bước, có giải thích ngắn):

  - Clone repo và chuyển sang branch làm việc của tôi:
    ```bash
    git clone https://github.com/kwishtt/Do_An_1.git
    cd Do_An_1
    git fetch origin
    git checkout huylamchan
    ```
    Giải thích: `git.fetch` để lấy branch mới từ remote; `git checkout huylamchan` chuyển sang branch chứa file tôi đã push.

  - Tạo môi trường và cài thư viện (nếu cần):
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    pip install tabulate   # tuỳ chọn để có output đẹp khi dùng to_markdown
    ```

  - Chạy báo cáo dataset:
    ```bash
    python3 progress/week02/raw_movies_report.py
    # kết quả: progress/week02/raw_movies_report.md và raw_movies_missing.csv
    ```

  - Chạy notebook `progress/week03/crea_label.ipynb` trong Jupyter hoặc convert sang script để chạy. Trong Jupyter: mở notebook và chạy toàn bộ cells.

  - Kiểm tra các file đầu ra: `data/clean_movies_with_labels.csv`, các ảnh trong `chart/` (nếu notebook được chạy với phần vẽ + savefig).

### Nhận xét và bài học rút ra

- Việc tách trách nhiệm: tôi đảm nhiệm EDA và báo cáo, điều này giúp tối ưu hoá việc ra quyết định cho feature engineering.
- Quản lý dữ liệu thiếu và policy xử lý `Budget`/`Revenue` là điểm cần thảo luận sớm với nhóm/giảng viên vì ảnh hưởng mạnh tới nhãn success.
- Kỹ thuật: luôn chuẩn bị fallback khi dùng thư viện tuỳ chọn (ví dụ: `tabulate` cho `to_markdown`) để script không fail trên môi trường thiếu dependency.

---

## 5. Tuần 4

### Mục tiêu tuần

- Review features, thảo luận model-ready dataset, chuẩn hoá các biến categorical (one-hot / embedding), và test reproducibility.

### Công việc dự kiến (đã làm / sẽ làm)

- Chuẩn hoá genres → tách nhiều thể loại thành columns nhị phân (one-hot). Tôi sẽ đảm nhiệm phần parse strings và one-hot.
- Chuẩn bị file features.csv sẵn sàng cho modeling.

---

## 6. Tổng hợp số liệu & kiểm chứng (file, đường dẫn, bằng chứng)

- File báo cáo dataset (tôi đã tạo): `progress/week02/raw_movies_report.md` — xem trong repo branch `huylamchan`.
- File missing CSV: `progress/week02/raw_movies_missing.csv`.
- Notebook EDA & label: `progress/week03/crea_label.ipynb`.
- Các lệnh git đã dùng để push branch `huylamchan` (bằng chứng có trong lịch sử terminal và remote branch trên GitHub).

Đường dẫn GitHub (branch huylamchan): https://github.com/kwishtt/Do_An_1/tree/huylamchan

Nếu giảng viên muốn, tôi có thể cung cấp:

- Một video ngắn (screen recording) chạy lại toàn bộ pipeline (tôi sẽ record 3–5 phút) — cần đồng ý.
- Các log đầy đủ khi chạy notebook (tôi có thể redirect stdout → file và commit vào `progress/logs/` nếu cần).

---

## 7. Kế hoạch tuần sau (tuần 5)

1. Hoàn thiện feature engineering:
   - One-hot cho `Genres` (top-k genres), mã hoá Production Companies (top frequent), tạo feature kết hợp (Budget per Runtime, Revenue per Budget, log-transforms).
2. Chuẩn bị dataset cho modeling: train/validation split, lưu `features_train.csv` và `features_valid.csv`.
3. Viết notebook thử nghiệm model baseline (Logistic Regression / RandomForest) để báo cáo kết quả ban đầu.

---

## 8. Tài liệu tham khảo

- Pandas documentation — to_markdown, to_string: https://pandas.pydata.org/
- Seaborn documentation — histplot, boxplot: https://seaborn.pydata.org/
- GitHub repo: https://github.com/kwishtt/Do_An_1 (branch `huylamchan`)

---

### Ghi chú cuối

Nếu giảng viên cần kiểm chứng bất kỳ bước nào, vui lòng yêu cầu file log/run cụ thể hoặc tôi sẽ đính kèm thêm ZIP chứa các artifact (csv + báo cáo + ảnh) trong lần nộp tiếp theo.

Trân trọng,

Phan Văn Huy
EDA / Visualization
