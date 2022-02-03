using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiTiempoProyecto.Models;

namespace WebApiTiempoProyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TiempoController : ControllerBase
    {
        private readonly TiempoContext _context;

        public TiempoController(TiempoContext context)
        {
            _context = context;
        }

        // GET: api/Tiempo
        [Autohorrize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TiempoData>>> GetTiempoData()
        {
            return await _context.TiempoData.ToListAsync();
        }

        // GET: api/Tiempo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TiempoData>> GetTiempoData(string id)
        {
            var tiempoData = await _context.TiempoData.FindAsync(id);

            if (tiempoData == null)
            {
                return NotFound();
            }

            return tiempoData;
        }

        // PUT: api/Tiempo/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTiempoData(string id, TiempoData tiempoData)
        {
            if (id != tiempoData.Id)
            {
                return BadRequest();
            }

            _context.Entry(tiempoData).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TiempoDataExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Tiempo
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TiempoData>> PostTiempoData(TiempoData tiempoData)
        {
            _context.TiempoData.Add(tiempoData);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TiempoDataExists(tiempoData.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTiempoData", new { id = tiempoData.Id }, tiempoData);
        }

        // DELETE: api/Tiempo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTiempoData(string id)
        {
            var tiempoData = await _context.TiempoData.FindAsync(id);
            if (tiempoData == null)
            {
                return NotFound();
            }

            _context.TiempoData.Remove(tiempoData);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TiempoDataExists(string id)
        {
            return _context.TiempoData.Any(e => e.Id == id);
        }
    }
}
