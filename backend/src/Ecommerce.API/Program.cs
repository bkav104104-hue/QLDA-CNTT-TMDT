using System;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using FluentValidation;
using Ecommerce.API.Middlewares;
using Ecommerce.BLL.Interfaces;
using Ecommerce.BLL.Mappings;
using Ecommerce.BLL.Services;
using Ecommerce.BLL.Validators;
using Ecommerce.DAL.Context;
using Ecommerce.DAL.Interfaces;
using Ecommerce.DAL.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình kết nối SQL Server với ApplicationDbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions => 
        sqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));

// 2. Đăng ký Data Access Layer (DAL)
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// 3. Đăng ký Business Logic Layer (BLL) Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IBrandService, BrandService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<ICouponService, CouponService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// 4. Đăng ký AutoMapper & FluentValidation
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());
builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();

// 5. Cấu hình JWT Bearer Authentication
var jwtKey = builder.Configuration["Jwt:SecretKey"] ?? "NextPhone_ECommerce_Secret_Key_Super_Secure_2026!#*NextPhoneVietNamApp";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "NextPhone";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "NextPhoneUsers";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// 6. Cấu hình CORS cho Web Frontend (localhost:3000) và Mobile Expo
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 7. Đăng ký Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 8. Cấu hình Swagger
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 9. Middleware Pipeline
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "NextPhone API v1");
    });
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
