import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FormularioDTO {
  id: number;
  title: string;
  description: string;
  questions: PerguntaDTO[];
  createdAt: string;
  responses: number;
  ativa: boolean;
}

export interface PerguntaDTO {
  id: number;
  title: string;
  type: string;
  options: string[];
  required: boolean;
}

export interface CreateFormularioDTO {
  title: string;
  description: string;
  questions: CreatePerguntaDTO[];
}

export interface CreatePerguntaDTO {
  title: string;
  type: string;
  options: string[];
  required: boolean;
}

export interface RespostaFormularioDTO {
  formId: number;
  responses: { [key: number]: any };
}

export interface EstatisticasDTO {
  totalForms: number;
  totalResponses: number;
  totalParticipants: number;
  averageRating: string;
}

export interface RespostaDetalhadaDTO {
  id: number;
  formularioId: number;
  formularioTitulo: string;
  clienteNome: string;
  clienteEmail: string;
  dataResposta: string;
  respostas: { [perguntaId: number]: any };
}

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = 'http://localhost:5010/api';

  constructor(private http: HttpClient) { }

  // Buscar todos os formulários
  getForms(): Observable<FormularioDTO[]> {
    return this.http.get<FormularioDTO[]>(`${this.apiUrl}/pesquisas`);
  }

  // Buscar estatísticas do dashboard
  getStats(): Observable<EstatisticasDTO> {
    return this.http.get<EstatisticasDTO>(`${this.apiUrl}/pesquisas/estatisticas`);
  }

  // Salvar formulário
  saveForm(formData: CreateFormularioDTO): Observable<FormularioDTO> {
    return this.http.post<FormularioDTO>(`${this.apiUrl}/pesquisas`, formData);
  }

  // Deletar formulário
  deleteForm(formId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pesquisas/${formId}`);
  }

  // Buscar formulário específico por ID
  getFormById(formId: number): Observable<FormularioDTO> {
    return this.http.get<FormularioDTO>(`${this.apiUrl}/pesquisas/${formId}`);
  }

  // Salvar resposta de formulário
  saveFormResponse(formId: number, responses: { [key: number]: any }): Observable<any> {
    const respostaDto: RespostaFormularioDTO = {
      formId: formId,
      responses: responses
    };
    return this.http.post(`${this.apiUrl}/pesquisas/${formId}/respostas`, respostaDto);
  }

  // Buscar todas as respostas
  getRespostas(): Observable<RespostaDetalhadaDTO[]> {
    return this.http.get<RespostaDetalhadaDTO[]>(`${this.apiUrl}/pesquisas/respostas`);
  }
}
