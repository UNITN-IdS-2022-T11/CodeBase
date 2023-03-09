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
import { useEffect, useState } from "react";
import { useUser } from "lib/hooks";
import Link from "components/chakraNextLink";

const getPrettyDate = (date) => {
  return new Date(date).toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getPrettyHour = (date) => {
  return new Date(date).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Home = () => {
  const user = useUser();

  const [myEvents, setMyEvents] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/event")
      .then((res) => res.json())
      .then(async (myEvents) => {
        for (let i = 0; i < myEvents.length; i++) {
          const res = await (
            await fetch("/api/user/getUsername?userid=" + myEvents[i].ownerId)
          ).json();
          myEvents[i].username = res.username;
        }
        setMyEvents(myEvents);
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
              <Heading>Benvenuto su CarMeeTiN</Heading>
            </VStack>

            {!isLoading ? (
              myEvents.map((item, index) => (
                <Link key={index} href={"event/" + item.id}>
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
                    <Heading>{item.eventName}</Heading>
                    <Text>Utente: {item.username}</Text>
                    <Text>Descrizione: {item.description}</Text>
                    <Text>
                      Data inizio:{" "}
                      {getPrettyDate(item.startDate) +
                        ", " +
                        getPrettyHour(item.startDate)}
                    </Text>
                    <Text>
                      Numero di posti ancora disponibili:{" "}
                      {item.maxParticipants - item.participants}
                    </Text>
                    <Spacer my={4} />
                    <ChakraNextImage
                      height={330}
                      width={670}
                      maxHeight={375}
                      maxWidth={700}
                      alt="car"
                      src="/images/carmeeting.png"
                    />
                  </Box>
                </Link>
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

export default Home;
