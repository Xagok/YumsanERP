using Microsoft.EntityFrameworkCore;
using YumsanERP.Models;

namespace YumsanERP.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<JobOrder> JobOrders { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Employee> Employees { get; set; }

         protected override void OnModelCreating(ModelBuilder modelBuilder)
         {
        //     // Configure one-to-many relationship between Customer and JobOrder
             modelBuilder.Entity<JobOrder>()
                 .HasOne(j => j.Customer)
                 .WithMany()
                 .HasForeignKey(j => j.CustomerId)
                 .OnDelete(DeleteBehavior.Restrict); // Prevent cascading deletes
             modelBuilder.Entity<JobOrder>()
                 .HasOne(j => j.Employee)
                 .WithMany()
                 .HasForeignKey(j => j.EmployeeId)
                 .OnDelete(DeleteBehavior.Restrict); // Prevent cascading deletes

        //     // Configure self-referencing relationship for OrderedBy
        //     modelBuilder.Entity<JobOrder>()
        //         .HasOne(j => j.Contact)
        //         .WithMany()
        //         .HasForeignKey(j => j.OrderedById)
        //         .OnDelete(DeleteBehavior.Restrict); // Prevent cascading deletes
         }
    }
}
