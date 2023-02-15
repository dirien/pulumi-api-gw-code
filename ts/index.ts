import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const restApi = new aws.apigateway.RestApi("myDemoAPI", {description: "This is my API for demonstration purposes"});

/*
const resource = new aws.apigateway.Resource("test-resource", {
    restApi: restApi.id,
    parentId: restApi.rootResourceId,
    pathPart: "resource"
},{
    dependsOn: [
        restApi
    ]
})

const method = new aws.apigateway.Method("test-method", {
    restApi: restApi.id,
    resourceId: resource.id,
    httpMethod: "GET",
    authorization: "NONE"
},{
    dependsOn: [
        resource
    ]
})

const integration = new aws.apigateway.Integration("test-integration", {
    restApi: restApi.id,
    resourceId: resource.id,
    httpMethod: "GET",
    type: "MOCK"
},{
    dependsOn: [
        method
    ]
})*/

const resource2 = new aws.apigateway.Resource("test-resource2", {
    restApi: restApi.id,
    parentId: restApi.rootResourceId,
    pathPart: "resource2"
},{
    dependsOn: [
        restApi
    ]
})

const method2 = new aws.apigateway.Method("test-method2", {
    restApi: restApi.id,
    resourceId: resource2.id,
    httpMethod: "GET",
    authorization: "NONE"
},{
    dependsOn: [
        resource2
    ]
})

const integration2 = new aws.apigateway.Integration("test-integration2", {
    restApi: restApi.id,
    resourceId: resource2.id,
    httpMethod: "GET",
    type: "MOCK"
},{
    dependsOn: [
        method2
    ]
})


const deployment = new aws.apigateway.Deployment("test-deployment", {
    restApi: restApi.id,
    triggers: {
        redeploy: new Date().toISOString()
    }
},{
    deleteBeforeReplace: true,
    retainOnDelete: true,
    dependsOn: [
        //method,
        method2
    ]
})

const stage = new aws.apigateway.Stage("test-stage", {
    restApi: restApi.id,
    deployment: deployment.id,
    stageName: "TEST"
},{
    dependsOn: [
        deployment
    ]
})

/*
const size = "t2.micro";     // t2.micro is available in the AWS free tier
const ami = aws.getAmiOutput({
    filters: [{
        name: "name",
        values: ["amzn-ami-hvm-*"],
    }],
    owners: ["137112412989"], // This owner ID is Amazon
    mostRecent: true,
});

const group = new aws.ec2.SecurityGroup("webserver-secgrp", {
    ingress: [
        { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
    ],
});

const server = new aws.ec2.Instance("webserver-www", {
    instanceType: size,
    vpcSecurityGroupIds: [ group.id ], // reference the security group resource above
    ami: ami.id,
});

export const publicIp = server.publicIp;
export const publicHostName = server.publicDns;
*/