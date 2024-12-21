import { Routes } from '@angular/router';
import { AutenticarUsuarioComponent } from './components/pages/autenticar-usuario/autenticar-usuario.component';
import { CriarUsuarioComponent } from './components/pages/criar-usuario/criar-usuario.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ServicoComponent } from './components/pages/servico/servico.component';

export const routes: Routes = [

    {
        path:'pages/usuarios/autenticar',
        component: AutenticarUsuarioComponent
        
    },

    {
        path:'pages/usuarios/criar',
        component: CriarUsuarioComponent
        
    },

    {
        path:'pages/dashboard',
        component: DashboardComponent
        
    },
    {
        path:'pages/servicos',
        component: ServicoComponent
        
    },

    {
        path: '', pathMatch: 'full', //ROTA raiz do projeto
        redirectTo: 'pages/usuarios/autenticar'
    }

];
