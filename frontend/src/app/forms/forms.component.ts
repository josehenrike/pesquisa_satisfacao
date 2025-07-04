import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormService, FormularioDTO } from '../services/form.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent implements OnInit {
  forms: FormularioDTO[] = [];
  selectedForm: FormularioDTO | null = null;
  showFormModal = false;
  showDropdownId: number | null = null;

  showDeleteModal = false;
  formToDelete: FormularioDTO | null = null;

  dropdownPosition = { top: 0, left: 0 };

  //#region Constructor

  constructor(
    private formService: FormService,
    private router: Router,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    this.loadForms();
  }

  //#endregion

  //#region Public Methods

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: Event) {
    this.showDropdownId = null;
  }

  public toggleDropdown(formId: number, event: Event) {
    event.stopPropagation();

    if (this.showDropdownId === formId) {
      this.showDropdownId = null;
      return;
    }

    // Calcular posição do dropdown
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    // Posicionar o dropdown logo abaixo do botão
    this.dropdownPosition = {
      top: rect.bottom + window.scrollY,
      left: rect.right - 150 + window.scrollX
    };

    // Verificar se o dropdown vai sair da tela e ajustar
    if (this.dropdownPosition.left < 10) {
      this.dropdownPosition.left = 10;
    }

    const windowWidth = window.innerWidth;
    if (this.dropdownPosition.left + 150 > windowWidth - 10) {
      this.dropdownPosition.left = windowWidth - 160;
    }

    this.showDropdownId = formId;
  }

  public viewForm(form: FormularioDTO) {
    this.selectedForm = form;
    this.showFormModal = true;
    this.showDropdownId = null;
  }

  public closeModal() {
    this.showFormModal = false;
    this.selectedForm = null;
  }

  public closeDeleteModal() {
    this.showDeleteModal = false;
    this.formToDelete = null;
  }

  public copyFormLink(form: FormularioDTO) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const baseUrl = window.location.origin;
    const formLink = `${baseUrl}/survey/${form.id}`;

    navigator.clipboard.writeText(formLink).then(() => {
      this.notificationService.success('Link copiado para a área de transferência!');
    }).catch(() => {
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

  public deleteForm(form: FormularioDTO) {
    this.formToDelete = form;
    this.showDeleteModal = true;
    this.showDropdownId = null;
  }

  public confirmDeleteForm() {
    if (this.formToDelete) {
      this.formService.deleteForm(this.formToDelete.id).subscribe({
        next: () => {
          this.loadForms();
          this.notificationService.success('Formulário excluído com sucesso!');
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Erro ao excluir formulário:', error);
          this.notificationService.error('Erro ao excluir formulário');
        }
      });
    }
  }

  public createNewForm() {
    this.router.navigate(['/dashboard/create-form']);
  }

  //#endregion

  //#region Private Methods

  private loadForms() {
    this.formService.getForms().subscribe({
      next: (forms) => {
        this.forms = forms;
      },
      error: (error) => {
        console.error('Erro ao carregar formulários:', error);
        this.notificationService.error('Erro ao carregar formulários');
      }
    });
  }

  //#endregion

  //#region Public Functions

  public formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  public getDropdownStyle() {
    return {
      'top.px': this.dropdownPosition.top,
      'left.px': this.dropdownPosition.left
    };
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

  //#endregion

}
