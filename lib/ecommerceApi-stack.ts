import * as cdk from "aws-cdk-lib"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as apigatway from "aws-cdk-lib/aws-apigateway"
import * as cwlogs from "aws-cdk-lib/aws-logs"

import { Construct } from "constructs"

interface ECommerceApiStackProps extends cdk.StackProps{
    productsFetchHandle : lambdaNodeJS.NodejsFunction
}

export class ECommerceApiStack extends cdk.Stack{

    constructor(scope: Construct, id: string, props: ECommerceApiStackProps){

        super(scope, id, props)

        const logGroups = new cwlogs.LogGroup(this, "ECommerceApiLogs")

        const api = new apigatway.RestApi(this, "ECommerceApi", {
            restApiName: "ECommerceApi",
            cloudWatchRole: true,
            deployOptions: {
                accessLogDestination: new apigatway.LogGroupLogDestination(logGroups),
                accessLogFormat: apigatway.AccessLogFormat.jsonWithStandardFields({
                    httpMethod: true,
                    ip: true,
                    protocol: true,
                    requestTime: true,
                    resourcePath: true,
                    responseLength: true,
                    status: true,
                    caller: true,
                    user: true
                })
            }
        })

        const productsFetchIntegration = new apigatway.LambdaIntegration(props.productsFetchHandle)

        // api.root fornece o "/"        
        const productsResource = api.root.addResource("products") // fornece o "/products"
        productsResource.addMethod("GET", productsFetchIntegration)

    }
}