import { mode } from "@chakra-ui/theme-tools";

const styles = {
  global: (props) => ({
    body: {
      bg: mode("green.500", "green.900")(props),
      color: mode("black", "white")(props),
    },
  }),
};

export default styles;
