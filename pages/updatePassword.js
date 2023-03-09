import {
  Button,
  HStack,
  Heading,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AuthLayout, FormFields } from "components/authentication";
import Layout from "components/layout";
import { Form, Formik } from "formik";
import { useUser } from "lib/hooks";
import { loginSchema, regSchema } from "lib/yupSchemas";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

const UpdatePassword = () => {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (!user?.isLoading && !user.data) router.push("/");
  }, [user]);

  let invalidPassword = false;

  async function handleSubmit(values) {
    const body = {
      username: user.data?.username,
      password: values.password,
      newPassword: values.newPassword,
    };

    try {
      const res = await fetch("/api/updatePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 200) {
        router.push("/");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("An unexpected error happened occurred:", error);

      invalidPassword =
        error.message === "Invalid username and password combination";
    }
  }

  const formList = [
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Inserisci la password corrente",
    },
    {
      name: "newPassword",
      label: "Nuova Password",
      type: "password",
      placeholder: "Inserisci una password sicura",
    },
    {
      name: "newPasswordConfirm",
      label: "Confirm Nuova Password",
      type: "password",
      placeholder: "Conferma password sicura",
    },
  ];

  return (
    <Layout user={user}>
      <Head>
        <title>Aggiorna la tua password</title>
      </Head>
      <AuthLayout
        title={<Heading>Aggiorna la tua password</Heading>}
        bottom={
          <HStack justify="center">
            <Text>
              Aggiornare la tua password regolarmente è una buona abitudine!
            </Text>
          </HStack>
        }
      >
        <Formik
          validationSchema={Yup.object().shape({
            password: loginSchema.password.test(
              "WrongPassword",
              "La password è incorretta!",
              () => !invalidPassword
            ),
            newPassword: regSchema.password.notOneOf(
              [Yup.ref("password")],
              "La nuova password non può essere uguale alla vecchia!"
            ),
            newPasswordConfirm: Yup.string()
              .required("Questo campo è obbligatorio!")
              .oneOf(
                [Yup.ref("newPassword")],
                "Le password non corrispondono!"
              ),
          })}
          initialValues={{
            password: "",
            newPassword: "",
            newPasswordConfirm: "",
          }}
          onSubmit={async (values, actions) => {
            await handleSubmit(values);
            await actions.validateForm();
            invalidPassword = false;
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <VStack spacing={4}>
                <FormFields list={formList} />
                <Spacer my={4} />
                <Button w="100%" isLoading={props.isSubmitting} type="submit">
                  Aggiorna la tua password
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </AuthLayout>
    </Layout>
  );
};

export default UpdatePassword;
