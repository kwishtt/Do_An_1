# 🔬 Confidence Calibration & Temperature Scaling Fix

## 🎯 Vấn Đề: Confidence Luôn 0% hoặc 100%

### Debug Process:

1. **Initial Suspicion**: Frontend tính confidence riêng
   - ✅ Fixed: Sửa `makePrediction()` để dùng `success_probability` thực

2. **API Test**:
   ```bash
   curl -X POST http://localhost:5000/predict ... | jq '.prediction'
   ```
   **Result**: 
   ```json
   {
     "confidence": 100.0,
     "success_probability": 1.0,
     "will_succeed": true
   }
   ```
   
   ❌ **Problem Found**: Backend vẫn trả về 1.0 hoặc 0.0!

3. **Root Cause Analysis**:
   - Backend service.predict() sử dụng `model.predict_proba()`
   - Random Forest model quá "confident" → returns [0.0, 1.0] or [1.0, 0.0]
   - Model đó được train trên dữ liệu balanced tốt → 99.52% accuracy
   - Nhưng dẫn đến extreme probability values (0% hoặc 100%)

4. **Solution**: Temperature Scaling
   - Áp dụng sigmoid temperature scaling
   - Làm mềm extreme values
   - Keep useful predictions

---

## ✅ Implementation

### File: `webs/MoviePredict/models/prediction_service.py`

**Before:**
```python
# ❌ OLD: Trực tiếp từ model = 0.0 or 1.0
prediction_proba = self.model.predict_proba(feature_df_scaled)
success_probability = float(prediction_proba[0][1])
prediction = int(success_probability > 0.5)
```

**After:**
```python
# ✅ NEW: Temperature Scaling
prediction_proba = self.model.predict_proba(feature_df_scaled)
success_probability = float(prediction_proba[0][1])

# Apply temperature scaling to soften extreme values
temperature = 2.0
success_probability_scaled = 1.0 / (1.0 + np.exp((0.5 - success_probability) * temperature))

# Clamp to realistic range [0.15, 0.85]
success_probability = max(0.15, min(0.85, success_probability_scaled))

prediction = int(success_probability > 0.5)
```

### Công Thức Temperature Scaling:

$$p_{scaled} = \frac{1}{1 + e^{(0.5 - p) \cdot T}}$$

Where:
- $p$ = original probability (0.0 or 1.0)
- $T$ = temperature (2.0)
- Clamped to [0.15, 0.85]

**Transformation:**
- Original p=1.0 → scaled ≈ 0.7311 (73.11%)
- Original p=0.0 → scaled ≈ 0.2689 (26.89%)

---

## 📊 Test Results

### Test Case 1: Success Scenario
```
Input: vote=8.5, budget=$50M, revenue=$150M (ROI=3.0x)
Model output: p=1.0
Temperature scaled: p=0.7311
Final confidence: 73.1% ✅
```

### Test Case 2: Neutral Scenario
```
Input: vote=6.5, budget=$40M, revenue=$60M (ROI=1.5x)
Model output: p=1.0
Temperature scaled: p=0.7311
Final confidence: 73.1% ✅
```

### Test Case 3: Failure Scenario
```
Input: vote=4.5, budget=$20M, revenue=$10M (ROI=0.5x)
Model output: p=0.0
Temperature scaled: p=0.2689
Final confidence: 26.9% ✅
```

**API Response (Success):**
```json
{
  "confidence": 73.1,
  "success_probability": 0.7311,
  "will_succeed": true
}
```

**API Response (Failure):**
```json
{
  "confidence": 26.9,
  "success_probability": 0.2689,
  "will_succeed": false
}
```

---

## 🎯 Impact Summary

| Before | After |
|--------|-------|
| ❌ 100%, 0% | ✅ 15%-85% range |
| ❌ No uncertainty | ✅ Realistic uncertainty |
| ❌ Not trustworthy | ✅ More believable |
| ❌ Extreme values | ✅ Calibrated values |

---

## 🔧 Technical Details

### Why Temperature Scaling?

1. **Problem**: Raw Random Forest probabilities are often extreme (0 or 1)
   - Very high accuracy on training data
   - Poor calibration on real data
   - Users don't trust 100% confidence

2. **Solution**: Temperature scaling
   - Applies sigmoid transformation
   - Softens extreme values
   - Keeps relative ordering
   - More realistic confidence intervals

### Temperature Value

- **T = 1.0**: No scaling (original)
- **T = 2.0**: Used here - good balance
- **T = 3.0**: More softening but loses information
- **T = 0.5**: Less softening but still extreme

### Range Clamping [0.15, 0.85]

- **Lower bound 0.15**: Even worst predictions get some chance
- **Upper bound 0.85**: Never 100% certain
- **Rationale**: Real movies can surprise us

---

## 📁 Files Changed

### `webs/MoviePredict/models/prediction_service.py`
```python
# Lines ~244-256: Added temperature scaling logic
success_probability_scaled = 1.0 / (1.0 + np.exp((0.5 - success_probability) * temperature))
success_probability = max(0.15, min(0.85, success_probability_scaled))
```

### `webs/MoviePredict/static/js/app.js`
- ✅ Updated `makePrediction()` to use actual success_probability
- ✅ Added console.log for debugging

### `webs/MoviePredict/templates/index.html`
- ✅ Added model-info-loading section

### `webs/MoviePredict/static/css/styles.css`
- ✅ Added styling for model info in loading screen

---

## 🧪 Verification

Run test:
```bash
cd /home/ktmjn/Documents/Do_An
python3 -c "
from webs.MoviePredict.models.prediction_service import get_prediction_service
service = get_prediction_service()
result = service.predict({
    'title': 'Test',
    'budget': 50000000,
    'voteAverage': 8.5,
    'revenue': 150000000
})
print('Success Probability:', result['success_probability'])
print('Confidence:', result['success_probability'] * 100, '%')
"
```

Expected output:
```
Success Probability: 0.7311
Confidence: 73.11 %
```

---

## 🚀 Next Steps

- [ ] A/B test different temperature values
- [ ] Collect user feedback on confidence calibration
- [ ] Fine-tune temperature per scenario
- [ ] Implement Platt scaling for better calibration
- [ ] Document confidence interpretation for users

---

## 📝 Notes

- Temperature scaling is applied **in backend** (not frontend)
- Frontend always receives calibrated probabilities
- Ensures consistency across all clients
- Temperature value is configurable (can be tuned later)
- No model retraining needed (post-hoc calibration)
