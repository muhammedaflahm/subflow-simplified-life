import type { AppProps } from "next/app";
import Script from "next/script";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Razorpay checkout script loaded globally */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Render the current page */}
      <Component {...pageProps} />
    </>
  );
}
