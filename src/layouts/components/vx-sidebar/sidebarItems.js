/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  Strucutre:
          url     => router path
          name    => name to display in sidebar
          slug    => router path name
          icon    => Feather Icon component/icon name
          tag     => text to display on badge
          tagColor  => class to apply on badge element
          i18n    => Internationalization
          submenu   => submenu of current item (current item will become dropdown )
                NOTE: Submenu don't have any icon(you can add icon if u want to display)
          isDisabled  => disable sidebar item/group
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default [
  {
    url: "/",
    name: "Início",
    slug: "home",
    icon: "HomeIcon",
  },
  {
    header: "Cliente",
    i18n: "Cliente",
  },
  {
    url: "/cliente/consulta",
    name: "Consulta Cliente",
    slug: "Cliente",
    icon: "UsersIcon",
  }, 
  {
    url: "/cliente/cadastro",
    name: "Novo Cliente",
    slug: "Cliente",
    icon: "UserPlusIcon",
  },   
  {
    header: "Pedido",
    i18n: "Pedido",
  },
  {
    url: "/pedido/consulta",
    name: "Consulta Pedidos",
    slug: "Pedido",
    icon: "ShoppingCartIcon",
  },
  {
    url: "/catalogo",
    name: "Catálogo",
    slug: "Catálogo",
    icon: "ShoppingBagIcon",
  },
  {
    header: "Suporte",
    i18n: "Suporte",
  },
  {
    url: "/pages/sincronizacao",
    name: "Sincronizar",
    slug: "Sincronizar",
    icon: "RefreshCcwIcon",
  },
  {
    url: "/pages/suporte/atualizacao",
    name: "Atualização",
    slug: "Atualização",
    icon: "DownloadIcon",
  },
  {
    url: "/pages/suporte/log",
    name: "Logs do Sistema",
    slug: "Logs do Sistema",
    icon: "MonitorIcon",
  },
]
