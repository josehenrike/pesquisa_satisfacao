import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../services/form.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.scss'
})
export class SurveyComponent implements OnInit {
  form: any = null;
  responses: any = {};
  loading = true;
  submitted = false;
  formNotFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const formId = parseInt(params['id']);
      this.loadForm(formId);
    });
  }

  loadForm(formId: number) {
    this.form = this.formService.getFormById(formId);

    if (this.form) {
      this.initializeResponses();
      this.loading = false;
    } else {
      this.formNotFound = true;
      this.loading = false;
    }
  }

  initializeResponses() {
    this.form.questions.forEach((question: any) => {
      if (question.type === 'checkbox') {
        this.responses[question.id] = [];
      } else {
        this.responses[question.id] = '';
      }
    });
  }

  onCheckboxChange(questionId: number, option: string, event: any) {
    if (!this.responses[questionId]) {
      this.responses[questionId] = [];
    }

    if (event.target.checked) {
      this.responses[questionId].push(option);
    } else {
      const index = this.responses[questionId].indexOf(option);
      if (index > -1) {
        this.responses[questionId].splice(index, 1);
      }
    }
  }

  isFormValid(): boolean {
    for (let question of this.form.questions) {
      if (question.required) {
        const response = this.responses[question.id];
        if (!response || (Array.isArray(response) && response.length === 0)) {
          return false;
        }
      }
    }
    return true;
  }

  submitForm() {
    if (!this.isFormValid()) {
      this.notificationService.warning('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Salvar resposta usando o FormService
    this.formService.saveFormResponse(this.form.id, this.responses);

    this.submitted = true;
    this.notificationService.success('Resposta enviada com sucesso!');
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getQuestionTypeLabel(type: string): string {
    const types = {
      'text': 'Texto',
      'number': 'Número',
      'email': 'Email',
      'radio': 'Múltipla Escolha',
      'checkbox': 'Seleção Múltipla',
      'textarea': 'Texto Longo',
      'rating': 'Avaliação (1-5)'
    };
    return types[type as keyof typeof types] || type;
  }
}
