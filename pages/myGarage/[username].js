import {
  Box,
  Container,
  Stack,
  VStack,
  Heading,
  useColorModeValue,
  Text,
  Spacer,
} from "@chakra-ui/react";
import Layout from "components/layout";
import Head from "next/head";
import { ChakraNextImage } from "components/utils";
import { findUser } from "lib/dbUser";
import { useUser } from "lib/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const getServerSideProps = async (context) => {
  const user = await findUser(context.query);

  return {
    props: {
      username: context.query.username,
      userid: user?.id ? user.id : null,
    },
  };
};

const MyGarage = ({ username, userid }) => {
  const user = useUser();
  const router = useRouter();

  const [myCars, setMyCars] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!userid) router.push("/myGarage");
  });

  useEffect(() => {
    fetch("/api/car?userid=" + userid)
      .then((res) => res.json())
      .then((myCars) => {
        setMyCars(myCars);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Layout user={user}>
        <Head>
          <title>CarMeeTiN!</title>
        </Head>
        <Container
          maxW="750px"
          px={{ base: "", sm: "0" }}
          py={{ base: "0", md: "24" }}
        >
          <Stack spacing="8">
            <VStack textAlign="center">
              {username === user?.data?.username ? (
                <Heading>Il tuo garage</Heading>
              ) : (
                <Heading>Garage di {username}</Heading>
              )}
            </VStack>

            {!isLoading ? (
              myCars.map((item, index) => (
                <Box
                  key={index}
                  px={{ base: "4", sm: "10" }}
                  py={{ base: "0", sm: "8" }}
                  bg={{
                    sm: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
                  }}
                  borderRadius={{ base: "none", sm: "xl" }}
                  shadow={{
                    base: "none",
                    sm: useColorModeValue("md", "md-dark"),
                  }}
                >
                  <Heading>
                    {item.carType.producer + ", " + item.carType.model}
                  </Heading>
                  <Text>Anno di produzione: {item.carType.year} </Text>
                  <Text>Modifiche/Descrizione: {item.description}</Text>
                  <Spacer my={4} />
                  <ChakraNextImage
                    height={330}
                    width={670}
                    maxHeight={375}
                    maxWidth={700}
                    alt="car"
                    src={item.image ? item.image : "/images/carmeeting.png"}
                  />
                </Box>
              ))
            ) : (
              <Text>Caricamento...</Text>
            )}
          </Stack>
        </Container>
      </Layout>
    </>
  );
};

export default MyGarage;
