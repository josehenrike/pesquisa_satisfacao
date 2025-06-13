using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PesquisaSatisfacao.API.Data;
using PesquisaSatisfacao.API.Models;
using PesquisaSatisfacao.API.Models.DTOs;
using System.Text.Json;

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
        public async Task<ActionResult<IEnumerable<FormularioDTO>>> GetPesquisas()
        {
            var pesquisas = await _context.Pesquisas
                .Include(p => p.Perguntas)
                .ToListAsync();

            var formularios = new List<FormularioDTO>();

            foreach (var p in pesquisas)
            {
                // Contar formulários únicos respondidos para esta pesquisa
                var respostasUnicas = await _context.Respostas
                    .Where(r => r.PesquisaId == p.Id)
                    .Select(r => r.ClienteId)
                    .Distinct()
                    .CountAsync();

                formularios.Add(new FormularioDTO
                {
                    Id = p.Id,
                    Title = p.Titulo,
                    Description = p.Descricao,
                    CreatedAt = p.DataCriacao,
                    Responses = respostasUnicas,
                    Ativa = p.Ativa,
                    Questions = p.Perguntas?.Select(pg => new PerguntaDTO
                    {
                        Id = pg.Id,
                        Title = pg.Titulo,
                        Type = pg.Tipo.ToString().ToLower(),
                        Required = pg.Obrigatoria,
                        Options = pg.Opcoes
                    }).ToList() ?? new List<PerguntaDTO>()
                });
            }

            return formularios;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FormularioDTO>> GetPesquisa(int id)
        {
            var pesquisa = await _context.Pesquisas
                .Include(p => p.Perguntas)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pesquisa == null)
            {
                return NotFound();
            }

            // Contar formulários únicos respondidos para esta pesquisa
            var respostasUnicas = await _context.Respostas
                .Where(r => r.PesquisaId == id)
                .Select(r => r.ClienteId)
                .Distinct()
                .CountAsync();

            var formulario = new FormularioDTO
            {
                Id = pesquisa.Id,
                Title = pesquisa.Titulo,
                Description = pesquisa.Descricao,
                CreatedAt = pesquisa.DataCriacao,
                Responses = respostasUnicas,
                Ativa = pesquisa.Ativa,
                Questions = pesquisa.Perguntas?.Select(pg => new PerguntaDTO
                {
                    Id = pg.Id,
                    Title = pg.Titulo,
                    Type = pg.Tipo.ToString().ToLower(),
                    Required = pg.Obrigatoria,
                    Options = pg.Opcoes
                }).ToList() ?? new List<PerguntaDTO>()
            };

            return formulario;
        }

        [HttpPost]
        public async Task<ActionResult<FormularioDTO>> PostPesquisa(CreateFormularioDTO createFormularioDto)
        {
            var pesquisa = new Pesquisa
            {
                Titulo = createFormularioDto.Title,
                Descricao = createFormularioDto.Description,
                DataCriacao = DateTime.UtcNow,
                Ativa = true,
                LinkUnico = Guid.NewGuid().ToString(),
                Perguntas = createFormularioDto.Questions.Select((q, index) => new Pergunta
                {
                    Titulo = q.Title,
                    Tipo = Enum.Parse<TipoPergunta>(q.Type, true),
                    Obrigatoria = q.Required,
                    Ordem = index + 1,
                    Opcoes = q.Options
                }).ToList()
            };

            _context.Pesquisas.Add(pesquisa);
            await _context.SaveChangesAsync();

            var result = new FormularioDTO
            {
                Id = pesquisa.Id,
                Title = pesquisa.Titulo,
                Description = pesquisa.Descricao,
                CreatedAt = pesquisa.DataCriacao,
                Responses = 0,
                Ativa = pesquisa.Ativa,
                Questions = pesquisa.Perguntas.Select(pg => new PerguntaDTO
                {
                    Id = pg.Id,
                    Title = pg.Titulo,
                    Type = pg.Tipo.ToString().ToLower(),
                    Required = pg.Obrigatoria,
                    Options = pg.Opcoes
                }).ToList()
            };

            return CreatedAtAction("GetPesquisa", new { id = pesquisa.Id }, result);
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

        [HttpPost("{id}/respostas")]
        public async Task<ActionResult> PostResposta(int id, RespostaFormularioDTO respostaDto)
        {
            var pesquisa = await _context.Pesquisas
                .Include(p => p.Perguntas)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pesquisa == null)
            {
                return NotFound();
            }

            // Extrair nome e email das respostas
            string nomeCliente = "Anônimo";
            string emailCliente = $"anonimo_{Guid.NewGuid()}@temp.com";

            foreach (var pergunta in pesquisa.Perguntas)
            {
                if (respostaDto.Responses.ContainsKey(pergunta.Id))
                {
                    var valorResposta = respostaDto.Responses[pergunta.Id]?.ToString() ?? "";
                    
                    // Detectar pergunta de nome (por tipo ou título)
                    if (pergunta.Tipo == TipoPergunta.Text && 
                        (pergunta.Titulo.ToLower().Contains("nome") || 
                         pergunta.Titulo.ToLower().Contains("name")))
                    {
                        if (!string.IsNullOrWhiteSpace(valorResposta))
                        {
                            nomeCliente = valorResposta.Trim();
                        }
                    }
                    
                    // Detectar pergunta de email (por tipo ou título)
                    if (pergunta.Tipo == TipoPergunta.Email || 
                        (pergunta.Titulo.ToLower().Contains("email") || 
                         pergunta.Titulo.ToLower().Contains("e-mail")))
                    {
                        if (!string.IsNullOrWhiteSpace(valorResposta) && valorResposta.Contains("@"))
                        {
                            emailCliente = valorResposta.Trim();
                        }
                    }
                }
            }

            // Verificar se já existe um cliente com esse email
            var clienteExistente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.Email == emailCliente);

            Cliente cliente;
            if (clienteExistente != null)
            {
                // Atualizar nome se fornecido e diferente de "Anônimo"
                if (nomeCliente != "Anônimo" && clienteExistente.Nome == "Anônimo")
                {
                    clienteExistente.Nome = nomeCliente;
                }
                cliente = clienteExistente;
            }
            else
            {
                // Criar novo cliente
                cliente = new Cliente
                {
                    Nome = nomeCliente,
                    Email = emailCliente,
                    DataCadastro = DateTime.UtcNow
                };
                _context.Clientes.Add(cliente);
            }

            await _context.SaveChangesAsync();

            // Criar respostas para cada pergunta
            foreach (var resposta in respostaDto.Responses)
            {
                var perguntaId = resposta.Key;
                var valor = JsonSerializer.Serialize(resposta.Value);

                var novaResposta = new Resposta
                {
                    PesquisaId = id,
                    PerguntaId = perguntaId,
                    ClienteId = cliente.Id,
                    Valor = valor,
                    DataResposta = DateTime.UtcNow
                };

                _context.Respostas.Add(novaResposta);
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Resposta enviada com sucesso!" });
        }

        [HttpGet("estatisticas")]
        public async Task<ActionResult<EstatisticasDTO>> GetEstatisticas()
        {
            var totalForms = await _context.Pesquisas.CountAsync();
            
            // Contar formulários respondidos únicos (por combinação de PesquisaId e ClienteId)
            var totalResponses = await _context.Respostas
                .Select(r => new { r.PesquisaId, r.ClienteId })
                .Distinct()
                .CountAsync();
                
            var totalParticipants = await _context.Clientes.CountAsync();

            // Calcular média real de avaliação baseada nas respostas de rating
            string averageRating = "-";
            
            var respostasRating = await _context.Respostas
                .Include(r => r.Pergunta)
                .Where(r => r.Pergunta.Tipo == TipoPergunta.Rating)
                .ToListAsync();

            if (respostasRating.Any())
            {
                var avaliacoes = new List<double>();
                
                foreach (var resposta in respostasRating)
                {
                    try
                    {
                        var valorJson = resposta.Valor;
                        // Deserializar o valor (pode ser um número ou string)
                        var valorObj = JsonSerializer.Deserialize<object>(valorJson);
                        
                        double valor = 0;
                        if (valorObj != null)
                        {
                            if (double.TryParse(valorObj.ToString(), out valor))
                            {
                                avaliacoes.Add(valor);
                            }
                        }
                    }
                    catch
                    {
                        // Ignorar valores inválidos
                        continue;
                    }
                }
                
                if (avaliacoes.Any())
                {
                    var media = avaliacoes.Average();
                    averageRating = media.ToString("F1"); // Formato com 1 casa decimal
                }
            }

            var estatisticas = new EstatisticasDTO
            {
                TotalForms = totalForms,
                TotalResponses = totalResponses,
                TotalParticipants = totalParticipants,
                AverageRating = averageRating
            };

            return estatisticas;
        }

        [HttpGet("respostas")]
        public async Task<ActionResult<IEnumerable<RespostaDetalhadaDTO>>> GetRespostas()
        {
            var respostasRaw = await _context.Respostas
                .Include(r => r.Pesquisa)
                .Include(r => r.Cliente)
                .Include(r => r.Pergunta)
                .ToListAsync();

            var respostasAgrupadas = respostasRaw
                .GroupBy(r => new { r.PesquisaId, r.ClienteId })
                .Select(g => new RespostaDetalhadaDTO
                {
                    Id = g.First().ClienteId ?? 0,
                    FormularioId = g.Key.PesquisaId,
                    FormularioTitulo = g.First().Pesquisa.Titulo,
                    ClienteNome = g.First().Cliente.Nome,
                    ClienteEmail = g.First().Cliente.Email,
                    DataResposta = g.First().DataResposta,
                    Respostas = g.ToDictionary(
                        r => r.PerguntaId,
                        r => JsonSerializer.Deserialize<object>(r.Valor) ?? string.Empty
                    )
                })
                .ToList();

            return Ok(respostasAgrupadas);
        }

        private bool PesquisaExists(int id)
        {
            return _context.Pesquisas.Any(e => e.Id == id);
        }
    }
} 