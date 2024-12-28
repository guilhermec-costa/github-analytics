import 'dotenv/config';
import fastify from "fastify";


const app = fastify();
 
const PORT = parseInt(process.env.PORT || '3333') 

app.listen({
    port: PORT
}).then(() => {
    console.log(`Server running at ${PORT}`)
});