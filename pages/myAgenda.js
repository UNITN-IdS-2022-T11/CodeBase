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
import { useRouter } from "next/router";
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

const MyAgenda = () => {
  const user = useUser();
  const router = useRouter();

  const [myEvents, setMyEvents] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.data) router.push("/");
    else if (!user.isLoading && myEvents === null) {
      fetch("/api/event/myAgenda?username=" + user.data.username)
        .then((res) => res.json())
        .then((myEvents) => {
          setMyEvents(myEvents);
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <>
      <Layout user={user}>
        <Head>
          <title>La tua agenda!</title>
        </Head>
        <Container
          maxW="750px"
          px={{ base: "", sm: "0" }}
          py={{ base: "0", md: "24" }}
        >
          <Stack spacing="8">
            <VStack textAlign="center">
              <Heading>La tua agenda</Heading>
            </VStack>

            {!isLoading ? (
              myEvents.length === 0 ? (
                <Heading>Sembra che non sei iscritto ad alcun evento!</Heading>
              ) : (
                myEvents.map((item, index) => (
                  <Link key={index} href={"event/" + item.id}>
                    <Box
                      px={{ base: "4", sm: "10" }}
                      py={{ base: "0", sm: "8" }}
                      bg={{
                        sm: useColorModeValue(
                          "blackAlpha.200",
                          "whiteAlpha.200"
                        ),
                      }}
                      borderRadius={{ base: "none", sm: "xl" }}
                      shadow={{
                        base: "none",
                        sm: useColorModeValue("md", "md-dark"),
                      }}
                    >
                      <Heading>{item.eventName}</Heading>
                      <Text>Descrizione: {item.description}</Text>
                      <Text>
                        Data inizio:{" "}
                        {getPrettyDate(item.startDate) +
                          ", " +
                          getPrettyHour(item.startDate)}
                      </Text>
                      <Text>
                        Data fine:{" "}
                        {getPrettyDate(item.finishDate) +
                          ", " +
                          getPrettyHour(item.finishDate)}
                      </Text>
                      <Text>
                        Numero massimo di partecipanti: {item.maxParticipants}
                      </Text>
                      <Text>Numero di partecipanti: {item.participants}</Text>
                      {item.price ? (
                        <Text>Prezzo: {item.price.toFixed(2) + " €"}</Text>
                      ) : (
                        <Text>Prezzo: gratuito</Text>
                      )}
                      <Text>Luogo: {item.location}</Text>
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
              )
            ) : (
              <Text>Caricamento...</Text>
            )}
          </Stack>
        </Container>
      </Layout>
    </>
  );
};

export default MyAgenda;
