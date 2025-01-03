#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { ProductsAppStack } from '../lib/productsApp-stack'
import { ECommerceApiStack } from '../lib/ecommerceApi-stack'
import { ProductsAppLayerStack } from '../lib/productsAppLayers-stack'

const app = new cdk.App();

const env: cdk.Environment = {
  account: "354188320224",
  region: "us-east-1"
}

const tags = {
  const: "ECommerce",
  team: "Mandalorian"
}

const productsAppLayerStack = new ProductsAppLayerStack(app, "ProductsAppLayers", {
  tags: tags,
  env: env  
})

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  tags: tags,
  env: env
})
productsAppStack.addDependency(productsAppLayerStack)

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
  productsFetchHandle: productsAppStack.productsFetchHandler,
  productsAdminHandle: productsAppStack.productsAdminHandler,
  tags: tags,
  env: env
})
eCommerceApiStack.addDependency(productsAppStack)