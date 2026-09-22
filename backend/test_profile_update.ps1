$loginBody = @{ username = '0912345678'; password = 'NextPhone@2026' } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri 'http://localhost:5245/api/auth/login' -Method Post -Body $loginBody -ContentType 'application/json'
$token = $loginRes.data.token
$headers = @{ Authorization = "Bearer $token" }

$updateBody = @{ 
    fullName = "Nguyễn Văn A"
    email = "nguyenvana@gmail.com"
} | ConvertTo-Json

$res = Invoke-RestMethod -Uri 'http://localhost:5245/api/auth/profile' -Method Put -Body $updateBody -ContentType 'application/json' -Headers $headers
Write-Host "Restored Name: $($res.data.fullName) | Email: $($res.data.email)"

