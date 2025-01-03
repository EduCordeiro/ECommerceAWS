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

        if(method === "GET"){

            console.log("GET")

            return{
                statusCode: 200,
                body: JSON.stringify({
                    message: "GET Products - OK",
                    lambdaRequestId: lambdaRequestId,
                    APIRequestId: APIRequestId
                })
            }
        }
    }
    else
    if(event.resource === "/products/{id}"){

        const productId = event.pathParameters!.id as string

        console.log(`GET /products/${productId}`)
        
        return{
            statusCode: 200,
            body: `GET /products/${productId}`
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Bad request",
            lambdaRequestId: lambdaRequestId,
            APIRequestId: APIRequestId            
        })
    }
}