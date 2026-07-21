using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Nexhire.Data;
using Nexhire.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    jwtSettings["SecretKey"]!
                )
            )
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<JobsService>();
builder.Services.AddScoped<ApplicationsService>();
builder.Services.AddScoped<PdfReaderService>();
builder.Services.AddScoped<AIService>();
builder.Services.AddScoped<InterviewsService>();
builder.Services.AddScoped<InterviewPrepService>();

// OpenRouter AI Client
builder.Services.AddHttpClient("OpenRouter", client =>
{
    client.BaseAddress = new Uri(
        "https://openrouter.ai/api/v1/"
    );

    var apiKey =
        builder.Configuration["OpenRouter:ApiKey"];

    client.DefaultRequestHeaders.Add(
        "Authorization",
        $"Bearer {apiKey}"
    );

    client.DefaultRequestHeaders.Add(
        "HTTP-Referer",
        "http://localhost:3001"
    );

    client.DefaultRequestHeaders.Add(
        "X-Title",
        "Nexhire AI Recruitment"
    );
});

// Swagger
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Description =
                "Enter: Bearer {your JWT token}",

            Name = "Authorization",

            In = ParameterLocation.Header,

            Type = SecuritySchemeType.ApiKey,

            Scheme = "Bearer"
        }
    );

    c.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference =
                        new OpenApiReference
                        {
                            Type =
                                ReferenceType.SecurityScheme,

                            Id = "Bearer"
                        }
                },

                Array.Empty<string>()
            }
        }
    );
});

var app = builder.Build();

// Database Migration and Admin Seeding
using (var scope = app.Services.CreateScope())
{
    var db =
        scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

    db.Database.Migrate();

    if (!db.Users.Any(u => u.Role == "admin"))
    {
        db.Users.Add(
            new Nexhire.Models.User
            {
                FullName = "System Admin",

                Email = "admin@nexhire.com",

                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(
                        "Admin@123"
                    ),

                Role = "admin",

                CreatedAt = DateTime.UtcNow,

                IsActive = true
            }
        );

        db.SaveChanges();

        Console.WriteLine(
            "Default admin seeded: " +
            "admin@nexhire.com / Admin@123"
        );
    }
}

// Middleware
app.UseSwagger();

app.UseSwaggerUI();

app.UseStaticFiles();

app.UseCors("AllowReact");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();