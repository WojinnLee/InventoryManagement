TRƯỜNG ĐẠI HỌC Kiến trúc Đà Nẵng

**KHOA CÔNG NGHỆ THÔNG TIN**

**PHÂN CÔNG NHIỆM VỤ ĐỒ ÁN DEVOPS**

**Đề tài: EZ-Inventory --- Hệ thống Quản lý Kho Tinh Gọn**

Môn học: Chuyên đề Công nghệ Mới (DevOps) \| Nhóm: 5 thành viên

# 1. DANH SÁCH THÀNH VIÊN NHÓM

  ------------------------------------------------------------------------------
  **STT**   **Họ và tên**      **MSSV**     **Vai trò**
  --------- ------------------ ------------ ------------------------------------
  1         **Lê Ngọc Ánh**    2251220067   Infrastructure Engineer (Deploy
                                            Owner)

  2         **Lê Văn Hậu**     2251220053   DevOps Engineer (CI/CD Owner)

  3         **Lê Toàn Trung**  2251220086   QA / SRE Engineer

  4         **Lê Minh Hoài     2251220283   Frontend Engineer
            Thương**                        

  5         **Thái Hữu Long    2251220216   Backend Engineer
            Vũ**                            
  ------------------------------------------------------------------------------

# 2. TỔNG QUAN ỨNG DỤNG

## 2.1 Mô tả

EZ-Inventory là ứng dụng quản lý kho hỗ trợ doanh nghiệp theo dõi hàng
hóa và kiểm soát tồn kho. Hệ thống cho phép thêm/sửa sản phẩm, nhập kho,
xuất kho và theo dõi số lượng tồn hiện tại qua dashboard.

## 2.2 Stack công nghệ

  -----------------------------------------------------------------------------
  **Tầng**        **Công nghệ**         **Lý do chọn**
  --------------- --------------------- ---------------------------------------
  **Frontend**    React + Vite +        Nhanh, dùng VITE\_\* env đúng chuẩn
                  Tailwind CSS          DevOps, build production nhỏ

  **Backend API** Node.js + Express.js  Nhẹ, dễ viết /api/health, log
                                        middleware rõ ràng

  **Database**    PostgreSQL            Hỗ trợ migration, transaction, phù hợp
                                        quản lý kho

  **ORM**         Prisma                Migration dễ, type-safe, dễ debug DB
                                        layer

  **Container**   Docker + Docker       Bắt buộc theo đề, multi-stage build cho
                  Compose               frontend

  **CI/CD**       GitHub Actions        Bắt buộc theo đề, tích hợp
                                        lint/test/build

  **Deploy**      VPS Ubuntu / Render   Dễ demo, URL public, redeploy được

  **API Test**    Postman / curl        Test /api/health và các endpoint
  -----------------------------------------------------------------------------

# 3. PHÂN CÔNG NHIỆM VỤ CHI TIẾT

## 3.1 Backend Engineer --- Thái Hữu Long Vũ (MSSV: 2251220216)

Công nghệ: Node.js, Express.js, Prisma ORM, PostgreSQL

**Nhiệm vụ chính:**

  ------------------------------------------------------------------------
  **Nhiệm vụ cụ thể**            **Yêu cầu bắt buộc /     **Deadline / Ghi
                                 Bằng chứng cần nộp**     chú**
  ------------------------------ ------------------------ ----------------
  Khởi tạo project Node.js +     Commit khởi tạo repo,    Tuần 1
  Express, cấu trúc thư mục rõ   screenshot cấu trúc thư  
  ràng                           mục                      

  Thiết kế và tạo DB schema:     File schema.prisma,      Tuần 1
  bảng items, stock_logs (dùng   migration files commit   
  Prisma migration)              lên repo                 

  Xây dựng endpoint GET          Screenshot curl          BẮT BUỘC - Tuần
  /api/health trả { \"ok\": true /api/health, Postman     1
  }                              collection               

  API CRUD sản phẩm:             Postman collection,      Tuần 2
  GET/POST/PUT /api/items        screenshot response      

  API nhập kho: POST             Postman test, screenshot Tuần 2
  /api/stock/import (cập nhật    DB trước/sau             
  stock_logs + items.quantity)                            

  API xuất kho: POST             Test case lỗi 400,       Tuần 2
  /api/stock/export (kiểm tra    screenshot log           
  tồn, trả 400 nếu không đủ)                              

  Thêm middleware logging lỗi    Screenshot log container Tuần 3
  (console.error khi 4xx/5xx)    khi gọi sai API          

  Không hardcode DB URL --- dùng .env.example có          BẮT BUỘC
  biến môi trường DATABASE_URL   DATABASE_URL, không      
                                 commit .env              
  ------------------------------------------------------------------------

  -----------------------------------------------------------------------
  **⚠️ QUAN TRỌNG: Endpoint /api/health phải hoạt động trước mọi thứ. Nếu
  /api/health fail khi demo = 0 điểm Deploy. Có log lỗi rõ ràng là điều
  kiện để QA làm được incident.**
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

## 3.2 Frontend Engineer --- Lê Minh Hoài Thương (MSSV: 2251220283)

Công nghệ: React, Vite, Tailwind CSS, Axios

**Nhiệm vụ chính:**

  ------------------------------------------------------------------------
  **Nhiệm vụ cụ thể**            **Yêu cầu bắt buộc /     **Deadline / Ghi
                                 Bằng chứng cần nộp**     chú**
  ------------------------------ ------------------------ ----------------
  Khởi tạo project React + Vite, Commit khởi tạo,         Tuần 1
  cấu hình Tailwind CSS          screenshot UI chạy được  
                                 local                    

  Cấu hình biến môi trường đúng  .env.example có          BẮT BUỘC
  chuẩn: VITE_API_URL trong .env VITE_API_URL, không      
                                 hardcode URL             

  Trang Danh sách sản phẩm: hiển Screenshot UI, Network   Tuần 2
  thị items từ API, có tên, SKU, tab devtools thấy API    
  số lượng tồn                   call                     

  Form Thêm/sửa sản phẩm: gọi    Screenshot UI trước/sau  Tuần 2
  POST/PUT /api/items            thêm sản phẩm            

  Trang Nhập kho & Xuất kho:     Screenshot UI, hiển thị  Tuần 2
  form nhập số lượng, hiển thị   thông báo lỗi khi không  
  kết quả                        đủ hàng                  

  Dashboard tồn kho: tổng số mặt Screenshot dashboard     Tuần 3
  hàng, cảnh báo sắp hết hàng                             
  (\<= 5 đơn vị)                                          

  Kiểm tra không có lỗi console  Screenshot Console tab   BẮT BUỘC - 5
  (0 error, 0 warning)           devtools khi demo        điểm

  Multi-stage build: Dockerfile  Dockerfile frontend,     Phối hợp DevOps
  frontend dùng node:alpine      image size \< 50MB       
  build rồi nginx:alpine serve                            
  ------------------------------------------------------------------------

  -----------------------------------------------------------------------
  **⚠️ KHÔNG hardcode URL backend (ví dụ: http://localhost:3000). PHẢI
  dùng import.meta.env.VITE_API_URL. Nếu hardcode = fail ngay mục
  Environment (10 điểm).**
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

## 3.3 DevOps Engineer (CI/CD Owner) --- Lê Văn Hậu (MSSV: 2251220053)

Công nghệ: GitHub Actions, ESLint, Jest / Vitest, Docker build

**Nhiệm vụ chính:**

  ------------------------------------------------------------------------
  **Nhiệm vụ cụ thể**            **Yêu cầu bắt buộc /     **Deadline / Ghi
                                 Bằng chứng cần nộp**     chú**
  ------------------------------ ------------------------ ----------------
  Tạo repo GitHub, thiết lập     Screenshot GitHub repo,  Tuần 1 - BẮT
  branch: main, dev, feature/\*  branch list              BUỘC

  Thiết lập quy tắc commit: mỗi  Screenshot git log /     BẮT BUỘC liên
  thành viên commit lịch sử rõ   GitHub commits history   tục
  ràng, không commit 1 lần cuối                           

  Tạo GitHub Actions workflow:   File ci.yml commit lên   Tuần 2
  .github/workflows/ci.yml       repo, screenshot         
                                 pipeline chạy            

  Pipeline CI phải có đủ:        Screenshot GitHub        BẮT BUỘC - 15
  install deps → lint → test →   Actions tab: tất cả      điểm
  build                          steps PASS               

  Pipeline tự động chạy khi push Screenshot Actions chạy  BẮT BUỘC
  / pull request                 khi push commit mới      

  Pipeline FAIL nếu có lỗi       Screenshot 1 lần         Phải có bằng
  lint/test/build --- KHÔNG      pipeline fail (cố tình   chứng fail
  bypass                         tạo lỗi để demo)         

  Không chứa secret/API key      GitHub Settings \>       BẮT BUỘC - 5
  trong code --- dùng GitHub     Secrets, screenshot      điểm
  Secrets                        secrets đã set           

  Phối hợp Frontend/Backend thêm File .eslintrc, test     Tuần 2-3
  eslint config và ít nhất 1     files, screenshot test   
  unit test                      pass                     
  ------------------------------------------------------------------------

  -----------------------------------------------------------------------
  📌 Mẹo: Tạo 1 commit cố tình lỗi lint để chụp màn hình pipeline FAIL,
  sau đó fix lại để chụp pipeline PASS. Đây là bằng chứng pipeline hoạt
  động đúng.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

## 3.4 Infrastructure Engineer (Deploy Owner) --- Lê Ngọc Ánh (MSSV: 2251220067)

Công nghệ: Docker, Docker Compose, VPS Ubuntu / Render / Vercel

**Nhiệm vụ chính:**

  ------------------------------------------------------------------------
  **Nhiệm vụ cụ thể**            **Yêu cầu bắt buộc /     **Deadline / Ghi
                                 Bằng chứng cần nộp**     chú**
  ------------------------------ ------------------------ ----------------
  Viết Dockerfile cho Backend    Dockerfile commit lên    Tuần 2
  (Node.js): multi-stage nếu có  repo, screenshot build   
  thể                            thành công               

  Viết Dockerfile cho Frontend   Dockerfile frontend,     BẮT BUỘC - 5
  (React/Vite): BẮT BUỘC         screenshot image size    điểm
  multi-stage (node build +                               
  nginx serve)                                            

  Viết docker-compose.yml: 3     File docker-compose.yml, BẮT BUỘC - 5
  service (frontend, backend,    screenshot docker        điểm
  db), đúng depends_on, volumes, compose up -d            
  env_file                                                

  Demo: docker compose up -d     Screenshot docker ps (3  BẮT BUỘC - 5
  chạy thành công toàn hệ thống  container RUNNING),      điểm
                                 screenshot UI chạy được  

  Demo: docker logs              Screenshot log container BẮT BUỘC - Debug
  \<container\> xem log backend  khi gọi API              

  Deploy lên môi trường thực tế  URL hoạt động,           BẮT BUỘC - 15
  (VPS/Render/Vercel) --- có URL screenshot trình duyệt   điểm
  public                         với URL public           

  Cấu hình CORS đúng: backend    Screenshot API call từ   Dễ bị quên!
  chấp nhận request từ URL       frontend production      
  frontend production            không bị CORS error      

  Demo redeploy: thay đổi 1 thứ  Screenshot lần redeploy  5 điểm
  nhỏ, deploy lại được           thành công               
  ------------------------------------------------------------------------

  -----------------------------------------------------------------------
  **⚠️ KHÔNG chạy local khi demo --- đây là tiêu chí LOẠI. URL deploy
  phải public truy cập được. CORS sai là incident phổ biến nhất --- cấu
  hình CORS_ORIGIN khớp với URL frontend.**
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

## 3.5 QA / SRE Engineer --- Lê Toàn Trung (MSSV: 2251220086)

Công nghệ: Postman, curl, docker logs, browser DevTools

**Nhiệm vụ chính:**

  ------------------------------------------------------------------------
  **Nhiệm vụ cụ thể**            **Yêu cầu bắt buộc /     **Deadline / Ghi
                                 Bằng chứng cần nộp**     chú**
  ------------------------------ ------------------------ ----------------
  Kiểm thử toàn bộ API bằng      Export Postman           Tuần 2-3
  Postman: tạo Collection đầy đủ Collection (.json)       
  các endpoint                   commit lên repo hoặc nộp 
                                 kèm                      

  Kiểm thử UI: test từng chức    Checklist kiểm thử UI,   Tuần 3
  năng, ghi lại bug nếu có       screenshot kết quả       

  Tạo ít nhất 3 incident thực    Báo cáo incident theo    BẮT BUỘC - 10
  tế: ghi lại hiện tượng, layer, mẫu (xem bảng dưới),     điểm
  nguyên nhân, cách fix          screenshot lỗi           

  Debug đúng layer theo mô hình  Ghi rõ layer lỗi trong   BẮT BUỘC
  L1-L4: phân tích lỗi CORS, ENV báo cáo incident         
  sai, DB fail, Frontend                                  
  undefined                                               

  Demo debug trực tiếp: gây lỗi  Demo live khi thuyết     Quan trọng
  có chủ đích, xác định layer,   trình                    
  fix trực tiếp khi demo                                  

  Kiểm tra checklist demo:       Screenshot tất cả        Tuần cuối
  frontend load, no console      checklist trước ngày     
  error, /api/health OK,         demo                     
  container running                                       

  Viết hướng dẫn setup & chạy    README.md có mục Setup,  1 điểm Docs
  local trong README.md          chạy thử theo README     
                                 thành công               
  ------------------------------------------------------------------------

# 4. MẪU BÁO CÁO INCIDENT (QA/SRE --- Lê Toàn Trung)

Cần ít nhất 3 incident. Dưới đây là 3 incident gợi ý sẵn --- có thể dùng
hoặc thay bằng incident thực tế gặp phải:

  ---------------------------------------------------------------------------------
  **\#**   **Loại      **Hiện tượng**  **Layer**   **Nguyên nhân** **Cách fix**
           lỗi**                                                   
  -------- ----------- --------------- ----------- --------------- ----------------
  1        CORS Error  Frontend gọi    L4 Frontend Backend thiếu   Thêm cors()
                       API bị block    / L3        CORS header     middleware, cấu
                       browser         Backend                     hình .env đúng

  2        ENV sai /   /api/health trả L3 Backend  DATABASE_URL    Kiểm tra
           API 500     500 hoặc DB lỗi / L2 DB     sai trong .env  .env.example,
                                                   production      set lại biến env

  3        Frontend    UI hiện NaN     L4 Frontend VITE_API_URL    Đặt đúng
           undefined   hoặc undefined              không set hoặc  VITE\_\* trong
                                                   sai             .env, rebuild
  ---------------------------------------------------------------------------------

  -----------------------------------------------------------------------
  📌 Mỗi incident phải có: Hiện tượng + Layer lỗi + Nguyên nhân + Cách
  fix + Cách phòng tránh. Screenshot màn hình lỗi là bằng chứng bắt buộc.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

# 5. CHECKLIST BẰNG CHỨNG CẦN CHUẨN BỊ TRƯỚC DEMO

Mỗi mục cần có screenshot hoặc file đính kèm. Đây là điều kiện để đạt
điểm từng hạng mục:

## 5.1 Bằng chứng cần commit lên GitHub

-   README.md: hướng dẫn setup, kiến trúc hệ thống, sơ đồ CI/CD flow

-   .env.example: liệt kê đủ các biến (DATABASE_URL, VITE_API_URL,
    PORT\...)

-   .gitignore: phải bao gồm .env, node_modules

-   Dockerfile (backend + frontend)

-   docker-compose.yml

-   .github/workflows/ci.yml (GitHub Actions)

-   Postman Collection JSON

-   Prisma migration files

## 5.2 Bằng chứng chụp màn hình cần chuẩn bị

-   GitHub commits history --- mỗi người có ít nhất 5+ commits riêng
    biệt

-   GitHub Actions tab --- pipeline chạy PASS (xanh)

-   GitHub Actions tab --- ít nhất 1 lần pipeline FAIL (để chứng minh
    pipeline có tác dụng)

-   docker compose up -d thành công, docker ps thấy 3 container RUNNING

-   docker logs \<backend-container\> thấy log request

-   curl http://localhost:3000/api/health trả { \"ok\": true }

-   URL public của ứng dụng đang chạy (không phải localhost)

-   Console tab browser (F12) không có lỗi đỏ

-   Network tab browser thấy API call đến backend thành công

-   3 incident: screenshot màn hình lỗi + ghi chú fix

# 6. RUBRIC ĐIỂM & MỤC TIÊU TỪNG VAI TRÒ

  --------------------------------------------------------------------------
  **Hạng mục**          **Điểm**   **Ai chịu trách nhiệm   **Tiêu chí đạt**
                                   chính**                 
  --------------------- ---------- ----------------------- -----------------
  System (App chạy đầy  **20**     Backend + Frontend      Frontend load,
  đủ)                                                      /api/health OK,
                                                           API trả data, 0
                                                           console error

  Docker                **20 (BẮT  Infrastructure Engineer Dockerfile,
                        BUỘC)**                            docker-compose,
                                                           chạy OK,
                                                           multi-stage

  CI/CD                 **15**     DevOps Engineer         GitHub Actions:
                                                           lint + test +
                                                           build, fail khi
                                                           lỗi

  Deploy                **15**     Infrastructure Engineer URL public,
                                                           redeploy được,
                                                           không chạy local

  Environment           **10**     Tất cả                  .env.example,
                                                           không leak
                                                           secret, không
                                                           hardcode

  Debug / Incident      **10**     QA/SRE Engineer         3 incident thật,
                                                           debug đúng layer

  Documentation         **5**      QA/SRE + Tất cả         Architecture,
                                                           CI/CD flow, setup
                                                           guide

  Role presentation     **5**      Tất cả                  Mỗi người trình
                                                           bày phần của mình
  --------------------------------------------------------------------------

# 7. TIÊU CHÍ LOẠI NGAY (FAIL --- 0 ĐIỂM)

  -----------------------------------------------------------------------
  **⚠️ Các mục sau đây sẽ khiến nhóm bị 0 điểm toàn bộ đồ án nếu vi phạm
  khi demo!**
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

-   **Không có Docker (Dockerfile + docker-compose.yml)**

-   **Không deploy được --- app chỉ chạy local**

-   **Không có CI/CD (GitHub Actions)**

-   **Commit secret/API key lên GitHub**

-   **Không debug được lỗi khi được hỏi**

-   **App không có database / chỉ hiển thị UI tĩnh**

# 8. GHI CHÚ QUAN TRỌNG

  -----------------------------------------------------------------------
  📌 DevOps không đánh giá \'code chạy local\'. DevOps đánh giá: hệ thống
  chạy được trên production và có thể deploy lại, debug được khi lỗi.
  -----------------------------------------------------------------------

  -----------------------------------------------------------------------

Lịch làm việc đề xuất:

-   Tuần 1: Khởi tạo repo, thiết lập DB schema, cấu trúc project,
    /api/health

-   Tuần 2: Hoàn thiện API + UI chính, viết Dockerfile + docker-compose,
    thiết lập CI/CD

-   Tuần 3: Deploy production, fix CORS/ENV, tạo incident, chuẩn bị bằng
    chứng

-   Tuần cuối: Kiểm tra checklist, viết README, chạy thử toàn bộ từ đầu

Tài liệu tham khảo:

-   GitHub Actions docs: https://docs.github.com/en/actions

-   Docker multi-stage build:
    https://docs.docker.com/build/building/multi-stage/

-   Prisma migration:
    https://www.prisma.io/docs/concepts/components/prisma-migrate

-   Render deploy Node.js:
    https://render.com/docs/deploy-node-express-app

**Chúc nhóm hoàn thành đồ án xuất sắc! 🚀**

*EZ-Inventory --- DevOps Capstone Project*
