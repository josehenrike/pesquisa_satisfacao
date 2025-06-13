import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { FormService, CreateFormularioDTO } from '../services/form.service';

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
    private formService: FormService,
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
    const formData: CreateFormularioDTO = {
      title: this.formTitle,
      description: this.formDescription,
      questions: this.questions.map(q => ({
        title: q.title,
        type: q.type,
        options: q.options || [],
        required: q.required
      }))
    };

    this.formService.saveForm(formData).subscribe({
      next: (response) => {
        console.log('Formulário salvo:', response);
        this.notificationService.success('Formulário criado com sucesso!');
        // Voltar para o dashboard principal
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erro ao salvar formulário:', error);
        this.notificationService.error('Erro ao criar formulário');
      }
    });
  }

  cancel() {
    // Voltar para o dashboard principal
    this.router.navigate(['/dashboard']);
  }
}
