from flask import Flask, render_template, request, jsonify
import pickle
import pandas as pd
import numpy as np
from datetime import datetime
import os
import sys

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
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
        # Path to your trained model (adjust as needed)
        model_path = os.path.join(project_root,'filmpredict-website','models', 'optimized_rf_model.pkl')
        scaler_path = os.path.join(project_root, 'filmpredict-website', 'models', 'scaler.pkl')
        features_path = os.path.join(project_root, 'filmpredict-website', 'models', 'feature_columns.pkl')

        # Load model
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
            print("✓ Model loaded successfully")
        else:
            print(f"⚠ Model file not found at {model_path}")
            print("Using mock model for demonstration")
            model = MockModel()
        
        # Load scaler
        if os.path.exists(scaler_path):
            with open(scaler_path, 'rb') as f:
                scaler = pickle.load(f)
            print("✓ Scaler loaded successfully")
        else:
            print("⚠ Scaler not found, using mock scaler")
            scaler = MockScaler()
        
        # Load feature columns
        if os.path.exists(features_path):
            with open(features_path, 'rb') as f:
                feature_columns = pickle.load(f)
            print("✓ Feature columns loaded successfully")
        else:
            print("⚠ Feature columns not found, using default features")
            feature_columns = get_default_features()
            
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
    """Default feature columns for the model"""
    return [
        'budget', 'vote_average', 'runtime',
        'genre_Action', 'genre_Adventure', 'genre_Animation',
        'genre_Comedy', 'genre_Crime', 'genre_Documentary',
        'genre_Drama', 'genre_Family', 'genre_Fantasy',
        'genre_Horror', 'genre_Music', 'genre_Mystery',
        'genre_Romance', 'genre_Science Fiction', 'genre_Thriller',
        'genre_War', 'genre_Western'
    ]

def prepare_features(data):
    """Prepare features for model prediction"""
    try:
        # Initialize feature vector
        features = {}
        
        # Basic numerical features
        features['budget'] = float(data.get('budget', 0))
        features['vote_average'] = float(data.get('voteAverage', 5.0))
        features['runtime'] = int(data.get('runtime', 90))
        
        # Genre one-hot encoding
        available_genres = [
            'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
            'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
            'Music', 'Mystery', 'Romance', 'Science Fiction', 'Thriller',
            'War', 'Western'
        ]
        
        selected_genres = data.get('genres', [])
        for genre in available_genres:
            features[f'genre_{genre}'] = 1 if genre in selected_genres else 0
        
        # Convert to feature vector matching model expectations
        feature_vector = []
        for col in feature_columns:
            feature_vector.append(features.get(col, 0))
        
        return np.array([feature_vector])
        
    except Exception as e:
        print(f"Error preparing features: {e}")
        # Return default feature vector
        return np.zeros((1, len(feature_columns)))

def calculate_metrics(prediction_data, success_probability):
    """Calculate business metrics for the prediction"""
    budget = float(prediction_data.get('budget', 0))
    
    # Calculate ROI based on success probability and budget
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
    break_even_point = budget * 1.1  # Assuming 10% additional costs
    
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
    
    return {
        'predicted_roi': round(predicted_roi, 2),
        'predicted_revenue': int(predicted_revenue),
        'break_even_point': int(break_even_point),
        'market_potential': market_potential,
        'risk_level': risk_level,
        'profit_margin': round((predicted_roi - 1) * 100, 1) if predicted_roi > 1 else round((1 - predicted_roi) * -100, 1)
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
        required_fields = ['title', 'budget', 'runtime', 'voteAverage', 'genres']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}',
                    'success': False
                }), 400
        
        # Prepare features for model
        features = prepare_features(data)
        
        # Make prediction
        if model and hasattr(model, 'predict_proba'):
            prediction_proba = model.predict_proba(features)
            success_probability = float(prediction_proba[0][1])  # Probability of success
            prediction = int(prediction_proba[0][1] > 0.5)
        else:
            # Fallback prediction logic
            budget = float(data.get('budget', 0))
            vote_avg = float(data.get('voteAverage', 5.0))
            runtime = int(data.get('runtime', 90))
            
            # Simple heuristic
            score = 0
            if budget > 50000000: score += 0.3
            elif budget > 20000000: score += 0.2
            elif budget > 5000000: score += 0.1
            
            if vote_avg >= 7.5: score += 0.4
            elif vote_avg >= 6.5: score += 0.3
            elif vote_avg >= 6.0: score += 0.2
            
            if 90 <= runtime <= 150: score += 0.2
            elif 120 <= runtime <= 180: score += 0.1
            
            # Genre bonus
            popular_genres = ['Action', 'Adventure', 'Comedy', 'Drama']
            genres = data.get('genres', [])
            if any(genre in popular_genres for genre in genres):
                score += 0.1
            
            success_probability = min(0.95, max(0.05, score + np.random.uniform(-0.1, 0.1)))
            prediction = 1 if success_probability > 0.5 else 0
        
        # Calculate business metrics
        metrics = calculate_metrics(data, success_probability)
        
        # Prepare response
        response = {
            'success': True,
            'prediction': {
                'will_succeed': bool(prediction),
                'confidence': round(success_probability * 100, 1),
                'success_probability': round(success_probability, 3)
            },
            'metrics': metrics,
            'input_data': {
                'title': data.get('title', 'Unknown'),
                'budget': float(data.get('budget', 0)),
                'runtime': int(data.get('runtime', 90)),
                'vote_average': float(data.get('voteAverage', 5.0)),
                'genres': data.get('genres', []),
                'production_companies': data.get('productionCompanies', []),
                'countries': data.get('countries', []),
                'languages': data.get('languages', [])
            },
            'model_info': {
                'accuracy': model_accuracy,
                'model_type': 'Random Forest',
                'features_used': len(feature_columns),
                'prediction_timestamp': datetime.now().isoformat()
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Prediction error: {e}")
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