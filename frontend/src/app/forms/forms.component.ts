import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormService } from '../services/form.service';
import { NotificationService } from '../services/notification.service';

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

  // Modal de confirmação de exclusão
  showDeleteModal = false;
  formToDelete: any = null;

  constructor(
    private formService: FormService,
    private router: Router,
    private notificationService: NotificationService,
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

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.formToDelete = null;
  }

  copyFormLink(form: any) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const baseUrl = window.location.origin;
    const formLink = `${baseUrl}/survey/${form.id}`;

    navigator.clipboard.writeText(formLink).then(() => {
      this.notificationService.success('Link copiado para a área de transferência!');
    }).catch(() => {
      // Fallback para browsers mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = formLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.notificationService.success('Link copiado para a área de transferência!');
    });

    this.showDropdownId = null;
  }

  deleteForm(form: any) {
    this.formToDelete = form;
    this.showDeleteModal = true;
    this.showDropdownId = null;
  }

  confirmDeleteForm() {
    if (this.formToDelete) {
      this.formService.deleteForm(this.formToDelete.id);
      this.loadForms();
      this.notificationService.success('Formulário excluído com sucesso!');
      this.closeDeleteModal();
    }
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
