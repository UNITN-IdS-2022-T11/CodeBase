import { Button, Heading, Spacer, VStack } from "@chakra-ui/react";
import { AuthLayout, FormFields } from "components/authentication";
import Layout from "components/layout";
import { Form, Formik } from "formik";
import { useUser } from "lib/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const UpdateUser = () => {
  const user = useUser();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!user?.isLoading && !user.data) router.push("/");
    else if (!user?.isLoading) {
      setUsername(user.data.username);
      setEmail(user.data.email);
    }
  }, [user]);

  let userNameTakenMsg = "";

  async function handleSubmit(values) {
    const body = {
      username: values.username,
      email: values.email,
      image: values.image,
    };

    try {
      const res = await fetch("/api/updateUser", {
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

      if (
        error.message === "Username already exists" ||
        error.message === "Username not available, try again tomorrow"
      ) {
        userNameTakenMsg = "Username già in uso.";
      }
    }
  }

  const formList = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: email,
    },
    {
      name: "username",
      label: "Username",
      placeholder: username,
    },
    {
      name: "image",
      label: "Immagine profilo",
      type: "file",
    },
  ];

  return (
    <Layout user={user}>
      <Head>
        <title>Aggiorna account</title>
      </Head>
      <AuthLayout
        title={<Heading>Aggiorna le tue informazioni account</Heading>}
      >
        <Formik
          validationSchema={Yup.object().shape({
            username: Yup.string().test(
              "Taken",
              () => userNameTakenMsg,
              () => !userNameTakenMsg
            ),
          })}
          initialValues={{
            email: "",
            username: "",
            image: "",
          }}
          onSubmit={async (values, actions) => {
            await handleSubmit(values);
            userNameTakenMsg = "";
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <VStack spacing={4}>
                <FormFields list={formList} />
                <Spacer my={4} />
                <Button w="100%" isLoading={props.isSubmitting} type="submit">
                  Salva impostazioni
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </AuthLayout>
    </Layout>
  );
};

export default UpdateUser;
