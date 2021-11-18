import Main from '@/components/main'
// import { component } from '~vue/types/umd'

export default [
  {
    path: '/manage',
    name: 'article_management',
    meta: {
      icon: 'ios-book',
      title: '文章管理'
    },
    component: Main,
    children: [
      {
        path: '/manage/content',
        name: 'content_management',
        meta: {
          icon: 'ios-bookqq',
          title: '内容管理'
        },
        component: () => import('@/view/manages/ManageContent.vue')
      },
      {
        path: '/manage/tags',
        name: 'tags_management',
        meta: {
          icon: 'ios-bookqq',
          title: '标签管理'
        },
        component: () => import('@/view/manages/ManageTags.vue')
      }

      // meta: {
      //   icon: 'ios-book',
      //   title: '文章内容管理',
      // },
      // component: () => import('@/view/detail/Detail.vue')
    ]
  },
  {
    path: '/user',
    name: 'user',
    mata: {
      icon: 'ios-bookqq',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: '/user/content',
        name: 'user_management',
        meta: {
          icon: 'ios-people',
          title: '内容管理'
        },
        component: () => import('@/view/user/index')
      },
    ]
  },
  {
    path: '/menu',
    name: 'menu',
    meta: {
      icon: 'ios-people',
      title: '菜单管理'
    },
    component: Main,
    children: [
      {
        path: '/menu/index',
        name: 'menu_management',
        meta: {
          icon: 'ios-menu',
          title: '内容管理'
        },
        component: () => import('@/view/menu/index')
      },
    ]
  },
  {
    path: '/roles',
    name: 'roles',
    meta: {
      icon: 'md-checkbox',
      title: '权限管理'
    },
    component: Main,
    children: [
      {
        path: '/roles/index',
        name: 'roles_management',
        meta: {
          icon: 'md-key',
          title: '角色权限'
        },
        component: () => import('@/view/roles/index')
      },
    ]
  }
]
