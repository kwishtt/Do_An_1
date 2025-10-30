# 🎬 Đồ Án Dự Đoán Độ Thành Công Phim Chiếu Rạp Tại Việt Nam 

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-orange.svg)](https://jupyter.org/)
[![Pandas](https://img.shields.io/badge/Pandas-Data%20Analysis-green.svg)](https://pandas.pydata.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Dự án phân tích dữ liệu phim Việt Nam và quốc tế để xây dựng mô hình dự đoán thành công dựa trên các đặc trưng như ngân sách, thể loại, diễn viên, và quốc gia sản xuất. Sử dụng machine learning để đưa ra dự báo chính xác về khả năng thành công của một bộ phim.

## 📁 Cấu Trúc Dự Án

Dự án được tổ chức theo tuần để dễ theo dõi tiến độ. Đây là hướng dẫn chi tiết cách đọc và thực hiện từng phần:

```
Do_An/
├── 📂 data/                          # Dữ liệu gốc và đã xử lý
│   ├── clean_movies.csv              # Dữ liệu phim sạch (thô)
│   ├── clean_movies_with_labels.csv  # Dữ liệu với nhãn thành công
│   ├── clean_movies_features.csv     # Đặc trưng đã engineering (output tuần 4)
│   └── raw_Movies.csv                # Dữ liệu thô từ nguồn
├── 📂 progress/                      # Tiến độ theo tuần
│   ├── week01/                       # Tuần 1: Lập kế hoạch
│   │   ├── w01.md                    # Báo cáo tuần 1
│   │   └── ...
│   ├── week02/                       # Tuần 2: Thu thập dữ liệu
│   │   ├── cleandata.py              # Script làm sạch dữ liệu
│   │   └── w02.md                    # Báo cáo tuần 2
│   ├── week03/                       # Tuần 3: Gắn nhãn và EDA
│   │   ├── crea_label.ipynb          # Notebook tạo nhãn và phân tích
│   │   └── w03.md                    # Báo cáo tuần 3
│   ├── week04/                       # Tuần 4: Feature Engineering
│   │   ├── feature_engineering.ipynb # Notebook tạo đặc trưng
│   │   └── w04.md                    # Báo cáo tuần 4
│   ├── week05/                       # Tuần 5: Modeling (sắp tới)
│   │   └── w05.md
│   └── ...                           # Các tuần tiếp theo
├── 📂 chart/                         # Biểu đồ và hình ảnh trực quan
├── 📂 report/                        # Báo cáo tổng hợp
│   ├── BaoCaoDoAn1_Nhom04.md         # Báo cáo đồ án (gốc)
│   └── todo.md                       # Danh sách công việc được chia theo tuần (10 tuần)
├── requirements.txt                  # Danh sách thư viện Python cần thiết
└── README.md                         # <-- File hiện tại
```

### 🔍 Cách Đọc và Thực Hiện Dự Án

1. **Bắt đầu từ README này**: Hiểu tổng quan dự án và yêu cầu.
2. **Cài đặt môi trường**: Theo hướng dẫn phần "Cài Đặt" bên dưới.
3. **Theo tuần tuần**:
   - **Tuần 1**: Đọc `progress/week01/w01.md` để hiểu kế hoạch.
   - **Tuần 2**: Chạy `progress/week02/cleandata.py` để làm sạch dữ liệu, đọc `w02.md` cho báo cáo.
   - **Tuần 3**: Mở `progress/week03/crea_label.ipynb` trong Jupyter để tạo nhãn và EDA, tham khảo `w03.md`.
   - **Tuần 4**: Chạy `progress/week04/feature_engineering.ipynb` để tạo đặc trưng, output ra `data/clean_movies_features.csv`.
   - **Tuần 5+**: Tiếp tục với modeling và báo cáo.
4. **Kiểm tra dữ liệu**: Luôn xem `data/` để hiểu input/output của từng bước.
5. **Đọc báo cáo**: `report/BaoCaoDoAn1_Nhom04.md` cho tổng hợp, `todo.md` cho tiến độ.
6. **Trực quan hóa**: Xem `chart/` cho biểu đồ mẫu.

## ⚙️ Cài Đặt Môi Trường
1. **Cài đặt Python 3.8+**: Tải từ [python.org](https://www.python.org/downloads/).

2. **Cài thư viện cần thiết**:
   ```bash
   pip install -r requirements.txt
   ```          
---

*Được tạo với ❤️ bởi Nhóm 04 - Dự Án Đồ Án 1*