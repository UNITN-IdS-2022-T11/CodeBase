import { Box, theme, useColorModeValue } from "@chakra-ui/react";
import Footer from "components/footer";
import Navbar from "components/navbar";
import Head from "next/head";

const Layout = ({ children, user }) => {
  return (
    <Box minH="100vh">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="theme-color"
          content={useColorModeValue(
            theme.colors.yellow[300],
            theme.colors.yellow[500]
          )}
        />
      </Head>
      <Navbar user={user} />
      <Box>{children}</Box>
      <Footer />
    </Box>
  );
};

export default Layout;
