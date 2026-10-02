# BẢNG PHÂN TÍCH RỦI RO DỰ ÁN (PROJECT RISK ANALYSIS)
## Hệ thống Thương mại Điện tử Đồ công nghệ NextPhone (NextPhone E-Commerce Platform)

---

### Bảng 1: Bảng tổng hợp ma trận rủi ro dự án (Risk Matrix Summary)

| Mã rủi ro (Risk ID) | Tên rủi ro (Risk Name) | Xác suất (Probability) | Mức độ ảnh hưởng (Impact) | Mức ưu tiên (Priority) | Người phụ trách (Owner) |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **R01** | Rò rỉ dữ liệu cá nhân & Tấn công bảo mật (Customer Data Breach & Security Attack) | 5% | High | **High** | Phạm Hoàng Dương |
| **R02** | Gián đoạn cổng thanh toán trực tuyến VietQR & Thẻ (Payment Gateway Failure / Delays) | 8% | High | **High** | Nguyễn Quốc Việt |
| **R03** | Xung đột tồn kho & Bán vượt số lượng khi Flash Sale (Inventory Concurrency & Overselling) | 12% | High | **High** | Huy Hoàng |
| **R04** | Lỗi logic phân quyền - Quản trị viên can thiệp mua hàng (Privilege Logic Flaw & Admin Role Misuse) | 4% | Medium | **Medium** | Huy Hoàng |
| **R05** | Gian lận mã giảm giá & Tấn công vét khuyến mãi (Coupon Abuse & Promo Bot Scraping) | 15% | Medium | **Medium** | Nguyễn Quốc Việt |
| **R06** | Quá tải máy chủ & Cạn kiệt Connection Pool CSDL (System Overload & DB Connection Pool Exhaustion) | 10% | Medium | **Medium** | Trần Minh Tuấn |
| **R07** | Mất đồng bộ dữ liệu giỏ hàng giữa Frontend và Backend (Frontend-Backend State Desynchronization) | 7% | Low | **Low** | Phạm Hoàng Dương |
| **R08** | Sự cố máy chủ CSDL & Nguy cơ mất mát dữ liệu giao dịch (Database Failure & Transaction Data Loss) | 2% | Critical | **High** | Trần Minh Tuấn |

---

### Chi tiết các bảng phân tích rủi ro theo mẫu chuẩn (Standard Risk Analysis Worksheets)

#### Table 2: Risk Analysis R01
| **Risk ID: R01** | **Priority Level: High** | **Report Date: Feb 22nd, 2026** |
| :--- | :--- | :--- |
| **Description:** Customer data breach or unauthorized exposure of sensitive customer data (passwords, phone numbers, delivery addresses, order history) via IDOR vulnerabilities or malicious network attacks. | | |
| **Probability: 5%** | **Impact: High** | |
| **First Indicator:** Unusual spike in HTTP 401/403/404 request rates, abnormal server access patterns, or sudden high-frequency querying on `/api/orders/by-code/{orderCode}` endpoints. | | |
| **Mitigation Approaches:** Enforce strict PBKDF2/Argon2 password hashing, implement robust Role-Based Access Control (RBAC), enforce Data Masking for phone numbers and emails on public order tracking, enable HTTPS/TLS 1.3 with HSTS. | | |
| **Date Started: Mar 1st, 2026** | **Date to Complete: Mar 6th, 2026** | **Owner: Phạm Hoàng Dương** |
| **Current Status:** Data masking for order queries implemented. JWT authentication and refresh token rotation activated. Zero security incidents reported. | | |
| **Contingency Plan:** Immediately revoke affected JWT tokens, isolate compromised endpoints, notify affected users, and execute emergency security patch deployment. | | |
| **Trigger for Contingency Plan:** Detection of automated data harvesting attempts or confirmed unauthorized data extraction from the production environment. | | |

*Table 2 Risk Analysis R01*

---

#### Table 3: Risk Analysis R02
| **Risk ID: R02** | **Priority Level: High** | **Report Date: Feb 22nd, 2026** |
| :--- | :--- | :--- |
| **Description:** Potential issues with online payment gateways (VietQR Napas 24/7 or International Credit Card 3D-Secure) resulting in transaction failures, delayed webhook confirmations, or payment timeouts. | | |
| **Probability: 8%** | **Impact: High** | |
| **First Indicator:** Customer reports of completed bank transfers with unconfirmed order statuses, or timeouts when calling `/api/payment/qr/create` and `/api/payment/card/process`. | | |
| **Mitigation Approaches:** Implement automated client-side VietQR fallback generator (Napas standard format), active polling verification on `/api/payment/status/{orderCode}`, and Cash-on-Delivery (COD) backup checkout. | | |
| **Date Started: Mar 1st, 2026** | **Date to Complete: Mar 6th, 2026** | **Owner: Nguyễn Quốc Việt** |
| **Current Status:** Client-side VietQR fallback generator deployed. Bank webhook simulator active for testing. Reconciliation polling loop operational. | | |
| **Contingency Plan:** Switch checkout flow to manual bank transfer instruction mode with customer proof upload, initiate direct hotline escalation with MBBank/gateway partners. | | |
| **Trigger for Contingency Plan:** Gateway downtime exceeding 5 consecutive minutes or more than 3 consecutive transaction timeout errors. | | |

*Table 3 Risk Analysis R02*

---

#### Table 4: Risk Analysis R03
| **Risk ID: R03** | **Priority Level: High** | **Report Date: Feb 25th, 2026** |
| :--- | :--- | :--- |
| **Description:** High concurrency during Flash Sales or product launch events causing race conditions in stock deduction, resulting in inventory overselling (selling more items than available in stock). | | |
| **Probability: 12%** | **Impact: High** | |
| **First Indicator:** Product stock quantity dropping below zero in database records, or multiple orders placed at the exact same millisecond for the final available inventory unit. | | |
| **Mitigation Approaches:** Implement database pessimistic locking (`SELECT ... WITH (UPDLOCK)`) / EF Core execution strategies, atomic decrement operations at database level, and automated pre-checkout inventory reservation. | | |
| **Date Started: Mar 3rd, 2026** | **Date to Complete: Mar 9th, 2026** | **Owner: Huy Hoàng** |
| **Current Status:** Concurrency checks integrated into `OrderService.cs`. UnitOfWork database transaction rollback enabled for stock anomalies. | | |
| **Contingency Plan:** Immediately halt order placement for affected SKUs, trigger back-order fulfillment, contact affected customers to offer upgrade models or prioritized refund with compensation voucher. | | |
| **Trigger for Contingency Plan:** Any inventory unit count registering below zero or discrepancy identified between physical warehouse count and digital stock records. | | |

*Table 4 Risk Analysis R03*

---

#### Table 5: Risk Analysis R04
| **Risk ID: R04** | **Priority Level: Medium** | **Report Date: Feb 26th, 2026** |
| :--- | :--- | :--- |
| **Description:** Business logic vulnerability allowing Administrator accounts to place customer purchase orders, creating conflicts of interest, distorted sales reports, and unauthorized transaction manipulation. | | |
| **Probability: 4%** | **Impact: Medium** | |
| **First Indicator:** Order records in the database where `UserId` or `ReceiverPhone` / `ReceiverEmail` links directly to a system Administrator profile. | | |
| **Mitigation Approaches:** Multi-layered defense: Frontend UI disables "Thêm vào giỏ hàng" and "Mua ngay" for Admin roles; Backend API strictly rejects `/api/orders` requests with HTTP 403 Forbidden if user token contains Role="Admin". | | |
| **Date Started: Mar 2nd, 2026** | **Date to Complete: Mar 5th, 2026** | **Owner: Huy Hoàng** |
| **Current Status:** Both Frontend buttons and Backend `OrdersController` have strict role-enforcement guards. Comprehensive integration tests validated. | | |
| **Contingency Plan:** Void unauthorized orders, automatically adjust sales accounting reports, and flag administrator account activity for audit review. | | |
| **Trigger for Contingency Plan:** Any order creation attempt originating from an Administrator credential hitting backend log monitors. | | |

*Table 5 Risk Analysis R04*

---

#### Table 6: Risk Analysis R05
| **Risk ID: R05** | **Priority Level: Medium** | **Report Date: Mar 1st, 2026** |
| :--- | :--- | :--- |
| **Description:** Malicious users or automated bots exploiting promotion coupon codes via brute-forcing voucher strings, stacking ineligible discount codes, or bypassing minimum spend thresholds. | | |
| **Probability: 15%** | **Impact: Medium** | |
| **First Indicator:** Rapid repetitive requests to `/api/coupons/apply` with varied alphanumeric codes, or unexpected surges in discounted checkouts with minimum order values. | | |
| **Mitigation Approaches:** Implement rate-limiting on coupon validation endpoints, validate server-side minimum spend rules and expiry dates, enforce single-use-per-user constraints in SQL Server transactions. | | |
| **Date Started: Mar 5th, 2026** | **Date to Complete: Mar 10th, 2026** | **Owner: Nguyễn Quốc Việt** |
| **Current Status:** Server-side coupon verification engine completed with minimum order amount validations, discount caps, and expiry tracking. | | |
| **Contingency Plan:** Instantly deactivate suspected coupon codes from the Admin Portal, cancel orders placed with illegitimate discounts, and blacklist malicious IP addresses. | | |
| **Trigger for Contingency Plan:** Coupon redemption velocity exceeding 20 redemptions per minute or coupon application failure rate exceeding 70% from a single source. | | |

*Table 6 Risk Analysis R05*

---

#### Table 7: Risk Analysis R06
| **Risk ID: R06** | **Priority Level: Medium** | **Report Date: Mar 2nd, 2026** |
| :--- | :--- | :--- |
| **Description:** High traffic volumes leading to server resource exhaustion (CPU, RAM, or SQL Server Connection Pool starvation), causing sluggish page rendering, request timeouts, or complete service unavailability. | | |
| **Probability: 10%** | **Impact: Medium** | |
| **First Indicator:** Average API response latency exceeding 1,500ms, database connection timeout exceptions in backend logs, or frontend dev server memory alarms. | | |
| **Mitigation Approaches:** Implement EF Core Split Query configurations, database indexing on high-frequency columns (`Slug`, `OrderCode`, `PhoneNumber`), response caching, and static asset minification with Vite. | | |
| **Date Started: Mar 6th, 2026** | **Date to Complete: Mar 12th, 2026** | **Owner: Trần Minh Tuấn** |
| **Current Status:** EF Core Query Splitting configured. Indexes established on `Orders`, `Products`, and `Users`. Production asset bundle optimized. | | |
| **Contingency Plan:** Enable backend request throttling, activate degraded mode (disable non-essential background metrics/polling), scale out API instances or increase SQL Server max pool size. | | |
| **Trigger for Contingency Plan:** Sustained CPU usage over 85% for more than 3 minutes or backend response latency consistently exceeding 2,000ms. | | |

*Table 7 Risk Analysis R06*

---

#### Table 8: Risk Analysis R07
| **Risk ID: R07** | **Priority Level: Low** | **Report Date: Mar 4th, 2026** |
| :--- | :--- | :--- |
| **Description:** Client-side local storage or cart state becoming out-of-sync with updated backend catalog prices, discontinued product variants, or modified promotion policies. | | |
| **Probability: 7%** | **Impact: Low** | |
| **First Indicator:** Customers submitting checkout requests with mismatched prices compared to current database pricing, or orders referencing obsolete variant SKUs. | | |
| **Mitigation Approaches:** Authoritative backend price recalculation during checkout (never trusting client-supplied prices), automated cart validation against live product data upon opening the checkout page. | | |
| **Date Started: Mar 7th, 2026** | **Date to Complete: Mar 11th, 2026** | **Owner: Phạm Hoàng Dương** |
| **Current Status:** Authoritative price recalculation active in `OrderService.cs`. Intelligent variant mapping implemented for smooth checkout transitions. | | |
| **Contingency Plan:** Display informative modal to user detailing updated pricing or variant availability, offering 1-click cart synchronization to current catalog state. | | |
| **Trigger for Contingency Plan:** Price difference detected between client cart state and database catalog during order validation. | | |

*Table 8 Risk Analysis R07*

---

#### Table 9: Risk Analysis R08
| **Risk ID: R08** | **Priority Level: High** | **Report Date: Mar 5th, 2026** |
| :--- | :--- | :--- |
| **Description:** Catastrophic database corruption, storage hardware failure, or accidental administrative data truncation leading to partial or total loss of transactional business records. | | |
| **Probability: 2%** | **Impact: Critical** | |
| **First Indicator:** SQL Server disk I/O read/write error logs, database engine integrity check failures (DBCC CHECKDB errors), or database entering suspect/recovery state. | | |
| **Mitigation Approaches:** Daily automated full SQL Server backups, hourly transaction log backups, automated backup replication to off-site cloud storage, and monthly disaster recovery drills. | | |
| **Date Started: Mar 8th, 2026** | **Date to Complete: Mar 14th, 2026** | **Owner: Trần Minh Tuấn** |
| **Current Status:** SQL Server differential backup script established. Transaction log recovery model enabled with point-in-time restore capability. | | |
| **Contingency Plan:** Switch to standby replica database, restore database from the most recent transaction log backup, and initiate transaction reconciliation using payment gateway audit logs. | | |
| **Trigger for Contingency Plan:** Primary database service failure lasting more than 5 minutes or unrecoverable database corruption alerts. | | |

*Table 9 Risk Analysis R08*
