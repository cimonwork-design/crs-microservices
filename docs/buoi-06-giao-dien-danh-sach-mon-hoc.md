# BUỔI 6: GIAO DIỆN DANH SÁCH MÔN HỌC, TÌM KIẾM & PHÂN TRANG (CRS-FRONTEND)

---

## 1. TỔNG QUAN & MỤC TIÊU BUỔI HỌC

### 1.1. Điều kiện tiên quyết
- Đã hoàn thành các buổi trước (Buổi 1 -> 5): Backend đã hoàn thiện `api-gateway`, `auth-service`, `course-service`, `registration-service`.
- `crs-frontend` đã có:
  - `axiosClient.ts` (cấu hình gọi API qua Gateway port 8080).
  - `types/course.ts` (định nghĩa kiểu `Course`, `PagedResponse<T>`).
  - `types/apiError.ts` (định nghĩa kiểu lỗi trả về `ApiErrorResponse`).
  - `api/courseApi.ts` (hàm gọi `GET /api/courses` có tham số `keyword, page, size`).

### 1.2. Mục tiêu Buổi 6
1. **Tách biệt Component theo Single Responsibility Principle**:
   - `useCourses`: Custom Hook quản lý state gọi API và 4 trạng thái.
   - `SearchBox`: Ô nhập từ khóa tìm kiếm có **Debounce** (400ms).
   - `Pagination`: Điều hướng phân trang độc lập, tái sử dụng được.
   - `CourseList`: Hiển thị bảng môn học, quản lý 4 trạng thái hiển thị.
   - `App.tsx`: Ráp nối các component.
2. **Xử lý trọn vẹn 4 trạng thái giao diện**:
   - ⏳ **Loading**: Đang gửi request và đợi Gateway phản hồi.
   - ✅ **Success**: Có dữ liệu trả về, mảng môn học không rỗng.
   - 📭 **Empty**: Gọi API thành công (200 OK) nhưng mảng rỗng (không tìm thấy môn học nào).
   - ❌ **Error**: Lỗi mạng, sập Gateway, sập service con, lỗi kết nối hoặc lỗi server trả về message.

---

## 2. TOÀN BỘ CODE ĐÃ TRIỂN KHAI CHO BUỔI 6

### 2.1. Custom Hook `useCourses`
📁 Đường dẫn: `crs-frontend/src/api/useCourses.ts`
```typescript
import { useState, useEffect, useCallback } from 'react';
import { getCourses } from './courseApi';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';
import axios from 'axios';

export type LoadState = 'loading' | 'success' | 'empty' | 'error';

export function useCourses(keyword: string, page: number, size = 10) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [state, setState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchCourses = useCallback(() => {
    setState('loading');
    getCourses(keyword, page, size)
      .then((res) => {
        const data = res.data;
        setCourses(data.content);
        setTotalPages(data.totalPages);
        setState(data.content.length === 0 ? 'empty' : 'success');
      })
      .catch((err) => {
        let message = 'Da xay ra loi khong xac dinh, vui long thu lai.';
        if (axios.isAxiosError<ApiErrorResponse>(err)) {
          if (err.response?.data?.message) {
            message = err.response.data.message;
          } else if (!err.response) {
            // Không nhận được response: Gateway hoặc course-service đang tắt
            message = 'Khong ket noi duoc toi he thong. Vui long thu lai sau.';
          }
        }
        setErrorMessage(message);
        setState('error');
      });
  }, [keyword, page, size]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, totalPages, state, errorMessage, refetch: fetchCourses };
}
```

---

### 2.2. Component `SearchBox` (Có Debounce 400ms)
📁 Đường dẫn: `crs-frontend/src/components/SearchBox.tsx`
```tsx
import { useState, useEffect } from 'react';

interface SearchBoxProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
}

export default function SearchBox({ onSearch, placeholder }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue.trim());
    }, 400);
    return () => clearTimeout(timer); // Hủy timer cũ khi người dùng tiếp tục gõ
  }, [inputValue, onSearch]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={placeholder ?? 'Tim kiem theo ten mon hoc...'}
      style={{
        width: '100%',
        maxWidth: 400,
        padding: '8px 12px',
        fontSize: 14,
        border: '1px solid #ccc',
        borderRadius: 6,
      }}
    />
  );
}
```

---

### 2.3. Component `Pagination`
📁 Đường dẫn: `crs-frontend/src/components/Pagination.tsx`
```tsx
interface PaginationProps {
  currentPage: number; // 0-indexed theo chuẩn Spring Pageable
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null; // Ẩn khi chỉ có <= 1 trang

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        « Trang truoc
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            fontWeight: p === currentPage ? 'bold' : 'normal',
            textDecoration: p === currentPage ? 'underline' : 'none',
          }}
        >
          {p + 1}
        </button>
      ))}
      <button
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Trang sau »
      </button>
    </div>
  );
}
```

---

### 2.4. Component `CourseList` (Xử lý 4 trạng thái)
📁 Đường dẫn: `crs-frontend/src/components/CourseList.tsx`
```tsx
import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
  courses: Course[];
  state: LoadState;
  errorMessage: string;
  onRetry: () => void;
}

export default function CourseList({
  courses,
  state,
  errorMessage,
  onRetry,
}: CourseListProps) {
  if (state === 'loading') {
    return <p>Dang tai danh sach mon hoc...</p>;
  }

  if (state === 'error') {
    return (
      <div style={{ color: '#b91c1c' }}>
        <p>{errorMessage}</p>
        <button onClick={onRetry}>Thu lai</button>
      </div>
    );
  }

  if (state === 'empty') {
    return <p>Khong tim thay mon hoc nao phu hop.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '2px solid #333' }}>
          <th style={{ padding: '8px 4px' }}>Ten mon hoc</th>
          <th style={{ padding: '8px 4px' }}>So tin chi</th>
          <th style={{ padding: '8px 4px' }}>So cho con lai</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px 4px' }}>{course.tenMonHoc}</td>
            <td style={{ padding: '8px 4px' }}>{course.soTinChi}</td>
            <td
              style={{
                padding: '8px 4px',
                color: course.soChoConLai === 0 ? '#b91c1c' : 'inherit',
              }}
            >
              {course.soChoConLai} / {course.soChoToiDa}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

### 2.5. Ráp nối tại `App.tsx`
📁 Đường dẫn: `crs-frontend/src/App.tsx`
```tsx
import { useState } from 'react';
import { useCourses } from './api/useCourses';
import SearchBox from './components/SearchBox';
import CourseList from './components/CourseList';
import Pagination from './components/Pagination';

function App() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(
    keyword,
    page
  );

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
    setPage(0); // Mỗi lần tìm kiếm mới, luôn quay về trang đầu
  };

  return (
    <div
      style={{
        padding: 24,
        fontFamily: 'sans-serif',
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      <h1>Danh sach mon hoc</h1>
      <SearchBox onSearch={handleSearch} />
      <div style={{ marginTop: 16 }}>
        <CourseList
          courses={courses}
          state={state}
          errorMessage={errorMessage}
          onRetry={refetch}
        />
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default App;
```

---

## 3. DANH SÁCH CÔNG CỤ CẦN CÀI ĐẶT (KHI BẮT ĐẦU TỪ CON SỐ 0)

Để chạy và demo toàn bộ dự án từ Frontend đến Backend Microservices, bạn cần tải và cài đặt các công cụ sau:

| STT | Công cụ | Mục đích | Link tải chính thức | Ghi chú khi cài |
|---|---|---|---|---|
| 1 | **JDK (Java 25 hoặc 21 LTS)** | Chạy 4 service Spring Boot | [Eclipse Temurin](https://adoptium.net/) hoặc [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) | Nhớ tích chọn **"Set JAVA_HOME variable"** và **"Add to PATH"** |
| 2 | **Node.js (v20+ hoặc v22 LTS)** | Chạy React/Vite Frontend | [Node.js Official](https://nodejs.org/en/download) | Chọn bản LTS (khuyên dùng Node 20.x hoặc 22.x) |
| 3 | **Docker Desktop** *(hoặc MySQL 8.0)* | Chạy MySQL database | [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Dùng Docker khởi chạy MySQL nhanh qua `docker-compose.yml` |
| 4 | **Postman** | Gọi API test và chèn dữ liệu mẫu | [Postman Official](https://www.postman.com/downloads/) | Tạo tài khoản miễn phí để sử dụng |
| 5 | **IDE (IntelliJ IDEA / VS Code)** | Code và chạy các microservices | [IntelliJ Community](https://www.jetbrains.com/idea/download/) hoặc [VS Code](https://code.visualstudio.com/) | IntelliJ Community hỗ trợ Java rất tốt |

---

## 4. HƯỚNG DẪN KHỞI CHẠY TỪNG BƯỚC

### BƯỚC 1: Khởi chạy Database MySQL

#### Cách 1: Dùng Docker (Khuyên dùng - nhanh nhất)
Mở PowerShell tại thư mục gốc của dự án `d:\Phat_Trien_Phan_Mem_Huong_Dich_Vu\crs-microservices` và chạy:
```powershell
docker compose up -d
```
> File `docker-compose.yml` sẽ tự động khởi động MySQL 8.0 (port 3306, user `root`, password `root`) và chạy script `init-db.sql` tạo sẵn 3 database:
> - `course_db`
> - `auth_db`
> - `registration_db`

#### Cách 2: Dùng MySQL Server cài cục bộ
Nếu cài MySQL Server trên máy:
1. Đảm bảo port là `3306`, user `root`, password `root`.
2. Mở MySQL Workbench hoặc CLI và chạy nội dung trong file `init-db.sql`:
```sql
CREATE DATABASE IF NOT EXISTS course_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS registration_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### BƯỚC 2: Khởi chạy 4 Microservices Backend

Thứ tự chạy tốt nhất:
1. `auth-service` (Port 8081)
2. `course-service` (Port 8082)
3. `registration-service` (Port 8083)
4. `api-gateway` (Port 8080)

#### Cách chạy trên IntelliJ IDEA:
1. Mở thư mục dự án `crs-microservices` trong IntelliJ.
2. Mở từng file Application chính và bấm nút **Run (Shift + F10)**:
   - `auth-service/src/main/java/vn/edu/crs/auth_service/AuthServiceApplication.java`
   - `course-service/src/main/java/vn/edu/crs/course_service/CourseServiceApplication.java`
   - `registration-service/src/main/java/vn/edu/crs/registration_service/RegistrationServiceApplication.java`
   - `api-gateway/src/main/java/vn/edu/crs/api_gateway/ApiGatewayApplication.java`

#### Cách chạy bằng dòng lệnh Terminal (PowerShell):
Mở 4 cửa sổ terminal riêng biệt:
- **Terminal 1 (Auth Service)**:
  ```powershell
  cd auth-service
  .\mvnw spring-boot:run
  ```
- **Terminal 2 (Course Service)**:
  ```powershell
  cd course-service
  .\mvnw spring-boot:run
  ```
- **Terminal 3 (Registration Service)**:
  ```powershell
  cd registration-service
  .\mvnw spring-boot:run
  ```
- **Terminal 4 (API Gateway)**:
  ```powershell
  cd api-gateway
  .\mvnw spring-boot:run
  ```

---

### BƯỚC 3: Khởi chạy React Frontend (`crs-frontend`)

Mở Terminal thứ 5:
```powershell
cd crs-frontend
npm install
npm run dev
```
Trình duyệt sẽ mở tại địa chỉ: `http://localhost:5173`.

---

## 5. HƯỚNG DẪN TẠO DỮ LIỆU MẪU BẰNG POSTMAN ĐỂ DEMO

Khi mới chạy lần đầu, database `course_db` chưa có môn học nào (khi vào web sẽ thấy trạng thái Empty). Bạn dùng Postman để đăng ký user ADMIN, lấy JWT Token và tạo danh sách môn học mẫu.

### 5.1. Đăng ký tài khoản Admin (Nếu chưa có)
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/register`
- **Body (JSON)**:
  ```json
  {
    "username": "admin",
    "password": "password123",
    "email": "admin@crs.edu.vn",
    "role": "ROLE_ADMIN"
  }
  ```

### 5.2. Đăng nhập lấy Token
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/login`
- **Body (JSON)**:
  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```
- **Response**: Copy chuỗi `token` trong kết quả trả về.

### 5.3. Tạo các môn học mẫu qua API Gateway
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/courses`
- **Headers**:
  - `Authorization`: `Bearer <token_vua_copy>`
  - `Content-Type`: `application/json`

Tạo lần lượt ít nhất 12-15 môn học để test phân trang (Page size mặc định là 10):

**Môn 1:**
```json
{
  "tenMonHoc": "Kien truc Microservices",
  "soTinChi": 3,
  "soChoToiDa": 40,
  "soChoConLai": 15
}
```

**Môn 2:**
```json
{
  "tenMonHoc": "Lap trinh Java nang cao",
  "soTinChi": 4,
  "soChoToiDa": 50,
  "soChoConLai": 0
}
```

**Môn 3:**
```json
{
  "tenMonHoc": "Phat trien Ung dung Web voi React",
  "soTinChi": 3,
  "soChoToiDa": 45,
  "soChoConLai": 20
}
```

**Môn 4:**
```json
{
  "tenMonHoc": "Co so du lieu phan tan",
  "soTinChi": 3,
  "soChoToiDa": 35,
  "soChoConLai": 5
}
```

**Môn 5 -> 15:** Tạo thêm các môn như: `Tri tue nhan tao`, `Hoc may co ban`, `An toan thong tin`, `Lap trinh Di dong`, `DevOps va CI/CD`, `Kiem thu phan mem`, `Quan ly du an CNTT`, `Mang may tinh`, `Cau truc du lieu va giai thuat`, `He dieu hanh`, `Nhap mon lap trinh`.

---

## 6. KỊCH BẢN KIỂM THỬ THỦ CÔNG 4 TRẠNG THÁI (DEMO CHECKLIST)

| STT | Thao tác trên trình duyệt (`http://localhost:5173`) | Trạng thái quan sát được | Kết quả mong đợi |
|---|---|---|---|
| **1** | Mở trang hoặc bấm F5 | ⏳ **Loading** ➔ ✅ **Success** | Thấy dòng `Dang tai danh sach mon hoc...` thoáng qua, sau đó bảng dữ liệu các môn học hiện ra. Môn hết chỗ (`soChoConLai === 0`) hiển thị màu đỏ. |
| **2** | Gõ vào ô tìm kiếm từ khóa không tồn tại: `zzz999` | 📭 **Empty** | Sau khoảng **400ms** (hết debounce), giao diện hiển thị: `Khong tim thay mon hoc nao phu hop.`. |
| **3** | Xóa sạch ô tìm kiếm | ✅ **Success** | Danh sách tất cả môn học tự động tải lại đầy đủ, trang được đưa về **Trang 1**. |
| **4** | Bấm nút chuyển trang (`2`, `3`, hoặc `Trang sau »`) | ✅ **Success (Paging)** | Danh sách môn học thay đổi đúng theo từng trang. Nút trang hiện tại được in đậm và gạch chân. |
| **5** | Dừng `api-gateway` (hoặc `course-service`) trong IDE / Terminal, sau đó bấm tìm kiếm hoặc F5 / bấm **"Thu lai"** | ❌ **Error (Network/Service Down)** | Hiện thông báo: `Khong ket noi duoc toi he thong. Vui long thu lai sau.` kèm nút **"Thu lai"**. Ứng dụng **không bị crash trắng trang**. |
| **6** | Bật lại `api-gateway` / `course-service` và bấm nút **"Thu lai"** | ✅ **Success** | Giao diện tự động tải lại danh sách môn học bình thường mà không cần refresh lại cả trang. |

---

## 7. CÁC LỖI THƯỜNG GẶP & CÁCH KHẮC PHỤC

| Hiện tượng | Nguyên nhân | Cách khắc phục |
|---|---|---|
| Gõ ô tìm kiếm bị giật, gửi API liên tục | Quên `clearTimeout(timer)` trong `SearchBox.tsx` hoặc đặt timer sai chỗ | Kiểm tra hàm cleanup `return () => clearTimeout(timer);` trong `SearchBox.tsx`. |
| Chuyển sang trang 2 rồi gõ tìm kiếm bị màn hình rỗng | Khi search từ khóa mới không reset lại số trang về 0 | Đảm bảo trong hàm `handleSearch` của `App.tsx` có gọi `setPage(0)`. |
| Bị lỗi CORS khi gọi từ Frontend (5173) tới Gateway (8080) | Gateway chưa cấu hình `allowed-origins: "http://localhost:5173"` | Kiểm tra `api-gateway/src/main/resources/application.yml` mục `globalcors`. |
| Trạng thái Error hiển thị "Network Error" tiếng Anh thô | Chưa bắt nhánh `!err.response` trong `useCourses.ts` | Map nhánh `!err.response` thành câu thông báo tiếng Việt không dấu: `"Khong ket noi duoc toi he thong. Vui long thu lai sau."`. |
| Thanh phân trang hiện cả khi chỉ có 1 trang | Thiếu kiểm tra điều kiện ẩn | Đảm bảo dòng `if (totalPages <= 1) return null;` ở đầu `Pagination.tsx`. |
