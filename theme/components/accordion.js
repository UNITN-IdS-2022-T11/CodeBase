import { mode } from "@chakra-ui/theme-tools";

const Accordion = {
  baseStyle: (props) => ({
    button: {
      boxShadow: mode("md", "md-dark")(props),
      rounded: "lg",
      bg: mode("blackAlpha.100", "whiteAlpha.100")(props),
      _expanded: {
        bg: mode("blackAlpha.300", "whiteAlpha.300")(props),
      },
      _hover: {
        bg: mode("blackAlpha.200", "whiteAlpha.200")(props),
      },
    },
  }),
};

export default Accordion;
