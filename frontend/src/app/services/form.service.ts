import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    // Buscar todos os formulários
    getForms(): any[] {
        if (!isPlatformBrowser(this.platformId)) {
            return [];
        }
        return JSON.parse(localStorage.getItem('forms') || '[]');
    }

    // Buscar estatísticas do dashboard
    getStats() {
        const forms = this.getForms();
        const totalResponses = forms.reduce((total, form) => total + (form.responses || 0), 0);
        const totalParticipants = totalResponses; // Assumindo 1 resposta = 1 participante

        // Calcular avaliação média (simulada por enquanto)
        const averageRating = forms.length > 0 ? (4.2).toFixed(1) : '-';

        return {
            totalForms: forms.length,
            totalResponses,
            totalParticipants,
            averageRating
        };
    }

    // Salvar formulário
    saveForm(formData: any): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const existingForms = this.getForms();
        existingForms.push(formData);
        localStorage.setItem('forms', JSON.stringify(existingForms));
    }

    // Deletar formulário
    deleteForm(formId: number): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const forms = this.getForms();
        const updatedForms = forms.filter(form => form.id !== formId);
        localStorage.setItem('forms', JSON.stringify(updatedForms));
    }
}
