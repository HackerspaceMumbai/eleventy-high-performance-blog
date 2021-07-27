---
title: A Well-Architected Cloud Application
date: 2021-07-15
description: Microsoft Learn Path for M365, Power Platform and, AI & Data 
image: /img/blog/VisageArchitecture_MVP.png
tags:
  - blog
category: Visage
layout: layouts/post.njk
---


> What's a beauty pageant's contestant most cliched answer? World peace.
  And a cloud developer on how would they describe their cloud application? Well architected !!!😊

An app to deliver business value at quality relies on code and infrastructure.
Your cloud app is literally **"standing on the shoulders of giants"**. Most cloud service providers, by now, have gathered a wealth of experience & expertise on how best to develop different types of applications on their infrastructure and have provided guidance accordingly, including [Azure](https://docs.microsoft.com/en-us/azure/architecture/framework/?WT.mc_id=AZ-MVP-5003041).

## The Smaller Picture

Right from our first [blog post](./Strategic_Domain_Driven_Design#big-picture-event-storming), we have been progressively narrowing our focus. Back then, our proposed Architecture for the entire solution looked somewhat like 👇
![Visage Architecture](/img/blog/Visage_Architecture.png)

### Honey, Azure SWA shrunk the Architecture Diagram

> In tech, of late, procrastination isn't that bad a thing - by me.

While we were muddling through our design, the good folks at Microsoft had raced ahead to release [Azure Static Web Apps](https://azure.microsoft.com/en-in/services/app-service/static/?WT.mc_id=AZ-MVP-5003041). Incorporating Azure SWA would consolidate our frontend and API, reducing management overhead, and in the process, also save us a pretty penny. To celebrate the occasion, Azure held a virtual event, [Code to Scale](https://channel9.msdn.com/Events/Learn-TV/Static-Web-Apps-Code-to-Scale?WT.mc_id=AZ-MVP-5003041)[Some of the videos were great in delving into SWA]. And they also released a learning challenge, which I felt didn't build upon the sessions. For example, there were three mandatory modules on JS, Blazor, & Gatsby; a newbie would only be interested in only one[a choice would have been better]. Also missing were modules on local development with [Azure SWA CLI](https://techcommunity.microsoft.com/t5/apps-on-azure/introducing-the-azure-static-web-apps-cli/ba-p/2257581/?WT.mc_id=AZ-MVP-5003041) and E2E testing with [Playwright](https://docs.microsoft.com/en-us/microsoft-edge/playwright/?WT.mc_id=AZ-MVP-5003041). I have created my own collection [MS Docs Learn Paths for Azure SWA](https://docs.microsoft.com/en-us/users/augustinecorrea-4621/collections/6ew4a4m857q61g/?WT.mc_id=AZ-MVP-5003041), which I will be updating in the coming weeks as I find more modules that are useful for Blazor WASM based Azure SWA.

For our 1st iteration ["MVP"](https://dev.azure.com/augcor/Visage/_sprints/backlog/Visage%20Team/Visage/MVP), our erstwhile Architecture diagram has slimmed down considerably.

![Visage Architecture Diagram - MVP](/img/blog/VisageArchitecture_MVP.png)

- Our frontend and API have fused into a single Azure-managed service. Also, imma gonna be drinking some of that [minimal API](https://devblogs.microsoft.com/aspnet/asp-net-core-updates-in-net-6-preview-4/?WT.mc_id=AZ-MVP-5003041) Kool-Aid
  
- We are taking a bet on [.Net 6](https://dotnet.microsoft.com/?WT.mc_id=AZ-MVP-5003041) vision. Because our deployment targets, in the coming iterations, will be devices like Laptops/Tabs[[WinUI](https://docs.microsoft.com/en-us/windows/apps/winui/?WT.mc_id=AZ-MVP-5003041)] and mobiles[[MAUI](https://devblogs.microsoft.com/dotnet/introducing-net-multi-platform-app-ui/?WT.mc_id=AZ-MVP-5003041)]. We are doubling down on [Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor/?WT.mc_id=AZ-MVP-5003041) so that we can reuse a substantial part of our codebase **as-is** across these platforms. Cons: In the diagram, we indicate there is still NO native Application Insight integration for Blazor WASM, looks like Azure is still sitting on the fence for this one. **A web app team is flying blind without user action and transaction telemetry.**
  
- Also introducing [Azure Event Grid](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor/?WT.mc_id=AZ-MVP-5003041) which will be the fulcrum of our event-based architecture.
  
- [Azure Cosmos DB](https://azure.microsoft.com/en-in/services/cosmos-db/?WT.mc_id=AZ-MVP-5003041), as our data store, is a natural counterfoil for Azure SWA: faster app development, scales globally, and is fully managed.

- The recently released SWA CLI should bolster our local coding experience, and we can do the entire development on [WSL2](https://docs.microsoft.com/en-us/windows/wsl/about/?WT.mc_id=AZ-MVP-5003041). Totes.

## Pillars of a Well-Architected Cloud Application  

Both [AWS](https://aws.amazon.com/architecture/well-architected/?wa-lens-whitepapers.sort-by=item.additionalFields.sortDate&wa-lens-whitepapers.sort-order=desc) and [Azure](https://docs.microsoft.com/en-us/azure/architecture/framework/) agree that there are 5 "pillars" of a well-architected cloud application, while [Google](https://cloud.google.com/architecture/framework) demurs that they are only 4 "principles". Reminded me of the hilarious scene from [History of the World where God gave Moses "actually" 15 commandments.](https://www.youtube.com/watch?v=I48hr8HhDv0)😁

  1. Cost Optimization
  2. Operational Excellence
  3. Performance Efficiency
  4. Reliability
  5. Security, Privacy, and Compliance [Psst: Azure and AWS just went with security, but I did not want Google to feel left out, so I have used their nomenclature 😉]

From a project management perspective, these pillars render themselves quite naturally as epics spanning throughout the product lifecycle. And that's how we roll with them on our [Azure Boards](https://azure.microsoft.com/en-in/services/devops/boards/?WT.mc_id=AZ-MVP-5003041).

[![Azure DevOps Boards Epics](/img/blog/epics_pillars_devops.png)](https://dev.azure.com/augcor/Visage/_workitems/recentlyupdated/?WT.mc_id=AZ-MVP-5003041)

### Cost Optimization

Google has 4 principles because it clubs Performance with Cost Estimation. Well Ferrari is super-performant, but as an Indian, [this car ad gets us](https://www.youtube.com/watch?v=akmpsx5F2-4), right to the last paise 😊. So the desi in me will ensure the first pillar we target will be Cost Optimization.

#### Pricing Calculator

Before we write a single line of code and deploy artifacts, we gotta know how much this will all cost us? Azure provides a handy tool just to do that: [Azure pricing calculator](https://azure.microsoft.com/en-in/pricing/calculator/?WT.mc_id=AZ-MVP-5003041)

> For cloud practitioners, architecture diagrams double up as a handy shopping list. - once again, by me.

Let's ring up our resources on the calculator [[click here for the estimate](https://azure.com/e/bcea12c81ce748b190dc532a9055ff13)]:

- While initially we will be developing with the free version of the Azure SWA, I'm opting for the run-rate of the Standard version because we will be using Custom Authentication [[Auth0](https://auth0.com/)].

  [![Azure SWA Standard Pricing](/img/blog/AzureSWA_Pricing.png)](https://dev.azure.com/augcor/Visage/_workitems/edit/114/?workitem=124&WT.mc_id=AZ-MVP-5003041)

- Going with the [serverless pricing of Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/serverless/?WT.mc_id=AZ-MVP-5003041) and a modest 1 GB storage.

  [![Azure CosmosDB Pricing](/img/blog/AzureCosmosDB_Pricing.png)](https://dev.azure.com/augcor/Visage/_workitems/edit/114/?workitem=124&WT.mc_id=AZ-MVP-5003041)

- Event Grid is free for the first 100,000 operations. I'm always amazed at these prices; 10 years ago, we would have been shelling couple of lakhs for a fraction of such a service.
  
  [![Azure Event Grid Pricing](/img/blog/EventGrid_Pricing.png)](https://dev.azure.com/augcor/Visage/_boards/board/t/Visage%20Team/Stories/?workitem=126&WT.mc_id=AZ-MVP-5003041)

- With Key vault, we come to the first service not offered in any of the Azure regions in India, as per the Pricing Calculator. But its available in Central India region [bug ???]
  ![Key vault Pricing](/img/blog/KeyVault_Pricing.png)

- For Azure Monitor, I have been liberal with the number of logs and metrics that are being captured because during the early days, you are trying to get familiar with your application. And this ties in with other pillars, which we will touch upon in forthcoming posts.
  ![Azure Monitor Pricing](/img/blog/AzureMonitor_Pricing.png)

- We have attached the excel estimate with the [Pricing Calculator user story](https://dev.azure.com/augcor/Visage/_boards/board/t/Visage%20Team/Stories/?workitem=123) and checked it in our git repository.
  
> **The grand total comes to a very affordable ₹1,687.66 per month with no upfront payment.**

#### Azure Cost Management [ACM]

With ACM we can get a quick look at our costs and its constituents. And more importantly, create a trackable budget via billing data/reports, and set up cost alerts.

For the MVP iteration, we have created a budget of ₹2000, a buffer of ~18% over our Pricing Calculator estimate. We have set a threshold alert for 75% of the actual cost and 110% of the forecasted budget.

![Azure Budget Cost Alerts](/img/blog/AzureBudget_Alerts.png)

At the day's end, our items on our Azure Boards are "shifting right" -> its good news in project management.
![Azure Boards Post Budget](/img/blog/AzureDevBoard_PostBudget.png)

In our upcoming blog posts, we will start incorporating best practices from other pillars into our solution. Up next, though, I will be leaving my comfort zone to dive into UI/UX wireframing and prototyping. Stay safe 💪.
