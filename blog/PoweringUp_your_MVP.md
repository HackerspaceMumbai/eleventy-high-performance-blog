---
title: Powering Up Your MVP
date: 2021-03-22
description: Building your MVP using the Power Platform
image: /img/blog/OData_lookup.png
tags:
  - blog
category: Visage
layout: layouts/post.njk
---

After completing the strategic domain design and feature mapping, our next logical step would be undertaking the tactical domain design of identifying aggregates, entities, value objects etc. But I prefer to hammer out an MVP built-in low code before going that route. Why?

![Mike Tyson Plan Punch](../img/blog/Tyson_Plan_Mouth.jpg)

1. It is always a good idea to validate your design decisions as quickly as possible.

1. We are hosting the [Global Power Platform Bootcamp](https://twitter.com/hackmum/status/1362081566177034245) in February, providing us an opportunity to check out the [Power Platform](https://powerplatform.microsoft.com/?WT.mc_id=BA-MVP-5003041).
   * To compensate for our non-existent UX skills, we are riding piggyback on Power Platform's ability to stitch up a much decent UI than we ever can.
   * Our office productivity suite is [M365](https://www.microsoft.com/en-in/microsoft-365), and this, in combination with Power Platform, means fewer securities snafus due to slip-ups in terms of access and permissions.
   * We can iterate and incubate changes to our processes in-house initially, see how things go and then introduce them to other community organizers.

## First Iteration

Since we were new to the Power Platform, as any developer worth its salt, we threw caution to the wind and rushed headlong into creating a [Canvas Power App](https://docs.microsoft.com/en-us/powerapps/maker/canvas-apps/getting-started/?WT.mc_id=BA-MVP-5003041) invoking an external API.

A Canvas App is, as the name suggests, a blank slate that allows you the free-style your UI.

### Custom API

To invoke the Eventbrite endpoint, an external API, we need to create a Custom Connector(Custom API). The latter is a Premium connection under Power Platform(=> its costs extra 💲💲). So we had to use a trial environment to get this working.

There has been substantial refactoring of Eventbrite's API. While previously I had to navigate through their Event blade to get Event details, for v3, I had to use the Organizations object.

Also, I would be remiss if I did not mention [Nightingale](https://nightingale.rest/). It is a gorgeous app while at the same time being a highly performant API Testing Client built natively for [Windows 10](https://www.microsoft.com/en-in/windows/get-windows-10/?WT.mc_id=BA-MVP-5003041), and it shows.

Just look at that exquisite screen in dark mode below 👇.

![Nightingale Rest Client](../img/blog/Nightingale_Rest_Client.png)

The Custom API also requires an [Open API Specification File]( https://swagger.io/specification/). Ah, here's the catch, not the latest v3 but rather the previous version. The below version shows how this is done with the
[Swagger inspector](https://swagger.io/tools/swagger-inspector/).

![Swagger Inspector](../img/blog/Swagger_Inspector.png)

With the swagger file, [Microsoft Docs](https://docs.microsoft.com/en-us/connectors/custom-connectors/define-openapi-definition/?WT.mc_id=BA-MVP-5003041) has provided a straight forward method to create the Custom API.

![Custom API](../img/blog/Custom_API_Connector.png)

Nevertheless, I did not feel the Connector creation to be quite intuitive, at least for now.

## Second Iteration

Off we went to search among the Interwebz and we found a solution that was almost similar to ours in the [Power Users Community](https://powerusers.microsoft.com/t5/Power-Automate-Cookbook/Edu-Simplify-Google-Books-API/?WT.mc_id=BA-MVP-5003041). It consisted of a Canvas Power App that acted like a HTML form to collect values and pass it on to a [Power Automate Flow](https://flow.microsoft.com/?WT.mc_id=BA-MVP-5003041). The flow, by [Brian Dang](https://twitter.com/mrdang), would do the heavy lifting of invoking the external API and massaging the JSON result. While the original flow returned the result back to the Canvas App, our use case was to insert it into the custom tables we created in [Dataverse](https://docs.microsoft.com/en-us/powerapps/maker/data-platform/data-platform-intro/?WT.mc_id=BA-MVP-5003041)

![Get Events Canvas Power App](../img/blog/GetEvents_Canvas_App.png)

![Get Events Power Automate Flow](../img/blog/GetEvents_Flow.png)

Wiring up the Canvas Power Apps with Power Automate Flow, we get our Eventbrite events

![Final Result](../img/blog/FinalResultPowerApps.png)

## Learnings

1. In the Power Automate Flow, where the 1st step involves consuming data passed from the Power Apps, ensure you rename the variable before clicking on "Ask in PowerApps".

   * If you click on the Ask in PowerApps without renaming the variable, then PowerApps provides its nomenclature for the variable.

   ![Clicking on Ask in PowerApps without renaming](../img/blog/Initial_AskinPowerApps.png)

   * Renaming the variable will still leave you with the previously named variable.

   ![Renaming the original variable](../img/blog/RenameVariable_AskInPowerApps.png)

   * And your pain is going to be compounded if the bridge variable was a required field in PowerApps. You now have to provide two mandatory values.

   ![Testing Flow](../img/blog/Test_Flow.png)

   * So save yourself some hassles and rename your variable before clicking on that dark lavender-colored button.

   ![Renaming variable beforehand](../img/blog/HappyFlow_AskInPowerApps.png)

2. We had to add an invisible timer with a recurring frequency of 5 seconds[YMMV] to the Canvas App. At the end of the timer, the Gallery view of the result would be refreshed. This was to account for the network latency during the API call. I felt from a UX perspective, controls like Gallery View should have a **"watch"** feature over their source. A citizen developer would not necessarily understand this nuance.

3. The biggest challenge was encountered during the insertion of the API results into the Dataverse custom tables. This was a two-table operation that involved a lookup from the secondary table. And what seemed a simple step, kept failing repeatedly even after tweaking the lookup value multiple times.

![Flow run Fail while inserting API results into Dataverse](../img/blog/Flow_Run_Fail.png)

The error message was constant: **Resource not found for the segment...**

![Resource Not Found](../img/blog/Resource_Not_Found.png)

> Solution: In the latest Dataverse version, the lookup value has to follow the OData format: The primary table name(including its prefix, if its a custom table) in the plural and in the small case and then followed by a slash and the secondary table GUID(already available in the Dynamic Content).

![OData Lookup](../img/blog/OData_lookup.png)

Tough for a citizen developer to be able to get this. Especially, since this value can be automatically constructed by Flow. If you look at the highlights in the diagram, it knows it is a lookup and what table it is looking up.
