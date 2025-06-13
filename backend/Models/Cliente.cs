using System;
using System.Collections.Generic;

namespace PesquisaSatisfacao.API.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public DateTime DataCadastro { get; set; }
        
        // Relacionamentos
        public ICollection<Resposta> Respostas { get; set; }
    }
} 