import {
  Box,
  Container,
  Stack,
  HStack,
  VStack,
  Heading,
  useColorModeValue,
  Text,
  Button,
  Spacer,
} from "@chakra-ui/react";
import Layout from "components/layout";
import Head from "next/head";
import { ChakraNextImage } from "components/utils";
import { useRouter } from "next/router";
import { useUser } from "lib/hooks";
import { useEffect, useState } from "react";

const MyGarage = () => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.isLoading && !user.data) router.push("/");
  }, [user]);

  const [myCars, setMyCars] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((user) => {
        user
          ? fetch("/api/car?userid=" + user.userid)
              .then((res) => res.json())
              .then((myCars) => {
                setMyCars(myCars);
                setLoading(false);
              })
          : router.push("/");
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
              <Heading>Il tuo garage</Heading>
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
                  <Spacer my={4} />
                  <HStack justify="space-between">
                    <Button>Modifica l'auto</Button>
                    <Button
                      onClick={() => {
                        fetch("/api/car", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: item.id }),
                        });
                      }}
                    >
                      Elimina l'auto
                    </Button>
                  </HStack>
                </Box>
              ))
            ) : (
              <Text>Caricamento...</Text>
            )}
            <Button
              onClick={() => {
                router.push("/car/createCar");
              }}
            >
              Aggiungi un'auto
            </Button>
          </Stack>
        </Container>
      </Layout>
    </>
  );
};

export default MyGarage;
