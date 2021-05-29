import Vue from 'vue'
import Router from 'vue-router'
import Header from '@/components/Header'
import Login from '@/pages/Login'
import SideBar from '@/components/SideBar'
import Home from '@/components/Home'
import UserManages from "@/pages/userManages/UserManages"
import UserAdd from "@/pages/userManages/UserAdd"
import UserEdit from "@/pages/userManages/UserEdit"

import CustomerManages from "@/pages/customerManages/CustomerManages"
import CustomerAdd from "@/pages/customerManages/CustomerAdd"
import CustomerEdit from "@/pages/customerManages/CustomerEdit"

import ViewManages from "@/pages/viewManages/ViewManages"
import OrderManages from "@/pages/orderManages/OrderManages"
import OrderDetail from "@/pages/orderManages/OrderDetail"


import AdvertManages from "@/pages/advertManages/AdvertManages"
import AdvertAdd from "@/pages/advertManages/AdvertAdd"
import AdvertEdit from "@/pages/advertManages/AdvertEdit"

import BoxAdd from "@/pages/boxManages/BoxAdd"
import BoxManages from "@/pages/boxManages/BoxManages"
import BoxNumber from "@/pages/boxManages/BoxNumber"
import BoxNumberAdd from "@/pages/boxManages/BoxNumberAdd"



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/header',
      name: 'header',
      component: Header
    },
    {
      path: '/sidebar',
      name: 'sidebar',
      component: SideBar
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children:[
      
      {
      path: '/usermanages',
      name: 'usermanages',
      component: UserManages
    },
    {
      path: '/useradd',
      name: 'useradd',
      component: UserAdd
    },
    {
      path: '/useredit',
      name: 'useredit',
      component: UserEdit
    },

    
    {
      path: '/customermanages',
      name: 'customermanages',
      component: CustomerManages
    },
    {
      path: '/customeradd',
      name: 'customeradd',
      component: CustomerAdd
    },
    {
      path: '/customeredit',
      name: 'customeredit',
      component: CustomerEdit
    },

    {
      path: '/viewmanages',
      name: 'viewmanages',
      component: ViewManages
        },
        {
          path: '/ordermanages',
          name: 'ordermanages',
          component: OrderManages
        },
        {
          path: '/orderdetail',
          name: 'orderdetail',
          component: OrderDetail
        },

    {
      path: '/advertmanages',
      name: 'advertmanages',
      component: AdvertManages
    },
    {
      path: '/advertadd',
      name: 'advertadd',
      component: AdvertAdd
    },
    {
      path: '/advertedit',
      name: 'advertedit',
      component: AdvertEdit
    },



    {
      path: '/boxadd',
      name: 'boxadd',
      component: BoxAdd
    },
    {
      path: '/boxnumberadd',
      name: 'boxnumberadd',
      component: BoxNumberAdd
    },
    {
      path: '/boxmanages',
      name: 'boxmanages',
      component: BoxManages
    },
    {
      path: '/boxnumber',
      name: 'boxnumber',
      component: BoxNumber
    },
    
  
  
  ]
    },
    
  ]
})
