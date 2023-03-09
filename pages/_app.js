import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/index";

export default function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
