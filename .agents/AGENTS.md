# Frontend Development Rules (Angular & Nx)

Dự án này là một Frontend Monorepo sử dụng Nx Workspace và Angular. Khi hỗ trợ lập trình, AI phải tuân thủ nghiêm ngặt các quy tắc sau:

## 1. Cấu trúc (Architecture)
- **Monorepo:** Sử dụng Nx Workspace. Các ứng dụng chính (host, micro-frontends) đặt trong thư mục `apps/`. Các module và tính năng dùng chung phải đặt trong thư mục `libs/`.
- **Components:** Các UI components có thể tái sử dụng (reusable) phải được đặt trong `libs/shared-ui/` thay vì viết lặp lại trong các ứng dụng (apps).

## 2. Tích hợp API
- **API Clients:** TUYỆT ĐỐI KHÔNG viết HttpClient requests thủ công bằng tay. Bắt buộc phải sử dụng công cụ sinh code tự động (như NSwag, Orval, hoặc OpenAPI Generator) dựa trên file Swagger/OpenAPI của backend ABP Framework.
- Mã nguồn sinh ra phải được đặt vào thư mục `libs/api-clients/`.

## 3. Styling & State Management
- **Styling:** Sử dụng SCSS/SASS hoặc các thư viện UI Component chuẩn (như Angular Material, Ant Design). Không viết CSS inline trực tiếp vào HTML template trừ trường hợp bất khả kháng.
- **State Management:** Sử dụng RxJS, NgRx hoặc BehaviorSubject trong các Services để quản lý state phức tạp. Mọi logic gọi API phải thông qua Service/Store, không gọi trực tiếp ở Component.
