using System;

namespace PesquisaSatisfacao.API.Models
{
    public class Resposta
    {
        public int Id { get; set; }
        public string Valor { get; set; }
        public DateTime DataResposta { get; set; }
        
        // Relacionamentos
        public int PesquisaId { get; set; }
        public Pesquisa Pesquisa { get; set; }
        
        public int PerguntaId { get; set; }
        public Pergunta Pergunta { get; set; }
        
        public int? ClienteId { get; set; }
        public Cliente Cliente { get; set; }
    }
} 