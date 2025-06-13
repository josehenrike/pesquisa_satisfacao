using System;
using System.Collections.Generic;

namespace PesquisaSatisfacao.API.Models
{
    public class Pesquisa
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public DateTime DataCriacao { get; set; }
        public bool Ativa { get; set; }
        public string LinkUnico { get; set; }
        
        // Relacionamentos
        public ICollection<Pergunta> Perguntas { get; set; }
        public ICollection<Resposta> Respostas { get; set; }
    }
} 