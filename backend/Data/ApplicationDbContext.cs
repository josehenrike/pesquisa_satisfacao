using Microsoft.EntityFrameworkCore;
using PesquisaSatisfacao.API.Models;

namespace PesquisaSatisfacao.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Pesquisa> Pesquisas { get; set; }
        public DbSet<Pergunta> Perguntas { get; set; }
        public DbSet<Resposta> Respostas { get; set; }
        public DbSet<Cliente> Clientes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração da entidade Pesquisa
            modelBuilder.Entity<Pesquisa>()
                .HasMany(p => p.Perguntas)
                .WithOne(p => p.Pesquisa)
                .HasForeignKey(p => p.PesquisaId);

            // Configuração da entidade Resposta
            modelBuilder.Entity<Resposta>()
                .HasOne(r => r.Pesquisa)
                .WithMany(p => p.Respostas)
                .HasForeignKey(r => r.PesquisaId);

            modelBuilder.Entity<Resposta>()
                .HasOne(r => r.Pergunta)
                .WithMany(p => p.Respostas)
                .HasForeignKey(r => r.PerguntaId);
        }
    }
} 