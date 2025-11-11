"""
Movie Success Prediction Service
Sử dụng Random Forest model đã được training để dự đoán thành công phim
"""

import pickle
import pandas as pd
import numpy as np
import os
import sys
from datetime import datetime
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MoviePredictionService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_columns = None
        self.model_accuracy = 0.9952
        self.model_info = {
            'model_type': 'Random Forest (Optimized)',
            'accuracy': 0.9952,
            'training_data_size': 1022,
            'test_accuracy': 0.9952,
            'features_count': 47
        }
        self._load_model()
    
    def _load_model(self):
        """Load mô hình Random Forest đã được training"""
        try:
            # Đường dẫn tới project root
            current_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
            
            # Load scaler và feature names
            train_test_data_path = os.path.join(project_root, 'data', 'pkl', 'train_test_data.pkl')
            if os.path.exists(train_test_data_path):
                with open(train_test_data_path, 'rb') as f:
                    train_data = pickle.load(f)
                    self.scaler = train_data.get('scaler')
                    self.feature_columns = train_data.get('feature_names', [])
                logger.debug("Scaler loaded: %s features", len(self.feature_columns))
            else:
                raise FileNotFoundError(f"train_test_data.pkl không tìm thấy tại {train_test_data_path}")
            
            # Load Random Forest model
            model_path = os.path.join(project_root, 'data', 'pkl', 'optimized_rf_model.pkl')
            if os.path.exists(model_path):
                with open(model_path, 'rb') as f:
                    model_data = pickle.load(f)
                    if isinstance(model_data, dict) and 'model' in model_data:
                        self.model = model_data['model']
                    else:
                        self.model = model_data
                # Concise info when model loaded
                logger.info("Dùng RF: loaded — acc=%.2f%%, features=%s", self.model_accuracy*100, len(self.feature_columns) if self.feature_columns else 0)
            else:
                # Fallback to other model files
                fallback_path = os.path.join(project_root, 'data', 'pkl', 'random_forest_model.pkl')
                if os.path.exists(fallback_path):
                    with open(fallback_path, 'rb') as f:
                        self.model = pickle.load(f)
                    logger.info("Dùng RF (fallback): loaded — acc=%.2f%%, features=%s", self.model_accuracy*100, len(self.feature_columns) if self.feature_columns else 0)
                else:
                    raise FileNotFoundError("Không tìm thấy file model Random Forest")
                    
        except Exception as e:
            logger.error(f"Lỗi khi load model: {e}")
            raise e
    
    def prepare_features(self, input_data):
        """
        Chuẩn bị features từ input data theo đúng format của model
        
        Feature importance từ model analysis:
        - Vote Average: 76.53% 
        - ROI features: 23.47%
        - Còn lại: ~0%
        """
        try:
            # Initialize feature dictionary
            features = {}
            
            # ===========================================
            # CRITICAL FEATURES (99.8% importance)
            # ===========================================
            
            # 1. Vote Average - 76.53% importance (QUAN TRỌNG NHẤT)
            vote_average = float(input_data.get('voteAverage', 6.5))
            features['Vote Average'] = vote_average
            
            # 2. Budget & Revenue cho ROI calculation - 23.47% importance
            budget = float(input_data.get('budget', 0))
            revenue = float(input_data.get('revenue', 0))
            
            features['Budget'] = budget
            features['Revenue'] = revenue
            
            # ✅ FIXED: Cải thiện tính ROI features
            if budget > 0 and revenue > 0:
                roi = revenue / budget
                roi_clipped = min(roi, 10)  # Clip tại 10x ROI
                roi_vs_vote = roi * (vote_average / 10.0)
            elif budget > 0:
                # Pre-release: ước tính ROI dựa trên vote_average và budget
                # Phim có điểm cao hơn có xu hướng ROI tốt hơn
                estimated_roi = max(0.1, (vote_average - 5.0) / 3.0)  # 5.0->0, 8.0->1.0
                roi = estimated_roi
                roi_clipped = min(roi, 10)
                roi_vs_vote = roi * (vote_average / 10.0)
            else:
                roi = 0
                roi_clipped = 0
                roi_vs_vote = 0
            
            features['roi'] = roi
            features['roi_clipped'] = roi_clipped  
            features['roi_vs_vote'] = roi_vs_vote
            
            # ===========================================
            # OPTIONAL FEATURES (0-0.2% importance)
            # ===========================================
            
            # Runtime
            runtime = int(input_data.get('runtime', 120))
            features['Runtime'] = runtime
            features['runtime_minutes'] = runtime
            features['runtime_hours'] = runtime / 60.0
            
            # Vote Count
            features['Vote Count'] = int(input_data.get('voteCount', 1000))
            
            # Time features
            release_date_str = input_data.get('releaseDate')
            if release_date_str:
                try:
                    release_date = pd.to_datetime(release_date_str)
                except:
                    release_date = datetime.now()
            else:
                release_date = datetime.now()
            
            features['release_year'] = release_date.year
            features['release_month'] = release_date.month
            features['release_weekday'] = release_date.weekday()
            features['release_quarter'] = (release_date.month - 1) // 3 + 1
            features['is_holiday_season'] = 1 if release_date.month in [11, 12, 1] else 0
            
            # Derived features
            features['Budget_log'] = np.log10(budget) if budget > 0 else 0
            features['Revenue_log'] = np.log10(revenue) if revenue > 0 else 0
            features['budget_per_year'] = budget
            
            # Genre features (~0% importance)
            available_genres = [
                'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
                'Drama', 'Family', 'Fantasy', 'Horror', 'Music', 
                'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'History'
            ]
            
            selected_genres = input_data.get('genres', [])
            features['num_genres'] = len(selected_genres) if selected_genres else 1
            
            for genre in available_genres:
                features[f'genre_{genre}'] = 1 if genre in selected_genres else 0
            
            # Cast features
            features['num_main_cast'] = input_data.get('cast_count', 5)
            features['cast_genre_interaction'] = features['num_main_cast'] * features['num_genres']
            
            # Country features (set mặc định)
            country_flags = [
                'is_united_states_of_america', 'is_united_kingdom', 'is_canada',
                'is_vietnam', 'is_china', 'is_france', 'is_south_korea',
                'is_australia', 'is_japan', 'is_india', 'is_usa'
            ]
            for flag in country_flags:
                features[flag] = 0
            
            # Convert to feature vector theo đúng thứ tự
            feature_vector = []
            missing_features = []
            
            for col in self.feature_columns:
                if col in features:
                    feature_vector.append(features[col])
                else:
                    feature_vector.append(0)  # Default value for missing features
                    missing_features.append(col)
            
            # Create DataFrame with proper feature names (để tránh warning)
            feature_df = pd.DataFrame([feature_vector], columns=self.feature_columns)
            
            # Apply scaler nếu có và chuẩn bị DataFrame đã scale (giữ tên cột)
            if self.scaler is not None:
                try:
                    feature_array = self.scaler.transform(feature_df)
                    # Keep scaled DataFrame with same column names to preserve feature names
                    feature_df_scaled = pd.DataFrame(feature_array, columns=self.feature_columns)
                except Exception as e:
                    logger.warning("Scaler transform warning: %s", e)
                    # Fallback: sử dụng raw values
                    feature_array = feature_df.values
                    feature_df_scaled = feature_df.copy()
            else:
                feature_array = feature_df.values
                feature_df_scaled = feature_df.copy()
            
            # Log debugging info
            # Less noisy: debug-level details
            logger.debug("Features prepared: %s", feature_array.shape)
            logger.debug("Inputs: vote=%s, budget=%s, revenue=%s, roi=%s", vote_average, budget, revenue, roi)
            if missing_features:
                logger.debug("Missing features (set to 0): %s...", missing_features[:5])
            
            return feature_array, features, feature_df_scaled
            
        except Exception as e:
            logger.error(f"Lỗi khi chuẩn bị features: {e}")
            raise e
    
    def predict(self, input_data):
        """
        Thực hiện prediction sử dụng Random Forest model
        
        Returns:
            dict: {
                'success': bool,
                'success_probability': float,
                'confidence': float,
                'feature_importance': dict,
                'metrics': dict,
                'model_info': dict
            }
        """
        try:
            if not self.model:
                raise ValueError("Model chưa được load")
            
            # Chuẩn bị features (trả về scaled DataFrame để giữ tên cột)
            feature_array, feature_dict, feature_df_scaled = self.prepare_features(input_data)

            # Thực hiện prediction trên DataFrame đã scale (giữ feature names) để tránh sklearn warning
            prediction_proba = self.model.predict_proba(feature_df_scaled)
            success_probability = float(prediction_proba[0][1])  # Xác suất thành công
            prediction = int(success_probability > 0.5)
            
            # Concise log when using real model
            logger.info("Dùng RF: p=%.4f pred=%s vote=%.2f budget=%s roi=%.2f", success_probability, prediction, float(input_data.get('voteAverage', 0)), input_data.get('budget', 0), feature_dict.get('roi_clipped', 0))
            
            # ✅ SANITY CHECK: Nếu probability = 0, có thể có vấn đề với features
            if success_probability < 0.01:
                # Demote to DEBUG: only show these detailed feature values when debugging
                logger.debug("Rất thấp p - kiểm tra giá trị feature (debug)...")
                # Log top 5 feature values from scaled DataFrame
                for col in self.feature_columns[:5]:
                    try:
                        val = float(feature_df_scaled.iloc[0][col])
                    except Exception:
                        val = None
                    logger.debug("  %s: %s", col, val)
            
            # Tính confidence dựa trên probability
            if success_probability > 0.8 or success_probability < 0.2:
                confidence = 95  # Rất tự tin
            elif success_probability > 0.7 or success_probability < 0.3:
                confidence = 85  # Khá tự tin
            elif success_probability > 0.6 or success_probability < 0.4:
                confidence = 75  # Trung bình
            else:
                confidence = 65  # Ít tự tin (gần ngưỡng 0.5)
            
            # Feature importance
            feature_importance_data = self._get_feature_importance(feature_dict)
            
            # Business metrics
            metrics = self._calculate_business_metrics(input_data, success_probability)
            
            # Kết quả cuối cùng
            result = {
                'success': bool(prediction),
                'success_probability': round(success_probability, 4),
                'confidence': confidence,
                'feature_importance': feature_importance_data,
                'metrics': metrics,
                'model_info': {
                    **self.model_info,
                    'prediction_timestamp': datetime.now().isoformat(),
                    'features_used_count': len(self.feature_columns)
                }
            }
            
            logger.debug("Prediction completed: %s (p=%.2f%%)", result['success'], result['success_probability']*100)
            return result
            
        except Exception as e:
            logger.error(f"Lỗi trong quá trình prediction: {e}")
            raise e
    
    def _get_feature_importance(self, feature_dict):
        """Lấy feature importance từ model"""
        try:
            # Try to extract feature_importances_ from possible model wrappers (Pipeline, Calibrated, etc.)
            importances = None

            # Direct attribute
            if hasattr(self.model, 'feature_importances_'):
                importances = getattr(self.model, 'feature_importances_')

            # sklearn Pipeline: search named_steps
            if importances is None:
                try:
                    from sklearn.pipeline import Pipeline
                    if isinstance(self.model, Pipeline):
                        for step_name, step in self.model.named_steps.items():
                            if hasattr(step, 'feature_importances_'):
                                importances = getattr(step, 'feature_importances_')
                                break
                except Exception:
                    pass

            # Wrapped estimators (CalibratedClassifierCV, etc.) may store estimator_
            if importances is None:
                if hasattr(self.model, 'estimator_') and hasattr(self.model.estimator_, 'feature_importances_'):
                    importances = getattr(self.model.estimator_, 'feature_importances_')

            # Some wrappers use base_estimator
            if importances is None:
                if hasattr(self.model, 'base_estimator') and hasattr(self.model.base_estimator, 'feature_importances_'):
                    importances = getattr(self.model.base_estimator, 'feature_importances_')

            # If we found importances, build result
            if importances is not None:
                # Ensure importances is iterable and matches feature_columns length
                feature_imp_dict = {}
                for i, col in enumerate(self.feature_columns):
                    try:
                        imp = float(importances[i])
                    except Exception:
                        imp = 0.0
                    if imp > 0.001:
                        feature_imp_dict[col] = imp

                sorted_features = sorted(feature_imp_dict.items(), key=lambda x: x[1], reverse=True)
                top_10_features = sorted_features[:10]

                return {
                    'top_features': [
                        {
                            'name': name,
                            'importance': round(imp * 100, 2),
                            'value': feature_dict.get(name, 0)
                        }
                        for name, imp in top_10_features
                    ],
                    'total_features': len(self.feature_columns),
                    'note': 'Feature importance từ Random Forest model'
                }

            # If we couldn't find any feature_importances_ in the model or wrappers,
            # do NOT return a static/fake fallback. Return an empty top_features list and
            # a clear note that importance values are unavailable.
            logger.info("Không tìm thấy feature_importances_ trong model; feature importance unavailable")
            return {
                'top_features': [],
                'total_features': len(self.feature_columns) if self.feature_columns else 0,
                'note': 'Feature importance unavailable'
            }
        except Exception as e:
            logger.error(f"Lỗi khi lấy feature importance: {e}")
            return {'top_features': [], 'total_features': 0, 'note': 'Error'}
    
    def _calculate_business_metrics(self, input_data, success_probability):
        """Tính toán business metrics"""
        budget = float(input_data.get('budget', 0))
        current_revenue = float(input_data.get('revenue', 0))
        
        # ROI prediction dựa trên success probability
        if success_probability > 0.7:
            predicted_roi = 2.0 + (success_probability - 0.7) * 10  # 2.0-5.0x
        elif success_probability > 0.5:
            predicted_roi = 1.0 + (success_probability - 0.5) * 5   # 1.0-2.0x
        else:
            predicted_roi = 0.3 + success_probability * 1.4         # 0.3-1.0x
        
        predicted_revenue = budget * predicted_roi if budget > 0 else 0
        
        # Market potential
        if success_probability > 0.8:
            market_potential = "Rất cao"
            risk_level = "Rất thấp"
            investment_grade = "A+"
        elif success_probability > 0.7:
            market_potential = "Cao"
            risk_level = "Thấp"
            investment_grade = "A"
        elif success_probability > 0.6:
            market_potential = "Trung bình cao"
            risk_level = "Trung bình"
            investment_grade = "B+"
        elif success_probability > 0.5:
            market_potential = "Trung bình"
            risk_level = "Trung bình"
            investment_grade = "B"
        elif success_probability > 0.4:
            market_potential = "Thấp"
            risk_level = "Cao"
            investment_grade = "C+"
        else:
            market_potential = "Rất thấp"
            risk_level = "Rất cao"
            investment_grade = "C"
        
        return {
            'predictedROI': round(predicted_roi, 2),
            'predictedRevenue': int(predicted_revenue),
            'breakEvenPoint': int(budget * 1.1) if budget > 0 else 0,
            'marketPotential': market_potential,
            'riskLevel': risk_level,
            'profitMargin': f"{round((predicted_roi - 1) * 100, 1)}%" if predicted_roi > 1 else f"{round((1 - predicted_roi) * -100, 1)}%",
            'investmentGrade': investment_grade,
            'targetAudience': self._analyze_target_audience(input_data),
            'releaseStrategy': self._analyze_release_strategy(input_data),
            'financialBreakdown': {
                'production': int(budget * 0.7) if budget > 0 else 0,
                'marketing': int(budget * 0.3) if budget > 0 else 0,
                'expectedProfit': int(predicted_revenue - budget) if budget > 0 else 0,
                'breakEvenDays': int(15 + (1 - success_probability) * 75)  # 15-90 ngày
            }
        }
    
    def _analyze_target_audience(self, data):
        vote_avg = float(data.get('voteAverage', 6.5))
        if vote_avg >= 8.5:
            return 'Khán giả cao cấp, yêu thích chất lượng'
        elif vote_avg >= 7.5:
            return 'Khán giả đại chúng, gia đình'
        elif vote_avg >= 6.5:
            return 'Khán giả trẻ, giải trí nhẹ'
        else:
            return 'Khán giả thích thể loại đặc biệt'
    
    def _analyze_release_strategy(self, data):
        # Dựa trên release month nếu có
        try:
            month = int(data.get('releaseMonth', datetime.now().month))
        except:
            month = datetime.now().month
            
        if month in [6, 7, 12]:  # Summer & Holiday
            return 'Mùa phim bom tấn - Cạnh tranh cao'
        elif month in [3, 4, 9, 10]:  # Spring & Fall
            return 'Mùa vàng - Thuận lợi phát hành'
        else:
            return 'Mùa thấp điểm - Ít cạnh tranh'


# Singleton instance
prediction_service = MoviePredictionService()

def get_prediction_service():
    """Get the singleton prediction service instance"""
    return prediction_service