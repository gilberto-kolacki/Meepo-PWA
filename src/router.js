/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  Object Strucutre:
                    path => router path
                    name => router name
                    component(lazy loading) => component to load
                    meta : {
                      rule => which user can have access (ACL)
                      breadcrumb => Add breadcrumb to specific page
                      pageTitle => Display title besides breadcrumb
                    }
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue';
import Router from 'vue-router';
import auth from "./rapidsoft/auth/authService";
import UsuarioDB from './rapidsoft/db/usuarioDB';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior () {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            // =============================================================================
            // MAIN LAYOUT ROUTES
            // =============================================================================
			path: '',
			component: () => import('./layouts/main/Main.vue'),
			children: [
            // =============================================================================
            // Theme Routes
            // =============================================================================
				{
					path: '/',
					name: 'home',
					component: () => import('./views/Home.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: true,
                    },
				},
				{
					path: '/cliente/cadastro',
					name: 'clienteCadastro',
					component: () => import('./views/pages/ClienteCadastro.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: true,
                    },
                },
                {
					path: '/cliente/cadastro',
					name: 'clienteEditar',
					component: () => import('./views/pages/ClienteCadastro.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: true,
                    },
                },
                {
					path: '/pedido/cadastro',
					name: 'pedidoEditar',
					component: () => import('./views/pages/PedidoCadastro.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: true,
                    },
                },
                {
					path: '/cliente/consulta',
					name: 'clienteConsulta',
					component: () => import('./views/pages/ClienteConsulta.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: true,
                    },
                },
                {
					path: '/pedido/consulta',
					name: 'pedidoConsulta',
					component: () => import('./views/pages/PedidoConsulta.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: true,
                    },
                },
            {
					path: '/pedido/cadastro',
					name: 'pedidoCadastro',
					component: () => import('./views/pages/PedidoCadastro.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: true,
                    },
                }, 
                {
					path: '/catalogo',
					name: 'catalogo',
					component: () => import('./views/pages/PedidoCatalogo.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: false,
                    },
                },
                {
					path: '/catalogo/item',
					name: 'catalogoItem',
					component: () => import('./views/pages/PedidoCatalogoItem.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: false,
                    },
                },
                {
					path: '/carrinho',
					name: 'carrinho',
					component: () => import('./views/pages/Carrinho.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: false,
                    },
                },
                {
					path: '/carrinhoPedido',
					name: 'carrinhoPedido',
					component: () => import('./views/pages/CarrinhoPedido.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: false,
                    },
                },
                {
					path: '/orcamento/consulta',
					name: 'orcamentoConsulta',
					component: () => import('./views/pages/OrcamentoConsulta.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: true,
                    },
                },
                {
					path: '/orcamento/visualizar',
					name: 'orcamentoVisualizar',
					component: () => import('./views/pages/OrcamentoVisualizar.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: true,
                    },
                },
                {
					path: '/pages/sincronizacao',
					name: 'sincronizacao',
					component: () => import('./views/pages/Sincronizacao.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: true,
                    },
                },
                {
					path: '/pages/suporte/atualizacao',
					name: 'atualizacao',
					component: () => import('./views/pages/suporte/Atualizacao.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: true,
                    },
                },
                {
					path: '/pages/suporte/log',
					name: 'log',
					component: () => import('./views/pages/suporte/Log.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: true,
                    },
                },
                {
					path: '/carrinho/add',
					name: 'carrinhoAdd',
					component: () => import('./views/pages/AddCarrinho.vue'),
					meta: {
                        requiresAuth: true,
                        rule: 'editor',
                        navBar: false,
                    },
                },
			],
		},
        // =============================================================================
        // FULL PAGE LAYOUTS
        // =============================================================================
        {
            path: '',
            component: () => import('@/layouts/full-page/FullPage.vue'),
            children: [
                // =============================================================================
                // PAGES
                // =============================================================================
                {
                    path: '/login',
                    name: 'login',
                    component: () => import('@/views/pages/Login.vue'),
                    meta: {
                        rule: 'editor'
                    }
                },
                {
                    path: '/pages/error-404',
                    name: 'pageError404',
                    component: () => import('@/views/pages/Error404.vue'),
                    meta: {
                        rule: 'editor'
                    }
                },
            ]
        },
        // Redirect to 404 page, if no match found
        {
            path: '*',
            redirect: '/pages/error-404'
        }
    ],
});

router.afterEach(() => {
    // Remove initial loading
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = "none";
    }
})

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if(auth.isAuthenticated()) {
            next();
        } else {
            UsuarioDB.onAuthStateChanged().then(() => {
                if (auth.isAuthenticated()) {
                    next();
                } else {
                    next('/login');
                }
            }).catch(() => {
                next('/login');
            });
        }
    } else {
        if (to.name === "login" && auth.isAuthenticated()) {
            next('/');
        } else {
            next();
        }
    }
});

export default router;
