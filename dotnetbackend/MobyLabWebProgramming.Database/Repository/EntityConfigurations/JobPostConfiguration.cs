using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MobyLabWebProgramming.Database.Repository.Entities;

namespace MobyLabWebProgramming.Database.Repository.EntityConfigurations;

public class JobPostConfiguration : IEntityTypeConfiguration<JobPost>
{
    public void Configure(EntityTypeBuilder<JobPost> builder)
    {
        builder.Property(e => e.Id)
            .IsRequired();
        builder.HasKey(x => x.Id);
        builder.Property(e => e.Title)
            .HasMaxLength(255)
            .IsRequired();
        builder.Property(e => e.Description)
            .HasMaxLength(5000);
        builder.Property(e => e.Location)
            .HasMaxLength(255);
        builder.Property(e => e.Salary)
            .IsRequired(false);
        builder.Property(e => e.CreatedAt)
            .IsRequired();
        builder.Property(e => e.UpdatedAt)
            .IsRequired();

        builder.HasOne(e => e.Company)
            .WithMany(e => e.JobPosts)
            .HasForeignKey(e => e.CompanyId)
            .HasPrincipalKey(e => e.Id)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}
