import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.scss'
})
export class CreateFormComponent {
  formTitle = '';
  formDescription = '';
  questions: any[] = [];

  questionTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'email', label: 'Email' },
    { value: 'radio', label: 'Múltipla Escolha' },
    { value: 'checkbox', label: 'Seleção Múltipla' },
    { value: 'textarea', label: 'Texto Longo' },
    { value: 'rating', label: 'Avaliação (1-5)' }
  ];

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  addQuestion() {
    this.questions.push({
      id: this.questions.length + 1,
      title: '',
      type: 'text',
      required: false,
      options: []
    });
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  addOption(questionIndex: number) {
    if (!this.questions[questionIndex].options) {
      this.questions[questionIndex].options = [];
    }
    this.questions[questionIndex].options.push('');
  }

  removeOption(questionIndex: number, optionIndex: number) {
    this.questions[questionIndex].options.splice(optionIndex, 1);
  }

  // Função trackBy para evitar recriação dos elementos
  trackByQuestionIndex(index: number, item: any): number {
    return index;
  }

  trackByOptionIndex(index: number, item: any): number {
    return index;
  }

  // Função para atualizar opção específica
  updateOption(questionIndex: number, optionIndex: number, event: Event) {
    const target = event.target as HTMLInputElement;
    this.questions[questionIndex].options[optionIndex] = target.value;
  }

  saveForm() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const formData = {
      id: Date.now(), // ID único baseado no timestamp
      title: this.formTitle,
      description: this.formDescription,
      questions: this.questions,
      createdAt: new Date().toISOString(),
      responses: 0 // Contador de respostas
    };

    // Buscar formulários existentes
    const existingForms = JSON.parse(localStorage.getItem('forms') || '[]');

    // Adicionar novo formulário
    existingForms.push(formData);

    // Salvar de volta no localStorage
    localStorage.setItem('forms', JSON.stringify(existingForms));

    console.log('Formulário salvo:', formData);
    this.notificationService.success('Formulário criado com sucesso!');

    // Voltar para o dashboard principal
    this.router.navigate(['/dashboard']);
  }

  cancel() {
    // Voltar para o dashboard principal
    this.router.navigate(['/dashboard']);
  }
}
