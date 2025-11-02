# Báo cáo dataset gốc: raw_Movies.csv

- Đường dẫn: `/home/huy/Downloads/Do_An_1-main/data/raw_Movies.csv`
- Số hàng: **2193**
- Số cột: **17**

## Thông tin cột và tỷ lệ thiếu

|                      |   missing_count |   missing_percent | dtype   |
|:---------------------|----------------:|------------------:|:--------|
| Stars                |            1737 |             79.21 | object  |
| Director             |            1730 |             78.89 | object  |
| Overview             |             110 |              5.02 | object  |
| Id                   |               0 |              0    | int64   |
| Title                |               0 |              0    | object  |
| Revenue              |               0 |              0    | float64 |
| Budget               |               0 |              0    | float64 |
| Original Title       |               0 |              0    | object  |
| Original Language    |               0 |              0    | object  |
| Release Date         |               0 |              0    | object  |
| Runtime              |               0 |              0    | int64   |
| Vote Average         |               0 |              0    | float64 |
| Vote Count           |               0 |              0    | int64   |
| Production Companies |               0 |              0    | object  |
| Genres               |               0 |              0    | object  |
| Spoken Languages     |               0 |              0    | object  |
| Production Countries |               0 |              0    | object  |

## Thống kê cho các cột số

|              |   count |             mean |            std |   min |      25% |              50% |              75% |             max |
|:-------------|--------:|-----------------:|---------------:|------:|---------:|-----------------:|-----------------:|----------------:|
| Id           |    2193 | 821475           |    2.40954e+06 |    12 | 270946   | 453575           | 646389           |     3.15231e+07 |
| Revenue      |    2193 |      1.03072e+08 |    2.3458e+08  |     0 |      0   |      2.85671e+06 |      9.53966e+07 |     2.8e+09     |
| Budget       |    2193 |      3.08004e+07 |    5.58643e+07 |     0 |      0   | 201822           |      3.7e+07     |     4.6e+08     |
| Runtime      |    2193 |    102.85        |   26.3634      |     0 |     92   |    103           |    116           |   206           |
| Vote Average |    2193 |      6.30475     |    1.39293     |     0 |      5.8 |      6.5         |      7.1         |    10           |
| Vote Count   |    2193 |   2236.46        | 4169.2         |     0 |     43   |    318           |   2564           | 35454           |

## Số lượng giá trị khác nhau (unique) theo cột (Top 20)

|                      |    0 |
|:---------------------|-----:|
| Id                   | 2193 |
| Original Title       | 2192 |
| Title                | 2187 |
| Overview             | 2082 |
| Production Companies | 1743 |
| Release Date         | 1584 |
| Revenue              | 1395 |
| Vote Count           | 1235 |
| Genres               |  797 |
| Vote Average         |  636 |
| Stars                |  446 |
| Production Countries |  332 |
| Budget               |  314 |
| Spoken Languages     |  292 |
| Director             |  245 |
| Runtime              |  134 |
| Original Language    |   30 |

## Top 10 giá trị cho các cột văn bản

### Title

|    | count                   |   count |
|---:|:------------------------|--------:|
|  0 | Cats                    |       2 |
|  1 | Break                   |       2 |
|  2 | Switch                  |       2 |
|  3 | Inferno                 |       2 |
|  4 | Adrift                  |       2 |
|  5 | The Protector           |       2 |
|  6 | It Chapter Two          |       1 |
|  7 | The Bad Guys: The Movie |       1 |
|  8 | Cheer Up, Mr. Lee       |       1 |
|  9 | The Room                |       1 |

### Original Title

|    | count                |   count |
|---:|:---------------------|--------:|
|  0 | Táo Quậy             |       2 |
|  1 | Paradise Hills       |       1 |
|  2 | Biết chết liền       |       1 |
|  3 | Cát Nóng             |       1 |
|  4 | 引っ越し大名！       |       1 |
|  5 | It Chapter Two       |       1 |
|  6 | 나쁜 녀석들: 더 무비 |       1 |
|  7 | The Wedding Year     |       1 |
|  8 | The Room             |       1 |
|  9 | Tiền Chùa            |       1 |

### Original Language

|    | count   |   count |
|---:|:--------|--------:|
|  0 | en      |    1129 |
|  1 | vi      |     458 |
|  2 | ko      |     184 |
|  3 | ja      |     106 |
|  4 | zh      |      71 |
|  5 | th      |      57 |
|  6 | fr      |      46 |
|  7 | cn      |      33 |
|  8 | ru      |      29 |
|  9 | es      |      24 |

### Overview

|    | count                                                                                                                                                                                                                                                                                                                                                             |   count |
|---:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------:|
|  0 | nan                                                                                                                                                                                                                                                                                                                                                               |     110 |
|  1 | Một doanh nhân chuyển giới Việt Nam trở nên nghèo khó mỗi khi yêu ai đó.                                                                                                                                                                                                                                                                                          |       2 |
|  2 | Eun-hee 14 tuổi trải qua cuộc đời như một con chim ruồi đang tìm kiếm hương vị ngọt ngào ở bất cứ nơi nào cô có thể tìm thấy. Bị cha mẹ phớt lờ và bị anh trai ngược đãi, cô tìm cách trốn thoát bằng cách lang thang trong khu phố với người bạn thân nhất của mình, phiêu lưu và khám phá tình yêu tuổi trẻ.                                                    |       1 |
|  3 | Một phụ nữ trẻ được gửi đến Paradise Hills để cải tạo, chỉ để biết rằng mặt tiền đẹp đẽ của cơ sở cao cấp ẩn giấu một bí mật nham hiểm.                                                                                                                                                                                                                           |       1 |
|  4 | Bị thực hiện bởi tham vọng của Tuyết đang tìm kiếm địa điểm xây dựng bến tàu để hiện đại hóa khu nghỉ dưỡng của mình, cuộc sống yên bình của chị em Cát ở vùng đất cát thơ mộng bị phá vỡ. Khi ngôi nhà của Mèo, cũng là nơi trú ẩn của Dong - một loài bò sát sống trên cát, sắp bị đốt cháy, Dong đang đứng trước nguy cơ tuyệt chủng, chúng bắt đầu trả thù.   |       1 |
|  5 | Shunnosuke Katagiri là một samurai và một con mọt sách. Anh nhận được nhiệm vụ giúp đỡ một lãnh chúa di chuyển. Với sự hỗ trợ của Genemon Takamura và Oran, Shunnosuke Katagiri thực hiện sứ mệnh của mình.                                                                                                                                                       |       1 |
|  6 | 27 năm sau khi vượt qua thực thể siêu nhiên độc ác Pennywise, các cựu thành viên của Losers' Club, những người đã trưởng thành và rời xa Derry, được đoàn tụ lại sau một cuộc điện thoại tàn khốc.                                                                                                                                                                |       1 |
|  7 | Sau khi một nhóm tội phạm trốn thoát trong khi đang được vận chuyển, một đội đặc nhiệm lành nghề được tập hợp để giúp truy tìm và đưa chúng trở lại nhà tù.                                                                                                                                                                                                       |       1 |
|  8 | Chul-soo là một người đàn ông thiểu năng trí tuệ. Một ngày nọ, Chul-soo phát hiện ra cô gái trẻ Saet-byul đang nằm viện chính là con gái anh. Và chẳng bao lâu sau, Saet-byul lẻn ra khỏi bệnh viện và một mình đến một thành phố xa xôi để dự sinh nhật bạn mình. Khi Chul-soo đồng hành cùng cuộc hành trình của Saet-byul, tình bạn giữa hai người phát triển. |       1 |
|  9 | Giữa lòng Sài Gòn có một nơi lời hứa vẫn còn viết bằng máu.                                                                                                                                                                                                                                                                                                       |       1 |

### Release Date

|    | count      |   count |
|---:|:-----------|--------:|
|  0 | 2018-02-16 |       6 |
|  1 | 2019-02-05 |       6 |
|  2 | 2023-03-23 |       6 |
|  3 | 2022-10-07 |       5 |
|  4 | 2019-11-08 |       5 |
|  5 | 2017-06-16 |       4 |
|  6 | 2020-10-16 |       4 |
|  7 | 2017-08-03 |       4 |
|  8 | 2017-04-28 |       4 |
|  9 | 2018-08-01 |       4 |

### Genres

|    | count                                      |   count |
|---:|:-------------------------------------------|--------:|
|  0 | ['Drama']                                  |     102 |
|  1 | ['Comedy']                                 |      70 |
|  2 | ['Horror']                                 |      70 |
|  3 | ['Comedy', 'Romance']                      |      54 |
|  4 | ['Drama', 'Romance']                       |      50 |
|  5 | []                                         |      45 |
|  6 | ['Horror', 'Thriller']                     |      43 |
|  7 | ['Action', 'Adventure', 'Science Fiction'] |      32 |
|  8 | ['Action', 'Thriller']                     |      27 |
|  9 | ['Action', 'Crime', 'Thriller']            |      24 |

### Production Companies

|    | count                                            |   count |
|---:|:-------------------------------------------------|--------:|
|  0 | []                                               |     284 |
|  1 | ['Marvel Studios']                               |      13 |
|  2 | ['Vietnam Feature Film Studio']                  |      13 |
|  3 | ['Giai Phong Film Studio']                       |      12 |
|  4 | ['Walt Disney Pictures', 'Pixar']                |       7 |
|  5 | ['Pixar', 'Walt Disney Pictures']                |       6 |
|  6 | ['Pixar']                                        |       5 |
|  7 | ['Ly Hai Production']                            |       5 |
|  8 | ['CJ HK Entertainment']                          |       5 |
|  9 | ['Columbia Pictures', 'Sony Pictures Animation'] |       5 |

### Production Countries

|    | count                                          |   count |
|---:|:-----------------------------------------------|--------:|
|  0 | ['United States of America']                   |     593 |
|  1 | ['Vietnam']                                    |     411 |
|  2 | ['South Korea']                                |     175 |
|  3 | ['Japan']                                      |     101 |
|  4 | ['United Kingdom', 'United States of America'] |      74 |
|  5 | ['Thailand']                                   |      54 |
|  6 | ['China']                                      |      38 |
|  7 | ['Canada', 'United States of America']         |      30 |
|  8 | ['China', 'Hong Kong']                         |      29 |
|  9 | ['Russia']                                     |      27 |

### Spoken Languages

|    | count                              |   count |
|---:|:-----------------------------------|--------:|
|  0 | ['Tiếng Anh']                      |     772 |
|  1 | ['Tiếng Việt']                     |     426 |
|  2 | ['Tiếng Hàn']                      |     145 |
|  3 | ['Tiếng Nhật']                     |      94 |
|  4 | ['Tiếng Anh', 'Tiếng Tây Ban Nha'] |      45 |
|  5 | ['Tiếng Lào']                      |      44 |
|  6 | ['Tiếng Trung']                    |      39 |
|  7 | ['Tiếng Pháp']                     |      27 |
|  8 | ['Tiếng Nga']                      |      26 |
|  9 | ['Tiếng Anh', 'Tiếng Pháp']        |      26 |

### Director

|    | count             |   count |
|---:|:------------------|--------:|
|  0 | nan               |    1730 |
|  1 | Victor Vu         |      16 |
|  2 | Quang Dung Nguyen |      11 |
|  3 | Ly Hai            |       9 |
|  4 | Charlie Nguyen    |       9 |
|  5 | Le Bao Trung      |       9 |
|  6 | Ngoc Dang Vu      |       8 |
|  7 | Nhat Trung        |       8 |
|  8 | Duc Thinh         |       7 |
|  9 | Vo Thanh Hoa      |       7 |

### Stars

|    | count                                                           |   count |
|---:|:----------------------------------------------------------------|--------:|
|  0 | nan                                                             |    1737 |
|  1 | []                                                              |       5 |
|  2 | ['Lam Vy Da', 'Midu', 'Le Huynh My Duyen']                      |       2 |
|  3 | ['Thanh Truc Huynh', 'Lê Bê La', 'Can Mac']                     |       2 |
|  4 | ['Hua Minh Dat', 'Pom', 'Nhi Katy']                             |       2 |
|  5 | ['Lap Huynh', 'Dai Nghia', 'Kha Nhu']                           |       2 |
|  6 | ['Zazie Beetz', 'Joaquin Phoenix', 'Lady Gaga']                 |       2 |
|  7 | ['Hua Minh Dat', 'Ly Hai', 'Vo Dinh Hieu']                      |       2 |
|  8 | ['Thanh Minh Phan', 'Thi Kieu Trinh Nguyen', 'Ha Phong Nguyen'] |       1 |
|  9 | ['Quynh Hoa', 'Khuong Ngoc', 'Phan Tan Thi']                    |       1 |

## Mẫu dữ liệu (5 hàng đầu)

|    |       Id | Title                              | Original Title                     | Original Language   | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |     Revenue |           Budget |   Runtime | Release Date        |   Vote Average |   Vote Count | Genres                                                | Production Companies                                    | Production Countries         | Spoken Languages   | Director   | Stars                                                                                                         |
|---:|---------:|:-----------------------------------|:-----------------------------------|:--------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------:|-----------------:|----------:|:--------------------|---------------:|-------------:|:------------------------------------------------------|:--------------------------------------------------------|:-----------------------------|:-------------------|:-----------|:--------------------------------------------------------------------------------------------------------------|
|  0 | 31174028 | Mai                                | Mai                                | vi                  | Bị ám ảnh không ngừng bởi quá khứ, Mai được chào đón bởi một bình minh mới khi cô miễn cưỡng kết bạn với người đàn ông hàng xóm. Nhưng hôm qua cô ấy đuổi kịp cô ấy thì ngày mai cô ấy sẽ ra sao?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 2.21199e+07 |      2.50315e+06 |       133 | 2024-02-10          |            6.8 |          495 | ['Drama', 'Comedy', 'Romance']                        | ['Trấn Thành Town']                                     | ['Vietnam']                  | ['Tiếng Việt']     | Tran Thanh | ['Tuan Tran', 'Phuong Anh Dao', 'Hong Dao', 'Ngoc Giau', 'Quoc Khanh', 'Manh Lan' ,'Tran Thanh', 'Tuan Tran'] |
|  1 |  1255517 | Nhà Bà Nữ                          | Nhà Bà Nữ                          | vi                  | Bà Nữ (Lê Giang) là một mẫu hệ độc đoán, điều hành gia đình ba thế hệ của mình giống như cách bà điều hành quán bún riêu thành công của mình. Nói tóm lại, cô ấy điều hành một con tàu chặt chẽ trong mọi khía cạnh của cuộc sống. Tuy nhiên, khi ba thế hệ cùng chung sống dưới một mái nhà, tia lửa chắc chắn sẽ bay ra - và không nhất thiết phải là tia lửa tốt. Cảm thấy ngột ngạt trước ánh mắt áp bức của mẹ, cô con gái út Nhị (Uyên An) của Nu quyết định bỏ trốn theo người bạn trai vô tư John (Song Luân). Nhưng cặp đôi trẻ sớm nhận ra rằng họ chưa chuẩn bị sẵn sàng cho tương lai cùng nhau như thế nào. Thời gian trôi qua, những người phụ nữ nhà Nu dần dần hòa giải, mỗi người đều tìm hiểu về bản thân và nhau trên đường đi. | 1.9491e+07  |      1.37768e+06 |       103 | 2023-01-11          |            6.1 |          448 | ['Drama', 'Comedy']                                   | ['Trấn Thành Town']                                     | ['Vietnam']                  | ['Tiếng Việt']     | Tran Thanh | ['Huynh Uyen An', 'Le Giang', 'Ngoc Giau', 'Song Luan', 'Ngoc Giau', 'Kha Nhu', 'Tran Thanh']                 |
|  2 |   787459 | Dad, I'm Sorry                     | Bố Già                             | vi                  | Câu chuyện về Ba Sang – con thứ 2 trong 4 anh em ồn ào: Giàu, Sáng, Phú, Quý. Ba Sang là người hay can thiệp, “quá” tốt bụng và luôn hy sinh vì người khác dù họ có muốn hay không. Quân – Con trai Ba Sang là một Youtuber trẻ hiện đại.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 1.74805e+07 | 905332           |       128 | 2021-03-12          |            9.2 |         1100 | ['Comedy', 'Family', 'Drama']                         | ['HK Film', 'Trấn Thành Town', 'Galaxy Studio']         | ['Vietnam']                  | ['Tiếng Việt']     | Tran Thanh | ['Tran Thanh', 'Tuan Tran', 'Le Giang']                                                                       |
|  3 |   939347 | Transformers: Rise of the Beasts 3 | Transformers: Rise of the Beasts 3 | en                  | Phần thứ hai trong số hai phần tiếp theo được lên kế hoạch cho bộ phim năm 2023 Transformers: Rise of the Beasts.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 4.93e+08    |      2e+08       |       127 | 2023-06-09 00:00:00 |            7.3 |         4240 | ['Action', 'Adventure', 'Science Fiction', 'Fantasy'] | ['Skydance Media', 'Hasbro Entertainment', 'Paramount'] | ['United States of America'] | ['Tiếng Anh']      | nan        | nan                                                                                                           |
|  4 |  1072077 | Face Off 6: The Ticket Of Destiny  | Lật Mặt 6: Tấm Vé Định Mệnh        | vi                  | Một nhóm bạn lâu năm bất ngờ nhận được cơ hội đổi đời khi biết tấm vé của nhóm này trúng giải độc đắc 136,8 tỷ đồng. Bất ngờ, An, người giữ vé gặp tai nạn và tử vong. Đối mặt với giấc mơ trúng số tiền đáng lẽ phải dễ dàng có được, nhóm bạn bắt tay vào hành trình đi tìm tấm vé số. Nhưng đó chỉ là khởi đầu của vô số sự kiện bất ngờ. Nhiệm vụ tìm kiếm và chia sẻ số tiền mơ ước sinh lợi sẽ thực sự dẫn nhóm đến đâu?                                                                                                                                                                                                                                                                                                                     | 1.26511e+07 |      0           |       131 | 2023-04-28          |            6.5 |          224 | ['Action', 'Drama', 'Thriller']                       | ['Ly Hai Production']                                   | ['Vietnam']                  | ['Tiếng Việt']     | Ly Hai     | ['Trung Dung', 'Huy Khanh', 'Diep Bao Ngoc', 'Huy Khanh']                                                     |

