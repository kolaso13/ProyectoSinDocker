using System;
using System.Text.Json.Serialization;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class TiempoContext : DbContext
    {
        public DbSet<TiempoData> TiempoData { get; set; }
        public string connString { get; private set; }
    
        public TiempoContext()
        {
            connString = $"Server=185.60.40.210\\SQLEXPRESS,58015;Database=DB01Adrian;User Id=sa;Password=Pa88word;MultipleActiveResultSets=true;";
            //connString = $"Server=(localdb)\\mssqllocaldb;Database=DB01AdrianPrueba;Trusted_Connection=True;MultipleActiveResultSets=true";
        }
        protected override void OnConfiguring(DbContextOptionsBuilder options) => options.UseSqlServer(connString);
    }
