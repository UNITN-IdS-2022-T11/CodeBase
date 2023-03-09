import { Container, Stack, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Container as="footer" role="contentinfo" variant="footer">
      <Stack
        alignItems={{ base: "center", md: "center" }}
        justify={{ base: "center", md: "space-around" }}
        direction={{ base: "column", md: "row" }}
        py={4}
      >
        <Text>&copy; {new Date().getFullYear()} CarMeeTiN</Text>
      </Stack>
    </Container>
  );
};

export default Footer;
