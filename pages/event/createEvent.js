import {
  Button,
  Heading,
  Spacer,
  FormLabel,
  FormControl,
  VStack,
} from "@chakra-ui/react";
import { FormLayout, FormFields } from "components/genericForm";
import Layout from "components/layout";
import { Form, Formik } from "formik";
import { useUser } from "lib/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Map from "components/map";

const CreateEvent = () => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.isLoading && !user.data) router.push("/");
  }, [user]);

  async function handleSubmit(values) {
    try {
      const res = await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.status === 200) {
        router.push("/login");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("An unexpected error happened occurred:", error);
    }
  }

  const formList = [
    {
      name: "eventName",
      label: "Nome evento",
      placeholder: "Nome evento",
    },
    {
      name: "startDate",
      label: "Data inizio",
      type: "datetime-local",
    },
    {
      name: "finishDate",
      label: "Data fine",
      type: "datetime-local",
    },
    {
      name: "description",
      label: "Breve descrizione",
      type: "text",
      placeholder: "Descrizione evento",
    },
    {
      name: "allowed cars",
      label: "Macchine ammesse",
      type: "list",
      placeholder: "Lista...",
    },
    {
      name: "maxParticipants",
      label: "Massimo Partecipanti",
      type: "number",
      placeholder: "10",
    },
    {
      name: "cost",
      label: "Costo partecipazione",
      type: "number",
      placeholder: "0,00 €",
    },
    {
      name: "image",
      label: "Immagine evento",
      type: "file",
    },
  ];

  return (
    <Layout user={user}>
      <Head>
        <title>Crea Evento</title>
      </Head>
      <FormLayout title={<Heading>Crea Evento</Heading>}>
        <Formik
          initialValues={{
            eventName: "",
            startDate: "",
            finishDate: "",
            descripriton: "",
            allowedCars: "",
            maxParticipants: "",
            cost: "",
            image: "",
          }}
          onSubmit={async (values, actions) => {
            values.location = "46.068990279231414, 11.150593269314516";
            await handleSubmit(values);
            await actions.validateForm();
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <VStack spacing={4}>
                <FormFields list={formList} />
                <FormControl>
                  <FormLabel>Seleziona il luogo</FormLabel>
                  <Map />
                </FormControl>
                <Spacer my={4} />
                <Button w="100%" isLoading={props.isSubmitting} type="submit">
                  Crea Evento!
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </FormLayout>
    </Layout>
  );
};

export default CreateEvent;
