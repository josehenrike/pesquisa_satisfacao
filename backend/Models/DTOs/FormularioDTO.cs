using System;
using System.Collections.Generic;

namespace PesquisaSatisfacao.API.Models.DTOs
{
    public class FormularioDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<PerguntaDTO> Questions { get; set; } = new List<PerguntaDTO>();
        public DateTime CreatedAt { get; set; }
        public int Responses { get; set; }
        public bool Ativa { get; set; }
    }

    public class PerguntaDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public List<string> Options { get; set; } = new List<string>();
        public bool Required { get; set; }
    }

    public class CreateFormularioDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<CreatePerguntaDTO> Questions { get; set; } = new List<CreatePerguntaDTO>();
    }

    public class CreatePerguntaDTO
    {
        public string Title { get; set; }
        public string Type { get; set; }
        public List<string> Options { get; set; } = new List<string>();
        public bool Required { get; set; }
    }

    public class RespostaFormularioDTO
    {
        public int FormId { get; set; }
        public Dictionary<int, object> Responses { get; set; } = new Dictionary<int, object>();
    }

    public class EstatisticasDTO
    {
        public int TotalForms { get; set; }
        public int TotalResponses { get; set; }
        public int TotalParticipants { get; set; }
        public string AverageRating { get; set; }
    }

    public class RespostaDetalhadaDTO
    {
        public int Id { get; set; }
        public int FormularioId { get; set; }
        public string FormularioTitulo { get; set; }
        public string ClienteNome { get; set; }
        public string ClienteEmail { get; set; }
        public DateTime DataResposta { get; set; }
        public Dictionary<int, object> Respostas { get; set; } = new Dictionary<int, object>();
    }
} 