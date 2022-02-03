using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApiTiempoProyecto.Models
{
    public class TiempoData
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Id { get; set; }
        public string Nombre { get; set; }
        public string Municipio { get; set; }
        public string Provincia { get; set; }
        public string Temperatura { get; set; }
        public string Humedad { get; set; }
        public string Viento { get; set; }
        public string Precipitacion { get; set; }
        public string GpxX { get; set; }
        public string GpxY { get; set; }
        public string TipoEstacion { get; set; } 
    }

}