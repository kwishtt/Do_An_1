from flask import Flask, render_template, request, jsonify
import pickle
import pandas as pd
import numpy as np
from datetime import datetime
import os
import sys

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(project_root)

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['DEBUG'] = True

# Global variables for model and data
model = None
scaler = None
feature_columns = None
model_accuracy = 0.9952  # From your project results

def load_model():
    """Load the trained model, scaler, and feature information"""
    global model, scaler, feature_columns
    
    try:
        # Path to trained model in data/pkl/ directory (CORRECTED)
        model_path = os.path.join(project_root, 'data', 'pkl', 'optimized_rf_model.pkl')
        train_test_data_path = os.path.join(project_root, 'data', 'pkl', 'train_test_data.pkl')

        # Load train_test_data.pkl to get scaler and feature_names
        if os.path.exists(train_test_data_path):
            with open(train_test_data_path, 'rb') as f:
                train_data = pickle.load(f)
                scaler = train_data.get('scaler')
                feature_columns = train_data.get('feature_names')
            print("✓ Scaler loaded successfully from train_test_data.pkl")
            print(f"✓ Feature columns loaded: {len(feature_columns)} features")
            print(f"   Features: {feature_columns[:5]}... (showing first 5)")
        else:
            print(f"⚠ train_test_data.pkl not found at {train_test_data_path}")
            print("Using mock scaler and default features")
            scaler = MockScaler()
            feature_columns = get_default_features()
        
        # Load optimized model
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                model_data = pickle.load(f)
                # Check if it's a dict with 'model' key or just the model
                if isinstance(model_data, dict) and 'model' in model_data:
                    model = model_data['model']
                    print("✓ Optimized model loaded successfully (from dict)")
                else:
                    model = model_data
                    print("✓ Model loaded successfully")
        else:
            print(f"⚠ Model file not found at {model_path}")
            print("Trying fallback: random_forest_model.pkl")
            fallback_path = os.path.join(project_root, 'data', 'pkl', 'random_forest_model.pkl')
            if os.path.exists(fallback_path):
                with open(fallback_path, 'rb') as f:
                    model = pickle.load(f)
                print("✓ Fallback model loaded successfully")
            else:
                print("Using mock model for demonstration")
                model = MockModel()
            
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Using mock model for demonstration")
        model = MockModel()
        scaler = MockScaler()
        feature_columns = get_default_features()

class MockModel:
    """Mock model for demonstration purposes"""
    def predict(self, X):
        """Simple heuristic-based prediction"""
        predictions = []
        for row in X:
            # Simple logic based on budget, vote_average, and runtime
            budget_score = min(row[0] / 100000000, 1.0) * 0.4  # Normalized budget
            rating_score = (row[1] - 5.0) / 5.0 * 0.4  # Vote average impact
            runtime_score = 0.2 if 90 <= row[2] <= 150 else 0.1  # Optimal runtime
            
            total_score = budget_score + rating_score + runtime_score
            predictions.append(1 if total_score > 0.5 else 0)
        
        return np.array(predictions)
    
    def predict_proba(self, X):
        """Return prediction probabilities"""
        predictions = self.predict(X)
        probabilities = []
        for pred in predictions:
            if pred == 1:
                prob = np.random.uniform(0.6, 0.95)
                probabilities.append([1-prob, prob])
            else:
                prob = np.random.uniform(0.6, 0.95)
                probabilities.append([prob, 1-prob])
        
        return np.array(probabilities)

class MockScaler:
    """Mock scaler for demonstration"""
    def transform(self, X):
        # Simple normalization
        return np.array(X) / np.max(np.array(X), axis=0)

def get_default_features():
    """Default feature columns for the model - CORRECTED to match actual dataset"""
    return [
        'budget', 'vote_average', 'runtime',
        'genre_Action', 'genre_Adventure', 'genre_Animation',
        'genre_Comedy', 'genre_Crime', 
        'genre_Drama', 'genre_Family', 'genre_Fantasy',
        'genre_Horror', 'genre_Music', 'genre_Mystery',
        'genre_Romance', 'genre_Science Fiction', 'genre_Thriller',
        'genre_History'  # Added - exists in dataset
        # Removed: genre_Documentary, genre_War, genre_Western (not in dataset)
    ]

def prepare_features(data):
    """
    Prepare features for model prediction
    
    IMPORTANT FINDING (from feature importance analysis):
    - Vote Average: 76.53% importance ⭐⭐⭐
    - ROI features: 23.47% importance
    - All other 43 features: ~0.00% importance
    
    This means we only need 3-4 key inputs from user:
    1. Vote Average (MOST IMPORTANT)
    2. Revenue (to calculate ROI)
    3. Budget (to calculate ROI)
    4. Runtime (optional, very low importance)
    
    All other features can be set to reasonable defaults.
    """
    try:
        from datetime import datetime
        
        # Initialize feature dictionary
        features = {}
        
        # ============================================
        # CRITICAL FEATURES (99.8% importance)
        # ============================================
        
        # 1. Vote Average - 76.53% importance ⭐⭐⭐
        vote_average = float(data.get('voteAverage', 6.5))
        features['Vote Average'] = vote_average
        
        # 2. Budget & Revenue for ROI calculation - 23.47% importance
        budget = float(data.get('budget', 0))
        revenue = float(data.get('revenue', 0))  # Current revenue if movie is already released
        
        features['Budget'] = budget
        features['Revenue'] = revenue
        
        # Calculate ROI features (23.47% combined importance)
        if budget > 0 and revenue > 0:
            roi = revenue / budget
            roi_clipped = min(roi, 10)  # Clip at 10x (1000% ROI)
            roi_vs_vote = roi * (vote_average / 10.0)
        else:
            # If no revenue data (pre-release), set ROI features to default
            roi = 0
            roi_clipped = 0
            roi_vs_vote = 0
        
        features['roi'] = roi
        features['roi_clipped'] = roi_clipped
        features['roi_vs_vote'] = roi_vs_vote
        
        # ============================================
        # OPTIONAL FEATURES (0-0.2% importance)
        # These can be user input OR defaults
        # ============================================
        
        # 3. Runtime (very low importance)
        runtime = int(data.get('runtime', 120))
        features['Runtime'] = runtime
        features['runtime_minutes'] = runtime
        features['runtime_hours'] = runtime / 60.0
        
        # 4. Vote Count (very low importance)
        features['Vote Count'] = int(data.get('voteCount', 100))
        
        # 5. Time-based features (set to current date or user input)
        release_date_str = data.get('releaseDate')
        if release_date_str:
            release_date = pd.to_datetime(release_date_str)
        else:
            release_date = datetime.now()
        
        features['release_year'] = release_date.year
        features['release_month'] = release_date.month
        features['release_weekday'] = release_date.weekday()
        features['release_quarter'] = (release_date.month - 1) // 3 + 1
        features['is_holiday_season'] = 1 if release_date.month in [11, 12, 1] else 0
        
        # 6. Derived features
        features['Budget_log'] = np.log10(budget) if budget > 0 else 0
        features['Revenue_log'] = np.log10(revenue) if revenue > 0 else 0
        features['budget_per_year'] = budget  # Simplified
        
        # 7. Genre features (very low importance ~0%)
        available_genres = [
            'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
            'Drama', 'Family', 'Fantasy', 'Horror',
            'Music', 'Mystery', 'Romance', 'Science Fiction', 'Thriller',
            'History'
        ]
        
        selected_genres = data.get('genres', [])
        features['num_genres'] = len(selected_genres) if selected_genres else 2
        
        for genre in available_genres:
            features[f'genre_{genre}'] = 1 if genre in selected_genres else 0
        
        # 8. Cast features (very low importance)
        features['num_main_cast'] = 5  # Default
        features['cast_genre_interaction'] = features['num_main_cast'] * features['num_genres']
        
        # 9. Country features (very low importance ~0%)
        # Set all to 0 (default)
        country_flags = [
            'is_united_states_of_america', 'is_united_kingdom', 'is_canada',
            'is_vietnam', 'is_china', 'is_france', 'is_south_korea',
            'is_australia', 'is_japan', 'is_india', 'is_usa'
        ]
        for flag in country_flags:
            features[flag] = 0
        
        # ============================================
        # Convert to feature vector in correct order
        # ============================================
        feature_vector = []
        for col in feature_columns:
            feature_vector.append(features.get(col, 0))
        
        feature_array = np.array([feature_vector])
        
        # ============================================
        # Apply scaler (IMPORTANT!)
        # ============================================
        if scaler is not None:
            feature_array = scaler.transform(feature_array)
        
        return feature_array
        
    except Exception as e:
        print(f"Error preparing features: {e}")
        import traceback
        traceback.print_exc()
        # Return default feature vector
        return np.zeros((1, len(feature_columns)))

def calculate_metrics(prediction_data, success_probability):
    """
    Calculate business metrics for the prediction
    
    For movies already released (with revenue data):
    - Calculate actual ROI from provided revenue
    - Estimate final revenue based on current revenue and days in theater
    - Provide break-even analysis
    
    For pre-release movies (no revenue):
    - Estimate potential ROI based on success probability
    - Calculate break-even requirements
    """
    budget = float(prediction_data.get('budget', 0))
    current_revenue = float(prediction_data.get('revenue', 0))
    
    # Check if movie is already released (has revenue data)
    has_revenue_data = current_revenue > 0
    
    if has_revenue_data:
        # Movie is already in theaters - calculate actual metrics
        actual_roi = current_revenue / budget if budget > 0 else 0
        
        # Estimate final revenue (assuming current revenue is from partial run)
        # Simple heuristic: multiply by a factor based on success probability
        revenue_multiplier = 1.5 if success_probability > 0.7 else 1.2
        predicted_final_revenue = current_revenue * revenue_multiplier
        predicted_roi = predicted_final_revenue / budget if budget > 0 else 0
        
        break_even_point = budget * 1.1  # 10% overhead
        is_profitable = current_revenue >= break_even_point
        
        # Market potential based on current performance
        if actual_roi >= 3.0:
            market_potential = "Rất cao"
        elif actual_roi >= 1.5:
            market_potential = "Cao"
        elif actual_roi >= 1.0:
            market_potential = "Trung bình"
        else:
            market_potential = "Thấp"
        
        # Risk level (for continued investment decisions)
        if success_probability > 0.7 and actual_roi > 1.0:
            risk_level = "Thấp"
        elif success_probability > 0.5 or actual_roi >= 0.8:
            risk_level = "Trung bình"
        else:
            risk_level = "Cao"
        
        profit_margin = ((actual_roi - 1) * 100) if actual_roi > 1 else ((1 - actual_roi) * -100)
        
        return {
            'has_revenue_data': True,
            'current_revenue': int(current_revenue),
            'current_roi': round(actual_roi, 2),
            'predicted_roi': round(predicted_roi, 2),
            'predicted_final_revenue': int(predicted_final_revenue),
            'break_even_point': int(break_even_point),
            'is_profitable': is_profitable,
            'market_potential': market_potential,
            'risk_level': risk_level,
            'profit_margin': round(profit_margin, 1)
        }
    else:
        # Pre-release movie - estimate based on success probability
        # Use traditional estimation approach
        if success_probability > 0.7:
            base_roi = 2.5 + (success_probability - 0.7) * 3
        elif success_probability > 0.5:
            base_roi = 1.2 + (success_probability - 0.5) * 6.5
        else:
            base_roi = 0.3 + success_probability * 1.8
        
        # Add some randomness to make it more realistic
        roi_variation = np.random.uniform(-0.3, 0.3)
        predicted_roi = max(0.1, base_roi + roi_variation)
        
        predicted_revenue = budget * predicted_roi
        break_even_point = budget * 1.1
        
        # Market potential assessment
        if success_probability > 0.8:
            market_potential = "Rất cao"
        elif success_probability > 0.6:
            market_potential = "Cao"
        elif success_probability > 0.4:
            market_potential = "Trung bình"
        else:
            market_potential = "Thấp"
        
        # Risk level assessment
        if success_probability > 0.7:
            risk_level = "Thấp"
        elif success_probability > 0.5:
            risk_level = "Trung bình"
        else:
            risk_level = "Cao"
        
        profit_margin = round((predicted_roi - 1) * 100, 1) if predicted_roi > 1 else round((1 - predicted_roi) * -100, 1)
        
        return {
            'has_revenue_data': False,
            'predicted_roi': round(predicted_roi, 2),
            'predicted_revenue': int(predicted_revenue),
            'break_even_point': int(break_even_point),
            'market_potential': market_potential,
            'risk_level': risk_level,
            'profit_margin': profit_margin
        }


@app.route('/')
def index():
    """Main page"""
    return render_template('index.html', model_accuracy=model_accuracy)

@app.route('/predict', methods=['POST'])
def predict():
    """Handle prediction requests"""
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No data provided',
                'success': False
            }), 400
        
        # Validate required fields
        # Note: revenue is now OPTIONAL (can be 0 for pre-release predictions)
        required_fields = ['title', 'budget', 'voteAverage']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}',
                    'success': False
                }), 400
        
        # Set defaults for optional fields
        if 'runtime' not in data:
            data['runtime'] = 120
        if 'genres' not in data:
            data['genres'] = []
        if 'revenue' not in data:
            data['revenue'] = 0  # Pre-release prediction
        
        # Prepare features for model
        features = prepare_features(data)
        
        # Make prediction
        if model and hasattr(model, 'predict_proba'):
            prediction_proba = model.predict_proba(features)
            success_probability = float(prediction_proba[0][1])  # Probability of success
            prediction = int(prediction_proba[0][1] > 0.5)
        else:
            # Fallback prediction logic (shouldn't happen with real model loaded)
            budget = float(data.get('budget', 0))
            vote_avg = float(data.get('voteAverage', 5.0))
            revenue = float(data.get('revenue', 0))
            
            # Simple heuristic based on Vote Average (76.53% importance)
            score = 0
            if vote_avg >= 8.0: score += 0.7
            elif vote_avg >= 7.0: score += 0.5
            elif vote_avg >= 6.5: score += 0.3
            elif vote_avg >= 6.0: score += 0.2
            
            # ROI bonus if revenue available (23.47% importance)
            if revenue > 0 and budget > 0:
                roi = revenue / budget
                if roi >= 1.5: score += 0.2
                elif roi >= 1.0: score += 0.15
                elif roi >= 0.8: score += 0.1
            
            success_probability = min(0.95, max(0.05, score + np.random.uniform(-0.05, 0.05)))
            prediction = 1 if success_probability > 0.5 else 0
        
        # Calculate business metrics
        metrics = calculate_metrics(data, success_probability)
        
        # Extract feature importance from model (if available)
        feature_importance_data = {}
        if model and hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            # Sort features by importance and get top 10
            feature_imp_dict = {}
            for i, col in enumerate(feature_columns):
                if importances[i] > 0.001:  # Only include features with >0.1% importance
                    feature_imp_dict[col] = float(importances[i])
            
            # Sort by importance (descending)
            sorted_features = sorted(feature_imp_dict.items(), key=lambda x: x[1], reverse=True)
            
            # Get top 10 features
            top_10_features = sorted_features[:10]
            
            # ✅ FIX: Safely extract feature values with fallback
            def get_feature_value(feature_name, feature_array):
                """Safely get feature value by name"""
                try:
                    if feature_name in feature_columns:
                        idx = feature_columns.index(feature_name)
                        value = float(feature_array[0][idx])
                        return value if not np.isnan(value) else 0.0
                    return 0.0
                except (IndexError, ValueError, TypeError):
                    return 0.0
            
            feature_importance_data = {
                'top_features': [
                    {
                        'name': name,
                        'importance': round(imp * 100, 2),  # Convert to percentage
                        'value': get_feature_value(name, features)
                    }
                    for name, imp in top_10_features
                ],
                'total_features': len(feature_columns),
                'note': 'Top 10 most important features for this prediction'
            }
            
            # Debug logging
            print(f"✅ Feature importance extracted: {len(feature_importance_data['top_features'])} features")
            for f in feature_importance_data['top_features'][:3]:
                print(f"   - {f['name']}: {f['importance']}% (value: {f['value']})")
        else:
            # Fallback: Use known feature importance from analysis
            vote_avg = float(data.get('voteAverage', 6.5))
            budget = float(data.get('budget', 0))
            revenue = float(data.get('revenue', 0))
            roi = revenue / budget if budget > 0 else 0.0
            
            feature_importance_data = {
                'top_features': [
                    {'name': 'Vote Average', 'importance': 76.53, 'value': vote_avg},
                    {'name': 'ROI', 'importance': 23.47, 'value': roi},
                    {'name': 'Budget', 'importance': 0.00, 'value': budget},
                    {'name': 'Runtime', 'importance': 0.00, 'value': float(data.get('runtime', 120))},
                    {'name': 'Vote Count', 'importance': 0.00, 'value': float(data.get('voteCount', 100))},
                ],
                'total_features': 47,
                'note': 'Feature importance from model analysis (Week 6)'
            }
            
            print("⚠️ Using fallback feature importance (model doesn't have feature_importances_)")
        
        # Prepare response
        response = {
            'success': True,
            'prediction': {
                'will_succeed': bool(prediction),
                'confidence': round(success_probability * 100, 1),
                'success_probability': round(success_probability, 3)
            },
            'metrics': metrics,
            'feature_importance': feature_importance_data,  # ✨ NEW
            'input_data': {
                'title': data.get('title', 'Unknown'),
                'budget': float(data.get('budget', 0)),
                'revenue': float(data.get('revenue', 0)),
                'runtime': int(data.get('runtime', 120)),
                'vote_average': float(data.get('voteAverage', 5.0)),
                'genres': data.get('genres', []),
                'production_companies': data.get('productionCompanies', []),
                'countries': data.get('countries', []),
                'languages': data.get('languages', []),
                'is_post_release': metrics.get('has_revenue_data', False)
            },
            'model_info': {
                'accuracy': model_accuracy,
                'model_type': 'Random Forest (Optimized)',
                'features_used': len(feature_columns),
                'prediction_timestamp': datetime.now().isoformat(),
                'key_features': {
                    'vote_average_importance': '76.53%',
                    'roi_importance': '23.47%',
                    'note': 'Vote Average is the most critical factor'
                }
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/model-info')
def model_info():
    """Get information about the loaded model"""
    return jsonify({
        'model_loaded': model is not None,
        'model_type': type(model).__name__,
        'accuracy': model_accuracy,
        'features_count': len(feature_columns) if feature_columns else 0,
        'features': feature_columns[:10] if feature_columns else [],  # First 10 features
        'status': 'ready'
    })

@app.route('/api/sample-data')
def sample_data():
    """Get sample data for testing"""
    samples = [
        {
            'title': 'Avengers: Endgame Style',
            'budget': 356000000,
            'runtime': 181,
            'voteAverage': 8.4,
            'genres': ['Action', 'Adventure', 'Science Fiction']
        },
        {
            'title': 'Independent Drama',
            'budget': 2000000,
            'runtime': 105,
            'voteAverage': 7.2,
            'genres': ['Drama']
        },
        {
            'title': 'Comedy Hit',
            'budget': 25000000,
            'runtime': 98,
            'voteAverage': 6.8,
            'genres': ['Comedy']
        },
        {
            'title': 'Horror Thriller',
            'budget': 10000000,
            'runtime': 95,
            'voteAverage': 6.5,
            'genres': ['Horror', 'Thriller']
        }
    ]
    
    return jsonify(samples)

@app.errorhandler(404)
def not_found(error):
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'success': False
    }), 500

if __name__ == '__main__':
    print("="*50)
    
    # Load model and components
    load_model()
    
    print(f"> Model Status: {'✓ Loaded' if model else '✗ Not loaded'}")
    print(f"> Model Accuracy: {model_accuracy*100:.2f}%")
    print(f"> Features: {len(feature_columns) if feature_columns else 0}")
    print("="*50)
    print("> Starting Flask development server...")
    print("> Open: http://localhost:5000")
    print("="*50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)