import { ApikeyStatus, insertApikey, checkApiKeyExists } from "@/models/apikey";

import Empty from "@/components/blocks/empty";
import FormSlot from "@/components/console/slots/form";
import { Form as FormSlotType } from "@/types/slots/form";
import { getNonceStr } from "@/lib/hash";
import { getTranslations } from "next-intl/server";
import { getUserUuid } from "@/services/user";

export default async function () {
  const t = await getTranslations();

  const user_uuid = await getUserUuid();
  if (!user_uuid) {
    return <Empty message="no auth" />;
  }

  const form: FormSlotType = {
    title: t("api_keys.create_api_key"),
    crumb: {
      items: [
        {
          title: t("api_keys.title"),
          url: "/api-keys",
        },
        {
          title: t("api_keys.create_api_key"),
          is_active: true,
        },
      ],
    },
    fields: [
      {
        title: t("api_keys.form.name"),
        name: "title",
        type: "text",
        placeholder: t("api_keys.form.name_placeholder"),
        validation: {
          required: true,
        },
      },
      {
        title: t("api_keys.form.custom_key"),
        name: "custom_key",
        type: "text",
        placeholder: t("api_keys.form.custom_key_placeholder"),
        tip: t("api_keys.form.custom_key_help"),
        validation: {
          required: false,
        },
      },
    ],
    passby: {
      user_uuid,
    },
    submit: {
      button: {
        title: t("api_keys.form.submit"),
        icon: "RiCheckLine",
      },
      handler: async (data: FormData, passby: any) => {
        "use server";

        const { user_uuid } = passby;
        if (!user_uuid) {
          throw new Error("no auth");
        }

        const title = data.get("title") as string;
        if (!title || !title.trim()) {
          throw new Error("invalid params");
        }

        const customKey = data.get("custom_key") as string;
        let key: string;

        if (customKey && customKey.trim()) {
          // Validate custom key format
          const trimmedKey = customKey.trim();
          
          // Check length (minimum 8 characters)
          if (trimmedKey.length < 8) {
            throw new Error("Custom API key must be at least 8 characters long");
          }
          
          // Check if contains only alphanumeric characters
          const alphanumericRegex = /^[a-zA-Z0-9]+$/;
          if (!alphanumericRegex.test(trimmedKey)) {
            throw new Error("Custom API key must contain only letters and numbers");
          }

          // Check if key already exists
          const keyExists = await checkApiKeyExists(trimmedKey);
          if (keyExists) {
            throw new Error("API key already exists, please use a different key");
          }

          key = trimmedKey;
        } else {
          // Auto-generate key
          key = `sk-${getNonceStr(32)}`;
        }

        const apikey = {
          user_uuid,
          api_key: key,
          title,
          created_at: new Date(),
          status: ApikeyStatus.Created,
        };

        try {
          await insertApikey(apikey);

          return {
            status: "success",
            message: "apikey created",
            redirect_url: "/api-keys",
          };
        } catch (e: any) {
          console.error(e);
          throw new Error("create api key failed: " + e.message);
        }
      },
    },
  };

  return <FormSlot {...form} />;
}
