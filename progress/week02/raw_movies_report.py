import pandas as pd
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data" / "raw_Movies.csv"
OUT_MD = Path(__file__).resolve().parent / "raw_movies_report.md"
OUT_MISSING = Path(__file__).resolve().parent / "raw_movies_missing.csv"

pd.set_option('display.max_colwidth', 200)

# helper: try to use to_markdown(), fall back to to_string() if tabulate isn't installed
def md_table(df_obj):
    try:
        return df_obj.to_markdown()
    except Exception:
        try:
            # if it's a Series, convert to DataFrame first for nicer formatting
            if isinstance(df_obj, pd.Series):
                return df_obj.to_frame().to_string()
            return df_obj.to_string()
        except Exception:
            return str(df_obj)

if not DATA.exists():
    print(f"Error: data file not found: {DATA}")
    raise SystemExit(1)

print(f"Loading data from: {DATA}")
df = pd.read_csv(DATA, low_memory=False)

n_rows, n_cols = df.shape

# basic info
cols = list(df.columns)
dtypes = df.dtypes.apply(lambda x: x.name)

# missing counts and percent
missing_count = df.isna().sum()
missing_percent = (missing_count / n_rows) * 100
missing_table = pd.DataFrame({
    'missing_count': missing_count,
    'missing_percent': missing_percent.round(2),
    'dtype': dtypes
}).sort_values('missing_count', ascending=False)

# numeric summary
numeric_summary = df.select_dtypes(include=['number']).describe().T

# top values for object columns
top_values = {}
for col in df.select_dtypes(include=['object']).columns:
    top = df[col].value_counts(dropna=False).head(10)
    top_values[col] = top

# unique counts
unique_counts = df.nunique(dropna=True).sort_values(ascending=False)

# create markdown report
with open(OUT_MD, 'w', encoding='utf-8') as f:
    f.write(f"# Báo cáo dataset gốc: raw_Movies.csv\n\n")
    f.write(f"- Đường dẫn: `{DATA}`\n")
    f.write(f"- Số hàng: **{n_rows}**\n")
    f.write(f"- Số cột: **{n_cols}**\n\n")

    f.write("## Thông tin cột và tỷ lệ thiếu\n\n")
    f.write(md_table(missing_table))
    f.write("\n\n")

    f.write("## Thống kê cho các cột số\n\n")
    if not numeric_summary.empty:
        f.write(md_table(numeric_summary))
    else:
        f.write("(Không có cột số)\n")
    f.write("\n\n")

    f.write("## Số lượng giá trị khác nhau (unique) theo cột (Top 20)\n\n")
    f.write(md_table(unique_counts.head(20)))
    f.write("\n\n")

    f.write("## Top 10 giá trị cho các cột văn bản\n\n")
    for col, series in top_values.items():
        f.write(f"### {col}\n\n")
        f.write(md_table(series.to_frame().reset_index().rename(columns={'index':col, col:'count'})))
        f.write("\n\n")

    f.write("## Mẫu dữ liệu (5 hàng đầu)\n\n")
    f.write(md_table(df.head(5)))
    f.write("\n\n")

print(f"Writing Markdown report to: {OUT_MD}")
# save missing table as csv for further analysis
missing_table.to_csv(OUT_MISSING)
print(f"Also wrote missing counts CSV to: {OUT_MISSING}")
print("Done.")
