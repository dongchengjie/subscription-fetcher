import { server } from "@/sub-store/env";

const add = async (option: { name: string; url: string; ua?: string }) => {
  return await fetch(`${server}/api/subs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: option.name,
      displayName: "",
      form: "",
      remark: "",
      mergeSources: "remoteFirst",
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
      source: "remote",
      url: option.url,
      content: "",
      ua: option.ua,
      subUserinfo: "",
      proxy: "",
      tag: [],
      subscriptionTags: [],
    }),
  });
};

const list = () => {
  return fetch(`${server}/api/subs`, {
    method: "GET",
  });
};

const subs = {
  add,
  list,
};

export default subs;
