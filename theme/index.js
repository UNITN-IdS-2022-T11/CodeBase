import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

// Global style overrides
/* import styles from "./styles"; */

// Foundational style overrides
/* import borders from './foundations/borders'; */

// Component style overrides
import Accordion from "./components/accordion";
import Checkbox from "./components/checkbox";
import Container from "./components/container";
import Input from "./components/input";
import Link from "./components/link";
import Select from "./components/select";
import Textarea from "./components/textarea";

const overrides = {
  config: {
    useSystemColorMode: true,
  },
  /* styles, */
  /* borders, */
  /* // Other foundational style overrides go here */
  components: {
    Accordion,
    Checkbox,
    Container,
    Input,
    Link,
    Select,
    Textarea,
  },
};

export default extendTheme(
  overrides,
  withDefaultColorScheme({ colorScheme: "green" })
);
