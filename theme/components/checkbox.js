import { mode } from "@chakra-ui/theme-tools";

const Checkbox = {
  baseStyle: (props) => ({
    control: {
      borderColor: mode("blackAlpha.200", "whiteAlpha.200")(props),
    },
  }),
};

export default Checkbox;
