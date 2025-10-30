from pathlib import Path
import pandas as pd
from typing import Tuple

# --- Thiết lập Đường dẫn (Giả định) ---
# Điều chỉnh các đường dẫn này cho môi trường thực tế của mình
ROOT = Path(__file__).resolve().parents[2] if Path(__file__).exists() else Path.cwd()
DATA_DIR = ROOT / "data"
INPUT = DATA_DIR / "raw_Movies.csv"
if not INPUT.exists():
    # Giả lập DataFrame nếu không tìm thấy file để code chạy được
    print(f"Warning: File not found at {INPUT}. Creating a dummy DataFrame.")
    data = {
        'Budget': [100000, 0, pd.NA, 50000],
        'Revenue': [500000, 100000, 0, pd.NA],
        'Release Date': ['1999-12-01', '2010/05/15', 'invalid-date', pd.NA],
        'Runtime': [90, pd.NA, 120, 105],
        'Title': ['Movie A', 'Movie B', pd.NA, 'Movie D']
    }
    DUMMY_DF = pd.DataFrame(data)

def load_raw(path: Path = INPUT) -> pd.DataFrame:
    """Tải file CSV thô, làm sạch tên cột và thay thế chuỗi rỗng bằng NA."""
    try:
        df = pd.read_csv(path, low_memory=False)
    except FileNotFoundError:
        # Sử dụng DataFrame giả lập nếu file không tồn tại
        print("Using dummy DataFrame.")
        df = DUMMY_DF.copy()

    df.columns = [c.strip() for c in df.columns]
    # Thay thế chuỗi rỗng bằng giá trị thiếu (NaN/pd.NA)
    df = df.replace({"": pd.NA})
    return df

# --- Xử lý Hàng có Budget hoặc Revenue = 0 (loại/báo cáo) ---
def check_finance_zeros(df: pd.DataFrame) -> pd.DataFrame:
    print("\n-- B1: Xử lý Budget/Revenue = 0 ")
    df = df.copy()

    # Chuyển sang dạng số, chuyển lỗi thành NaN để xử lý zero chính xác hơn
    for col in ["Revenue", "Budget"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # Yêu cầu là Xử lý hàng có Budget hoặc Revenue = 0 (loại/báo cáo)
    # Tạo budget_is_zero và revenue_is_zero để đánh dấu các hàng này
    df["budget_is_zero"] = (df.get("Budget", pd.Series(0)) == 0) & df.get("Budget", pd.Series(0)).notna()
    df["revenue_is_zero"] = (df.get("Revenue", pd.Series(0)) == 0) & df.get("Revenue", pd.Series(0)).notna()
    # Tạo cột tổng hợp budget_or_revenue_zero nếu true bất kỳ cột nào trên là true 
    df["budget_or_revenue_zero"] = df["budget_is_zero"] | df["revenue_is_zero"]
    
    zero_rows = df['budget_or_revenue_zero'].sum()
    print(f"Số hàng có Budget hoặc Revenue = 0: {int(zero_rows)}")
    print(f"Tỉ lệ hàng cần báo cáo/loại bỏ: {zero_rows / len(df):.2%}")

    # Chức năng này chỉ BÁO CÁO và GHI CHÚ (flag), không loại bỏ.
    return df


# --- Điền hoặc Ghi Chú Giá Trị Thiếu (NaN) theo cột ---
def annotate_and_impute_missing(df: pd.DataFrame, impute_numeric: bool = True) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Ghi chú (annotate) giá trị thiếu và điền (impute) giá trị thiếu đơn giản.

    Trả về: (df2, missing_ratio)
      - df2: DataFrame đã được xử lý.
      - missing_ratio: Series thống kê tỉ lệ thiếu theo cột.
    """
    print("\n-- B2: Xử lý Giá trị Thiếu (NaN) ")
    df = df.copy()

    # Tính tỉ lệ thiếu theo cột
    missing_ratio = (df.isna().sum() / len(df)).sort_values(ascending=False)
    print("Tỉ lệ thiếu theo cột (Top 5):")
    print(missing_ratio.head())

    # 1. Điền giá trị thiếu cho cột số 
    if impute_numeric:
        for col in ["Runtime", "Vote Average"]:
            if col in df.columns:
                # Chuyển sang số và tính median
                numeric_col = pd.to_numeric(df[col], errors="coerce")
                med = numeric_col.median(skipna=True)
                
                # Tạo cột mới để lưu giá trị đã điền
                df[f"{col}_imputed"] = numeric_col.fillna(med)
                
                print(f"- Đã điền NaN cho cột '{col}' bằng Median ({med:.2f}) vào cột mới.")

    # 2. Ghi chú giá trị thiếu cho cột văn bản bằng '<missing>'
    # Chỉ áp dụng cho các cột dtype object (văn bản) còn lại
    object_cols = df.select_dtypes(include='object').columns
    for c in object_cols:
        # Sử dụng .fillna để điền trực tiếp vào cột hiện tại
        df[c] = df[c].fillna("<missing>")
        
    print("- Đã ghi chú giá trị thiếu trong cột Văn bản (Object) bằng '<missing>'.")

    return df, missing_ratio


# --- Chuyển Release Date sang kiểu ngày, thống kê tỉ lệ thiếu theo cột ---
def parse_release_date_and_stats(df: pd.DataFrame) -> Tuple[pd.DataFrame, float]:
    """
    Chuyển `Release Date` sang kiểu datetime và thống kê tỉ lệ thiếu của nó.

    Trả về: (df2, missing_fraction)
      - df2: DataFrame mới với cột `Release Date parsed`.
      - missing_fraction: Tỉ lệ phần trăm thiếu/không hợp lệ của cột ngày.
    """
    print("\n-- B3: Chuẩn hóa Release Date & Thống kê Tỉ lệ Thiếu ")
    df = df.copy()

    if "Release Date" in df.columns:
        # Chuyển đổi các cột Release Date sang datetime lưu vào cột mới
        df["Release Date parsed"] = pd.to_datetime(df["Release Date"], errors="coerce")
        
        missing_count = int(df["Release Date parsed"].isna().sum())
        missing_fraction = missing_count / len(df)
        
        print(f"- Đã chuyển 'Release Date' sang kiểu ngày (datetime).")
        print(f"- Số lượng/Tỉ lệ ngày thiếu/không hợp lệ: {missing_count} ({missing_fraction:.2%})")

    else:
        df["Release Date parsed"] = pd.NaT
        missing_fraction = 1.0
        print("- Cột 'Release Date' không tồn tại.")

    return df, missing_fraction


def full_cleaning_pipeline():
    """Chạy toàn bộ quy trình làm sạch dữ liệu và in tóm tắt."""
    df = load_raw()
    print(f"Dữ liệu gốc: {len(df)} hàng.")
    df = check_finance_zeros(df)
    df, missing_ratio = annotate_and_impute_missing(df, impute_numeric=True)
    df, missing_frac = parse_release_date_and_stats(df)
    
    print("\n--- Kết quả Hoàn thành ---")
    print("DataFrame đã qua xử lý (5 hàng đầu):")
    print(df.head())
    # lưu dữ liệu đã làm sạch 
    OUTPUT = DATA_DIR / "huy_cleaned_Movies.csv"
    df.to_csv(OUTPUT, index=False)
    print(f"Dữ liệu đã làm sạch được lưu tại: {OUTPUT}")
if __name__ == "__main__":
    full_cleaning_pipeline()