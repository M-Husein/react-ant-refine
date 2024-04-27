import { HomeFilled } from '@ant-design/icons';
import { FaCog, FaUser, FaPlus } from 'react-icons/fa'; // , FaUsers, FaUserTag, FaDice, FaCodeBranch
// import { FaFile } from "react-icons/fa6";
// import { ImHome } from "react-icons/im";
// import { IoStatsChart, IoCard } from "react-icons/io5";
// import { IoIosListBox } from "react-icons/io";

export const settingsUrl = (size?: number) => [
  {
    name: "apps",
    list: "/settings/apps",
    meta: { parent: "settings", label: "Apps", icon: <FaCog size={size} /> },
  },
  {
    name: "users",
    list: "/admin/settings/users",
    show: "/admin/settings/users/:id",
    meta: { parent: "settings", label: "Users", icon: <FaUser size={size} /> },
  },
  // {
  //   name: "team-management",
  //   list: "/admin/settings/team-management",
  //   show: "/admin/settings/team-management/:id",
  //   meta: { parent: "settings", label: "Team Management", icon: <FaUsers size={size} /> },
  // },
];

export const RESOURCES = [
  {
    name: "dashboard",
    list: "/dashboard", // Render in menu
    meta: { label: "Dashboard", icon: <HomeFilled /> },
  },

  // Parent
  {
    name: "products",
    meta: { label: "Products", icon: <FaCog /> },
  },
  {
    name: "add-product",
    list: "/products/add-product",
    meta: { parent: "products", label: "Add Product", icon: <FaPlus /> },
  },

  // Parent
  {
    name: "settings",
    meta: { label: "Settings", icon: <FaCog /> },
  },
  ...settingsUrl(),

  /** @DEV_ONLY */
  // {
  //   name: "devs",
  //   list: "/devs",
  // },

  /** @DEV_ONLY : Demo Refine */
  // {
  //   name: "categories",
  //   list: "/admin/categories",
  //   create: "/admin/categories/create",
  //   edit: "/admin/categories/edit/:id",
  //   show: "/admin/categories/show/:id",
  //   meta: {
  //     canDelete: true,
  //   },
  // },

  // {
  //   name: "upload-logs",
  //   list: "/upload-logs",
  //   meta: {
  //     label: "Upload Logs",
  //     icon: <FaExclamationTriangle />,
  //     // canDelete: false, // ???
  //     // canShow: false, // ???
  //     // hide: true, // https://refine.dev/docs/api-reference/core/components/refine-config/#hide
  //   }
  // },
];

