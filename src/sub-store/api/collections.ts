import { server } from "@/sub-store/env";

const add = async (option: { name: string; subscriptions: string[] }) => {
  return await fetch(`${server}/api/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: option.name,
      displayName: "",
      form: "",
      remark: "",
      mergeSources: "",
      ignoreFailedRemoteSub: true,
      passThroughUA: false,
      icon: "",
      process: [
        {
          type: "Quick Setting Operator",
          args: {
            useless: "ENABLED",
            udp: "DEFAULT",
            scert: "DEFAULT",
            tfo: "DEFAULT",
            "vmess aead": "DEFAULT",
          },
        },
        {
          type: "Handle Duplicate Operator",
          args: {
            action: "rename",
            position: "back",
            template: "0 1 2 3 4 5 6 7 8 9",
            link: "-",
          },
          id: `${Math.random() * 100000000}`,
          disabled: false,
        },
      ],
      subscriptions: option.subscriptions,
      tag: [],
      subscriptionTags: [],
    }),
  });
};

const collections = {
  add,
};

export default collections;
