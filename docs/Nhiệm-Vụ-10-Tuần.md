## Kế hoạch 10 tuần — TODO

Mục tiêu: Hoàn thành dự án phân tích/dự đoán thành công phim dựa trên dataset `Movies.csv`. Dưới đây là danh sách việc cần làm theo tuần, mô tả dễ hiểu cho người không chuyên, mỗi mục ghi mục tiêu chính, việc cụ thể và sản phẩm giao nộp.

---

### Tuần 1 — Khởi động & thu thập dữ liệu
- Mục tiêu: Chuẩn bị nền tảng và lấy dữ liệu gốc.
- Việc cần làm:
	- Lấy file `Movies.csv` và lưu bản gốc (dataset thô).
	- Kiểm tra cấu trúc cột (Budget, Revenue, Vote Average, Release Date, Genres, Cast,...).
	- Họp nhanh với giảng viên để thống nhất tiêu chí 'thành công' cho phim.
- Giao nộp: dataset thô + kế hoạch chi tiết (timeline, phân công).

### Tuần 2 — Làm sạch dữ liệu cơ bản
- Mục tiêu: Loại bỏ hoặc ghi chú các lỗi dữ liệu, chuẩn hóa định dạng.
- Việc cần làm:
	- Xác định và xử lý hàng có Budget hoặc Revenue = 0 (loại/báo cáo).
	- Điền hoặc ghi chú giá trị thiếu (NaN) theo cột.
	- Chuyển `Release Date` sang kiểu ngày, thống kê tỉ lệ thiếu theo cột.
- Giao nộp: dataset đã làm sạch + báo cáo ngắn về vấn đề còn lại.

### Tuần 3 — Tạo nhãn thành công & EDA cơ bản
- Mục tiêu: Định nghĩa nhãn (thành công/không) và hiểu tổng quan dữ liệu.
- Việc cần làm:
	- Tính ROI = Revenue / Budget và tạo cột `Success` theo quy tắc (ví dụ ROI ≥ 1 và Vote Average ≥ 6.5).
	- Thống kê số phim, tỉ lệ thành công, phân bố Budget/Revenue, 2–3 biểu đồ đơn giản.
- Giao nộp: dataset có nhãn + tóm tắt EDA (1 trang) và vài biểu đồ.

### Tuần 4 — Chuẩn bị đặc trưng (Feature Engineering)
- Mục tiêu: Biến thông tin thô thành các đặc trưng dễ dùng cho mô hình.
- Việc cần làm:
	- Tạo cột năm, tháng, ngày trong tuần từ `Release Date`.
	- Nhóm độ dài phim (short/medium/long), đếm số diễn viên chính.
	- Chuẩn hóa tên `Genres` và `Country`, tạo cột số thể loại chính.
	- Lập danh sách đặc trưng cuối cùng và giải thích ý nghĩa (dạng phi kỹ thuật).
- Giao nộp: bảng đặc trưng và mô tả ngắn cho từng đặc trưng.

### Tuần 5 — Mô hình cơ sở (Baseline)
- Mục tiêu: Chạy một mô hình đơn giản để có mốc so sánh.
- Việc cần làm:
	- Chia dữ liệu (ví dụ 80/20) hoặc dùng 5‑fold CV.
	- Huấn luyện Logistic Regression (hoặc tương tự), báo cáo Accuracy/Precision/Recall/F1.
- Giao nộp: kết quả baseline + giải thích ngắn (ý nghĩa các con số).

### Tuần 6 — Mô hình chính & feature importance
- Mục tiêu: Xây mô hình mạnh hơn và xác định yếu tố quan trọng ảnh hưởng đến thành công.
- Việc cần làm:
	- Huấn luyện Random Forest (hoặc model tương đương), tinh chỉnh vài tham số cơ bản.
	- Xuất danh sách top 10 yếu tố quan trọng.
	- So sánh hiệu năng với baseline.
- Giao nộp: kết quả mô hình + danh sách các yếu tố quan trọng.

### Tuần 7 — Xử lý cân bằng lớp & phân tích lỗi
- Mục tiêu: Giảm sai lệch do mất cân bằng và hiểu loại lỗi chính.
- Việc cần làm:
	- Thử SMOTE hoặc điều chỉnh trọng số lớp; đánh giá ảnh hưởng.
	- Phân tích các False Positive và False Negative với ví dụ cụ thể.
	- Ước lượng tác động (về mặt kinh tế/ra quyết định) của mỗi loại lỗi.
- Giao nộp: báo cáo phân tích lỗi + mô hình đã điều chỉnh.

### Tuần 8 — Ổn định mô hình & kiểm tra chéo cuối cùng
- Mục tiêu: Đảm bảo mô hình ổn định và kết quả lặp lại.
- Việc cần làm:
	- Chạy 5‑fold cross‑validation đầy đủ, tính trung bình và khoảng tin cậy cho các metric.
	- Kiểm tra overfitting bằng so sánh train/test performance.
- Giao nộp: bảng tổng hợp hiệu năng cuối cùng và kết luận ngắn.

### Tuần 9 — Chuẩn bị báo cáo chính thức & trực quan hóa
- Mục tiêu: Soạn báo cáo và slide thuyết trình.
- Việc cần làm:
	- Viết các chương báo cáo: giới thiệu, phương pháp, kết quả, phân tích lỗi, kết luận.
	- Tạo slide 10–15 trang và biểu đồ minh họa cho từng điểm chính.
- Giao nộp: bản nháp báo cáo + slide.

### Tuần 10 — Hoàn thiện, tổng duyệt & nộp final
- Mục tiêu: Hoàn tất, nhận phản hồi và nộp sản phẩm cuối cùng.
- Việc cần làm:
	- Tổng duyệt thuyết trình, chỉnh sửa theo góp ý giảng viên.
	- Đóng gói mã/notebook reproducible và hướng dẫn chạy lại.
	- Nộp báo cáo final, slide final và mã nguồn.
- Giao nộp: báo cáo final, slide final, mã nguồn/notebook và dataset cuối cùng.

---

Ghi chú ngắn:
- Mỗi tuần nên có 1 cuộc họp ngắn (15–30 phút) để cập nhật tiến độ.
- Đặt milestone kiểm tra giữa Tuần 5 (baseline) và Tuần 8 (final model) để đánh giá rủi ro.
- Dự phòng 1–2 ngày mỗi tuần cho việc xử lý lỗi bất ngờ.

---
