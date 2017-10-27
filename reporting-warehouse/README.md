# Reporting Warehouse Serverless

This serverless project contains all AWS serverless configuration for the messaging infrastructure used in our Reporting Warehouse platform.

Specifically this serverless application creates/updates all of the following resources:

* All kineses streams needed by all applications across Reevoo so they can push events with the information we need to populate our Reporting Warehouse Landing Database.


* Any lambda functions needed for processing/transforming the events pushed into any of our Kinesis streams.


* Any Kineses firehoses used to persist stream data into our Reporting Warehouse Redshift Landing Database.


### Development setup

1. Install the serverless cli if you don't already have it:

    ```
        npm install -g serverless
    ```

    **Note**: Make sure you have Node.js v6.5.0 or later in your system.

2. Set up an AWS profile with the access key and secret associated to the account where you want to deploy the serverless configuration. For example you can create a "reporting_warehouse_dev" profile as follow:

    * Open for edition your "~/.aws/credentials" file. For example using "vi" you can edit the file with the command below:

        ```
            vi ~/.aws/credentials
        ```
    * Add the following lines to the “~/.aws/credentials” file and save it (you will have to replace the example values for your real key and secret values).

        ```
            [reporting_warehouse_dev]
            aws_access_key_id=EXAMPLEAKIAIOSFODNN7
            aws_secret_access_key=EXAMPLEKEYwJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
        ```
        Once saved, you will be able to use "reporting_warehouse_dev" aws profile to deploy the serverless application to the associated account. See the next section explaining how to deply the app for more details.

    * Note that you can add multiple profiles to your “~/.aws/credentials” file. For example if you want another profile for deploying to production and you want to name the new profile "reporting_warehouse_prod", then your credentials file would look like below:

            ```
            [reporting_warehouse_dev]
            aws_access_key_id=EXAMPLEAKIAIOSFODNN7
            aws_secret_access_key=EXAMPLEKEYwJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

            [reporting_warehouse_prod]
            aws_access_key_id=EXAMPLEABBAIOSFODNBB
            aws_secret_access_key=EXAMPLEKEYBBBlrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEBBB
            ```
3. Create a copy of the environment variables file by issuing the command below and make sure to replace the variable example values by appropriate ones:

    ```
        cp env.yml.example env.yml
    ```
### Deployment

To deploy the serverless application, just issue the following command:

```
serverless deploy -v --aws-profile reporting_warehouse_dev
```
Note how we specify the aws account where it will be deployed by using the "--aws-profile" name option. Those profile names are setup as explained in the previous section (Development Setup).
