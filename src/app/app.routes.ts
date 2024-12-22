import { Routes } from '@angular/router';
import { AutenticarUsuarioComponent } from './components/pages/autenticar-usuario/autenticar-usuario.component';
import { CriarUsuarioComponent } from './components/pages/criar-usuario/criar-usuario.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ServicoComponent } from './components/pages/servico/servico.component';
import { GestaoComponent } from './components/pages/gestao/gestao.component';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

    {
        path:'pages/usuarios/autenticar',
        component: AutenticarUsuarioComponent,
        canActivate: [LoginGuard]
        
    },

    {
        path:'pages/usuarios/criar',
        component: CriarUsuarioComponent,
        canActivate: [LoginGuard]
        
    },

    {
        path:'pages/dashboard',
        component: DashboardComponent,
        canActivate:[AuthGuard]
        
    },
    {
        path:'pages/servicos',
        component: ServicoComponent,
        canActivate:[AuthGuard]
        
    },

    {
        path:'pages/gestao',
        component: GestaoComponent,
        canActivate:[AuthGuard]
    },

    {
        path: '', pathMatch: 'full', //ROTA raiz do projeto
        redirectTo: 'pages/usuarios/autenticar'
    }

];
