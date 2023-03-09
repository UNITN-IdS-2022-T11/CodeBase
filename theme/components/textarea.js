import { mode } from "@chakra-ui/theme-tools";

const Textarea = {
  variants: {
    outline: (props) => ({
      borderColor: mode("blackAlpha.200", "whiteAlpha.200")(props),
    }),
  },
};

export default Textarea;
