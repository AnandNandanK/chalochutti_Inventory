import { RiDashboardHorizontalFill } from "react-icons/ri";
import { MdInventory2 } from "react-icons/md";

import type { IconType } from "react-icons";
import type { UserRole } from "@/types/user";

export type menuItemType = {
  label: string;
  icon: IconType;
  path?: string;
  children?: {
    id: "room" | "rate";
    label: string;
    path:string;
  }[];
};


export const menusByRole: Partial<Record<UserRole, menuItemType[]>> = {
  admin: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: RiDashboardHorizontalFill,
    },
    {
      label: "Inventory",
      icon: MdInventory2,
      children: [
        {
          id: "room",
          label: "Room Type",
          path: "/inventory/room-types",
        },
        {
          id: "rate",
          label: "Rate Plan",
          path: "/inventory/rate-plans",
        },
      ],
    }


  ],

  // super_admin: [
  //   {
  //     label: "Sessions",
  //     path: "/school-admin/sessions",
  //     icon: MdAccessTimeFilled, // Timer equivalent
  //   },
  // ],
};
