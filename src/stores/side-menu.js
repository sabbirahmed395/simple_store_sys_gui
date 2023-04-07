import { defineStore } from "pinia";

export const useSideMenuStore = defineStore("sideMenu", {
  state: () => ({
    menu: [
      {
        icon: "BoxIcon",
        pageName: "items",
        title: "Items",
        scopes: ["admin", "employee", "store executive"],
      },
      {
        icon: "UsersIcon",
        pageName: "suppliers",
        title: "Suppliers",
        scopes: ["admin", "employee", "store executive"],
      },
      {
        icon: "BoxIcon",
        pageName: "stocks",
        title: "Stocks",
        scopes: ["store executive"],
      },
      {
        icon: "BookIcon",
        pageName: "requisitions",
        title: "Requisitions",
        scopes: ["employee", "admin", "store executive"],
        subMenu: [
          {
            icon: "BookIcon",
            pageName: "my_requisitions",
            title: "My Requisitions",
            scopes: ["employee"],
          },
          {
            icon: "BookIcon",
            pageName: "requisitions",
            title: "Requisitions",
            scopes: ["admin", "store executive"],
          },
        ]
      },
     
      {
        icon: "UserIcon",
        pageName: "users",
        title: "Users",
        scopes: ["admin"],
      },
     
    ],
  }),
});
