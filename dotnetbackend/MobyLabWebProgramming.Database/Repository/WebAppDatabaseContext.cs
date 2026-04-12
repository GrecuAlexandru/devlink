using Microsoft.EntityFrameworkCore;
using MobyLabWebProgramming.Database.Repository.Entities;
using MobyLabWebProgramming.Infrastructure.Extensions;

namespace MobyLabWebProgramming.Database.Repository;

/// <summary>
/// This is the database context used to connect with the database and links the ORM, Entity Framework, with it.
/// </summary>
public sealed class WebAppDatabaseContext(DbContextOptions<WebAppDatabaseContext> options, IServiceProvider serviceProvider) : DbContext(options)
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<UserProfile> UserProfiles { get; set; } = null!;
    public DbSet<Company> Companies { get; set; } = null!;
    public DbSet<CompanyMember> CompanyMembers { get; set; } = null!;
    public DbSet<JobPost> JobPosts { get; set; } = null!;
    public DbSet<Application> Applications { get; set; } = null!;
    public DbSet<Post> Posts { get; set; } = null!;
    public DbSet<Comment> Comments { get; set; } = null!;
    public DbSet<PostLike> PostLikes { get; set; } = null!;
    public DbSet<PostImage> PostImages { get; set; } = null!;
    public DbSet<Connection> Connections { get; set; } = null!;
    public DbSet<Feedback> Feedbacks { get; set; } = null!;

    /// <summary>
    /// Here additional configuration for the ORM is performed.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasPostgresExtension("unaccent")
            .ApplyConfigurationsFromAssemblies([], serviceProvider);

        modelBuilder.Entity<Connection>(entity =>
        {
            entity.HasOne(c => c.Requester)
                .WithMany(u => u.SentConnections)
                .HasForeignKey(c => c.RequesterId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Receiver)
                .WithMany(u => u.ReceivedConnections)
                .HasForeignKey(c => c.ReceiverId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}