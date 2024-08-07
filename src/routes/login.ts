import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export async function login(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.string(),
          400: z.string(),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const auth = getAuth();

      try {
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userToken = await userCredentials.user.getIdToken();

        reply.status(201).send(userToken);
      } catch (error) {
        return reply.status(400).send("E-mail ou senha incorretos.");
      }
    }
  );
}
