import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";

const ChakraNextLink = ({ href, children, ...props }) => {
  return (
    <ChakraLink as={NextLink} href={href} {...props}>
      {children}
    </ChakraLink>
  );
};

export default ChakraNextLink;
