import ConsoleLayout from "@/components/console/layout";
import Empty from "@/components/blocks/empty";
import { ReactNode } from "react";
import { Sidebar } from "@/types/blocks/sidebar";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userInfo = await getUserInfo();
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",");
  if (!adminEmails?.includes(userInfo?.email)) {
    return <Empty message="No access" />;
  }

  const sidebar: Sidebar = {
    brand: {
      title: "AlphaOption",
      logo: {
        src: "/logo.png",
        alt: "AlphaOption",
      },
      url: "/admin",
    },
    // nav: {
    //   items: [
    //     {
    //       title: "Dashboard",
    //       url: "/admin",
    //       icon: "RiDashboardLine",
    //     },
    //   ],
    // },
    variant: "sidebar", // sidebar, floating, inset
    collapsible: "icon", // offcanvas, icon
    nav: {
      title: "Menu",
      items: [
        // {
        //   title: "Users",
        //   url: "/admin/users",
        //   icon: "RiUserLine",
        // },
        // {
        //   title: "Orders",
        //   icon: "RiOrderPlayLine",
        //   url: "/admin/orders",
        // },
        // {
        //   title: "CMS",
        //   icon: "RiArticleLine",
        //   is_expand: true,
        //   children: [
        //     {
        //       title: "Posts",
        //       url: "/admin/posts",
        //       icon: "RiArticleLine",
        //     },
        //     {
        //       title: "Categories",
        //       url: "/admin/categories",
        //       icon: "RiFolderLine",
        //     },
        //   ],
        // },
        // {
        //   title: "Feedbacks",
        //   url: "/admin/feedbacks",
        //   icon: "RiMessage2Line",
        // },
        {
          title: "Site Access",
          url: "/admin/site-keys",
          icon: "RiKeyLine",
        },
      ],
    },
    bottomNav: {
      items: [
       
      ],
    },
    social: {
      items: [

      ],
    },
    account: {
      items: [
        {
          title: "Home",
          url: "/",
          icon: "RiHomeLine",
          target: "_blank",
        },
        {
          title: "Recharge",
          url: "/pricing",
          icon: "RiMoneyDollarBoxLine",
          target: "_blank",
        },
      ],
    },
  };

  return <ConsoleLayout sidebar={sidebar}>{children}</ConsoleLayout>;
}
