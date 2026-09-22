$orderPayload = @{
    receiverName = "Nguyen Van Test"
    receiverPhone = "0912345678"
    deliveryMethod = "store"
    shippingAddress = "122 Thai Ha, Dong Da, Ha Noi"
    paymentMethod = "QR_CODE"
    items = @(
        @{
            productVariantId = 1
            quantity = 1
            customPrice = 34290000
            productName = "iPhone 17 Pro Max 256GB"
            variantSummary = "Titan Sa Mạc"
        }
    )
} | ConvertTo-Json -Depth 5

$res = Invoke-RestMethod -Uri "http://localhost:5245/api/orders" -Method POST -Body $orderPayload -ContentType "application/json"
$orderCode = $res.data.orderCode
Write-Host "Created Order: $orderCode | TotalAmount: $($res.data.totalAmount)"

# Test QR create for this order
$qrPayload = @{ orderCode = $orderCode } | ConvertTo-Json
$qrRes = Invoke-RestMethod -Uri "http://localhost:5245/api/payment/qr/create" -Method POST -Body $qrPayload -ContentType "application/json"
Write-Host "QR Code URL amount check: $($qrRes.data.qrCodeUrl)"
Write-Host "QR Code Amount in DTO: $($qrRes.data.amount)"

# Test Bank Transfer simulation
$simPayload = @{ orderCode = $orderCode; amount = 34290000; bankTransactionId = "MBB-998877" } | ConvertTo-Json
$simRes = Invoke-RestMethod -Uri "http://localhost:5245/api/payment/qr/simulate-transfer" -Method POST -Body $simPayload -ContentType "application/json"
Write-Host "Payment Status: $($simRes.data.paymentStatus) | PaidAmount: $($simRes.data.paidAmount)"

# Test History lookup by orderCode
$histRes = Invoke-RestMethod -Uri "http://localhost:5245/api/payment/history?orderCode=$orderCode" -Method GET
Write-Host "History Count for $orderCode : $($histRes.data.Count)"
$histRes.data | Format-Table id, transactionCode, orderCode, paymentMethod, amount, statusDisplay, methodDetails

