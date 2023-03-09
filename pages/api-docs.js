import { createSwaggerSpec } from "next-swagger-doc";
import Footer from "components/footer";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "components/chakraNextLink";
import Image from "next/image";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(import("swagger-ui-react"), { ssr: false });

function ApiDoc({ spec }) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Box
        px={4}
        bg={useColorModeValue("green.300", "green.500")}
        shadow={useColorModeValue("xl", "xl-dark")}
      >
        <Flex justify="space-between" h={16}>
          <Flex align="center" gap={2}>
            <Link href="/">
              <Image
                width={200}
                height={200}
                alt="duck"
                src="/images/icon.png"
              />
            </Link>
          </Flex>

          <HStack spacing={3}>
            <IconButton
              aria-label="toggleColorMode"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              isRound
              onClick={toggleColorMode}
              variant="ghost"
            />
          </HStack>
        </Flex>
      </Box>
      <SwaggerUI spec={spec} />
      <Footer></Footer>
    </>
  );
}

export const getStaticProps = async () => {
  const spec = createSwaggerSpec({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "CarMeeTiN API Documentation",
        version: "1.0",
      },
    },
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
