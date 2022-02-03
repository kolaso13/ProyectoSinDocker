using Microsoft.EntityFrameworkCore;

namespace WebApiTiempoProyecto.Models
{
    public class TiempoContext : DbContext
    {
        public TiempoContext(DbContextOptions<TiempoContext> options)
            : base(options)
        {
        }

        public DbSet<TiempoData> TiempoData { get; set; }
        public DbSet<User> Usuarios { get; set; }
    }
}