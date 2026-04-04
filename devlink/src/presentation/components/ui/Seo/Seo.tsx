import { memo } from "react";
import type { SeoProps } from "./Seo.types";

export const Seo = memo((props: SeoProps) => {
  const { title = import.meta.env.VITE_APP_TITLE } = props;

  return (
    <>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <link rel="canonical" href="http://localhost:5173" />
    </>
  );
});
