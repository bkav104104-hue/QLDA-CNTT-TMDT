-- Set exact BCrypt hash for NextPhone@2026
-- Hash: $2a$11$SzdEVFHULqatnWX0EgTe4.fVq0TaVDknu05.t4WV95LTeQm.hcbEm
USE NextPhoneDb;

UPDATE Users 
SET PasswordHash = '$2a$11$SzdEVFHULqatnWX0EgTe4.fVq0TaVDknu05.t4WV95LTeQm.hcbEm'
WHERE PhoneNumber IN ('0901234567', '0912345678', '0987654321', '0988776655');

SELECT Id, PhoneNumber, FullName, RoleId, PasswordHash FROM Users;

