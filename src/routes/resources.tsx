import { HomeFilled } from '@ant-design/icons';
import { FaCog, FaUser, FaPlus } from 'react-icons/fa'; // , FaUsers, FaUserTag, FaDice, FaCodeBranch
// import { FaFile } from "react-icons/fa6";
// import { ImHome } from "react-icons/im";
// import { IoStatsChart, IoCard } from "react-icons/io5";
// import { IoIosListBox } from "react-icons/io";

export const RESOURCES = [
  {
    name: "dashboard",
    list: "/", // Render in menu
    meta: { label: "Dashboard", icon: <HomeFilled /> },
  },

  // Parent
  {
    name: "articles",
    meta: { label: "Articles", icon: <FaCog /> },
  },
  {
    name: "add-articles",
    list: "/articles/add-article",
    meta: { parent: "articles", label: "Add Article", icon: <FaPlus /> },
  },

  // Parent
  {
    name: "settings",
    meta: { label: "Settings", icon: <FaCog /> },
  },
  {
    name: "apps",
    list: "/settings/apps",
    meta: { parent: "settings", label: "Apps", icon: <FaCog /> },
  },
  {
    name: "users",
    list: "/settings/users",
    show: "/settings/users/:id",
    meta: { parent: "settings", label: "Users", icon: <FaUser /> },
  },
  // {
  //   name: "team-management",
  //   list: "/settings/team-management",
  //   show: "/settings/team-management/:id",
  //   meta: { parent: "settings", label: "Team Management", icon: <FaUsers /> },
  // },

  /** @DEV_ONLY */
  {
    name: "devs",
    list: "/devs",
  },

  /** @DEV_ONLY : Demo Refine */
  // {
  //   name: "categories",
  //   list: "/categories",
  //   create: "/categories/create",
  //   edit: "/categories/edit/:id",
  //   show: "/categories/show/:id",
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
]
.map((item: any) => ({
  ...item,
  list: "/admin" + item.list
}));
