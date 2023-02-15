import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws-native";

const restApi = new aws.apigateway.RestApi("myDemoAPI", {
    name: "myDemoAPI",
    description: "This is my API for demonstration purposes"

});

const resource = new aws.apigateway.Resource("test-resource", {
    restApiId: restApi.id,
    parentId: restApi.rootResourceId,
    pathPart: "resource"
},{
    dependsOn: [
        restApi
    ]
})

const method = new aws.apigateway.Method("test-method", {
    restApiId: restApi.id,
    resourceId: resource.resourceId,
    httpMethod: "GET",
    authorizationType: aws.apigateway.MethodAuthorizationType.None,
    integration: {
        type: aws.apigateway.MethodIntegrationType.Mock,
        integrationHttpMethod: "GET"
    },
    operationName: "test",
},{
    dependsOn: [
        resource
    ]
})


const resource2 = new aws.apigateway.Resource("test-resource2", {
    restApiId: restApi.id,
    parentId: restApi.rootResourceId,
    pathPart: "resource2"
},{
    dependsOn: [
        restApi
    ]
})

const method2 = new aws.apigateway.Method("test-method2", {
    restApiId: restApi.id,
    resourceId: resource2.resourceId,
    httpMethod: "GET",
    authorizationType: aws.apigateway.MethodAuthorizationType.None,
    integration: {
        type: aws.apigateway.MethodIntegrationType.Mock,
        integrationHttpMethod: "GET"
    },
    operationName: "test",
},{
    dependsOn: [
        resource2
    ]
})


const deployment = new aws.apigateway.Deployment("test-deployment-2", {
    restApiId: restApi.id,
    description: "This is my API for demonstration purposes"
},{
    replaceOnChanges: [
        "description"
    ],
    dependsOn: [
        method,
        method2
    ]
})

const stage = new aws.apigateway.Stage("test-stage", {
    restApiId: restApi.id,
    deploymentId: deployment.deploymentId,
    stageName: "TEST"
},{
    dependsOn: [
        deployment
    ]
})