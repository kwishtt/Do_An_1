from flask import Flask, render_template, request, jsonify
import sys
import os
from datetime import datetime
import logging

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(project_root)

# Import prediction service
from models.prediction_service import get_prediction_service

app = Flask(__name__)

# Setup logger
logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# Configuration
app.config['SECRET_KEY'] = 'not-so-secret-key-lol'
app.config['DEBUG'] = True

# Get prediction service instance
prediction_service = get_prediction_service()

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html', model_accuracy=prediction_service.model_accuracy)

@app.route('/predict', methods=['POST'])
def predict():
    """Handle prediction requests using Random Forest model"""
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No data provided',
                'success': False
            }), 400
        
        # Validate required fields
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
        
        # Use prediction service for actual Random Forest prediction
        prediction_result = prediction_service.predict(data)
        
        # Prepare response in expected format
        response = {
            'success': True,
            'prediction': {
                'will_succeed': prediction_result['success'],
                'confidence': round(prediction_result['success_probability'] * 100, 1),
                'success_probability': prediction_result['success_probability']
            },
            'metrics': prediction_result['metrics'],
            'feature_importance': prediction_result['feature_importance'],
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
                'is_post_release': data.get('revenue', 0) > 0
            },
            'model_info': {
                **prediction_result['model_info'],
                # Đánh dấu đây có đang dùng model thật hay không dựa trên trạng thái tải model
                'is_real_model': prediction_service.model is not None,
                'key_features': {
                    'vote_average_importance': '76.53%',
                    'roi_importance': '23.47%',
                    'note': 'Random Forest model với 99.52% accuracy'
                }
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        # Log exception with Vietnamese message and stack trace
        logger.exception(f"Lỗi khi thực hiện dự đoán: {e}")
        return jsonify({
            'error': f'Lỗi khi thực hiện dự đoán: {str(e)}',
            'success': False
        }), 500

@app.route('/api/model-info')
def model_info():
    """Get information about the loaded model"""
    return jsonify({
        'model_loaded': prediction_service.model is not None,
        'model_type': 'Random Forest (Optimized)',
        'accuracy': prediction_service.model_accuracy,
        'features_count': len(prediction_service.feature_columns) if prediction_service.feature_columns else 0,
        'features': prediction_service.feature_columns[:10] if prediction_service.feature_columns else [],
        'status': 'ready',
        # phản ánh đúng trạng thái tải model
        'is_real_model': prediction_service.model is not None
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
    logger.info("%s", "="*50)
    logger.info("> Dịch vụ Dự Đoán Thành Công Phim")
    logger.info("> Trạng thái mô hình: %s", '✓ Random Forest đã load' if prediction_service.model else '✗ Chưa load model')
    logger.info("> Độ chính xác mô hình: %.2f%%", prediction_service.model_accuracy*100)
    logger.info("> Số feature: %s", len(prediction_service.feature_columns) if prediction_service.feature_columns else 0)
    logger.info("%s", "="*50)
    logger.info("> Bắt đầu Flask server (dev)...")
    logger.info("> Mở: http://localhost:8000")
    logger.info("%s", "="*50)

    app.run(host='0.0.0.0', port=8000, debug=True)