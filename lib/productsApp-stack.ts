import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"

export class ProductsAppStack extends cdk.Stack{
    
    readonly productsFeatchHandler: lambdaNodeJS.NodejsFunction

    constructor(scope: Construct, id: string, props?: cdk.StackProps){

        super(scope, id, props)

        this.productsFeatchHandler = new lambdaNodeJS.NodejsFunction(
            this,
            "productsFeatchHandler",
            {
                runtime: lambda.Runtime.NODEJS_20_X,
                functionName: "productsFeatchHandler",
                entry: "lambda/products/productsFeatchFunction.ts",
                handler: "handler",
                memorySize: 512,
                timeout: cdk.Duration.seconds(5),
                bundling: {
                    minify: true,// o código menor possível 
                    sourceMap: false // desligando o mapa
                }
            }
        )
    }
}