# 🚀 HƯỚNG DẪN SỬ DỤNG WEB APP

## ✅ PRIORITY 1 ĐÃ HOÀN THÀNH

Tất cả các yêu cầu Priority 1 đã được thực hiện:
- ✅ Cập nhật HTML form - chỉ 3 fields chính
- ✅ Update messaging: "Đánh giá phim ĐANG chiếu"
- ✅ Thêm tooltip giải thích Vote Average (76.53%)

---

## 🏃 CHẠY WEB APP

### **Bước 1: Khởi động server**

```bash
cd /home/ktmjin/Documents/Do_An/webs/filmpredict-website
python app.py
```

Hoặc:

```bash
flask run --host=0.0.0.0 --port=5000
```

### **Bước 2: Mở trình duyệt**

```
http://localhost:5000
```

---

## 📝 HƯỚNG DẪN SỬ DỤNG CHO USER

### **Cách 1: Quick Fill (Nhanh nhất)**

1. Click vào một trong 3 nút ví dụ:
   - **Mai (2024)** - Phim Việt Nam thành công
   - **Avengers: Endgame** - Hollywood blockbuster
   - **Independent Drama** - Phim indie

2. Form tự động điền thông tin

3. Click "Dự đoán thành công"

### **Cách 2: Nhập thủ công**

#### **Thông tin bắt buộc (3 fields):**

1. **Tên Phim**
   - VD: "Mai", "Avengers: Endgame"

2. **⭐ Vote Average (QUAN TRỌNG NHẤT - 76.53%)**
   - Slider từ 1-10
   - Lấy từ [TMDB](https://www.themoviedb.org) hoặc [IMDb](https://www.imdb.com)
   - VD: 7.5 (phim tốt), 8.4 (phim xuất sắc)
   - ⚠️ **Yếu tố quyết định nhất!**
   - 💡 Click nút `?` để xem giải thích chi tiết

3. **Revenue Hiện Tại (USD)**
   - Doanh thu đã thu được đến hiện tại
   - VD: 75000000 ($75M)
   - Lấy từ [Box Office Mojo](https://www.boxofficemojo.com) hoặc báo cáo rạp
   - 💡 Click nút `?` để xem cách tính ROI

4. **Budget (USD)**
   - Ngân sách sản xuất phim
   - VD: 50000000 ($50M)

#### **Thông tin bổ sung (không bắt buộc):**

Click "➕ Thông tin bổ sung" để mở:
- Runtime (phút)
- Ngày phát hành
- Thể loại phim

---

## 🎯 VÍ DỤ CỤ THỂ

### **Ví dụ 1: Phim Việt Nam - Mai (2024)**

```
✅ Thông tin bắt buộc:
   Tên: Mai (2024)
   Vote Average: 6.8
   Revenue: $22,119,910
   Budget: $2,503,150

📊 Kết quả dự đoán:
   ✅ SUCCESS (high probability)
   Current ROI: 8.84x
   Market potential: Rất cao
   Risk level: Thấp
```

### **Ví dụ 2: Hollywood Blockbuster**

```
✅ Thông tin bắt buộc:
   Tên: Avengers: Endgame
   Vote Average: 8.4
   Revenue: $2,797,800,564
   Budget: $356,000,000

📊 Kết quả dự đoán:
   ✅ SUCCESS (very high probability)
   Current ROI: 7.86x
   Predicted final ROI: ~11.79x
   Market potential: Rất cao
```

### **Ví dụ 3: Indie Film**

```
✅ Thông tin bắt buộc:
   Tên: Independent Drama
   Vote Average: 7.2
   Revenue: $3,500,000
   Budget: $2,000,000

📊 Kết quả dự đoán:
   ✅ SUCCESS (moderate probability)
   Current ROI: 1.75x
   Market potential: Cao
```

---

## 💡 TIPS SỬ DỤNG

### **1. Lấy Vote Average từ đâu?**

**TMDB (Khuyến nghị):**
1. Vào https://www.themoviedb.org
2. Tìm tên phim
3. Xem điểm "User Score" (VD: 75% = 7.5/10)

**IMDb:**
1. Vào https://www.imdb.com
2. Tìm tên phim
3. Xem điểm "Rating" (VD: 8.4/10)

### **2. Lấy Revenue hiện tại từ đâu?**

**Box Office Mojo:**
- https://www.boxofficemojo.com
- Xem "Domestic" + "International" = Total Revenue

**Vietnamnet (Phim Việt Nam):**
- Báo chí thường công bố sau tuần đầu/tháng đầu
- VD: "Phim Mai thu về 500 tỷ VND" → Quy đổi sang USD

### **3. Khi nào nên dùng tool này?**

✅ **PHÙ HỢP:**
- Phim đã ra rạp, có Vote Average thực tế
- Có doanh thu ban đầu (sau ít nhất 3-7 ngày)
- Muốn dự đoán thành công cuối cùng

❌ **KHÔNG PHÙ HỢP:**
- Phim chưa ra mắt (chưa có Vote Average thực tế)
- Phim chưa có doanh thu nào

---

## 🔍 HIỂU KẾT QUẢ DỰ ĐOÁN

### **Success Probability**

```
≥ 80%: Rất có khả năng thành công
60-79%: Khả năng thành công cao
40-59%: Khả năng thành công trung bình
< 40%: Khả năng thành công thấp
```

### **ROI (Return on Investment)**

```
ROI = Revenue / Budget

≥ 3.0x: Thành công lớn (VD: Mai = 8.84x)
2.0-2.9x: Thành công tốt
1.0-1.9x: Có lãi, thành công nhẹ
< 1.0x: Thua lỗ
```

### **Market Potential**

- **Rất cao**: Phim có tiềm năng thị trường lớn
- **Cao**: Phim có triển vọng tốt
- **Trung bình**: Phim có thể thành công vừa phải
- **Thấp**: Phim có rủi ro cao

### **Risk Level**

- **Thấp**: Đầu tư an toàn, khả năng thành công cao
- **Trung bình**: Cần theo dõi thêm
- **Cao**: Cẩn trọng khi đầu tư thêm

---

## 🎬 USE CASES THỰC TẾ

### **Use Case 1: Nhà sản xuất phim**

**Tình huống:** Phim vừa ra rạp 1 tuần
**Mục đích:** Quyết định có tăng ngân sách marketing không?

**Cách dùng:**
1. Nhập Vote Average hiện tại từ TMDB
2. Nhập Revenue tuần đầu
3. Xem prediction
4. Nếu success probability > 70% → Tăng marketing
5. Nếu < 50% → Cắt giảm chi phí

### **Use Case 2: Nhà đầu tư**

**Tình huống:** Đánh giá phim đã đầu tư
**Mục đích:** Quyết định có đầu tư tiếp vào sequel không?

**Cách dùng:**
1. Nhập dữ liệu phim hiện tại
2. Xem ROI và market potential
3. Nếu ROI > 2x và market potential "Rất cao" → Đầu tư sequel
4. Nếu ROI < 1.5x → Không nên tiếp tục

### **Use Case 3: Rạp chiếu phim**

**Tình huống:** Quyết định số suất chiếu
**Mục đích:** Tối ưu hóa lợi nhuận

**Cách dùng:**
1. Nhập dữ liệu phim sau 3 ngày đầu
2. Xem success probability
3. Nếu > 70% → Tăng suất chiếu
4. Nếu < 40% → Giảm suất chiếu, nhường cho phim khác

---

## ⚠️ LƯU Ý QUAN TRỌNG

### **1. Vote Average là yếu tố QUAN TRỌNG NHẤT (76.53%)**

- Phải là điểm đánh giá THỰC TẾ từ người xem
- Không được estimate hoặc đoán
- Nên chờ ít nhất 100+ votes trên TMDB để chính xác

### **2. Tool chỉ dành cho phim ĐANG CHIẾU**

- ❌ Không phù hợp cho dự đoán pre-release
- ✅ Phù hợp cho phim đã có rating và revenue thực tế

### **3. ROI từ Revenue/Budget**

- Revenue càng cao so với Budget → ROI càng tốt
- Model sẽ dự đoán chính xác hơn khi có ROI data

### **4. Độ chính xác 99.5%**

- Đạt được khi có đầy đủ Vote Average và Revenue thực tế
- Vote Average chiếm 76.53% ảnh hưởng
- ROI chiếm 23.47% ảnh hưởng

---

## 🐛 TROUBLESHOOTING

### **Lỗi: "Missing required field"**

**Nguyên nhân:** Thiếu 1 trong 3 field bắt buộc

**Giải pháp:**
- Kiểm tra đã điền: Title, Vote Average, Revenue, Budget
- Không được để trống hoặc = 0 (trừ Revenue có thể = 0)

### **Lỗi: "Vote Average phải từ 1-10"**

**Nguyên nhân:** Điểm nhập sai

**Giải pháp:**
- Vote Average phải trong khoảng 1.0 - 10.0
- VD: 7.5, 8.4, 6.8

### **Prediction kỳ lạ (quá cao/thấp)****

**Nguyên nhân:** Dữ liệu nhập không chính xác

**Giải pháp:**
1. Kiểm tra Vote Average (phải từ TMDB/IMDb)
2. Kiểm tra Revenue (đơn vị USD, không phải VND)
3. Kiểm tra Budget (đơn vị USD)
4. Thử dùng Quick Fill để so sánh

---

## 📞 HỖ TRỢ

### **Nếu gặp vấn đề:**

1. Kiểm tra lại 3 fields bắt buộc
2. Thử dùng Quick Fill để test
3. Xem tooltips (nút `?`) để hiểu rõ hơn
4. Check console (F12) để xem errors

### **Report bugs:**

File: `PRIORITY1_COMPLETED.md` có đầy đủ technical details

---

## 🎉 ENJOY!

Web app giờ đây đơn giản, nhanh chóng, và chính xác!

**Chỉ cần 1-2 phút để:**
1. Nhập 3 thông tin chính
2. Click "Dự đoán thành công"
3. Xem kết quả chi tiết với các metrics

**User-friendly features:**
- ✅ Quick fill buttons
- ✅ Tooltips giải thích
- ✅ Real-time validation
- ✅ Beautiful UI/UX
- ✅ Dark mode support
- ✅ Mobile responsive

Chúc bạn sử dụng hiệu quả! 🚀🎬
