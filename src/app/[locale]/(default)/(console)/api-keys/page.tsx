import Empty from "@/components/blocks/empty";
import TableSlot from "@/components/console/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import { getTranslations } from "next-intl/server";
import { getUserApikeys, ApikeyStatus } from "@/models/apikey";
import { getUserUuid } from "@/services/user";
// Replaced moment with native Date formatting
import { Badge } from "@/components/ui/badge";

export default async function () {
  const t = await getTranslations();

  const user_uuid = await getUserUuid();
  if (!user_uuid) {
    return <Empty message="no auth" />;
  }

  const data = await getUserApikeys(user_uuid);

  const table: TableSlotType = {
    title: t("api_keys.title"),
    tip: {
      title: t("api_keys.tip"),
    },
    toolbar: {
      items: [
        {
          title: t("api_keys.create_api_key"),
          url: "/api-keys/create",
          icon: "RiAddLine",
        },
      ],
    },
    columns: [
      {
        title: t("api_keys.table.name"),
        name: "title",
      },
      {
        title: t("api_keys.table.key"),
        name: "api_key",
        type: "copy",
        callback: (item: any) => {
          return item.api_key.slice(0, 4) + "..." + item.api_key.slice(-4);
        },
      },
      {
        title: t("api_keys.table.created_at"),
        name: "created_at",
        callback: (item: any) => {
          const date = new Date(item.created_at);
          const now = new Date();
          const diff = now.getTime() - date.getTime();
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          if (days === 0) return 'today';
          if (days === 1) return '1 day ago';
          return `${days} days ago`;
        },
      },
    ],
    data,
    empty_message: t("api_keys.no_api_keys"),
  };

  return <TableSlot {...table} />;
}
