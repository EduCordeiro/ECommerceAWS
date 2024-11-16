import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as cdk from "aws-cdk-lib"
import * as dynadb from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs"

export class ProductsAppStack extends cdk.Stack{
    
    readonly productsFetchHandler: lambdaNodeJS.NodejsFunction
    readonly productsAdminHandler: lambdaNodeJS.NodejsFunction
    readonly productsDdb: dynadb.Table

    constructor(scope: Construct, id: string, props?: cdk.StackProps){

        super(scope, id, props)

        this.productsDdb = new dynadb.Table(
            this,
            "ProductsDdb",
            {
                tableName: "products",
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                partitionKey:{
                    name: "id",
                    "type": dynadb.AttributeType.STRING
                },
                billingMode: dynadb.BillingMode.PROVISIONED, // Provisionado ou Sobre demanda
                readCapacity: 1, // Limite de leitura
                writeCapacity: 1 // limite de escrita

            }

        )

        this.productsFetchHandler = new lambdaNodeJS.NodejsFunction(
            this,
            "ProductsFetchFunction",
            {
                runtime: lambda.Runtime.NODEJS_20_X,
                functionName: "ProductsFetchFunction",
                entry: "lambda/products/productsFetchFunction.ts",
                handler: "handler",
                memorySize: 512,
                timeout: cdk.Duration.seconds(5),
                // Agrupar
                bundling: {
                    minify: true,// o código menor possível 
                    sourceMap: false // desligando o mapa
                },
                // Ambiente
                environment: {
                    PRODUCTS_DDB: this.productsDdb.tableName
                }
            }
        )

        // grantReadData = conceder dados de leitura
        this.productsDdb.grantReadData(this.productsFetchHandler)

        this.productsAdminHandler = new lambdaNodeJS.NodejsFunction(
            this,
            "ProductsAdminFunction",
            {
                runtime: lambda.Runtime.NODEJS_20_X,
                functionName: "ProductsAdminFunction",
                entry: "lambda/products/productsAdminFunction.ts",
                handler: "handler",
                memorySize: 512,
                timeout: cdk.Duration.seconds(5),
                // Agrupar
                bundling: {
                    minify: true,// o código menor possível 
                    sourceMap: false // desligando o mapa
                },
                // Ambiente
                environment: {
                    PRODUCTS_DDB: this.productsDdb.tableName
                }
            }
        )

        this.productsDdb.grantWriteData(this.productsAdminHandler)
    }
}