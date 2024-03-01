import { SwaggerUIOptions } from "@elysiajs/swagger/dist/swagger/types"

const swaggerConfig = {
    documentation: { 
        info: { 
            title: 'BBooker API', 
            version: "0.0.1", 
            description: "This is the official Beauty Booker API."
        }
    },
    provider: "swagger-ui",
}

export { swaggerConfig }