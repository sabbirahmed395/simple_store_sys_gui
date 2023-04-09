import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/side-menu/Main.vue";
import DashboardOverview1 from "../views/dashboard-overview-1/Main.vue";

// Application Views
import Login from "../views/app/login/Main.vue";

import Dashboard from "../views/app/Dashboard/Main.vue";

import Items from "../views/app/Items/Main.vue";
import ItemForm from "../views/app/Items/Form.vue";

import Suppliers from "../views/app/Suppliers/Main.vue";
import SupplierForm from "../views/app/Suppliers/Form.vue";

import Stocks from "../views/app/Stocks/Main.vue";
import StockForm from "../views/app/Stocks/Form.vue";

import Requisitions from "../views/app/Requisitions/Main.vue";
import MyRequisitions from "../views/app/Requisitions/MyRequisition.vue";
import RequisitionForm from "../views/app/Requisitions/Form.vue";
import RequisitionView from "../views/app/Requisitions/View.vue";
import RequisitionIssueDetails from "../views/app/Requisitions/IssueDetails.vue";

import Users from "../views/app/users/Main.vue";
import UserForm from "../views/app/users/Form.vue";

const routes = [
  	{
		path: "/",
		component: SideMenu,
		children: [
			// items
			{
				path: "/items",
				name: "items",
				component: Items,
			},
			{
				path: '/items/:id/edit',
				name: "edit-item",
				component: ItemForm
			},
			{
				path: '/items/create',
				name: "create-new-item",
				component: ItemForm
			},
			// suppliers
			{
				path: "/suppliers",
				name: "suppliers",
				component: Suppliers,
			},
			{
				path: '/suppliers/:id/edit',
				name: "edit-supplier",
				component: SupplierForm
			},
			{
				path: '/suppliers/create',
				name: "create-new-supplier",
				component: SupplierForm
			},
			// stocks
			{
				path: "/stocks",
				name: "stocks",
				component: Stocks,
			},
			{
				path: '/stocks/:id/edit',
				name: "edit-stock",
				component: StockForm
			},
			{
				path: '/stocks/create',
				name: "create-new-stock",
				component: StockForm
			},

			// requisitions
			{
				path: "/requisitions",
				name: "requisitions",
				component: Requisitions,
			},
			{
				path: "/my-requisitions",
				name: "my_requisitions",
				component: MyRequisitions,
			},
			{
				path: '/requisitions/:id/edit',
				name: "edit-requisition",
				component: RequisitionForm
			},
			{
				path: '/requisitions/create',
				name: "create-new-requisition",
				component: RequisitionForm
			},
			{
				path: '/requisitions/:id/view',
				name: "view-requisition",
				component: RequisitionView
			},
			{
				path: '/requisitions/:id/issued-details',
				name: 'view-requisition-issue-details',
				component: RequisitionIssueDetails
			},
			
			// users
			{
				path: "/users",
				name: "users",
				component: Users,
			},
			{
				path: '/users/:id/edit',
				name: "edit-user",
				component: UserForm
			},
			{
				path: '/users/create',
				name: "create-new-user",
				component: UserForm
			},
    
      {
        path: "dashboard-overview-1",
        name: "side-menu-dashboard-overview-1",
        component: DashboardOverview1,
      },
      {
        path: "/",
        name: "dashboard",
        component: Dashboard,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

export default router;
