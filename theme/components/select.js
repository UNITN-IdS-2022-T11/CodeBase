import { mode } from "@chakra-ui/theme-tools";

const Select = {
  variants: {
    outline: (props) => ({
      field: {
        borderColor: mode("blackAlpha.200", "whiteAlpha.200")(props),
      },
    }),
  },
};

export default Select;
