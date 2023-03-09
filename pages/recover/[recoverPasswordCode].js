import { Button, Heading, Spacer, VStack } from "@chakra-ui/react";
import { AuthLayout, FormFields } from "components/authentication";
import Layout from "components/layout";
import { Form, Formik } from "formik";
import { findRecoverPwdUser } from "lib/dbUser";
import { regSchema } from "lib/yupSchemas";
import Head from "next/head";
import { useRouter } from "next/router";
import * as Yup from "yup";

export const getServerSideProps = async (context) => {
  const recoverPasswordCode = context.query.recoverPasswordCode;

  const recoverPasswordUserObject = await findRecoverPwdUser({
    secret: recoverPasswordCode,
  });

  if (!recoverPasswordUserObject) return { notFound: true };

  return {
    props: {
      username: recoverPasswordUserObject.username,
      recoverPasswordCode: recoverPasswordCode,
    },
  };
};

const RecoverPassword = ({ username, recoverPasswordCode }) => {
  const router = useRouter();

  async function handleSubmit(values) {
    const body = {
      username: username,
      recoverPasswordCode: recoverPasswordCode,
      newPassword: values.password,
    };

    try {
      const res = await fetch("/api/user/recoverPassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
      name: "password",
      label: "Nuova password",
      type: "password",
      placeholder: "Perfavore, inserisci una password sicura",
    },
    {
      name: "passwordConfirm",
      label: "Conferma nuova password",
      type: "password",
      placeholder: "Conferma la tua password",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Password dimenticata</title>
      </Head>
      <AuthLayout title={<Heading>Recupera la tua Password</Heading>}>
        <Formik
          validationSchema={Yup.object().shape({
            password: regSchema.password,
            passwordConfirm: Yup.string()
              .required("This field is very important.")
              .oneOf([Yup.ref("password")], "Le password non corrispondono!"),
          })}
          initialValues={{ password: "", passwordConfirm: "" }}
          onSubmit={async (values, actions) => {
            await handleSubmit(values);
            await actions.validateForm();
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <VStack spacing={4}>
                <FormFields list={formList} />
                <Spacer my={4} />
                <Button w="100%" isLoading={props.isSubmitting} type="submit">
                  Cambia la password
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </AuthLayout>
    </Layout>
  );
};

export default RecoverPassword;
