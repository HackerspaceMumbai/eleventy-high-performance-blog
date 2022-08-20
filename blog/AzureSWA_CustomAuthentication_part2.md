---
title: Securing a Blazor WASM app on Azure Static Web App - Part 2
date: 2022-08-16
description: Custom Authentication and programmatic programming in Azure SWA Blazor  
image: /img/blog/azureSWA_Auth0_cover_pic.png
tags:
  - blog
category: Visage
layout: layouts/post.njk
---

In our [previous post](/blog/azureswa_cli_customauthentication), we secured our Blazor WASM app, deployed on Azure Static Web App, with a pre-configured authentication provider, [GitHub](http://github.com/).

## Change the Plan

Now we need to replace GitHub with our production authentication provider, Auth0. A question might be swirling up in your mind: if the goal was to have Auth0 as our authentication provider, why did we invest so much into GitHub in the previous post? Here's the rub, custom authentication is part of the paid [Standard Plan](https://azure.microsoft.com/en-in/pricing/details/app-service/static/) of Azure Static Web App. Our strategy was to ensure we got the nuts and bolts of our frontend's IAM right, without incurring any costs, and the Free Plan provided the perfect foil for us.

> The original blog post has been amended and is split into two, since we were waiting on a fix for a bug on Azure SWA blade, for which we now have a workaround. For the original versions, please refer to [Dev](https://dev.to/indcoder/securing-an-azure-static-web-app-with-auth0-actions-1om2), or [hashnode](https://indcoder.hashnode.dev/securing-an-azure-static-web-app-with-auth0-actions)

Getting custom authentication to work requires perfect synchronization amongst the three principals involved: code[[Blazor WASM](https://dotnet.microsoft.com/en-us/apps/aspnet/web-apps/blazor)], infrastructure[[Azure SWA](https://azure.microsoft.com/en-us/services/app-service/static/?WT.mc_id=AZ-MVP-5003041)],and the Identity/Authentication Provider[[Auth0](https://auth0.com/)].

### Readying our app on Auth0

Auth0 is a free, open source authentication provider that allows you to integrate with your existing identity provider. We have been using Auth0 for the last 5 years and it has been our mainstay for IAM on all of our production apps. [Aaron Powell's post](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/using-auth0-with-static-web-apps/ba-p/2353653?WT.mc_id=AZ-MVP-5003041) has been a big help in configuring the Auth0.

1. Create an application on the Auth0 portal, and note the following properties which we will need later on:
    a. Client ID
    b. Client Secret
    c. Domain Authority URL

![The Auth0 Application Details page with the Client ID and Client Secret information redacted](/img/blog/auth0_application_properties.png)

2. As the [OIDC authentication](https://auth0.com/docs/authenticate/protocols/openid-connect-protocol) rides piggyback on OAuth2 authorization flow, we have to configure the endpoints that Auth0 needs to redirect to, post the login process.

![Auth0 Application Details page with the Application URIs ](/img/blog/auth0_oauth_application_url.png)

### Preparing Azure SWA to accept Auth0 as our authentication provider

1. Visit the Hosting Plan tab under the Static Web App in the Azure Portal to convert the plan from Free to Standard.
   ![Hosting Plan tab on the Azure SWA ](/img/blog/azure__portal_hosting_plan.png)

2. Click on the Configuration link within the navigation pane, choose the stage environment and add two application secrets, namely AUTH0_CLIENT_ID, & AUTH0_CLIENT_SECRET, with the values from step 1 of the Auth0 subsection above.
   ![Configuration settings on the Azure SWA blade of the Azure Portal](/img/blog/azureswa_application_secrets_portal.png)

### Configuring our code for custom authentication

Back to our code, we provision custom authentication in our static web app config file.

```json

{
  "auth": {
    "identityProviders": {
      "customOpenIdConnectProviders": {
        "auth0": {
          "registration": {
            "clientIdSettingName": "AUTH0_CLIENT_ID",
            "clientCredential": {
              "clientSecretSettingName": "AUTH0_CLIENT_SECRET"
            },
            "openIdConnectConfiguration": {
              "wellKnownOpenIdConfiguration": "https://developerday-ind.us.auth0.com/.well-known/openid-configuration"
            }
          },
          "login": {
            "nameClaimType": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
            "scopes": [],
            "loginParameterNames": []
          }
        }
      }
    }
  }
}
```

Three things of note in the above code snippet:

   a. Named our custom provider as auth0; which we will use to configure the custom login route below.

   b. The application secrets we provisioned in the settings on the Azure SWA blade of the Azure portal above.

   c. The well-known OpenID configuration endpoint, available at the Domain Authority URL.

Unfortunately, the Domain Authority URL was not considered sensitive enough to be secured as an application configuration. And since we have to check-in the code into a public GitHub repository, in the interim, I'm constrained to utilize an Auth0 developer tenant. [Tooting a bit of my own horn: This tenant was employed in the [Auth0 hackathon](https://auth0.com/blog/auth0-announces-the-winners-of-the-actions-hackathon/) in which I was runner-up: Used Auth0 Actions with Yoonik Face Recognition; I'll be expanding on this in the upcoming posts]

Also, we need to update the login route in the static file. And because we have implemented this route rule in the previous post, we don't need to modify the link within the MainLayout page.

```json
{
      "route": "/login",
      "rewrite": "/.auth/login/auth0"
}
```

In the above code snippet, we replaced github with auth0.

Restart the CLI, and once you click on the Login link, the SWA CLI authentication emulator page comes up. We now see the provider field pre-populated with auth0 [the name we gave in the static config file], and I'm using my username as it is in the Auth0 tenant.

![Azure SWA emulator with the provider and username inputs highlighted in red](/img/blog/swacli_emulator_customauth.png)

By now, you know the drill. Send up the git commits to GitHub and wait for the GitHub actions to complete. Once done, we should be able to verify, on our Stage URL, that Auth0 is supplying the Username post login.

![Blazor WASM default page](/img/blog/weatherforecast_customauthn.png)



## Custom Authorization

Great, we got Custom Authentication working, but we have still yet to wire up the authorization bit to go with it.

![Weather Forecast Fetch data page with "Not Authorized" highlighted on the page](/img/blog/weatherforecast_customauthz_fail.png)

### Auth0 Role Management

1. On the Auth0 end, we create a Role named "weathercaster".
    ![Auth0 role management](/img/blog/auth0_add_role.png)

2. Add my username to the role.
   ![Auth0 Adding a user to the role](/img/blog/auth0_add_user_role.png)

### Auth0 Actions

We need to add the roles to the [id token](https://auth0.com/docs/secure/tokens/id-tokens), and just for good measure, I'm also going to add them to the [access token](https://auth0.com/docs/secure/tokens/access-tokens). In the past, for my older Auth0 tenants, this was achieved by [Auth0 Rules](https://auth0.com/docs/customize/rules) and later by [Auth0 Hooks](https://auth0.com/docs/customize/hooks). Last year, [Auth0 introduced Actions](https://auth0.com/docs/customize/actions) to supersede them, and it's time we take the new hotness for a ride.

1. We are going to need a custom Auth0 Actions

![Auth0 Page with a button named "Build Custom" alongside another button to "Add Action; below them a table of existing actions](/img/blog/Auth0_custom_action.png)

2. Create a custom Action.

![A modal Auth0 Action Create with 3 input elements](/img/blog/auth0_add_action.png)

3. A familiar [Monaco code editor](https://microsoft.github.io/monaco-editor/) opens up. Because its the same one that powers VS Code. Adding a role to an OAuth2.0 token is such a common use case, that you can find a code snippet for it, amongst others, after clicking the **[View Samples](https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow)** sticky button at the bottom right of the editor, which like the genius developer I am, have already copy-pasted into the editor.

![A Monaco code editor is pre-filled with code snippet to add roles to the ID Token and the Access token ](/img/blog/auth0_custom_action_code.png)

4. We need to add the roles during our Login Flow.

![The Flow Page under the Action Tab is highlighted. The different available flows are listed in a card format](/img/blog/auth0_choose_flow.png)

5. Drag and drop our Custom Action into the Login Flow.

![A visual canvas with a Start and Complete blobs are present. And the space in between them is highlighted in red by the author](/img/blog/auth0_flow_add_action.png)

6. Apply the changes, and we are done on the Auth0 end.

![The Add Visage Role Custom Action is placed between the Start and Complete icons in the canvas. The Apply button has a author-drawn green arrow pointed towards it](/img/blog/auth0_flow_apply_action.png)

7. **"Trust, but verify"**: We used the [Auth0 vanilla JS](https://auth0.com/docs/quickstart/spa/vanillajs#read-the-user-profile) SPA sample to check that the Auth0 Action is indeed adding the roles to the ID Token.

![The Auth0 sample app page displaying the payload sent over by Auth0 post login](/img/blog/auth0_sample_app_profile.png)

### Azure Function in Role Management

To glean out the custom roles from the response sent by an identity provider post-authentication, Azure SWA has a preview feature of using Azure Function to process the payload from the identity provider.

The SWA CLI provides a quick way of creating an Azure Function via the VS Code command palette.

![VS Code with highlights of the Command Palette, SWA config file in the code editor tab and thenewly created folder and files under the File Explorer](/img/blog/vscode_AzureSWA_AzureFunction.png)

In the static config file, we need to enhance the auth section with the path of the Azure Function.

```json
{
  "auth": {
    "rolesSource": "/api/GetRoles",
    "identityProviders": {
      // ...
    }
  }
}
```

But here is where things got awry. For our first iteration of the Azure Function, I wanted to play safe and used the [sample tutorial](https://docs.microsoft.com/en-us/azure/static-web-apps/assign-roles-microsoft-graph?WT.mc_id=AZ-MVP-5003041). I even tried bypassing the processing of the Auth0, and had the function return hardcoded results. Also independently tested the GetRoles Function and it was returning the intended result.

![VS Code with the left tab showing the test payload, the right tab displaying the result returned from the Azure Function,and the bottom console displaying the log stream generated by the invoked Azure Function](/img/blog/azurefunction_api_role_mgmt.png)

But pushing these changes to GitHub, and post a successful login [verified via Auth0 logs] on the Stage URL, Azure SWA always threw up the dreaded internal server error.

### Application Insight to the rescue, or so I thought

Difference between an on-premise and a cloud deployment? In the former, you have a more easier and immediate access to the logs generated by your app and the infrastructure underneath. With cloud, you have to rely solely on their monitoring tools to get the logs. On Azure, the [Application Insights service](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview?WT.mc_id=AZ-MVP-5003041) is a cloud service that provides you with a set of tools to monitor your application and infrastructure.

The Azure Static Web Apps blade on Azure Portal has a tab to create an associate Application Insights resource. So, we thought about using that to see why we were getting the internal server error.

![Application Insight tab is highlighted within the Azure Static Web App blade on the Azure Portal](/img/blog/azureswa_appl_insight.png)

But, the Application Insights service refused to be created. And, it was an extremely insidious bug. There was no error displayed anywhere: neither on the Azure portal, nor on the browser console, and apparently not on the backend.[[Screen capture](https://youtu.be/r7AVcjQeSPk)]

The solution: In the interim, if you are using a new Azure account or have never created an Application Insight insight in that account, then please create one independently in its own blade. The Azure Application Insights team is aware of the bug and are working on a solution for it.

In the end, it finally worked, with a clean browser console.

![Weather forecast with Auth0 provided login show and side-by-side browser developer console is shown](/img/blog/weatherforecast_customauthz_success.png)

## Etc

Just like how some movies play the bloopers reel at the end:

1. While the [Microsoft Docs quickstart](https://docs.microsoft.com/en-us/azure/static-web-apps/getting-started?tabs=blazor&WT.mc_id=AZ-MVP-5003041) for building your first static site with Azure Static Web Apps has a tab for Blazor WASM, the subsequent post for [adding an API](https://docs.microsoft.com/en-us/azure/static-web-apps/add-api?tabs=vanilla-javascript&WT.mc_id=AZ-MVP-5003041) has no sample code for Blazor WASM, for which I have opened a [GitHub issue](https://github.com/MicrosoftDocs/azure-docs/issues/95651).

2. For creating a SWA, hopefully you get the below experience in your VS Code extension

![The Azure VS Code extension is expanded out and its various resources are visible](/img/blog/vscode_AzureSWA_extension.png)

But in the quickstart for step 2 [which was removed last month after the team was informed] is shown as below:

![VS Code extension for Azure Static Web Apps with a plus icon boxed in red highlight and an adjacent lightning icon fenced in green highlight](/img/blog/vscode_AzureSWA_extension_initial.png)

The icon I have highlighted in green was present in the original workflow, through which we could add the Azure Function in the SWA blade[if you can call that] of the Azure VS Code extension...without creating it explicitly via the Azure Function blade or the command palette as shown currently in the quickstart.

Yet the remnant of that workflow still persists in the [VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) for SWA extension

![Text highlighted in red](/img/blog/vscode_AzureSWA_marketplace.png)

The API step [highlighted in red] in the SWA creation workflow is not present in its current version

3. While the [API constraints](https://docs.microsoft.com/en-us/azure/static-web-apps/apis-overview?WT.mc_id=AZ-MVP-5003041) explicitly mentions that the API route prefix must be *"api"*

![Text about API route nomenclature highlighted in red](/img/blog/msdocs_azureswa_api_constraints.png)

But, the VS Code extension generated Github Action workflow file names it as "Api".

![GitHub Action workflow YAML](/img/blog/vscode_extension_github_action.png)

Innocuous, right? Read on.

When we create the API via the command palette as instructed by the MS Docs,

![VS Code extension command palette expanded with the Create API command in the middle of the list](/img/blog/vscode_extension_command_pallette_create_api.png)

it creates a file folder titled "api" in the SWA folder.

![VS Code File Folder side tab with api folder highlighted in red](/img/blog/vscode_api_file_explorer.png)

Now,if you test it locally via the SWA CLI using "API"on windows ,it works !!!

![SWA CLI](/img/blog/swa_cli_api_option_windows.png)

And when pushed to GitHub, no error is thrown and is deployed. But errors out on the browser.

![Weather browser opened in browser with the developer tool console opened side by side and riddled with http error code](/img/blog/weatherforecast_api_nomenclature_fail.png)

If you are diligent enough to go through the successful GitHub Actions logs, there is a hint.

![GitHub Actions logs with a missing API warning](/img/blog/github_action_log_azureswa_api_warning.png)
