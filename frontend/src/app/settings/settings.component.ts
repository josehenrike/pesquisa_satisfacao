import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';

interface EmpresaConfig {
    nome: string;
    cnpj: string;
    razaoSocial: string;
    telefone: string;
    email: string;
    website: string;
    logo?: string;
    endereco: {
        cep: string;
        rua: string;
        numero: string;
        complemento: string;
        bairro: string;
        cidade: string;
        estado: string;
    };
}

interface AdminConfig {
    nome: string;
    email: string;
    telefone: string;
    cargo: string;
}

interface PersonalizacaoConfig {
    corPrimaria: string;
    corSecundaria: string;
    logoFormularios?: string;
    mensagemBoasVindas: string;
    textoAgradecimento: string;
    rodapeFormularios: string;
    temaEscuro: boolean;
}

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
    activeTab: string = 'empresa';

    empresa: EmpresaConfig = {
        nome: '',
        cnpj: '',
        razaoSocial: '',
        telefone: '',
        email: '',
        website: '',
        endereco: {
            cep: '',
            rua: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: ''
        }
    };

    admin: AdminConfig = {
        nome: '',
        email: '',
        telefone: '',
        cargo: ''
    };

    personalizacao: PersonalizacaoConfig = {
        corPrimaria: '#667eea',
        corSecundaria: '#764ba2',
        mensagemBoasVindas: 'Bem-vindo à nossa pesquisa de satisfação!',
        textoAgradecimento: 'Obrigado por participar da nossa pesquisa!',
        rodapeFormularios: 'Sua opinião é muito importante para nós.',
        temaEscuro: false
    };

    // Estados de loading
    loadingEmpresa = false;
    loadingAdmin = false;
    loadingPersonalizacao = false;

    // Controle de senha
    showPasswordChange = false;
    passwordData = {
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    };

    constructor(private notificationService: NotificationService) { }

    ngOnInit() {
        this.loadConfiguracoes();
    }

    setActiveTab(tab: string) {
        this.activeTab = tab;
    }

    loadConfiguracoes() {
        // TODO: Carregar configurações salvas do backend
        // Por enquanto, usar dados mockados
        this.loadDadosMockados();
    }

    loadDadosMockados() {
        this.empresa = {
            nome: 'Empresa Exemplo Ltda',
            cnpj: '12.345.678/0001-90',
            razaoSocial: 'Empresa Exemplo Ltda',
            telefone: '(11) 9999-9999',
            email: 'contato@empresa.com',
            website: 'www.empresa.com',
            endereco: {
                cep: '01234-567',
                rua: 'Rua das Flores',
                numero: '123',
                complemento: 'Sala 456',
                bairro: 'Centro',
                cidade: 'São Paulo',
                estado: 'SP'
            }
        };

        this.admin = {
            nome: 'João Silva',
            email: 'admin@empresa.com',
            telefone: '(11) 8888-8888',
            cargo: 'Gerente de Qualidade'
        };
    }

    salvarEmpresa() {
        this.loadingEmpresa = true;

        // TODO: Implementar salvamento no backend
        setTimeout(() => {
            this.loadingEmpresa = false;
            this.notificationService.success('Dados da empresa salvos com sucesso!');
        }, 1000);
    }

    salvarAdmin() {
        this.loadingAdmin = true;

        // TODO: Implementar salvamento no backend
        setTimeout(() => {
            this.loadingAdmin = false;
            this.notificationService.success('Dados do administrador salvos com sucesso!');
        }, 1000);
    }

    salvarPersonalizacao() {
        this.loadingPersonalizacao = true;

        // TODO: Implementar salvamento no backend
        setTimeout(() => {
            this.loadingPersonalizacao = false;
            this.notificationService.success('Configurações de personalização salvas com sucesso!');
        }, 1000);
    }

    alterarSenha() {
        if (this.passwordData.novaSenha !== this.passwordData.confirmarSenha) {
            this.notificationService.error('As senhas não coincidem!');
            return;
        }

        if (this.passwordData.novaSenha.length < 6) {
            this.notificationService.error('A nova senha deve ter pelo menos 6 caracteres!');
            return;
        }

        // TODO: Implementar alteração de senha no backend
        this.notificationService.success('Senha alterada com sucesso!');
        this.showPasswordChange = false;
        this.passwordData = {
            senhaAtual: '',
            novaSenha: '',
            confirmarSenha: ''
        };
    }

    onFileSelected(event: any, tipo: 'logo' | 'logoFormularios') {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (tipo === 'logo') {
                    this.empresa.logo = e.target.result;
                } else {
                    this.personalizacao.logoFormularios = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    buscarCEP() {
        const cep = this.empresa.endereco.cep.replace(/\D/g, '');
        if (cep.length === 8) {
            // TODO: Implementar busca de CEP via API
            this.notificationService.info('Funcionalidade de busca de CEP será implementada em breve!');
        }
    }
}
