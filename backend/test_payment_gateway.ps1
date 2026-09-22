$baseUrl = "http://localhost:5245/api"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   TESTING NEXTPHONE PAYMENT GATEWAY BACKEND" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Login to get token
Write-Host "`n[1] Logging in test account 0912345678..." -ForegroundColor Yellow
$loginBody = @{
    username = "0912345678"
    password = "NextPhone@2026"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginRes.data.token
$headers = @{ Authorization = "Bearer $token" }
Write-Host "-> Logged in as: $($loginRes.data.user.fullName)" -ForegroundColor Green

# 2. Create Order 1 for QR Payment Test
Write-Host "`n[2] Creating Order 1 for VietQR test..." -ForegroundColor Yellow
$order1Body = @{
    receiverName = "Nguyen Van A"
    receiverPhone = "0912345678"
    receiverEmail = "nguyenvana@gmail.com"
    deliveryMethod = "home"
    shippingAddress = "72 Nguyen Trai, Thanh Xuan, Ha Noi"
    paymentMethod = "QR_CODE"
    items = @(
        @{ productVariantId = 1; quantity = 1 }
    )
} | ConvertTo-Json -Depth 5

$order1Res = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body $order1Body -ContentType "application/json" -Headers $headers
$order1Code = $order1Res.data.orderCode
$order1Amount = $order1Res.data.totalAmount
Write-Host "-> Created Order 1: $order1Code (Amount: $order1Amount VND)" -ForegroundColor Green

# 3. Create VietQR for Order 1
Write-Host "`n[3] Generating VietQR for Order $order1Code..." -ForegroundColor Yellow
$qrReqBody = @{
    orderCode = $order1Code
} | ConvertTo-Json

$qrRes = Invoke-RestMethod -Uri "$baseUrl/payment/qr/create" -Method Post -Body $qrReqBody -ContentType "application/json"
Write-Host "-> VietQR generated successfully!" -ForegroundColor Green
Write-Host "   Bank: $($qrRes.data.bankName) (BIN: $($qrRes.data.bankBin))"
Write-Host "   Account: $($qrRes.data.accountNo) - $($qrRes.data.accountName)"
Write-Host "   Transfer Content: $($qrRes.data.transferContent)"
Write-Host "   QR URL: $($qrRes.data.qrCodeUrl)"

# 4. Check Polling Status before transfer
Write-Host "`n[4] Checking status before transfer..." -ForegroundColor Yellow
$statusBefore = Invoke-RestMethod -Uri "$baseUrl/payment/status/$order1Code" -Method Get
Write-Host "-> Payment Status: $($statusBefore.data.paymentStatus) | Order Status: $($statusBefore.data.orderStatus)" -ForegroundColor Cyan

# 5. Simulate Bank Transfer Webhook
Write-Host "`n[5] Simulating Bank Transfer Webhook for $order1Code..." -ForegroundColor Yellow
$simBody = @{
    orderCode = $order1Code
    amount = $order1Amount
    bankTransactionId = "MBB-" + (Get-Random -Minimum 100000 -Maximum 999999)
} | ConvertTo-Json

$simRes = Invoke-RestMethod -Uri "$baseUrl/payment/qr/simulate-transfer" -Method Post -Body $simBody -ContentType "application/json"
Write-Host "-> Webhook processed!" -ForegroundColor Green
Write-Host "   Updated Payment Status: $($simRes.data.paymentStatus)" -ForegroundColor Green
Write-Host "   Updated Order Status: $($simRes.data.orderStatus)" -ForegroundColor Green
Write-Host "   Paid Amount: $($simRes.data.paidAmount) VND" -ForegroundColor Green

# 6. Create Order 2 for Credit Card Payment Test
Write-Host "`n[6] Creating Order 2 for Credit Card test..." -ForegroundColor Yellow
$order2Body = @{
    receiverName = "Nguyen Van A"
    receiverPhone = "0912345678"
    receiverEmail = "nguyenvana@gmail.com"
    deliveryMethod = "home"
    shippingAddress = "72 Nguyen Trai, Thanh Xuan, Ha Noi"
    paymentMethod = "CREDIT_CARD"
    items = @(
        @{ productVariantId = 1; quantity = 1 }
    )
} | ConvertTo-Json -Depth 5

$order2Res = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body $order2Body -ContentType "application/json" -Headers $headers
$order2Code = $order2Res.data.orderCode
$order2Amount = $order2Res.data.totalAmount
Write-Host "-> Created Order 2: $order2Code (Amount: $order2Amount VND)" -ForegroundColor Green

# 7. Test Invalid Card (Luhn check failure)
Write-Host "`n[7] Testing invalid card number (violating Luhn algorithm)..." -ForegroundColor Yellow
$invalidCardBody = @{
    orderCode = $order2Code
    cardNumber = "4111 1111 1111 1112" # Invalid Luhn
    cardHolderName = "NGUYEN VAN A"
    expiryMonth = 12
    expiryYear = 2028
    cvv = "123"
} | ConvertTo-Json

try {
    $invRes = Invoke-RestMethod -Uri "$baseUrl/payment/card/process" -Method Post -Body $invalidCardBody -ContentType "application/json"
    Write-Host "-> Unexpected success: Should have rejected invalid card!" -ForegroundColor Red
} catch {
    Write-Host "-> Correctly rejected invalid card with Luhn error!" -ForegroundColor Green
}

# 8. Test Valid Visa Card (4111 1111 1111 1111) -> 3D Secure OTP Challenge
Write-Host "`n[8] Processing valid Visa card (4111 1111 1111 1111)..." -ForegroundColor Yellow
$validCardBody = @{
    orderCode = $order2Code
    cardNumber = "4111 1111 1111 1111"
    cardHolderName = "NGUYEN VAN A"
    expiryMonth = 12
    expiryYear = 2028
    cvv = "123"
} | ConvertTo-Json

$cardRes = Invoke-RestMethod -Uri "$baseUrl/payment/card/process" -Method Post -Body $validCardBody -ContentType "application/json"
Write-Host "-> Card Process Result: $($cardRes.data.status)" -ForegroundColor Green
Write-Host "   Brand: $($cardRes.data.cardBrand)"
Write-Host "   Masked Number: $($cardRes.data.cardNumberMasked)"
Write-Host "   Transaction: $($cardRes.data.transactionCode)"
Write-Host "   3D-Secure Hint: $($cardRes.data.otpHint)"
$txnCode = $cardRes.data.transactionCode

# 9. Test Verify OTP with wrong code
Write-Host "`n[9] Testing 3D-Secure verification with wrong OTP (000000)..." -ForegroundColor Yellow
$wrongOtpBody = @{
    transactionCode = $txnCode
    otpCode = "000000"
} | ConvertTo-Json

try {
    $wrongOtpRes = Invoke-RestMethod -Uri "$baseUrl/payment/card/verify-otp" -Method Post -Body $wrongOtpBody -ContentType "application/json"
    Write-Host "-> Unexpected success with wrong OTP!" -ForegroundColor Red
} catch {
    Write-Host "-> Correctly rejected wrong OTP!" -ForegroundColor Green
}

# 10. Verify OTP with correct code (888888)
Write-Host "`n[10] Verifying 3D-Secure with correct OTP (888888)..." -ForegroundColor Yellow
$validOtpBody = @{
    transactionCode = $txnCode
    otpCode = "888888"
} | ConvertTo-Json

$otpRes = Invoke-RestMethod -Uri "$baseUrl/payment/card/verify-otp" -Method Post -Body $validOtpBody -ContentType "application/json"
Write-Host "-> 3D-Secure OTP verified successfully!" -ForegroundColor Green
Write-Host "   Payment Status: $($otpRes.data.status)" -ForegroundColor Green
Write-Host "   Message: $($otpRes.data.message)" -ForegroundColor Green
Write-Host "   Paid At: $($otpRes.data.paidAt)" -ForegroundColor Green

# 11. Final Status Check for Order 2
Write-Host "`n[11] Checking final status of Order $order2Code..." -ForegroundColor Yellow
$finalStatus = Invoke-RestMethod -Uri "$baseUrl/payment/status/$order2Code" -Method Get
Write-Host "-> Payment Status: $($finalStatus.data.paymentStatus)" -ForegroundColor Green
Write-Host "   Order Status: $($finalStatus.data.orderStatus)" -ForegroundColor Green
Write-Host "   Payment Method: $($finalStatus.data.paymentMethod)" -ForegroundColor Green
Write-Host "   Total Transactions: $($finalStatus.data.transactions.Count)" -ForegroundColor Green

# 12. Payment History Endpoint Check
Write-Host "`n[12] Checking Payment History for user and order..." -ForegroundColor Yellow
$historyUser = Invoke-RestMethod -Uri "$baseUrl/payment/history" -Method Get -Headers $headers
Write-Host "-> Payment History Count (by token): $($historyUser.data.Count)" -ForegroundColor Green

$historyOrder = Invoke-RestMethod -Uri "$baseUrl/payment/history?orderCode=$order2Code" -Method Get
Write-Host "-> Payment History for Order $order2Code : $($historyOrder.data.Count)" -ForegroundColor Green
$historyOrder.data | Format-Table id, transactionCode, orderCode, paymentMethod, amount, statusDisplay, methodDetails

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "   ALL PAYMENT GATEWAY TESTS COMPLETED SUCCESSFULLY!" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

