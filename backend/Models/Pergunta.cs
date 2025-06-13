using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace PesquisaSatisfacao.API.Models
{
    public class Pergunta
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public TipoPergunta Tipo { get; set; }
        public string OpcoesJson { get; set; }
        public bool Obrigatoria { get; set; }
        public int Ordem { get; set; }
        
        // Propriedade não mapeada para facilitar serialização
        [NotMapped]
        public List<string> Opcoes 
        { 
            get => string.IsNullOrEmpty(OpcoesJson) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(OpcoesJson);
            set => OpcoesJson = JsonSerializer.Serialize(value);
        }
        
        // Relacionamentos
        public int PesquisaId { get; set; }
        public Pesquisa Pesquisa { get; set; }
        public ICollection<Resposta> Respostas { get; set; }
    }

    public enum TipoPergunta
    {
        Text,      // text
        Number,    // number
        Email,     // email
        Radio,     // radio (multiple choice)
        Checkbox,  // checkbox (multiple selection)
        Textarea,  // textarea (long text)
        Rating     // rating (1-5)
    }
} 