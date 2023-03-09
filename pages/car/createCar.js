import {
  Button,
  Heading,
  Spacer,
  FormLabel,
  FormErrorMessage,
  FormControl,
  Select,
  VStack,
} from "@chakra-ui/react";
import { FormLayout, FormFields } from "components/genericForm";
import Layout from "components/layout";
import { Field, Form, Formik } from "formik";
import { useUser } from "lib/hooks";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const iterateYears = (startYear, finishYear) => {
  let years = [];
  for (let i = startYear; i <= finishYear; i++) {
    years.push(i);
  }
  return years;
};

const CreateCar = () => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.data) router.push("/");
  }, [user]);

  const [cars, setCars] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/car/getCars")
      .then((res) => res.json())
      .then((cars) => {
        setCars(cars);
        setLoading(false);
      });
  }, []);

  async function handleSubmit(values) {
    try {
      const res = await fetch("/api/car", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.status === 200) {
        router.push("/myGarage");
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
      name: "description",
      label: "Descrizione modifiche auto",
      type: "text",
      placeholder: "Descrizione breve",
    },
    {
      name: "image",
      label: "Immagine dell'auto",
      type: "file",
    },
  ];

  return (
    <Layout user={user}>
      <Head>
        <title>Aggiungi la tua auto</title>
      </Head>
      <FormLayout title={<Heading>Aggiungi la tua auto</Heading>}>
        <Formik
          initialValues={{
            producer: "",
            model: "",
            year: "",
            description: "",
            image: "",
          }}
          onSubmit={async (values, actions) => {
            await handleSubmit(values);
            await actions.validateForm();
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <VStack spacing={4}>
                <Field name="producer">
                  {({ field, form }) => (
                    <FormControl isInvalid={Boolean(form.errors.subject)}>
                      <FormLabel>Produttore dell'auto</FormLabel>
                      <Select
                        {...field}
                        border="2px"
                        onChange={(e) => {
                          props.values.model = "";
                          props.values.year = "";
                          props.handleChange(e);
                        }}
                      >
                        <option value="" disabled defaultValue>
                          {isLoading
                            ? "Caricamento..."
                            : "Audi, Nissan, Alfa Romeo, ecc..."}
                        </option>
                        {!isLoading
                          ? cars.map((car) => (
                              <option value={car.producer} key={car.producer}>
                                {car.producer}
                              </option>
                            ))
                          : null}
                      </Select>
                      <FormErrorMessage>
                        {form.errors.producer}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="model">
                  {({ field, form }) => (
                    <FormControl isInvalid={Boolean(form.errors.subject)}>
                      <FormLabel>Modello dell'auto</FormLabel>
                      <Select {...field} border="2px">
                        <option value="" disabled defaultValue>
                          {isLoading
                            ? "Caricamento..."
                            : props.values.producer !== ""
                            ? "RS3, GTR, Giulietta Quadrifoglio, ecc..."
                            : "Seleziona prima il produttore"}
                        </option>
                        {!isLoading
                          ? cars
                              .find(
                                (car) => car.producer === props.values.producer
                              )
                              ?.models.map((model) => (
                                <option value={model.model} key={model.model}>
                                  {model.model}
                                </option>
                              ))
                          : null}
                      </Select>
                      <FormErrorMessage>{form.errors.model}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="year">
                  {({ field, form }) => (
                    <FormControl isInvalid={Boolean(form.errors.subject)}>
                      <FormLabel>Anno di produzione</FormLabel>
                      <Select {...field} border="2px">
                        <option value="" disabled defaultValue>
                          {isLoading
                            ? "Caricamento..."
                            : props.values.model !== ""
                            ? "2020, 2021..."
                            : "Seleziona prima il modello"}
                        </option>
                        {!isLoading
                          ? iterateYears(
                              cars
                                .find(
                                  (car) =>
                                    car.producer === props.values.producer
                                )
                                ?.models.find(
                                  (model) => model.model === props.values.model
                                )?.firstYear,
                              cars
                                .find(
                                  (car) =>
                                    car.producer === props.values.producer
                                )
                                ?.models.find(
                                  (model) => model.model === props.values.model
                                )?.lastYear
                            ).map((year) => (
                              <option value={year} key={year}>
                                {year}
                              </option>
                            ))
                          : null}
                      </Select>
                      <FormErrorMessage>{form.errors.year}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <FormFields list={formList} />
                <Spacer my={4} />
                <Button w="100%" isLoading={props.isSubmitting} type="submit">
                  Aggiungi la tua auto!
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </FormLayout>
    </Layout>
  );
};

export default CreateCar;
