# Eric App (Frontend)

Frontend React cho hệ thống **Auth + Quản lý Users/Roles/Group-Role**.

## Tính năng chính

- Đăng ký / đăng nhập (email/username + password)
- Đăng nhập Google (Google OAuth)
- Tự attach `Authorization: Bearer <access_token>` cho request
- Tự refresh token khi gặp `401` (gọi `api/v1/refresh-token`)
- CRUD Users + phân trang/tìm kiếm/sort
- CRUD Roles + phân trang/tìm kiếm/sort
- Gán roles theo group (Group-Role)
- Upload avatar qua Cloudinary (backend ký request, FE upload lên Cloudinary)

## Tech stack

- React 17 + Create React App
- React Router v6
- Redux Toolkit + React Redux
- Axios + interceptors
- Bootstrap / React-Bootstrap + Sass
- React Toastify

## Yêu cầu

- Node.js + npm

## Cài đặt & chạy local

```bash
npm install
npm start
```

Mặc định chạy ở `http://localhost:3000`.

## Scripts

- `npm start`: chạy dev
- `npm test`: chạy test (watch mode)
- `npm run build`: build production ra thư mục `build/`

Ghi chú: project dùng wrapper `scripts/cra.js` để tự thêm `--openssl-legacy-provider` khi cần (thường gặp trên Node/OpenSSL mới).

## Cấu hình API (Backend base URL)

Khuyến nghị cấu hình base URL qua biến môi trường:

1) Tạo `.env` từ mẫu:

```bash
cp .env.example .env
```

2) Sửa `REACT_APP_API_BASE_URL` theo backend bạn đang chạy.

Nếu không set `REACT_APP_API_BASE_URL`, app sẽ fallback theo `NODE_ENV` trong `src/utils/axiosCustomize.js`:

- Dev (`NODE_ENV=development`): `http://localhost:8080/`
- Prod: `https://fullstack-backend-6li3.onrender.com/`

## Auth flow (tóm tắt)

- Sau khi login thành công, FE lưu `access_token` vào `localStorage` với key `access_token`.
- Mọi request sẽ tự gắn header `Authorization` nếu có token.
- Khi bị `401` (trừ endpoint refresh), FE sẽ gọi `api/v1/refresh-token` với `withCredentials: true`, cập nhật token mới rồi retry request.

## Routes

- Public:
  - `/login`
  - `/register`
- Private (cần đăng nhập):
  - `/users`
  - `/roles`
  - `/group-role`

## Cấu trúc thư mục (rút gọn)

- `src/utils/axiosCustomize.js`: Axios instance + interceptors + baseURL
- `src/component/services/userservice.js`: API services
- `src/component/redux/*`: Redux store + auth slice
- `src/component/PrivateRoute/*`: PrivateRoute/PublicRoute + routes
- `src/component/*`: các màn hình (login/register/users/roles/group-role/nav)

## Notes

- `GoogleOAuthProvider` đang dùng `clientId` hard-code trong `src/index.js`. Khi deploy thực tế nên chuyển sang biến môi trường.

