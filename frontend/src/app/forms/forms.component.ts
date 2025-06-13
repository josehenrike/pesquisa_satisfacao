import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent implements OnInit {
  forms: any[] = [];
  selectedForm: any = null;
  showFormModal = false;
  showDropdownId: number | null = null;

  constructor(
    private formService: FormService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.loadForms();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Fecha o dropdown se clicar fora dele
    this.showDropdownId = null;
  }

  loadForms() {
    this.forms = this.formService.getForms();
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

  toggleDropdown(formId: number, event: Event) {
    event.stopPropagation();
    this.showDropdownId = this.showDropdownId === formId ? null : formId;
  }

  viewForm(form: any) {
    this.selectedForm = form;
    this.showFormModal = true;
    this.showDropdownId = null;
  }

  closeModal() {
    this.showFormModal = false;
    this.selectedForm = null;
  }

  copyFormLink(form: any) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const baseUrl = window.location.origin;
    const formLink = `${baseUrl}/survey/${form.id}`;

    navigator.clipboard.writeText(formLink).then(() => {
      alert('Link copiado para a área de transferência!');
    }).catch(() => {
      // Fallback para browsers mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = formLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copiado para a área de transferência!');
    });

    this.showDropdownId = null;
  }

  deleteForm(form: any) {
    if (confirm(`Tem certeza que deseja excluir o formulário "${form.title}"?`)) {
      this.formService.deleteForm(form.id);
      this.loadForms();
      alert('Formulário excluído com sucesso!');
    }
    this.showDropdownId = null;
  }

  createNewForm() {
    this.router.navigate(['/dashboard/create-form']);
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
