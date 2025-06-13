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
  isMobile = false;

  // Touch gesture variables
  private touchStartX = 0;
  private touchStartY = 0;
  private touchCurrentX = 0;
  private touchCurrentY = 0;
  private isDragging = false;

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
    // Detectar se é mobile
    this.checkMobile();

    // Escutar mudanças de rota para atualizar o menu ativo
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveMenuItem(event.url);
        // Fechar sidebar no mobile após navegação
        if (this.isMobile) {
          this.sidebarOpen = false;
        }
        // Atualizar estatísticas sempre que navegar para qualquer rota do dashboard
        this.updateStats();
      }
    });

    // Definir item ativo baseado na rota atual
    this.updateActiveMenuItem(this.router.url);

    // Carregar estatísticas iniciais
    this.updateStats();

    // Escutar redimensionamento da janela
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', () => {
        this.checkMobile();
      });
    }
  }

  private updateStats() {
    this.formService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
      }
    });
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

  private checkMobile() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;

      // No mobile, iniciar com sidebar fechada
      if (this.isMobile) {
        this.sidebarOpen = false;
      } else {
        // No desktop, iniciar com sidebar aberta
        this.sidebarOpen = true;
      }
    }
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  // Touch gesture methods para swipe
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.isDragging = true;
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;

    event.preventDefault();
    this.touchCurrentX = event.touches[0].clientX;
    this.touchCurrentY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isDragging) return;

    this.isDragging = false;

    const deltaX = this.touchCurrentX - this.touchStartX;
    const deltaY = Math.abs(this.touchCurrentY - this.touchStartY);

    // Verificar se foi um swipe horizontal (não vertical)
    if (deltaY < 100) {
      // Swipe para direita (fechar sidebar)
      if (deltaX > 50 && this.sidebarOpen) {
        this.closeSidebar();
      }
      // Swipe para esquerda (abrir sidebar) - apenas se começou da borda esquerda
      else if (deltaX < -50 && !this.sidebarOpen && this.touchStartX < 50) {
        this.sidebarOpen = true;
      }
    }
  }

  createNewForm() {
    // Navegar para a rota de criação de formulário
    this.router.navigate(['/dashboard', 'create-form']);
  }
}
