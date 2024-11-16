import { JobDefinitionBase } from "aws-cdk-lib/aws-batch";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { json } from "stream/consumers";


export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>
{
    const lambdaRequestId   = context.awsRequestId;             // Identificador único da excecussão da função lambda
    const APIRequestId      = event.requestContext.requestId;   // Identificador único da requisição da API
    const method            = event.httpMethod

    console.log(`API Gateway RequestId: ${APIRequestId} - Lambda RequestId: ${lambdaRequestId}`)

    if(event.resource === "/products"){
        console.log("POST /products")
        return{
            statusCode: 201,
            body: "POST /products"
        }
    }
    else
    if(event.resource === "/products/{id}"){

        const productId = event.pathParameters!.id as string

        if(event.httpMethod === "PUT"){

            console.log(`PUT /products/${productId}`)
            return{
                statusCode: 200,
                body: `PUT /products/${productId}`
            }

        }
        else
        if(event.httpMethod === "DELETE"){

            console.log(`DELETE /products/${productId}`)
            return{
                statusCode: 200,
                body: `DELETE /products/${productId}`
            }            

        }

    }    

    return{
        statusCode: 400,
        body: "Bad request"
    }                

}