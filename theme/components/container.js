import { mode } from "@chakra-ui/theme-tools";

const Container = {
  baseStyle: {
    p: 0,
  },
  variants: {
    rounded: (props) => ({
      rounded: "lg",
      bg: mode("gray.100", "gray.700")(props),
      boxShadow: "2xl",
      p: 4,
    }),
    footer: (props) => ({
      bg: mode("blackAlpha.300", "blackAlpha.500")(props),
      maxW: "100%",
      pos: "sticky",
      top: "100vh",
    }),
  },
};

export default Container;
