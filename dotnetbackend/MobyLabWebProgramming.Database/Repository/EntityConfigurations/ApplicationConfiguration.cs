using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MobyLabWebProgramming.Database.Repository.Entities;
using MobyLabWebProgramming.Database.Repository.Enums;

namespace MobyLabWebProgramming.Database.Repository.EntityConfigurations;

public class ApplicationConfiguration : IEntityTypeConfiguration<Application>
{
    public void Configure(EntityTypeBuilder<Application> builder)
    {
        builder.Property(e => e.Id)
            .IsRequired();
        
        builder.HasKey(x => x.Id);
        builder.Property(e => e.Status)
            .HasConversion(new EnumToStringConverter<ApplicationStatusEnum>())
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(e => e.CreatedAt)
            .IsRequired();
        
        builder.Property(e => e.UpdatedAt)
            .IsRequired();
        

        builder.HasOne(e => e.User)
            .WithMany(e => e.Applications)
            .HasForeignKey(e => e.UserId)
            .HasPrincipalKey(e => e.Id)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.JobPost)
            .WithMany(e => e.Applications)
            .HasForeignKey(e => e.JobPostId)
            .HasPrincipalKey(e => e.Id)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}
