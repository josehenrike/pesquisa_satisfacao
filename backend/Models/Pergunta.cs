using System.Collections.Generic;

namespace PesquisaSatisfacao.API.Models
{
    public class Pergunta
    {
        public int Id { get; set; }
        public string Texto { get; set; }
        public TipoPergunta Tipo { get; set; }
        public string Opcoes { get; set; }
        public int Ordem { get; set; }
        
        // Relacionamentos
        public int PesquisaId { get; set; }
        public Pesquisa Pesquisa { get; set; }
        public ICollection<Resposta> Respostas { get; set; }
    }

    public enum TipoPergunta
    {
        Texto,
        MultiplaEscolha,
        Escala
    }
} 