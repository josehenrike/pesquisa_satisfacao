import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  sidebarOpen = true;
  adminUser = 'Admin';
  stats: any = {
    totalForms: 0,
    totalResponses: 0,
    totalParticipants: 0,
    averageRating: '-'
  };

  menuItems = [
    { icon: '📊', label: 'Dashboard', active: true, route: '' },
    { icon: '📝', label: 'Criar Formulário', active: false, route: 'create-form' },
    { icon: '📋', label: 'Formulários', active: false, route: 'forms' },
    { icon: '📈', label: 'Respostas', active: false, route: 'responses' },
    { icon: '⚙️', label: 'Configurações', active: false, route: 'settings' }
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formService: FormService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Verificar se o usuário está logado apenas no browser
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn) {
        this.router.navigate(['']);
      }
    }
  }

  ngOnInit() {
    // Escutar mudanças de rota para atualizar o menu ativo
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveMenuItem(event.url);
        // Atualizar estatísticas quando voltar ao dashboard
        if (event.url === '/dashboard' || event.url === '/dashboard/') {
          this.updateStats();
        }
      }
    });

    // Definir item ativo baseado na rota atual
    this.updateActiveMenuItem(this.router.url);

    // Carregar estatísticas iniciais
    this.updateStats();
  }

  private updateStats() {
    this.stats = this.formService.getStats();
  }

  private updateActiveMenuItem(url: string) {
    // Resetar todos os itens
    this.menuItems.forEach(item => item.active = false);

    // Determinar qual item deve estar ativo baseado na URL
    if (url === '/dashboard' || url === '/dashboard/') {
      this.menuItems[0].active = true; // Dashboard
    } else if (url.includes('/dashboard/create-form')) {
      this.menuItems[1].active = true; // Criar Formulário
    } else if (url.includes('/dashboard/forms')) {
      this.menuItems[2].active = true; // Formulários
    } else if (url.includes('/dashboard/responses')) {
      this.menuItems[3].active = true; // Respostas
    } else if (url.includes('/dashboard/settings')) {
      this.menuItems[4].active = true; // Configurações
    } else {
      // Default para Dashboard se não encontrar correspondência
      this.menuItems[0].active = true;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  setActiveMenuItem(item: any) {
    // Navegar para a rota do item
    if (item.route === '') {
      // Para o dashboard principal, navegar para /dashboard sem rota filha
      this.router.navigate(['/dashboard']);
    } else {
      // Para outras rotas, navegar para a rota filha
      this.router.navigate(['/dashboard', item.route]);
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isLoggedIn');
    }
    this.router.navigate(['']);
  }

  hasActiveChildRoute(): boolean {
    return this.activatedRoute.children.length > 0;
  }
}
