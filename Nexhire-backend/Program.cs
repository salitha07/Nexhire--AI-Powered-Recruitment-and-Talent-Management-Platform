using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Nexhire.Data;
using Nexhire.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));


// JWT

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

        IssuerSigningKey =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!)
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
builder.Services.AddScoped<AIService>();


// OpenRouter Client

builder.Services.AddHttpClient("OpenRouter", client =>
{
    client.BaseAddress =
        new Uri("https://openrouter.ai/api/v1/");

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


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db =
        scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.Migrate();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseStaticFiles();

app.UseCors("AllowReact");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();