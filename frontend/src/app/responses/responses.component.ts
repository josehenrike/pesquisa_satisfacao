import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormService, FormularioDTO, RespostaDetalhadaDTO } from '../services/form.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-responses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './responses.component.html',
  styleUrl: './responses.component.scss'
})
export class ResponsesComponent implements OnInit {
  formularios: FormularioDTO[] = [];
  respostas: RespostaDetalhadaDTO[] = [];
  filteredRespostas: RespostaDetalhadaDTO[] = [];
  selectedResposta: RespostaDetalhadaDTO | null = null;
  selectedFormulario: FormularioDTO | null = null;
  showResponseModal = false;
  loading = true;
  searchTerm = '';

  constructor(
    private formService: FormService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    // Carregar formulários
    this.formService.getForms().subscribe({
      next: (forms) => {
        this.formularios = forms;
        this.loadRespostas();
      },
      error: (error) => {
        console.error('Erro ao carregar formulários:', error);
        this.notificationService.error('Erro ao carregar formulários');
        this.loading = false;
      }
    });
  }

  loadRespostas() {
    this.formService.getRespostas().subscribe({
      next: (respostas) => {
        this.respostas = respostas;
        this.filteredRespostas = respostas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar respostas:', error);
        this.notificationService.error('Erro ao carregar respostas');
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  viewResponse(resposta: RespostaDetalhadaDTO) {
    this.selectedResposta = resposta;

    // Buscar o formulário completo para mostrar as perguntas
    this.selectedFormulario = this.formularios.find(f => f.id === resposta.formularioId) || null;

    this.showResponseModal = true;
  }

  closeModal() {
    this.showResponseModal = false;
    this.selectedResposta = null;
    this.selectedFormulario = null;
  }

  getQuestionTitle(questionId: number): string {
    if (!this.selectedFormulario) return `Pergunta ${questionId}`;

    const question = this.selectedFormulario.questions.find(q => q.id === questionId);
    return question ? question.title : `Pergunta ${questionId}`;
  }

  getQuestionType(questionId: number): string {
    if (!this.selectedFormulario) return 'text';

    const question = this.selectedFormulario.questions.find(q => q.id === questionId);
    return question ? question.type : 'text';
  }

  formatResponse(value: any, type: string): string {
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    if (type === 'rating') {
      return `${value}/5 ⭐`;
    }

    return value?.toString() || '-';
  }

  getFormularioTitle(formularioId: number): string {
    const form = this.formularios.find(f => f.id === formularioId);
    return form ? form.title : `Formulário ${formularioId}`;
  }

  getResponsesCount(formularioId: number): number {
    return this.respostas.filter(r => r.formularioId === formularioId).length;
  }

  getUniqueFormularios(): number[] {
    const ids = this.respostas.map(r => r.formularioId);
    return [...new Set(ids)];
  }

  filterResponses() {
    if (!this.searchTerm.trim()) {
      this.filteredRespostas = this.respostas;
      return;
    }

    const search = this.searchTerm.toLowerCase().trim();
    this.filteredRespostas = this.respostas.filter(resposta => {
      return (
        resposta.formularioTitulo.toLowerCase().includes(search) ||
        resposta.clienteNome.toLowerCase().includes(search) ||
        resposta.clienteEmail.toLowerCase().includes(search)
      );
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredRespostas = this.respostas;
  }
}
