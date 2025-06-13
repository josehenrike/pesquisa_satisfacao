using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PesquisaSatisfacao.API.Data;
using PesquisaSatisfacao.API.Models;

namespace PesquisaSatisfacao.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PesquisasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PesquisasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pesquisa>>> GetPesquisas()
        {
            return await _context.Pesquisas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Pesquisa>> GetPesquisa(int id)
        {
            var pesquisa = await _context.Pesquisas.FindAsync(id);

            if (pesquisa == null)
            {
                return NotFound();
            }

            return pesquisa;
        }

        [HttpPost]
        public async Task<ActionResult<Pesquisa>> PostPesquisa(Pesquisa pesquisa)
        {
            _context.Pesquisas.Add(pesquisa);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPesquisa", new { id = pesquisa.Id }, pesquisa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPesquisa(int id, Pesquisa pesquisa)
        {
            if (id != pesquisa.Id)
            {
                return BadRequest();
            }

            _context.Entry(pesquisa).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PesquisaExists(id))
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePesquisa(int id)
        {
            var pesquisa = await _context.Pesquisas.FindAsync(id);
            if (pesquisa == null)
            {
                return NotFound();
            }

            _context.Pesquisas.Remove(pesquisa);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PesquisaExists(int id)
        {
            return _context.Pesquisas.Any(e => e.Id == id);
        }
    }
} 