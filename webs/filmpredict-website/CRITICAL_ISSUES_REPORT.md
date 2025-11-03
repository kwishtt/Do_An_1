# 🔴 BÁO CÁO VẤN ĐỀ NGHIÊM TRỌNG - WEB APP

## ✅ ĐÃ SỬA (Completed)
1. ✅ Đường dẫn model đã sửa từ `webs/filmpredict-website/models/` → `data/pkl/`
2. ✅ Load scaler và feature_names từ `train_test_data.pkl`
3. ✅ Sửa genres list (xóa Documentary/War/Western, thêm History)

---

## 🔴 VẤN ĐỀ NGHIÊM TRỌNG CÒN LẠI

### 1. **THIẾU 42/47 FEATURES (89% features bị thiếu!)**

#### Model cần 47 features, web chỉ thu thập 3:

**✅ Web hiện có (3 features):**
- `budget` 
- `vote_average`
- `runtime`
- `genre_*` (15 features)

**❌ THIẾU HOÀN TOÀN (29 features):**

#### A. Numerical Features (5 → chỉ có 3):
- ❌ `Revenue` - **QUAN TRỌNG** để tính ROI
- ❌ `Vote Count` - Số lượng vote

#### B. Time-based Features (4 features):
- ❌ `release_year` - Năm phát hành
- ❌ `release_month` - Tháng phát hành  
- ❌ `release_weekday` - Ngày trong tuần
- ❌ `release_quarter` - Quý phát hành

#### C. Country Features (12 features):
- ❌ `is_holiday_season` - Mùa lễ (Nov, Dec, Jan)
- ❌ `is_united_states_of_america`
- ❌ `is_united_kingdom`
- ❌ `is_canada`
- ❌ `is_vietnam` - **QUAN TRỌNG** (dataset focus Việt Nam)
- ❌ `is_china`
- ❌ `is_france`
- ❌ `is_south_korea`
- ❌ `is_australia`
- ❌ `is_japan`
- ❌ `is_india`
- ❌ `is_usa`

#### D. Derived/Computed Features (11 features):
- ❌ `roi` - **QUAN TRỌNG NHẤT** (Revenue/Budget)
- ❌ `runtime_minutes` - Copy của Runtime
- ❌ `runtime_hours` - Runtime/60
- ❌ `num_main_cast` - Số diễn viên chính
- ❌ `num_genres` - Số thể loại
- ❌ `Budget_log` - log10(Budget)
- ❌ `Revenue_log` - log10(Revenue)
- ❌ `roi_clipped` - ROI cắt ngưỡng 99%
- ❌ `budget_per_year` - Budget/(current_year - release_year + 1)
- ❌ `roi_vs_vote` - ROI * (Vote Average/10)
- ❌ `cast_genre_interaction` - num_main_cast * num_genres

---

### 2. **LOGIC PREDICTION SAI HOÀN TOÀN**

#### Vấn đề:
Hàm `prepare_features()` chỉ điền 3-18 features, còn 29-44 features = 0 hoặc NaN
→ Model sẽ dự đoán SAI vì thiếu quá nhiều thông tin

#### Code hiện tại:
```python
def prepare_features(data):
    features = {}
    features['budget'] = float(data.get('budget', 0))
    features['vote_average'] = float(data.get('voteAverage', 5.0))
    features['runtime'] = int(data.get('runtime', 90))
    
    # Genre one-hot encoding (15 features)
    for genre in available_genres:
        features[f'genre_{genre}'] = 1 if genre in selected_genres else 0
    
    # ❌ THIẾU 29 features khác!
```

---

### 3. **WEB FORM THIẾU CÁC TRƯỜNG BẮT BUỘC**

#### Form hiện tại chỉ có:
```html
- Title (chỉ display, không dùng)
- Vote Average (slider 1-10) ✅
- Budget (slider 1-500M USD) ✅
- Runtime (slider 60-240 min) ✅
- Genres (checkboxes) ✅
- Production Companies (optional, không xử lý)
- Countries (optional, không xử lý)
- Languages (optional, không xử lý)
```

#### CẦN THÊM:
```html
❌ Release Date (hoặc Year/Month/Day riêng)
❌ Vote Count (số lượng người vote)
❌ Stars/Cast (để tính num_main_cast)
❌ Revenue (hoặc để trống, nhưng cần giải thích)
```

---

### 4. **VẤN ĐỀ VỚI SCALER**

#### Hiện tại:
- Scaler được load từ `train_test_data.pkl` ✅
- Nhưng `prepare_features()` KHÔNG áp dụng scaler!

#### Code cần thêm:
```python
def prepare_features(data):
    # ... prepare all 47 features ...
    feature_vector = [features.get(col, 0) for col in feature_columns]
    feature_array = np.array([feature_vector])
    
    # ❌ THIẾU BƯỚC NÀY:
    if scaler is not None:
        feature_array = scaler.transform(feature_array)
    
    return feature_array
```

---

### 5. **REVENUE VÀ ROI - MÂU THUẪN LOGIC**

#### Vấn đề nghiêm trọng:
- Model cần `Revenue` và `roi` làm features
- Nhưng mục đích web là DỰ ĐOÁN thành công (ROI ≥ 1.0)
- **Mâu thuẫn**: Làm sao biết Revenue trước khi phim ra mắt?

#### Giải pháp:

**Option 1: Bỏ Revenue/ROI khỏi features** (Khuyến nghị)
- Retrain model KHÔNG sử dụng Revenue, roi, Revenue_log, roi_clipped
- Chỉ dùng pre-release features: Budget, Runtime, Genres, Release Date, Cast, etc.

**Option 2: Để Revenue = 0 hoặc estimated**
- Thiết lập Revenue = 0 cho dữ liệu mới
- Tính roi = 0
- Nhưng model sẽ predict kém vì mất 4 features quan trọng

**Option 3: Revenue Prediction trước**
- Tạo model phụ predict Revenue
- Dùng predicted Revenue → tính ROI
- Sau đó predict Success
- Phức tạp, dễ sai số tích lũy

---

### 6. **COUNTRY DETECTION SAI**

#### Code hiện tại:
```python
# Web form có field "countries" nhưng KHÔNG xử lý
selected_genres = data.get('genres', [])  # ✅ Có
selected_countries = data.get('countries', [])  # ❌ KHÔNG xử lý!
```

#### Cần:
```python
# Trong prepare_features()
countries = data.get('countries', [])
for country_flag in ['is_united_states_of_america', 'is_vietnam', 'is_china', ...]:
    country_name = country_flag.replace('is_', '').replace('_', ' ').title()
    features[country_flag] = 1 if country_name in countries else 0
```

---

### 7. **THIẾU XỬ LÝ RELEASE DATE**

#### Model cần:
- `release_year`
- `release_month` 
- `release_weekday` (0=Mon, 6=Sun)
- `release_quarter` (1,2,3,4)
- `is_holiday_season` (1 if month in [11,12,1])

#### Web form KHÔNG có trường Release Date!

---

### 8. **THIẾU DERIVED FEATURES COMPUTATION**

Model cần các features tính toán:

```python
# THIẾU HẾT trong prepare_features():
runtime_minutes = runtime
runtime_hours = runtime / 60.0
num_genres = len(selected_genres)
Budget_log = np.log10(budget) if budget > 0 else 0
budget_per_year = budget / (current_year - release_year + 1)
num_main_cast = len(cast_list)  # Từ Stars field
cast_genre_interaction = num_main_cast * num_genres

# Nếu có Revenue:
Revenue_log = np.log10(revenue) if revenue > 0 else 0
roi = revenue / budget if budget > 0 else 0
roi_clipped = min(roi, roi_99th_percentile)
roi_vs_vote = roi * (vote_average / 10.0)
```

---

## 📊 TÓM TẮT MỨC ĐỘ NGHIÊM TRỌNG

| Vấn đề | Mức độ | Ảnh hưởng | Ưu tiên |
|--------|--------|-----------|---------|
| Thiếu 29 features (62%) | 🔴🔴🔴 Cực nghiêm trọng | Model predict sai hoàn toàn | **P0** |
| Revenue/ROI paradox | 🔴🔴🔴 Cực nghiêm trọng | Logic nghiệp vụ sai | **P0** |
| Không apply scaler | 🔴🔴 Nghiêm trọng | Features khác scale → sai | **P1** |
| Thiếu Release Date | 🔴🔴 Nghiêm trọng | Mất 5 features quan trọng | **P1** |
| Không xử lý Countries | 🔴 Trung bình | Mất 12 features | **P2** |
| Thiếu Vote Count | 🔴 Trung bình | Mất 1 feature | **P2** |
| Thiếu Cast/Stars | 🔴 Trung bình | Mất 2 features (num_main_cast, interaction) | **P2** |
| Thiếu derived features | 🔴 Trung bình | Mất 6 features | **P2** |

---

## 🎯 KHUYẾN NGHỊ GIẢI PHÁP

### ⚡ GIẢI PHÁP NHANH (Quick Fix - 1-2 giờ):

**Bước 1: Retrain model bỏ Revenue/ROI features**
```python
# Trong data_split.py, loại bỏ:
excluded_features = ['Revenue', 'Revenue_log', 'roi', 'roi_clipped', 'roi_vs_vote']
features = [f for f in features if f not in excluded_features]
# → Còn 42 features
```

**Bước 2: Thêm fields vào web form**
```html
<!-- Release Date -->
<input type="month" name="releaseDate" required>

<!-- Vote Count -->
<input type="number" name="voteCount" min="0" value="100">

<!-- Stars (comma-separated) -->
<input type="text" name="stars" placeholder="Actor 1, Actor 2, Actor 3">

<!-- Country (dropdown hoặc checkboxes) -->
<select name="country">
  <option value="Vietnam">Vietnam</option>
  <option value="United States of America">USA</option>
  ...
</select>
```

**Bước 3: Viết lại prepare_features() đầy đủ**
```python
def prepare_features(data):
    features = {}
    
    # 1. Basic numerical
    features['Budget'] = float(data.get('budget', 0))
    features['Vote Average'] = float(data.get('voteAverage', 5.0))
    features['Vote Count'] = int(data.get('voteCount', 100))
    features['Runtime'] = int(data.get('runtime', 90))
    
    # 2. Time-based (từ releaseDate)
    release_date = pd.to_datetime(data.get('releaseDate', '2024-01-01'))
    features['release_year'] = release_date.year
    features['release_month'] = release_date.month
    features['release_weekday'] = release_date.dayofweek
    features['release_quarter'] = (release_date.month - 1) // 3 + 1
    features['is_holiday_season'] = 1 if release_date.month in [11,12,1] else 0
    
    # 3. Genres (15 one-hot)
    selected_genres = data.get('genres', [])
    for genre in available_genres:
        features[f'genre_{genre}'] = 1 if genre in selected_genres else 0
    
    # 4. Countries (12 one-hot)
    country = data.get('country', '')
    country_mapping = {
        'Vietnam': 'is_vietnam',
        'United States of America': 'is_united_states_of_america',
        # ... map all 12 countries
    }
    for flag in all_country_flags:
        features[flag] = 0
    if country in country_mapping:
        features[country_mapping[country]] = 1
    features['is_usa'] = features.get('is_united_states_of_america', 0)
    
    # 5. Derived features
    features['runtime_minutes'] = features['Runtime']
    features['runtime_hours'] = features['Runtime'] / 60.0
    features['num_genres'] = len(selected_genres)
    
    # Cast
    stars_input = data.get('stars', '')
    stars_list = [s.strip() for s in stars_input.split(',') if s.strip()]
    features['num_main_cast'] = len(stars_list)
    
    # Log transforms
    features['Budget_log'] = np.log10(features['Budget']) if features['Budget'] > 0 else 0
    
    # Interactions
    current_year = datetime.now().year
    features['budget_per_year'] = features['Budget'] / (current_year - features['release_year'] + 1)
    features['cast_genre_interaction'] = features['num_main_cast'] * features['num_genres']
    
    # 6. Convert to array theo đúng thứ tự feature_columns
    feature_vector = [features.get(col, 0) for col in feature_columns]
    feature_array = np.array([feature_vector])
    
    # 7. Apply scaler
    if scaler is not None:
        feature_array = scaler.transform(feature_array)
    
    return feature_array
```

---

### 🏗️ GIẢI PHÁP DÀI HẠN (Recommended - 1 tuần):

1. **Tách model thành 2 phases:**
   - Phase 1: Predict Revenue (regression model)
   - Phase 2: Predict Success (classification với predicted Revenue)

2. **Feature engineering mới:**
   - Chỉ dùng pre-release features
   - Thêm external data: director history, cast popularity, marketing budget

3. **Retrain với cross-validation:**
   - Train model mới với feature set đã fix
   - Validate trên Vietnamese market data

4. **Web app improvements:**
   - Add validation cho tất cả fields
   - Tooltips giải thích từng field
   - Sample data cho từng category (Hollywood, Bollywood, Vietnam indie, etc.)

---

## ⚠️ LƯU Ý QUAN TRỌNG

### Về Revenue/ROI Paradox:
Trong thực tế, model dự đoán thành công phim **KHÔNG NÊN** sử dụng Revenue/ROI làm features vì:
1. Revenue chỉ biết SAU khi phim ra mắt
2. Mục đích là predict TRƯỚC khi ra mắt để quyết định đầu tư
3. Sử dụng Revenue = training data leakage (rò rỉ thông tin tương lai)

**Dataset hiện tại có Revenue vì:**
- Dùng để TẠO LABEL `success = (ROI >= 1.0) & (vote_average >= 6.5)`
- Nhưng KHÔNG NÊN dùng làm feature cho prediction

**Giải pháp đúng:**
```python
# Loại bỏ hoàn toàn:
excluded = ['Revenue', 'Revenue_log', 'roi', 'roi_clipped', 'roi_vs_vote']

# Chỉ giữ pre-release features:
valid_features = [
    'Budget', 'Budget_log', 'Runtime', 'Vote Average', 'Vote Count',
    'release_*', 'genre_*', 'is_*', 'num_*', 
    'budget_per_year', 'cast_genre_interaction'
]
```

---

## 📝 CHECKLIST SỬA LỖI

### Phase 1: Critical Fixes (P0 - P1)
- [ ] Retrain model bỏ Revenue/ROI features (hoặc set = 0)
- [ ] Thêm Release Date field vào form
- [ ] Thêm Vote Count field
- [ ] Thêm Stars/Cast field
- [ ] Thêm Country selector
- [ ] Viết lại `prepare_features()` với đầy đủ 42 features
- [ ] Apply scaler sau khi prepare features
- [ ] Test với sample data thật

### Phase 2: Improvements (P2)
- [ ] Add form validation
- [ ] Add tooltips/help text
- [ ] Add sample data templates
- [ ] Improve error handling
- [ ] Add feature importance visualization
- [ ] Show which features impact prediction most

### Phase 3: Long-term (P3)
- [ ] Retrain model với proper feature engineering
- [ ] Add A/B testing for model versions
- [ ] Add feedback loop for predictions
- [ ] Monitor prediction accuracy on real releases

---

**Generated:** 2025-11-04  
**Status:** 🔴 CRITICAL - Web app không thể hoạt động đúng với setup hiện tại  
**Next Action:** Fix P0 issues trước khi deploy
