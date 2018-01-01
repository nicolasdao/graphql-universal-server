<a href="https://neap.co" target="_blank"><img src="https://neap.co/img/neap_logo_built_with_love.png" alt="Neap Pty Ltd logo" title="Neap" height="94" width="200" style="float: right" /></a>

> DISCLAIMER - Though we're recommending deploying using [_Zeit Now_](https://zeit.co/now), we have no affiliation whatsoever with that entity. We do not receive any incentive or are looking for any gain in promoting that tool and infrastructure. 

# Welcome To The Universal GraphQL Server Template

__*Create your own GraphQL server in less than 1 minute and deploy it on any serverless platform without changing a single line of code*__. 

Targeted serverless platforms:
1. __*Locally*__ (using express under the hood)
2. [__*Zeit Now*__](https://zeit.co/now) (using express under the hood)
3. [__*Google Cloud Functions*__](https://cloud.google.com/functions/) (incl. Firebase Function)
4. [__*AWS Lambdas*__](https://aws.amazon.com/lambda) (COMING SOON...)
5. [__*Azure Functions*__](https://azure.microsoft.com/en-us/services/functions/) (COMING SOON...)

In any of those scenarios above, the code is still the exact same, hence the use of the term __*universal*__. 

Clone this project, and then modify the code under `./src/graphql` for your specific usage and you're set. 
```
git clone https://github.com/nicolasdao/graphql-universal-server.git
cd graphql-universal-server
npm install
npm start
```

This server will serve both a [GraphQL](http://graphql.org/learn/) endpoint as well as a [GraphiQL Web UI](https://github.com/graphql/graphiql).

This has been made possible thanks to the following awesome projects:
1. [_webfunc_](https://github.com/nicolasdao/webfunc): A serverless framework that makes it possible to run any express middleware on FaaS.
2. [_Zeit Now_](https://zeit.co/now): A deployment tool CLI & a serveless infrastructure.
3. [_now-flow_](https://github.com/nicolasdao/now-flow): A wrapper around now-CLI that makes it super simple to configure and deploy to multiple environments.

# How To Use It
## Local Deployment
```
npm start
```

This command will start an express server and will automatically reload your code thanks to [_node-dev_](https://github.com/fgnass/node-dev). 2 endpoints will be immediately available:

- [http://localhost:4000](http://localhost:4000): This is the GraphQL endpoint that your client can start querying.
- [http://localhost:4000/graphiql](http://localhost:4000/graphiql): This is the GraphiQL Web UI that you can use to test and query your GraphQL server. 

## Serverless Deployment
#### Prerequisite
All deployments to serverless are managed by the awesome [_Zeit Now_](https://zeit.co/now). That means [_Zeit Now_](https://zeit.co/now) must be installed. Simply run:

```
npm install -g now
```

#### Deploying To Now
_More details about choosing now over a FaaS in the [Annex below](#a1-why-using-now-over-faas)._

To deploy on now, first make sure you're logged in (if you don't have an account, it will create one for free. The free version is more than enough to get familiar with now):
```
now login
``` 

Then this is as simple as running:
```
npm run deploy:prod
```
> WHAT THIS DOES BEYOND DEPLOYING TO ZEIT NOW
In a nutshell, the npm script will use the [_now CLI_](https://zeit.co/now) to deploy your first GraphQL API to __*now*__. Normally, you would have to make sure that you have a __*start*__ script in your _package.json_. If you wanted to [alias your deployment](https://zeit.co/docs/features/aliases), you would have to run another command (`now alias ...`) after your deployment is successful. Because all those steps can become a bit messy and error prone when you manage mutliple environments (prod, staging, ...), we're using a really usefull wrapper around _now CLI_ called [__*now-flow*__](https://github.com/nicolasdao/now-flow). If you want to know more about the different steps behind _now-flow_, jump to the annex [A.2. What does "nowflow production" do?](#a2-what-does-nowflow-production-do).

#### Deploying To Google Cloud Functions
To deploy on Google Cloud Function, first make sure you're logged in:
```
now gcp login
``` 
You will have to select a GCP project. 

> IMPORTANT: Make sure you've enabled billing for that project, otherwise the deployment will fail miserably.

Then this is as simple as running:
```
npm run deploy:staging
```
> WHAT THIS DOES BEYOND DEPLOYING TO GOOGLE CLOUD FUNCTION
Same as for the deployement to __*now*__, except that aliasing is not supported. 

## now.json Config File Explained
The _now.json_ file is used by [Zeit Now](https://zeit.co/now) to manage deployment's configuration. Because of its usefulness, the team behind [_webfunc_](https://github.com/nicolasdao/webfunc) decided to use the same file to store more information relevant to environments. 
```js
{
	"headers": {
		"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS, POST",
		"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
	},
	"env": {
		"active": "default",
		"default": {
			"hostingType": "localhost"
		},
		"staging": {
			"hostingType": "gcp",
			"gcp": {
				"functionName": "your-webfunc-app",
				"memory": 128
			}
		},
		"production": {
			"hostingType": "now",
			"scripts": {
				"start": "NODE_ENV=production node index.js"
			},
			"alias": "your-webfunc-app"
		}
	}
}
```

- __*"headers"*__: Control the CORS setup provided out-of-the-box by [_webfunc_](https://github.com/nicolasdao/webfunc).
- __*"env"*__: This property stores variables specific to environments. The "active" property is the only exception. That property defines which environment is currently active. When the command `npm run deploy:prod` is run, the underlying executed script is `nowflow production`. That command will automatically set the "active" property to "production" in the _now.json_ (more details about the entire series of tasks being run in the annex [A.2. What does "nowflow production" do?](#a2-what-does-nowflow-production-do)). 

Notice the difference between the __*"production"*__ configuration and the __*"staging"*__ one. In the _production_ configuration, a __"scripts"__ and a __"alias"__ property are setup. This will respectively ensure that the _package.json_'s "start" script is properly setup and that once the deployment to [Zeit Now](https://zeit.co/now) is completed, the right alias is associated to it. In the _staging_ configuration, there is no need for a _start_ script or an _alias_ as they are both irrelevant as far as Google Cloud Function is concerned. On the other hand, a __"gcp"__ property is required to configure the function's name as well as the memory size of the allocated to the function.

# Annex
## A.1. Why Using Now Over FaaS 
[Zeit Now](https://zeit.co/now) is a serverless infrastructure (i.e. you don't have to worry about the servers that host your app. They are fully managed by a third party who also takes care of load balancing, domain name, SSL certs, scaling up/down), whereas AWS Lambda or Google Cloud Function are better described as FaaS (i.e. Function as a Service). In both case, you just need to focus on one thing only: Writing code. 

Depending on what you're trying to achieve, [Zeit Now](https://zeit.co/now) could be a better alternative than a FaaS for the following reasons:
- No cold start (if you've made sure that there is at least 1 server up at any time)
- Express server with all the bells and whistle. That means more features (e.g. websocket, managing states, not screwing your RDBMS connection pools, ...)

It offers a free tier with 3 instances, so you can develop at your ease. Each deployment receives a unique URL that stays there forever (unless you explicitly delete it). You can deploy infinitely. Without entering into too many details, each time you deploy, the previous deployment will scale down to 0 instances. That's what allows you to deploy infinitely on the free tier without exceeding the free quota of 3 instances.

You can read more about Zeit Now [here](https://zeit.co/now). 

## A.2. What does "nowflow production" do?
The above is a shortcut for `nowflow production`. [_now-flow_](https://github.com/nicolasdao/now-flow) is a wrapper around now-CLI that makes it super simple to configure and deploy to multiple environments. Under the hood, this happens:
* Confirm that there is a valid __now.json__ file located in the root folder.
* Confirm that there is a __*production*__ property under the __*env*__ property of the __now.json__. Example:
	```js
	{
		"env": {
			"production": {
				"hostingType": "now",
				"scripts": {
					"start": "NODE_ENV=production node index.js"
				},
				"alias": "your-webfunc-app"
			}
		}
	}
	```

* Update both the _package.json_ and the _now.json_ so they fit the configuration defined for the specific environment.
	- Create backups for the _package.json_ and the _now.json_ respectively called __*.package.backup.json*__ and __*.now.backup.json*__ in case something goes wrong (those files will be deleted if all goes well).
	- If the configuration for the specific environment in the _now.json_ describes a __*"scripts"*__ property, then update the _package.json_'s __*"scripts"*__ property accordingly.
	- If the configuration for the specific environment in the _now.json_ describes an __*"alias"*__ property, then update the _now.json_'s __*"alias"*__ property accordingly.
	- If the configuration for the specific environment in the _now.json_ describes a __*"gcp"*__ property (Google Cloud Platform, i.e. Google Function), then update the _now.json_'s __*"gcp"*__ property accordingly.
	- Deploy to the platform described in the __*"hostingType"*__ property of the specific environment of the _now.json_.
	- If an __*"alias"*__ has been defined, and if the __*"hostingType"*__ is __*"now"*__, then alias the deployment.
	- If everything went well, then restore both the _package.json_ and the _now.json_ to their original state, and delete their respective backups (i.e. _.package.backup.json_ and _.now.backup.json_).
