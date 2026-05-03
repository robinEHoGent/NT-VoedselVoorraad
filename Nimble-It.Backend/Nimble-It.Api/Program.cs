using Microsoft.EntityFrameworkCore;
using Nimble_It.Api.Extensions;
using Nimble_It.Persistence.Entities;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Configuration.AddUserSecrets<Program>();

// var connectionString = builder.Configuration.GetConnectionString("DefaultConnectionString");
var connectionString = Environment.GetEnvironmentVariable("MYSQL_CONNECTION_STRING");

builder.Services.AddDbContext<NimbleitDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});
var allowedOrigins =
    Environment
        .GetEnvironmentVariable("Cors__AllowedOrigins")
        ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries) ?? [];
var allowedMethods =
    Environment
        .GetEnvironmentVariable("Cors__AllowedMethods")
        ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries) ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: "Origins",
        policy =>
        {
            policy.WithOrigins(allowedOrigins).AllowAnyMethod().AllowAnyHeader();
        }
    );
});

// services/repos toegevoegd via extensie methode (task 220)
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddApplicationRepositories(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Origins");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
