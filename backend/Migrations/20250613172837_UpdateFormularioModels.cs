using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PesquisaSatisfacao.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFormularioModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Texto",
                table: "Perguntas",
                newName: "Titulo");

            migrationBuilder.RenameColumn(
                name: "Opcoes",
                table: "Perguntas",
                newName: "OpcoesJson");

            migrationBuilder.AddColumn<bool>(
                name: "Obrigatoria",
                table: "Perguntas",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Obrigatoria",
                table: "Perguntas");

            migrationBuilder.RenameColumn(
                name: "Titulo",
                table: "Perguntas",
                newName: "Texto");

            migrationBuilder.RenameColumn(
                name: "OpcoesJson",
                table: "Perguntas",
                newName: "Opcoes");
        }
    }
}
