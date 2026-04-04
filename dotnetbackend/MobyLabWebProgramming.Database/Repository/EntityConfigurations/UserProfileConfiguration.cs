using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MobyLabWebProgramming.Database.Repository.Entities;

namespace MobyLabWebProgramming.Database.Repository.EntityConfigurations;

public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.Property(e => e.Id)
            .IsRequired();

        builder.HasKey(x => x.Id);

        builder.Property(e => e.Bio)
            .HasMaxLength(2000);
        
        builder.Property(e => e.ProfilePictureUrl)
            .HasMaxLength(512);
        
        builder.Property(e => e.LinkedInUrl)
            .HasMaxLength(255);
        
        builder.Property(e => e.GitHubUrl)
            .HasMaxLength(255);
        
        builder.Property(e => e.CreatedAt)
            .IsRequired();
        
        builder.Property(e => e.UpdatedAt)
            .IsRequired();

        builder.HasOne(e => e.User)
            .WithOne(e => e.Profile)
            .HasForeignKey<UserProfile>(e => e.UserId)
            .HasPrincipalKey<User>(e => e.Id)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}