using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PesquisaSatisfacao.API.Data;
using PesquisaSatisfacao.API.Models;

namespace PesquisaSatisfacao.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RespostasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RespostasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Resposta>>> GetRespostas()
        {
            return await _context.Respostas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Resposta>> GetResposta(int id)
        {
            var resposta = await _context.Respostas.FindAsync(id);

            if (resposta == null)
            {
                return NotFound();
            }

            return resposta;
        }

        [HttpPost]
        public async Task<ActionResult<Resposta>> PostResposta(Resposta resposta)
        {
            _context.Respostas.Add(resposta);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetResposta", new { id = resposta.Id }, resposta);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutResposta(int id, Resposta resposta)
        {
            if (id != resposta.Id)
            {
                return BadRequest();
            }

            _context.Entry(resposta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RespostaExists(id))
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
        public async Task<IActionResult> DeleteResposta(int id)
        {
            var resposta = await _context.Respostas.FindAsync(id);
            if (resposta == null)
            {
                return NotFound();
            }

            _context.Respostas.Remove(resposta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RespostaExists(int id)
        {
            return _context.Respostas.Any(e => e.Id == id);
        }
    }
} 