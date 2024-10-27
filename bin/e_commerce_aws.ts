#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { ProductsAppStack } from '../lib/productsApp-stack'
import { ECommerceApiStack } from '../lib/ecommerceAPI-stack'

const app = new cdk.App();

const env: cdk.Environment = {
  account: "354188320224",
  region: "us-east-1"
}

const tags = {
  const: "ECommerce",
  team: "mandalorian"
}

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  tags: tags,
  env: env
})

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApiStack", {
  productsFeatchHandle: productsAppStack.productsFeatchHandler,
  tags: tags,
  env: env
})

eCommerceApiStack.addDependency(productsAppStack)