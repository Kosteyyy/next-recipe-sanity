import { createClient, createPreviewSubscriptionHook } from "next-sanity";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import createImageUrlBuilder from "@sanity/image-url";

const config = {
  projectId: "tpmasc5a",
  dataset: "production",
  apiVersion: "2021-03-25",
  useCdn: false,
};

export const sanityClient = createClient(config);

export const usePreviewSubscription = createPreviewSubscriptionHook(config);

export const urlFor = (source) => createImageUrlBuilder(config).image(source);
export const PortableText = (props) => (
  <PortableTextComponent components={{}} {...props} />
);
// export const PortableText = createPortableTextComponent({
//   ...config,
//   serializers: {},
// });
