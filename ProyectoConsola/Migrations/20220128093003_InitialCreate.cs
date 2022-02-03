using Microsoft.EntityFrameworkCore.Migrations;

namespace ConsoleApp1.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TiempoData",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Municipio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Provincia = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Temperatura = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Humedad = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Viento = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Precipitacion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GpxX = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GpxY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TipoEstacion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiempoData", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TiempoData");
        }
    }
}
