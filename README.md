# Serverless

This repo holds all the serverless lambda functions and configuration that we use across Reevoo.

Let's try to keep them grouped by related areas, so for example all serverless lambda functions and configurations related to our Reporting Warehouse project will go inside the folder "reporting_warehouse".

To deploy the lambdas and the serverless configuration we use The Serverless Framework (https://serverless.com/framework/docs/).

Every root folder in this repository will be a separate serverless project, which can be deployed as a single separate entity.
So, for our Reporting Warehouse project, we have a serverless project inside the folder "reporting_warehouse".
We can add extra root folders for additional serverless projects as we need them.

### Development setup

Install the serverless cli if you don't have it already:

```
    npm install -g serverless
```
**Note**: Make sure you have Node.js v6.5.0 or later in your system.

### Deployment

Go into the README in the individual projects within this repo for details on how to deploy them:

- https://github.com/reevoo/serverless/blob/master/reporting-warehouse/README.md
