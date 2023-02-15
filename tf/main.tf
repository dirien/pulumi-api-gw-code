terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.54.0"
    }
  }
}

provider "aws" {
  # Configuration options
}

resource "aws_api_gateway_rest_api" "MyDemoAPI" {
  name        = "MyDemoAPI"
  description = "This is my API for demonstration purposes"
}


resource "aws_api_gateway_resource" "MyDemoResource" {
  rest_api_id = aws_api_gateway_rest_api.MyDemoAPI.id
  parent_id   = aws_api_gateway_rest_api.MyDemoAPI.root_resource_id
  path_part   = "v1"
  depends_on = [
    aws_api_gateway_rest_api.MyDemoAPI
  ]
}

resource "aws_api_gateway_method" "test-method" {
  rest_api_id   = aws_api_gateway_rest_api.MyDemoAPI.id
  resource_id   = aws_api_gateway_resource.MyDemoResource.id
  http_method   = "GET"
  authorization = "NONE"
  depends_on = [
    aws_api_gateway_resource.MyDemoResource
  ]
}

resource "aws_api_gateway_integration" "MyDemoIntegration" {
  rest_api_id = aws_api_gateway_rest_api.MyDemoAPI.id
  resource_id = aws_api_gateway_resource.MyDemoResource.id
  http_method = aws_api_gateway_method.test-method.http_method
  type        = "MOCK"
  depends_on = [
    aws_api_gateway_method.test-method
  ]
}


resource "aws_api_gateway_resource" "MyDemoResource2" {
  rest_api_id = aws_api_gateway_rest_api.MyDemoAPI.id
  parent_id   = aws_api_gateway_rest_api.MyDemoAPI.root_resource_id
  path_part   = "v2"
  depends_on = [
    aws_api_gateway_rest_api.MyDemoAPI
  ]
}

resource "aws_api_gateway_method" "test-method2" {
  rest_api_id   = aws_api_gateway_rest_api.MyDemoAPI.id
  resource_id   = aws_api_gateway_resource.MyDemoResource2.id
  http_method   = "GET"
  authorization = "NONE"
  depends_on = [
    aws_api_gateway_resource.MyDemoResource2
  ]
}

resource "aws_api_gateway_integration" "MyDemoIntegration2" {
  rest_api_id = aws_api_gateway_rest_api.MyDemoAPI.id
  resource_id = aws_api_gateway_resource.MyDemoResource2.id
  http_method = aws_api_gateway_method.test-method2.http_method
  type        = "MOCK"
  depends_on = [
    aws_api_gateway_method.test-method2
  ]
}



resource "aws_api_gateway_deployment" "MyDemoDeployment" {
  rest_api_id = aws_api_gateway_rest_api.MyDemoAPI.id
  triggers = {
    redeployment = timestamp()
  }

  lifecycle {
    create_before_destroy = true
  }
  depends_on = [
    aws_api_gateway_method.test-method,
    aws_api_gateway_method.test-method2
  ]
}

resource "aws_api_gateway_stage" "MyDemoStage" {
  deployment_id = aws_api_gateway_deployment.MyDemoDeployment.id
  rest_api_id   = aws_api_gateway_rest_api.MyDemoAPI.id

  stage_name = "TEST"
  depends_on = [
    aws_api_gateway_deployment.MyDemoDeployment
  ]
}
