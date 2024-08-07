import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { log } from "console";

export async function register(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z.string(),
          400: z.string(),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const auth = getAuth();

      try {
        await createUserWithEmailAndPassword(auth, email, password);

        reply.status(201).send("Usuário criado com sucesso!");
      } catch (error) {
        const errorMessage = error.message;
        return reply.status(400).send(errorMessage);
      }
    }
  );
}
