# Bảng Tổng Hợp Các Lệnh Git Thường Dùng (Git Cheat Sheet)

Tài liệu tra cứu nhanh các lệnh Git cơ bản và nâng cao thường dùng trong quá trình làm việc hàng ngày, được phân loại theo từng giai đoạn làm việc.

---

## 1. Cấu hình ban đầu (Configuration)

| Lệnh | Ý nghĩa / Cách dùng |
| :--- | :--- |
| `git config --global user.name "Tên Của Bạn"` | Cấu hình tên hiển thị cho các commit |
| `git config --global user.email "email@example.com"` | Cấu hình email gắn với commit |
| `git config --global init.defaultBranch main` | Đặt nhánh mặc định khi tạo mới là `main` |
| `git config --list` | Xem toàn bộ cấu hình Git hiện tại |

---

## 2. Khởi tạo & Tải dự án (Init & Clone)

| Lệnh | Ý nghĩa / Cách dùng |
| :--- | :--- |
| `git init` | Khởi tạo một Git repository rỗng trong thư mục hiện tại |
| `git clone <url>` | Clone (tải) repository từ xa về một thư mục mới |
| `git clone <url> .` | Clone repository trực tiếp vào thư mục hiện tại |

---

## 3. Kiểm tra trạng thái & Lịch sử (Status & Logs)

| Lệnh | Ý nghĩa / Cách dùng |
| :--- | :--- |
| `git status` | Kiểm tra trạng thái các file (đã sửa đổi, đã thêm vào stage, untracked) |
| `git diff` | Xem chi tiết các dòng thay đổi chưa được đưa vào stage (`unstaged`) |
| `git diff --staged` | Xem chi tiết các thay đổi đã ở trong stage chuẩn bị commit |
| `git log` | Xem lịch sử commit |
| `git log --oneline --graph --decorate --all` | Xem cây lịch sử commit thu gọn, trực quan |
| `git log -n <số_lượng>` | Xem `n` commit gần nhất (vd: `git log -n 5 --oneline`) |

---

## 4. Lưu trữ thay đổi (Stage & Commit)

| Lệnh | Ý nghĩa / Cách dùng |
| :--- | :--- |
| `git add <tên_file>` | Đưa một file cụ thể vào hàng đợi chuẩn bị commit (Staging Area) |
| `git add .` | Đưa toàn bộ các file thay đổi trong thư mục hiện tại vào Stage |
| `git commit -m "Nội dung commit"` | Lưu lại các thay đổi trong Stage kèm thông điệp mô tả |
| `git commit -am "Nội dung commit"` | Kết hợp `add` và `commit` cho các file đã được theo dõi (đã tracked) |
| `git commit --amend` | Sửa lại nội dung hoặc thêm file vào commit gần nhất (chưa push) |

---

## 5. Quản lý nhánh (Branching & Switching)

| Lệnh | Ý nghĩa / Cách dùng |
| :--- | :--- |
| `git branch` | Liệt kê tất cả các nhánh local |
| `git branch -a` | Liệt kê tất cả các nhánh (cả local và remote) |
| `git branch <tên_nhánh>` | Tạo một nhánh mới từ nhánh hiện tại |
| `git checkout <tên_nhánh>` | Chuyển sang nhánh chỉ định (lệnh truyền thống) |
| `git switch <tên_nhánh>` | Chuyển sang nhánh chỉ định (lệnh mới từ Git 2.23) |
| `git checkout -b <tên_nhánh>` | Tạo nhánh mới và chuyển ngay sang nhánh đó |
| `git switch -c <tên_nhánh>` | Tương tự `checkout -b` (cú pháp mới) |
| `git branch -d <tên_nhánh>` | Xóa nhánh local (chỉ xóa khi đã được merge an toàn) |
| `git branch -D <tên_nhánh>` | Ép xóa nhánh local dù chưa được merge |
| `git branch -m <tên_mới>` | Đổi tên nhánh hiện tại |

---

## 6. Làm việc với Remote (Sync, Fetch, Pull, Push)

| Lệnh | Ý nghĩa / Cách dùng |
| :--- | :--- |
| `git remote -v` | Xem danh sách các máy chủ remote và URL kết nối |
| `git remote add <tên_remote> <url>` | Thêm một kết nối remote (thường đặt tên là `origin`) |
| `git fetch <remote>` | Tải các commit/nhánh mới từ remote về nhưng **chưa** gộp vào code local |
| `git pull <remote> <tên_nhánh>` | Tải về và tự động gộp (merge) code từ remote vào nhánh hiện tại |
| `git push <remote> <tên_nhánh>` | Đẩy commit từ nhánh local lên remote |
| `git push -u origin <tên_nhánh>` | Đẩy lên và ghi nhớ liên kết upstream cho các lần gõ `git push` sau |
| `git push origin --delete <tên_nhánh>` | Xóa một nhánh trên remote |

---

## 7. Gộp nhánh & Giải quyết xung đột (Merge & Rebase)

| Lệnh | Ý nghĩa / Cách dùng |
| :--- | :--- |
| `git merge <tên_nhánh>` | Gộp nhánh chỉ định vào nhánh hiện tại |
| `git merge --abort` | Hủy bỏ quá trình merge đang bị xung đột (conflict) |
| `git rebase <tên_nhánh>` | Di chuyển toàn bộ commit của nhánh hiện tại lên đỉnh của nhánh đích |
| `git rebase --abort` | Hủy bỏ quá trình rebase |

---

## 8. Tạm lưu thay đổi chưa hoàn thành (Stashing)

Dùng khi bạn muốn đổi sang nhánh khác làm việc gấp mà chưa muốn commit code dở dang:

| Lệnh | Ý nghĩa / Cách dùng |
| :--- | :--- |
| `git stash` (hoặc `git stash save`) | Lưu tạm các thay đổi chưa commit vào ngăn xếp và đưa thư mục về sạch |
| `git stash list` | Xem danh sách các stash đang được lưu |
| `git stash pop` | Lấy lại thay đổi của stash gần nhất và xóa nó khỏi ngăn xếp |
| `git stash apply` | Áp dụng thay đổi từ stash nhưng vẫn giữ stash trong ngăn xếp |
| `git stash drop` | Xóa một stash cụ thể |
| `git stash clear` | Xóa sạch tất cả các stash |

---

## 9. Hoàn tác & Phục hồi (Undo & Reset)

> [!CAUTION]
> Các lệnh `reset --hard` sẽ xóa vĩnh viễn code chưa commit. Hãy cân nhắc kỹ trước khi chạy.

| Lệnh | Ý nghĩa / Cách dùng |
| :--- | :--- |
| `git restore <tên_file>` | Hủy bỏ những thay đổi của file chưa đưa vào stage (về trạng thái commit gần nhất) |
| `git restore --staged <tên_file>` | Đưa file từ Staging Area trở lại trạng thái Unstaged (bỏ `git add`) |
| `git reset HEAD~1` | Hủy commit gần nhất nhưng **vẫn giữ lại code** ở trạng thái chưa stage |
| `git reset --soft HEAD~1` | Hủy commit gần nhất nhưng đưa toàn bộ thay đổi vào Staging Area |
| `git reset --hard HEAD~1` | Hủy commit gần nhất và **xóa sạch toàn bộ thay đổi** |
| `git revert <commit_id>` | Tạo một commit mới đảo ngược lại tác động của commit chỉ định (an toàn khi đã push) |
