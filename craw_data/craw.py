import requests
from bs4 import BeautifulSoup
import pandas as pd
import os
import csv
from datetime import datetime
import urllib.parse

# --- CẤU HÌNH ---
# Anh nhớ lấy API Key từ https://www.themoviedb.org/settings/api và điền vào đây hoặc set biến môi trường nhé!
TMDB_API_KEY = os.environ.get("TMDB_API_KEY") or "YOUR_TMDB_API_KEY_HERE"
DATA_FILE = "../data/raw_Movies.csv"

def get_tmdb_data(title, api_key):
    """
    Tìm kiếm phim trên TMDb và lấy thông tin chi tiết.
    """
    if not api_key or api_key == "YOUR_TMDB_API_KEY_HERE":
        print("⚠️  Chưa có TMDb API Key. Chỉ lấy được doanh thu.")
        return None

    search_url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={urllib.parse.quote(title)}&language=vi-VN"
    try:
        response = requests.get(search_url, timeout=10)
        if response.status_code == 200:
            results = response.json().get('results', [])
            if results:
                # Lấy phim đầu tiên tìm thấy
                movie_id = results[0]['id']
                
                # Lấy chi tiết phim (thêm credits để lấy đạo diễn, diễn viên)
                detail_url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=vi-VN&append_to_response=credits"
                detail_res = requests.get(detail_url, timeout=10)
                if detail_res.status_code == 200:
                    return detail_res.json()
    except Exception as e:
        print(f"❌ Lỗi khi gọi TMDb API cho phim '{title}': {e}")
    
    return None

def process_movie_data(bovn_data, tmdb_data):
    """
    Kết hợp dữ liệu từ BOVN và TMDb thành một dòng chuẩn CSV.
    """
    row = {
        "Id": tmdb_data.get('id') if tmdb_data else "",
        "Title": bovn_data['Tên phim'],
        "Original Title": tmdb_data.get('original_title') if tmdb_data else "",
        "Original Language": tmdb_data.get('original_language') if tmdb_data else "",
        "Overview": tmdb_data.get('overview', "").replace("\n", " ") if tmdb_data else "",
        "Revenue": bovn_data['Doanh thu'].replace('.', '').replace('₫', '').strip(), # Ưu tiên doanh thu thực tế từ BOVN
        "Budget": tmdb_data.get('budget') if tmdb_data else 0,
        "Runtime": tmdb_data.get('runtime') if tmdb_data else 0,
        "Release Date": tmdb_data.get('release_date') if tmdb_data else "",
        "Vote Average": tmdb_data.get('vote_average') if tmdb_data else 0.0,
        "Vote Count": tmdb_data.get('vote_count') if tmdb_data else 0,
        "Genres": [g['name'] for g in tmdb_data.get('genres', [])] if tmdb_data else [],
        "Production Companies": [c['name'] for c in tmdb_data.get('production_companies', [])] if tmdb_data else [],
        "Production Countries": [c['name'] for c in tmdb_data.get('production_countries', [])] if tmdb_data else [],
        "Spoken Languages": [l['name'] for l in tmdb_data.get('spoken_languages', [])] if tmdb_data else [],
        "Director": "",
        "Stars": []
    }

    # Xử lý Credits (Đạo diễn & Diễn viên)
    if tmdb_data and 'credits' in tmdb_data:
        crew = tmdb_data['credits'].get('crew', [])
        cast = tmdb_data['credits'].get('cast', [])
        
        directors = [m['name'] for m in crew if m['job'] == 'Director']
        row['Director'] = directors[0] if directors else ""
        
        # Lấy top 5 diễn viên
        row['Stars'] = [m['name'] for m in cast[:5]]

    return row

def crawl_and_enrich():
    print("🚀 Bắt đầu crawl dữ liệu từ BoxOfficeVietnam...")
    
    url = "https://boxofficevietnam.com/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    new_movies = []

    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            print(f"❌ Lỗi kết nối BoxOfficeVietnam: {response.status_code}")
            return

        soup = BeautifulSoup(response.content, 'html.parser')
        table = soup.find('table', id='table_1')
        if not table:
            table = soup.find('table', class_='wpDataTable')
        
        if table:
            rows = table.find_all('tr')
            print(f"✅ Tìm thấy {len(rows)-1} phim trên bảng xếp hạng.")
            
            for row in rows[1:]: # Bỏ qua header
                cols = row.find_all('td')
                if len(cols) > 0:
                    name = cols[0].get_text(strip=True)
                    revenue = cols[1].get_text(strip=True)
                    
                    print(f"🔍 Đang xử lý: {name}...")
                    
                    # Lấy thêm thông tin từ TMDb
                    tmdb_info = get_tmdb_data(name, TMDB_API_KEY)
                    
                    # Gộp dữ liệu
                    full_data = process_movie_data({"Tên phim": name, "Doanh thu": revenue}, tmdb_info)
                    new_movies.append(full_data)
        else:
            print("⚠️ Không tìm thấy bảng dữ liệu trên BoxOfficeVietnam.")

    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return

    # Lưu vào CSV
    if new_movies:
        df = pd.DataFrame(new_movies)
        
        # Kiểm tra nếu file đã tồn tại để append, nếu chưa thì tạo mới
        file_exists = os.path.isfile(DATA_FILE)
        
        # Sắp xếp cột theo đúng chuẩn file raw_Movies.csv cũ
        columns_order = [
            "Id", "Title", "Original Title", "Original Language", "Overview", 
            "Revenue", "Budget", "Runtime", "Release Date", "Vote Average", 
            "Vote Count", "Genres", "Production Companies", "Production Countries", 
            "Spoken Languages", "Director", "Stars"
        ]
        
        # Chỉ lấy các cột có trong columns_order
        df = df[columns_order]
        
        mode = 'a' if file_exists else 'w'
        header = not file_exists
        
        try:
            df.to_csv(DATA_FILE, mode=mode, header=header, index=False)
            print(f"\n🎉 Đã lưu {len(new_movies)} phim vào {DATA_FILE}")
        except Exception as e:
             print(f"\n❌ Lỗi khi lưu file: {e}")
             # Fallback: in ra màn hình nếu lỗi file
             print(df)
    else:
        print("\n⚠️ Không có dữ liệu mới để lưu.")

if __name__ == "__main__":
    crawl_and_enrich()