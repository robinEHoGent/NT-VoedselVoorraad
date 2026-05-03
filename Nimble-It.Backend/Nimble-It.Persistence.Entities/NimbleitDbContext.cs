using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Nimble_It.Persistence.Entities;

public partial class NimbleitDbContext : DbContext
{
    public NimbleitDbContext() { }

    public NimbleitDbContext(DbContextOptions<NimbleitDbContext> options)
        : base(options) { }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Instruction> Instructions { get; set; }

    public virtual DbSet<Inventory> Inventories { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Recipe> Recipes { get; set; }

    public virtual DbSet<RecipeInfo> RecipeInfos { get; set; }

    public virtual DbSet<RecipeTag> RecipeTags { get; set; }

    public virtual DbSet<ShoppingList> ShoppingLists { get; set; }

    public virtual DbSet<StorageType> StorageTypes { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<UnitsOfMeasurement> UnitsOfMeasurements { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("utf8mb4_0900_ai_ci").HasCharSet("utf8mb4");

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("categories");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasMaxLength(30).HasColumnName("name");
            entity.Property(e => e.NotificationTime).HasColumnName("notification_time");
        });

        modelBuilder.Entity<Instruction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("instructions");

            entity.HasIndex(e => e.RecipeId, "recipe_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Header).HasMaxLength(50).HasColumnName("header");
            entity.Property(e => e.RecipeId).HasColumnName("recipe_id");
            entity.Property(e => e.Step).HasColumnName("step");
            entity.Property(e => e.Text).HasColumnType("text").HasColumnName("text");

            entity
                .HasOne(d => d.Recipe)
                .WithMany(p => p.Instructions)
                .HasForeignKey(d => d.RecipeId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("instructions_ibfk_1");
        });

        modelBuilder.Entity<Inventory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("inventories");

            entity.HasIndex(e => e.ProductId, "product_id");

            entity.HasIndex(e => e.StorageTypeId, "storage_type_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity
                .Property(e => e.Amount)
                .HasPrecision(12, 3)
                .HasDefaultValueSql("'0.000'")
                .HasColumnName("amount");
            entity.Property(e => e.ExpiryDate).HasColumnName("expiry_date");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.PurchaseDate).HasColumnName("purchase_date");
            entity.Property(e => e.StorageTypeId).HasColumnName("storage_type_id");

            entity
                .HasOne(d => d.Product)
                .WithMany(p => p.Inventories)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("inventories_ibfk_1");

            entity
                .HasOne(d => d.StorageType)
                .WithMany(p => p.Inventories)
                .HasForeignKey(d => d.StorageTypeId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("inventories_ibfk_2");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("products");

            entity.HasIndex(e => e.CategoryId, "category_id");

            entity.HasIndex(e => e.UomId, "uom_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.ImageUrl).HasMaxLength(200).HasColumnName("image_url");
            entity.Property(e => e.Name).HasMaxLength(30).HasColumnName("name");
            entity.Property(e => e.UomId).HasColumnName("uom_id");

            entity
                .HasOne(d => d.Category)
                .WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("products_ibfk_1");

            entity
                .HasOne(d => d.Uom)
                .WithMany(p => p.Products)
                .HasForeignKey(d => d.UomId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("products_ibfk_2");
        });

        modelBuilder.Entity<Recipe>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("recipes");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Complexity).HasColumnName("complexity");
            entity.Property(e => e.CreatedOn).HasColumnType("datetime").HasColumnName("created_on");
            entity
                .Property(e => e.Description)
                .HasColumnType("tinytext")
                .HasColumnName("description");
            entity.Property(e => e.Favorite).HasColumnName("favorite");
            entity.Property(e => e.ImageUrl).HasMaxLength(200).HasColumnName("image_url");
            entity
                .Property(e => e.LastCooked)
                .HasColumnType("datetime")
                .HasColumnName("last_cooked");
            entity.Property(e => e.Name).HasMaxLength(50).HasColumnName("name");
            entity.Property(e => e.PrepareTime).HasColumnName("prepare_time");
            entity.Property(e => e.ServingSize).HasColumnName("serving_size");
        });

        modelBuilder.Entity<RecipeInfo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("recipe_info");

            entity.HasIndex(e => e.ProductId, "product_id");

            entity.HasIndex(e => e.RecipeId, "recipe_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Amount).HasPrecision(12, 3).HasColumnName("amount");
            entity.Property(e => e.OrderIndex).HasColumnName("order_index");
            entity.Property(e => e.Part).HasColumnName("part");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.RecipeId).HasColumnName("recipe_id");
            entity.Property(e => e.Title).HasMaxLength(50).HasColumnName("title");

            entity
                .HasOne(d => d.Product)
                .WithMany(p => p.RecipeInfos)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("recipe_info_ibfk_2");

            entity
                .HasOne(d => d.Recipe)
                .WithMany(p => p.RecipeInfos)
                .HasForeignKey(d => d.RecipeId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("recipe_info_ibfk_1");
        });

        modelBuilder.Entity<RecipeTag>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("recipe_tags");

            entity.HasIndex(e => e.RecipeId, "recipe_id");

            entity.HasIndex(e => e.TagId, "tag_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RecipeId).HasColumnName("recipe_id");
            entity.Property(e => e.TagId).HasColumnName("tag_id");

            entity
                .HasOne(d => d.Recipe)
                .WithMany(p => p.RecipeTags)
                .HasForeignKey(d => d.RecipeId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("recipe_tags_ibfk_1");

            entity
                .HasOne(d => d.Tag)
                .WithMany(p => p.RecipeTags)
                .HasForeignKey(d => d.TagId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("recipe_tags_ibfk_2");
        });

        modelBuilder.Entity<ShoppingList>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("shopping_list");

            entity.HasIndex(e => e.ProductId, "product_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Amount).HasPrecision(12, 3).HasColumnName("amount");
            entity.Property(e => e.ProductId).HasColumnName("product_id");

            entity
                .HasOne(d => d.Product)
                .WithMany(p => p.ShoppingLists)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("shopping_list_ibfk_1");
        });

        modelBuilder.Entity<StorageType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("storage_types");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasMaxLength(30).HasColumnName("name");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tags");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasMaxLength(50).HasColumnName("name");
        });

        modelBuilder.Entity<UnitsOfMeasurement>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("units_of_measurement");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasMaxLength(10).HasColumnName("name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
