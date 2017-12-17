<a href="https://neap.co" target="_blank"><img src="https://neap.co/img/neap_black_small_logo.png" alt="Neap Pty Ltd logo" title="Neap" align="right" height="50" width="120"/></a>

> DISCLAIMER - Though we're recommending deploying using [_Zeit Now_](https://zeit.co/now), we have no affiliation whatsoever with that entity. We do not receive any incentive or are looking for any gain in promoting that tool and infrastructure. 

# Welcome To The Universal GraphQL Server Template

__*Create your own GraphQL server in less than 1 minute*__. Clone this project, and then modify the code under `./src/graphql` and you're set. 
```
git clone https://github.com/nicolasdao/graphql-universal-server.git
cd graphql-universal-server
npm install
npm run dev
```

This server will serve both a [GraphQL](http://graphql.org/learn/) endpoint as well as a [GraphiQL Web UI](https://github.com/graphql/graphiql). It is ready to be deployed on any of the following 3 platforms:
1. Locally (using express under the hood)
2. Serverless [Zeit Now](https://zeit.co/now) (using express under the hood)
3. FaaS [Google Cloud Function](https://cloud.google.com/functions/) (incl. Firebase Function)

In any of those 3 scenarios above, the code is still the exact same, hence the use of the term _universal_. 

This has been made possible thanks to the [_webfunc_](https://github.com/nicolasdao/webfunc) serverless framework and the awesome [_Zeit Now_](https://zeit.co/now) deployment tool & serveless infrastructure.

# How To Use It
## Deploy Locally
```
npm install
npm run dev
```

The second command will start an express server and will automatically reload your code thanks to [_node-dev_](https://github.com/fgnass/node-dev). 2 endpoints will be immediately available:

- [http://localhost:4000](http://localhost:4000): This is the GraphQL endpoint that your client can start querying.
- [http://localhost:4000/graphiql](http://localhost:4000/graphiql): This is the GraphiQL Web UI that you can use to test and query your GraphQL server. 

## Serverless Deployment
#### Prerequisite
All deployments to serverless are managed by the awesome [_Zeit Now_](https://zeit.co/now). That means [_Zeit Now_](https://zeit.co/now) must be installed. Simply run:

```
npm install -g now
```

#### Deploying To Now
_More details about choosing now over a FaaS in the [Annex below](#annex-why-using-now-over-faas)._

To deploy on now, first make sure you're logged in:
```
now login
``` 

Then this is as simple as running:
```
now
```

#### Deploying To Google Cloud FaaS 
To deploy on Google Cloud Function, first make sure you're logged in:
```
now gcp login
``` 
You will have to select a GCP project. 

> IMPORTANT: Make sure you've enabled billing for that project, otherwise the deployment will fail miserably.

Then this is as simple as running:
```
now gcp
```

# Annex - Why Using Now Over FaaS 
Now is true serverless when AWS Lambda or Google Cloud Function are better described as FaaS (i.e. Function as a Service). What that means is that _Zeit Now_ offers managed servers that can scale automatically. Just focus on writing code. 

Depending on what you're trying to achieve, this option can be better than a FaaS because:
- No cold start (if you've made sure that there is at least 1 server up at any time)
- Express server with all the bells and whistle. That means more features (e.g. websocket, managing states, not screwing your RDBMS connection pools, ...)

It offers a free tier with 3 instances, so you can develop at your ease. Each deployment receives a unique URL that stays there forever (unless you explicitly delete it). You can deploy infinitely. Without entering into too many details, each time you deploy, the previous deployment will scale down to 0 instances. That's what allows you to deploy infinitely on the free tier without exceeding the free quota of 3 instances.

You can read more about Zeit Now [here](https://zeit.co/now). 
