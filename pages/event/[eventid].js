import {
  Button,
  Heading,
  Spacer,
  Stack,
  Container,
  Box,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import Layout from "components/layout";
import { ChakraNextImage } from "components/utils";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "lib/hooks";
import Map from "components/map";

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

export const getServerSideProps = async (context) => {
  return {
    props: {
      eventid: context.query.eventid,
    },
  };
};

const Event = ({ eventid }) => {
  const router = useRouter();
  const user = useUser();

  const [event, setEvent] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [subscribe, setSubscribe] = useState(true);

  const handleSubmit = async (subscribe) => {
    try {
      let res = await fetch("/api/event/subscribeEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventid: eventid,
          subscribe: subscribe,
        }),
      });
      if (res.status === 200) {
        let updatedEvent = event;
        updatedEvent.participants += subscribe ? 1 : -1;
        setEvent(updatedEvent);
        setSubscribe(!subscribe);
      } else if (res.status !== 200) {
        throw new Error(await res.text());
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("An unexpected error happened occurred:", error);
    }
  };

  useEffect(() => {
    if (event === null && !user.isLoading) {
      fetch("/api/event?eventid=" + eventid)
        .then((res) => res.json())
        .then(async (event) => {
          if (event === null) router.push("/");
          const res = await (
            await fetch("/api/user/getUsername?userid=" + event.ownerId)
          ).json();
          event.username = res.username;
          if (event.participantsIds.find((id) => id === user?.data?.userid))
            setSubscribe(false);
          else setSubscribe(true);
          setEvent(event);
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <Layout user={user}>
      <Head>
        <title>Evento!</title>
      </Head>
      <Container
        maxW="750px"
        px={{ base: "", sm: "0" }}
        py={{ base: "0", md: "24" }}
      >
        <Stack spacing="8">
          {!isLoading ? (
            <Box
              px={{ base: "4", sm: "10" }}
              py={{ base: "0", sm: "8" }}
              bg={{ sm: useColorModeValue("blackAlpha.200", "whiteAlpha.200") }}
              borderRadius={{ base: "none", sm: "xl" }}
              shadow={{ base: "none", sm: useColorModeValue("md", "md-dark") }}
            >
              <Heading>{event.eventName}</Heading>
              <Text>Utente: {event.username}</Text>
              <Text>Descrizione: {event.description}</Text>
              <Text>
                Data inizio:{" "}
                {getPrettyDate(event.startDate) +
                  ", " +
                  getPrettyHour(event.startDate)}
              </Text>
              <Text>
                Data fine:{" "}
                {getPrettyDate(event.finishDate) +
                  ", " +
                  getPrettyHour(event.finishDate)}
              </Text>
              <Text>
                Numero massimo di partecipanti: {event.maxParticipants}
              </Text>
              <Text>Numero di partecipanti: {event.participants}</Text>
              {event.price ? (
                <Text>Prezzo: {event.price.toFixed(2) + " €"}</Text>
              ) : (
                <Text>Prezzo: gratuito</Text>
              )}
              <Text>Luogo: {event.location}</Text>
              <Map />
              <Spacer my={4} />
              <ChakraNextImage
                height={330}
                width={670}
                maxHeight={375}
                maxWidth={700}
                alt="car"
                src="/images/carmeeting.png"
              />
              <Spacer my={4} />
              {event.ownerId !== user?.data?.userid ? (
                <Button
                  onClick={() => {
                    handleSubmit(subscribe);
                  }}
                >
                  {subscribe
                    ? "Iscriviti all'evento"
                    : "Disiscriviti dall'evento"}
                </Button>
              ) : null}
            </Box>
          ) : (
            <Text>Loading...</Text>
          )}
        </Stack>
      </Container>
    </Layout>
  );
};

export default Event;
