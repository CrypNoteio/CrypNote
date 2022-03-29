import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
import { getCookie } from "../assets/js/Common";

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Main/Home.vue'),
      },
      {
        path: '/noteverse',
        name: 'Noteverse',
        component: () => import('../views/Main/Noteverse.vue'),
      },
      
      {
        path: '/campaigns',
        name: 'Campaigns',
        component: () => import('../views/Main/Campaigns.vue'),
      },
      {
        path: '/kols',
        name: 'Kols',
        component: () => import('../views/Main/Kols.vue'),
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/Home/Home.vue'),
        children: [
          {
            path: '',
            redirect: '/dashboard/workbench',
            meta: {
              title: 'CrypNote - Home'
            },
          },
          {
            path: "/dashboard/workbench",
            component: () => import('../views/Home/WorkBench.vue'),
            meta: {
              title: 'CrypNote - Home'
            },
            children: [
              {
                path: '',
                redirect: '/dashboard/workbench/notebook',
                meta: {
                  title: 'CrypNote - Home'
                },
              },
              {
                path: '/dashboard/workbench/notebook',
                component: () => import('../views/Home/NoteBook.vue'),
                meta: {
                  title: 'CrypNote - Home'
                },
              },
              {
                path: '/dashboard/quills',
                component: () => import('../views/Home/Quills.vue'),
                meta: {
                  title: 'CrypNote - Home'
                },
              }
            ]
          },
          {
            path: "/dashboard/favorites",
            component: () => import('../views/Home/Favorite.vue'),
            meta: {
              title: 'CrypNote - Favorites'
            },
          },
          {
            path: "/dashboard/recently",
            component: () => import('../views/Home/Recently.vue'),
            meta: {
              title: 'CrypNote - Recently'
            },
          },
          {
            path: "/dashboard/trash",
            component: () => import('../views/Home/Trash.vue'),
            meta: {
              title: 'CrypNote - Trash'
            },
          }
        ]
      },
      {
        path: '/library',
        name: 'Library',
        meta: {
          title: 'CrypNote - Library'
        },
        component: () => import('../views/Library/Library.vue')
      },
    ]
  },
  {
    path: '/nft',
    name: "NFT",
    component: () => import('../views/Main/NFT.vue'),
    children: [
      {
        path: '',
        redirect: '/nft/home',
      },
      {
        path: '/nft/home',
        name: 'NFT_Home',
        component: () => import('../views/Main/NFT_Home.vue')
      },
      {
        path: '/nft/about',
        name: 'NFT_About',
        component: () => import( '../views/Main/NFT_About.vue')
      },
      {
        path: '/nft/mint',
        name: 'NFT_Mint',
        component: () => import( '../views/Main/NFT_Mint.vue')
      }
    ]
  },
  {
    path: '/sign',
    name: 'Sign',
    meta: {
      title: 'CrypNote - Log in'
    },
    component: () => import('../views/Sign/Sign.vue')
  },
  {
    path: '/login',
    name: 'Lign',
    meta: {
      title: 'CrypNote - Log in'
    },
    component: () => import('../views/Login/Login.vue')
  },
 
  {
    path: '/forgetPasswordOne',
    name: 'ForgetPasswordOne',
    meta: {
      title: 'CrypNote - Log in'
    },
    component: () => import('../views/ForgetPass/ForgetPassOne.vue')
  }, 
  {
    path: '/forgetPasswordTwo',
    name: 'ForgetPasswordTwo',
    meta: {
      title: 'CrypNote - Log in'
    },
    component: () => import('../views/ForgetPass/ForgetPassTwo.vue')
  },
   {
    path: '/forgetPasswordThree',
     name: 'ForgetPasswordThree',
     meta: {
      title: 'CrypNote - Log in'
    },
    component: () => import('../views/ForgetPass/ForgetPassThree.vue')
  },
  {
    path: '/word/:groupId?/:fileType?/:id?',
    name: 'Word',
    meta: {
      title: 'CrypNote - Log in'
    },
    component: () => import('../views/add/Word.vue')
  },
  { 
    path: '/excel/:groupId?/:fileType?/:id?',
    name: 'Excel',
    meta: {
      title: 'CrypNote - Home'
    },
    component: () => import('../views/add/Excel.vue')
  },
  { 
    path: '/pptx/:groupId?/:fileType?/:id?',
    name: 'PPTX',
    meta: {
      title: 'CrypNote - Home'
    },
    component: () => import('../views/add/PPTX.vue')
  },
  {
    path: '/quill/:id?',
    name: 'quill',
    meta: {
      title: 'Publish in Quills'
    },
    component: () => import('../views/add/quill.vue')
  },
  {
    path: '/setingUserInfo',
    name: 'SetingUserInfo',
    meta: {
      title: 'CrypNote - SetingUserInfo'
    },
    component: () => import('../views/setingUserInfo/setingUserInfo.vue'),
    children: [
      {
        path: '',
        redirect: '/setingUserInfo/myprofile',
        meta: {
          title: 'CrypNote - setingUserInfo-myprofile'
        },
      },
      {
        path: "/setingUserInfo/myprofile",
        component: () => import('../views/setingUserInfo/MyProfile.vue'),
        meta: {
          title: 'CrypNote - myprofile'
        },
      },
      {
        path: "/setingUserInfo/myaccount",
        component: () => import('../views/setingUserInfo/MyAccount.vue'),
        meta: {
          title: 'CrypNote - myaccount'
        },
      },
      {
        path: "/setingUserInfo/myweb3",
        component: () => import('../views/setingUserInfo/MyWeb3.vue'),
        meta: {
          title: 'CrypNote - myweb3'
        },
      },
      {
        path: "/setingUserInfo/language",
        component: () => import('../views/setingUserInfo/Language.vue'),
        meta: {
          title: 'CrypNote - language'
        },
      },
    ]
  },
  {
    path: '/:walletAddress',
    name: 'Profile',
    meta: {
      title: 'CrypNote - Profile'
    },
    component: () => import('../views/Profile/Profile.vue')
  },
  {
    path: '/message',
    name: 'Message',
    meta: {
      title: 'CrypNote - Message'
    },
    component: () => import('../views/Message/MessageList.vue')
  },
  {
    path: '/versionHistory/:articleId?/:groupId?',
    name: 'VersionHistory',
    meta: {
      title: 'CrypNote - Home'
    },
    component: () => import('../views/versionHistory/versionHistory.vue')
  },
  {
    path: '/versionHistoryExcel/:articleId?/:groupId?',
    name: 'versionHistoryExcel',
    meta: {
      title: 'CrypNote - Home'
    },
    component: () => import('../views/versionHistory/versionHistoryExcel.vue')
  },
  {
    path: '/404',
    name: 'Error404',
    meta: {
      title: 'CrypNote - Profile'
    },
    component: () => import('../views/ErrorPage/Error404.vue'),
  },
  {
    path: '/loginck',
    name: 'LoginCheck',
    meta: {
      title: 'CrypNote'
    },
    component: () => import('../views/Login/LoginCheck.vue'),
  },  
  {
    path: '/:profileId',
    name: 'Profile',
    meta: {
      title: 'CrypNote - Profile'
    },
    component: () => import('../views/Profile/Profile.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass:"active_nb",
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
      document.title = to.meta.title;
  }
  const isLogin = getCookie("apptoken") ? true : false;
  
  if (to.path == '/login' || to.path == '/home' || to.path == '/noteverse' || to.path == '/campaigns' || to.path == '/nft/home' || to.path == '/nft/about' || to.path == '/nft/mint' || to.path == '/sign' || to.path == '/forgetPasswordOne' ||  to.path == '/forgetPasswordTwo' ||  to.path == '/forgetPasswordThree' || to.name == 'Profile' || to.name == 'Article' || to.name == 'Error404' || to.path == '/loginck' || to.path == '/kols') {
    next();
  } else {
    isLogin ? next() : next('/login');
  }
});
export default router
