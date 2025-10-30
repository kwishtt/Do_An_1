# Data cleaning report (week02)

Input file: `raw_Movies.csv`

## Actions taken

- Loaded raw CSV and standardized column names.
- Replaced empty strings with explicit missing markers.
- Converted numeric columns to numeric types where possible (Revenue, Budget, Runtime, Vote Average, Vote Count).
- Added flags: `budget_is_zero`, `revenue_is_zero`, `budget_or_revenue_zero`.
- Parsed `Release Date` to `Release Date parsed` (datetime).
- Imputed `Runtime` and `Vote Average` by median in new columns `Runtime_imputed` and `Vote Average_imputed`.
- For text columns, replaced missing with `'<missing>'`.

## Summary statistics

- Total rows: 2193
- Rows with Budget == 0: 1070
- Rows with Revenue == 0: 774
- Rows with Budget OR Revenue == 0: 1173
- Rows after removing those: 1020 (saved to `data/clean_movies_no_zero.csv`)

## Release Date parsing

- Missing / unparseable release dates: 4 (0.18%)

## Missing ratio by column (highest first)

|                        |          0 |
|:-----------------------|-----------:|
| Stars                  | 0.792066   |
| Director               | 0.788874   |
| Overview               | 0.0501596  |
| Release Date parsed    | 0.00182399 |
| Id                     | 0          |
| Original Language      | 0          |
| Original Title         | 0          |
| Title                  | 0          |
| Revenue                | 0          |
| Vote Average           | 0          |
| Budget                 | 0          |
| Runtime                | 0          |
| Release Date           | 0          |
| Production Companies   | 0          |
| Genres                 | 0          |
| Vote Count             | 0          |
| Spoken Languages       | 0          |
| Production Countries   | 0          |
| budget_is_zero         | 0          |
| revenue_is_zero        | 0          |
| budget_or_revenue_zero | 0          |

## Remaining issues / recommendations

1. Budget and Revenue have many zero or missing values. I saved a flagged dataset (`data/clean_movies_flagged.csv`) which keeps these rows and marks them. 
   - Decide whether to remove these rows (I also created `data/clean_movies_no_zero.csv`) or to impute values from external sources.
2. Release Date parsing failed for some rows — these are kept with `Release Date parsed = NaT`.
3. Some columns still contain `<missing>` placeholders for text fields; consider domain-specific filling if available.

## Files produced

- `data/clean_movies_flagged.csv`: full dataset with flags and imputations.
- `data/clean_movies_no_zero.csv`: dataset with rows removed where Budget or Revenue == 0.
- `report/cleaning_report_week02.md`: this report.
