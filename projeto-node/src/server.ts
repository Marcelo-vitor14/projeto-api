import "reflect-metadata";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { AppDataSource } from "./data-source";
import { AuthController } from "./controllers/AuthController";
import { UserController } from "./controllers/UserController";
import { CarController } from "./controllers/CarController";
import { ensureAuthenticated } from "./middlewares/ensureAuthenticated";

const app = express();
const authController = new AuthController();
const userController = new UserController();
const carController = new CarController();

app.use(express.json());

// Configuração das opções do Swagger
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Node.js + TypeORM",
      version: "1.0.0",
      description: "Documentação da API desenvolvida para o projeto MVP",
    },
    servers: [
      {
        url: "http://localhost:3333",
        description: "Servidor Local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  // Mapeia onde o Swagger vai procurar os comentários JSDoc de documentação
  apis: ["./src/server.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Rota para expor a interface do Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /:
 *   get:
 *     summary: Rota inicial de verificação de status
 *     tags:
 *       - Status
 *     responses:
 *       200:
 *         description: API a funcionar corretamente.
 */
app.get("/", (req, res) => {
  return res.json({ message: "API TypeScript + TypeORM rodando!" });
});

// Em Express 4, encaminhe rejeições das actions async para o middleware de erro.
const route = (handler: (req: any, res: any) => Promise<any>) => (req: any, res: any, next: any) =>
  Promise.resolve(handler(req, res)).catch(next);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Cadastra usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201: { description: Usuário criado }
 *       400: { description: Dados inválidos }
 *       409: { description: E-mail já cadastrado }
 */
app.post("/auth/register", route((req, res) => authController.register(req, res)));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Autentica e retorna JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Token emitido }
 *       401: { description: Credenciais inválidas }
 */
app.post("/auth/login", route((req, res) => authController.login(req, res)));

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Retorna o usuário do token
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Usuário autenticado }
 *       401: { description: Token ausente ou inválido }
 */
app.get("/users/me", ensureAuthenticated, route((req, res) => userController.me(req, res)));

/**
 * @openapi
 * /cars:
 *   get:
 *     tags: [Cars]
 *     summary: Lista carros
 *     responses:
 *       200: { description: Lista de carros }
 *   post:
 *     tags: [Cars]
 *     summary: Cadastra carro (requer JWT)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [brand, model, licensePlate, dailyRate]
 *             properties:
 *               brand: { type: string }
 *               model: { type: string }
 *               licensePlate: { type: string }
 *               dailyRate: { type: number, minimum: 0.01 }
 *     responses:
 *       201: { description: Carro criado }
 *       400: { description: Dados inválidos }
 *       401: { description: Token ausente ou inválido }
 *       409: { description: Placa já cadastrada }
 * /cars/{id}:
 *   get:
 *     tags: [Cars]
 *     summary: Consulta carro por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Carro encontrado }
 *       404: { description: Carro não encontrado }
 *   put:
 *     tags: [Cars]
 *     summary: Atualiza carro (requer JWT)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Carro atualizado }
 *       401: { description: Token ausente ou inválido }
 *       404: { description: Carro não encontrado }
 *   delete:
 *     tags: [Cars]
 *     summary: Remove carro (requer JWT)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Carro removido }
 *       401: { description: Token ausente ou inválido }
 *       404: { description: Carro não encontrado }
 */
app.get("/cars", route((req, res) => carController.index(req, res)));
app.get("/cars/:id", route((req, res) => carController.show(req, res)));
app.post("/cars", ensureAuthenticated, route((req, res) => carController.create(req, res)));
app.put("/cars/:id", ensureAuthenticated, route((req, res) => carController.update(req, res)));
app.delete("/cars/:id", ensureAuthenticated, route((req, res) => carController.delete(req, res)));

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  return res.status(500).json({ message: "Erro interno do servidor" });
});

AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida!");

    const port = Number(process.env.PORT ?? 3333);
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
      console.log(`Documenta��o Swagger dispon�vel em: http://localhost:${port}/docs`);
    });
  })
  .catch((error: unknown) => {
    console.error("Erro ao inicializar a conexão com o banco de dados:", error);
  });
