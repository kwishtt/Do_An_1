# GitHub Copilot Instructions

## Project Overview
This is a Vietnamese data science project that predicts movie success using machine learning. The project follows a 10-week academic schedule and combines data analysis, ML modeling, and web development.

## Architecture & Structure

### Core Components
- **Data Pipeline**: Raw data → Clean data → Feature engineering → Model-ready data
- **ML Models**: Logistic Regression (baseline) + Random Forest (main model)  
- **Web Interface**: Flask-based prediction website (planned)
- **Weekly Progress**: Structured development following academic timeline

### Key Directories
- `data/`: All datasets at different processing stages
  - `raw_Movies.csv` → `clean_movies.csv` → `clean_movies_with_labels.csv` → `clean_movies_features.csv`
  - `pkl/`: Serialized models and processed datasets
- `progress/weekXX/`: Weekly deliverables with specific goals
- `docs/`: Project documentation and reports in Vietnamese
- `webs/`: Website development blueprints and UI designs

## Development Patterns

### Data Processing Workflow
1. **Week 2**: Clean raw data using `cleandata.py` pattern
2. **Week 3**: Create success labels using ROI + Vote Average criteria
3. **Week 4**: Feature engineering with one-hot encoding for categorical data
4. **Week 5**: Train/test split with SMOTE for class balancing

### Model Development Standards
- Use `pickle` for saving models and processed data in `data/pkl/`
- Save results to `progress/weekXX/model_name/results.txt` files
- Follow pattern: load data → train → evaluate → save results + model
- Include comparison metrics between models in result files

### Success Criteria Definition
```python
# Critical business logic - success is defined as:
success = (ROI >= 1.0) & (vote_average >= 6.5)
# Where ROI = Revenue / Budget
```

## Code Conventions

### File Naming
- Script files: `snake_case.py` (e.g., `cleandata.py`, `feature_engineering.py`)
- Data files: `descriptive_names.csv` with processing stage indicated
- Result files: `model_name_results.txt` in respective model directories

### Vietnamese Documentation
- All reports and documentation are in Vietnamese
- Code comments can be in Vietnamese or English
- Variable names typically in English, but descriptions in Vietnamese

### Error Handling
- Use `fillna(0)` for missing values in ML preprocessing
- Remove rows where `Budget == 0` or `Revenue == 0`
- Apply `errors='coerce'` when converting dates

## Dependencies & Environment

### Core Libraries
```python
# Data processing
pandas, numpy
# ML and evaluation  
scikit-learn, imblearn (for SMOTE)
# Visualization
matplotlib, seaborn
# Web development (planned)
flask, flask_sqlalchemy, gunicorn
```

### Model Persistence
- Use `pickle` for model serialization
- Store in `data/pkl/` with descriptive names
- Include scaler objects and feature names in saved data dictionaries

## Testing & Evaluation

### ML Model Evaluation
- Use 5-fold cross-validation for final model assessment
- Key metrics: Accuracy, Precision, Recall, F1-Score
- Expected performance: >80% accuracy, >75% F1-score
- Analyze false positives (investment risks) vs false negatives (missed opportunities)

### Weekly Deliverables
Each week has specific deliverables - check `docs/Nhiệm-Vụ-10-Tuần.md` for current week's requirements.

## Business Context

### Domain Knowledge
- **ROI calculation**: Essential for success labeling
- **Vietnamese market focus**: Dataset covers movies released in Vietnam 1990-2024
- **Dual success criteria**: Both financial (ROI ≥ 1) and quality (rating ≥ 6.5) must be met
- **Feature importance**: Budget, vote count, runtime, and genre are expected key factors

### Web Application Goals
- Instant prediction without registration
- Mobile-first design (60% mobile traffic expected)
- Support for both light/dark themes
- Integration with the trained ML models for real-time predictions

## Special Considerations

### Data Quality Issues
- Handle zero budget/revenue values by removal
- Address class imbalance using SMOTE if ratio < 0.5
- Vietnamese movie data may have cultural/market-specific patterns

### Academic Requirements
- Follow 10-week schedule strictly
- Maintain Vietnamese documentation for academic submission
- Include comparison between baseline and advanced models
- Provide business impact analysis of prediction errors

When working on this project, always consider the academic timeline, Vietnamese documentation requirements, and the practical goal of helping Vietnamese film industry stakeholders make data-driven decisions.