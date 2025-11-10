## Purpose
Provide concise, repository-specific guidance for AI coding agents working on MoviePredict. Focus on architecture, run/debug workflows, important conventions, and concrete examples from the codebase.

## Big picture
- This is a small Flask-based prediction service. The web server is in `app.py` and the ML logic is encapsulated in `models/prediction_service.py`.
- At startup a singleton `prediction_service` (see `models/prediction_service.py`) loads model artifacts from `data/pkl/` (expected files: `train_test_data.pkl`, `optimized_rf_model.pkl`; fallback: `random_forest_model.pkl`). Importing the module triggers heavy I/O — treat it as expensive.
- Front-end assets live under `static/` and `templates/index.html` renders the main page and reads `model_accuracy` from the Flask context.

## Quick run & debug (dev)
- Start the dev server (runs the `if __name__ == '__main__'` block in `app.py`):

```fish
python app.py
```

- The server binds to `0.0.0.0:5000` with `DEBUG=True`. Check stdout for model load logs and `Model Accuracy` printout.

## Key files & endpoints to know
- `app.py` — Flask routes:
  - `/` — renders `index.html` with `model_accuracy`
  - `/predict` (POST) — expects JSON payload and returns structured prediction result
  - `/api/model-info` — returns basic model metadata
  - `/api/sample-data` — example payloads for manual testing
- `models/prediction_service.py` — singleton service exposing `get_prediction_service()` and `prediction_service.predict(input_data)`.

## Input / output contract (use these exact fields)
- Required input JSON keys (for `/predict`): `title`, `budget`, `voteAverage`.
- Optional keys: `runtime` (defaults to 120), `genres` (defaults to []), `revenue` (defaults to 0 for pre-release predictions), `voteCount`, `releaseDate`, `productionCompanies`, `countries`, `languages`.
- Feature mapping: the code converts `voteAverage` → feature named `Vote Average`; budget/revenue map to `Budget`/`Revenue` and derived ROI features (`roi`, `roi_clipped`, `roi_vs_vote`). The model expects columns listed in `train_test_data.pkl['feature_names']` — those names are used as DataFrame columns in `prepare_features`.
- `/predict` response shape (JSON):
  - `success` (bool), `prediction` object with `will_succeed`, `confidence`, `success_probability` (float), `metrics`, `feature_importance`, `model_info`, and an `input_data` echo.

Example minimal POST payload (JSON):

```json
{"title":"Example","budget":1000000,"voteAverage":7.2}
```

## Model & data conventions
- Model artifacts must be placed at `<project_root>/data/pkl/`:
  - `train_test_data.pkl` should contain at least `scaler` and `feature_names`.
  - `optimized_rf_model.pkl` is the preferred model pickle (or `random_forest_model.pkl` as fallback).
- `prediction_service` loads these at import time and raises `FileNotFoundError` if missing — CI or lightweight tests should mock `get_prediction_service()` to avoid heavy model loads.

## Patterns and gotchas for contributors
- Singleton load on import: `prediction_service = MoviePredictionService()` runs at module import. Avoid importing `models.prediction_service` in lightweight unit tests unless you deliberately want the model to load. Use `from models.prediction_service import get_prediction_service` and mock `get_prediction_service()` where appropriate.
- Feature naming is case-sensitive and often uses spaces (e.g., `'Vote Average'`) — when adding features in `prepare_features`, ensure names match the `feature_names` in the saved `train_test_data.pkl`.
- The service attempts to apply `scaler.transform(...)` when available; failing transforms fall back to raw values and log a warning. Tests should include scalers or patch the scaler to avoid transform errors.
- Error handling: `app.py` returns `400` for missing required fields and `500` with JSON error messages when exceptions occur. Logs include stack traces printed to stdout.

## Useful code examples to reference
- To get a service instance:

```py
from models.prediction_service import get_prediction_service
svc = get_prediction_service()
svc.predict({"title":"X","budget":5000000,"voteAverage":7.8})
```

- `prepare_features` builds the feature vector and fills missing features with `0`. Unit tests should assert this behavior for missing/partial inputs.

## Recommended quick tests to add (small, focused)
- Unit test for `prepare_features`:
  - Input with only required fields → output shape equals `len(feature_columns)` and important derived values (e.g., `roi`) computed as expected.
- Integration smoke test for `/api/sample-data` and `/api/model-info` (mock the service to avoid loading real model).

## Where to look next
- `templates/index.html` and `static/js/app.js` for how the front-end calls `/predict` and consumes the response.
- `data/pkl/` for model artifacts and `prompt/` for design notes and prompts already in the repo.

---
If anything here is unclear or you'd like me to include additional examples (e.g., sample curl requests, unit-test stubs, or mocking patterns), tell me which parts to expand and I'll iterate.
