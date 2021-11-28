---
title: Azure Static Web App 
date: 2021-11-06
description: Deploying Blazor WASM onto Azure Static Web App and using Custom Authentication  
image: /img/blog/HM-Sharepoint.png
tags:
  - blog
category: Visage
layout: layouts/post.njk
---

For our 1st code commit, we will create the default Blazor WASM application on our local workstation, deploy it on to [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/front-end-frameworks/?WT.mc_id=M365-MVP-5003041), and then use Custom Authentication to verify the IAM is working as intended on the frontend.

Most of the work was done over the release candidate versions, [RC1](https://devblogs.microsoft.com/dotnet/announcing-net-6-release-candidate-1/) & [RC2](https://devblogs.microsoft.com/dotnet/announcing-net-6-release-candidate-2/?WT.mc_id=M365-MVP-5003041), but I have revalidated the codebase against the [LTS version of dotnet 6](https://devblogs.microsoft.com/dotnet/announcing-net-6/?WT.mc_id=M365-MVP-5003041) released yesterday.

## Local Development

For services similar to Azure SWA, developers had to follow a circuitous path of building the code on their local machine, followed by deploying it onto the cloud, and only then would they have been able to verify if their code performed as intended. Especially true when the feature was infrastructure-dependent, like Identity and Access Management (IAM).

### Azure SWA CLI

Azure SWA addresses the above pain point by providing a command-line tool that approximates the cloud environment: [SWA CLI](https://techcommunity.microsoft.com/t5/apps-on-azure/introducing-the-azure-static-web-apps-cli/ba-p/2257581/?WT.mc_id=M365-MVP-5003041). We will be relying on the SWA CLI abilities to emulate authentication, custom routing, and route authorization.

Install the SWA CLI globally

```javascript
npm install -g @azure/static-web-apps-cli
```

Our Blazor WASM application will primarily address the organizer use cases; we will name it accordingly.

```dotnet
dotnet new blazorwasm -o OrganizerWeb
```

Ensure you are in the main git branch.

![dotnet new command creating a Blazor WASM project with the terminal logs showing the output](/img/blog/dotnet_new_blazorwasm.png)

Immediately, you are confronted by the bane of modern software development: the spawning of way too many files.

![dotnet new creating too many files](/img/blog/dotnet_creates_too_many_files.png)

Create a .gitignore to ensure the unnecessary files are not inadvertently checked in.

```dotnet
dotnet new gitignore
```

Bear in mind that we are creating the .gitignore at the Blazor WASM project level. Logically, I feel it should reside at the .git folder/solution(.sln) level, but, presently dotnet cli does not traverse through each .net project within the solution and generate a top-level .gitignore.

Please don't forget to check-in the .gitignore file, though🤷‍♂️.
![Cheeky Git commit message](/img/blog/cheeky_git_commit_msg_gitignore.png)

While creating the Blazor WASM project, dotnet will generate application URLs with random ports. It's a matter of preference, but I like to standardize the port numbers [which will help us later when using the SWA CLI].

![launch settings ports](/img/blog/launchSettings_ports.png)

Let's kick the tires to ensure things are in working order.

```dotnet
dotnet watch
```

We also get to see in action one of the most touted features of dotnet 6: [hot reload](https://devblogs.microsoft.com/dotnet/introducing-net-hot-reload/?WT.mc_id=M365-MVP-5003041), which generated a lot of [heat](https://devblogs.microsoft.com/dotnet/net-hot-reload-support-via-cli/?WT.mc_id=M365-MVP-5003041)🔥 recently

![Running dotnet watch command for hot reload](/img/blog/dotnet_watch_hot_reload_stmt.png)

Looks good.

![Running dotnet watch  the weather forecast page](/img/blog/dotnet_watch_success.png)

Next up, we want the Azure SWA CLI to serve the Blazor WASM application. I prefer to execute the SWA commands at the solution level because it will be convenient when we want to repeat this later by also including the Azure Function.

```javascript
swa start http://localhost:5000 --run "cd OrganizerWeb && dotnet watch run"
```

Voilà, the Blazor WASM served from the SWA CLI !!!

![Azure SWA CLI terminal logs](/img/blog/swa_cli_terminal_success.png)

A page automatically opens in your browser, but it is opened by the dotnet watch command[please close this tab/browser; lest it will just confuse during development]. Note the URL with the port number 4280 and traverse to that location; this is the Azure SWA CLI rendered page.

![Default weather app served with Azure SWA CLI port number highlighted in the location bar](/img/blog/swa_weather_page_port.png)

### SSL

Production web apps are served over HTTPS. Moreover, the default security posture adopted by browsers is to open sites in SSL. In fact, when we ran the watch run command above, dotnet opened the browser in https[port 7001]. And when we attempt to traverse to the SWA CLI rendered page, the browser promptly disallows it.

![Browser page displayed with the message of insecure connection](/img/blog/swa_ssl_browser_noopen.png)

It's a good practice to use SSL in our development to catch any potential bugs early. The [SWA CLI repository's README](https://github.com/azure/static-web-apps-cli) information to enable SSL is cursory at best. I will walk through the different steps I tried before getting SSL enabled.

- One CLI SSL option errored out.
   ![SWA CLI SSL option fail](/img/blog/swa_ssl_KVPair_option_fail.png)

- Providing only the SSL option to the CLI did not work.
  ![SWA CLI option SSL fails with a message to provide key and cert](/img/blog/swa_ssl_solo_option_fail.png)

- A certificate and key generated by a Root Certificate Authority, trusted by the browser. I recommend [mkcert](https://web.dev/how-to-use-local-https/#running-your-site-locally-with-https:-other-options) for its ease of accomplishing this. Please ensure that the generated certificate, and key, are kept in a secure location. These should NOT be **checked-in** if generated within the repository folder; amend the .gitignore file to exclude the key and certificate files.
  
```javascript
swa start --ssl --ssl-cert="../localhost.pem" --ssl-key="../localhost-key.pem" https://localhost:7001 --run "cd OrganizerWeb && dotnet watch run"
```

To confirm in the terminal logs, note the HTTPS protocol of the SWA CLI rendered URL.

![SWA CLI terminal logs with hot reload, and SSL-enabled URL highlighted](/img/blog/swa_cli_ssl_success.png)

Traversing to the URL 👇

![SWA rendered page with SSL lock icon clicked in the location bar, revealing secure connection](/img/blog/swa_page_ssl.png)

## Azure SWA VS Code Extension

Now it is time to lob our app into the cloud. And we can do it right from the comforts of VS code itself, courtesy of the [Azure SWA extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps/?WT.mc_id=M365-MVP-5003041).

**Ensure you have checked in all your code and have pushed them up to GitHub.**

Assuming you have logged into the Azure & GitHub by the Azure SWA extension:

1. When clicking on the "plus" icon [circled in red below] of the extension, you will be prompted to select the Azure subscription, followed by a dialog box for entering the name of the Azure Static Web App project.
  ![Azure SWA extension with the plus icon circled in red](/img/blog/azureswa_extension_name.png)

2. You will be asked for the Azure Region you wish to deploy the app. Right now, East Asia will be the nearest for the alpha users of the app.
  ![Azure SWA extension dialogue box with a dropdown displaying Azure regions](/img/blog/azureswa_azure_region.png)

3. Your frontend framework: choosing Blazor for this project.
  ![Azure SWA extension dialogue box with a dropdown displaying different frontend frameworks](/img/blog/azureswa_framework.png)

4. Next, you will be asked for the source folder for your frontend project.
   ![Azure SWA extension dialogue box with a textbox filled with the source folder location](/img/blog/azureswa_src_folder.png)

5. Finally, the build location for your frontend project.
  ![Azure SWA extension dialogue box with a textbox filled with the build location](/img/blog/azureswa_extension_build_location.png)

If everything goes to plan, a VS Code toast notification about the successful completion of the GitHub actions will pop up. And within the Azure SWA extension, and tucked under the subscription it was created in, the Azure SWA project should be listed.

![Azure SWA extension with Azure SWA listed under the subscription it was created](/img/blog/azureswa_extension_success.png)

By right-clicking on the Azure SWA project, you will be presented with a context menu with one of the menu item called "Browse site". Clicking on it, you can traverse to your Azure SWA hosted page.

🎉🎉🎉 Congratulations! You have successfully deployed your Blazor WASM app to Azure Static Web Apps. 🎉🎉🎉
![Azure SWA context menu](/img/blog/azureSWA_page.png)

### Things that tripped me

1. For folk from a TDD/BDD background who like to create an Azure SWA project first and then proceed to code, the extension does not work on an empty folder.
  ![VS Code toast notification of error message of empty workspace](/img/blog/azureswa_extension_empty_workspace.png)

2. Having said that, try to deploy your code asap. This project is not just our first project in Azure but also a re-entry into .net [coming from a 10-year Node.js background]. Tinkering with the generated .gitignore, I un-commented the below line [brain freeze on my part that I want to attribute to working with ASP pre-2012😉].
  ![wwwroot entry in gitignore](/img/blog/gitignore_wwwroot.png)
This led to an insidious error: the app worked fine on the local machine via SWA CLI, but on pushing the commits onto the cloud, GitHub actions failed because it could not find those files.

3. When you are creating a new Azure Static Web Apps project, the Azure SWA-generated GitHub action expects the artifacts to be on the default branch[main/master]. If not, it will fail.
  ![Azure SWA GitHub action fail by running on default Git branch](/img/blog/azureswa_github_action_default_branch.png)
However, once the Azure SWA is created, the GitHub action works very well with other branches in powerful ways, which we will see in action during our next section.

## Custom Authentication

Now that we have got our app up and running, let's secure it by ensuring that only authenticated users with the requisite role can access certain pages, just like any good self-respecting production web app out there.

### Authenticating with Pre-approved providers

But before plunging headlong into the custom authentication, we will first ensure the IAM plumbing works with one of the Azure SWA pre-configured providers, GitHub.

Let's create a new git branch

```git
git switch -c CustomAuth
```

[Microsoft Learn](https://docs.microsoft.com/en-us/shows/Azure-Tips-and-Tricks-Static-Web-Apps/?WT.mc_id=AZ-MVP-5003041) has a great video series on Azure SWA, and one of them, [Frank Boucher's authentication video](https://docs.microsoft.com/en-us/shows/azure-tips-and-tricks-static-web-apps/how-to-add-a-c-api-to-your-blazor-web-app-12-of-16--azure-tips-and-tricks-static-web-apps/?WT.mc_id=AZ-MVP-5003041), was crucial for this post.

1. Microsoft has released a .net library that configures an Authentication State Provider for our Azure SWA app.[ Don't go by its nomenclature. Microsoft is underselling it; it's not just for Azure Functions😉]

    ```dotnet
    dotnet add package Microsoft.Azure.Functions.Authentication.WebAssembly --prerelease
    ```

    While developing this app in RC1 and RC2, there was only a prerelease version we could use. I expected that we would have an official one when .net 6 was released. Alas, it is still in prerelease.
  ![VS Code terminal showing dotnet add package failing with a request to use prerelease version](/img/blog/dotnet_add_package_authentication_prerelease.png)

    Also, this package's [nuget](https://www.nuget.org/packages/Microsoft.Azure.Functions.Authentication.WebAssembly/1.0.1-preview) page is bereft of any content for a potential user, and I have serious doubts about the [GitHub repo](https://github.com/Azure/azure-app-service-authentication) it's claiming to be its source.

2. Once you add the library, we need to register the service in the WASM app builder found in the Program CSharp file: the 2 new lines added 👇 [The structure of this page will be different if you are on .net 5.]
   ![Program.cs with a horizontal green lines at the start of the new lines added to the file](/img/blog/program_cs_authentication.png)

3. Next up, we need to bolt on the Authentication scaffolding to the Blazor App [This step is applicable for any Blazor WASM standalone app; its not specific to Azure SWA]
    ![Blazor WASM's app razor page with code added for authentication highlighted](/img/blog/app_razor_authentication.png)

    Productivity tip: Use VS Code Format Document to get your code indented.
    ![VS Code Command Palette dropdown with Format Document as the first option](/img/blog/format_document_vscode.png)

4. Let's update the layout of the Weather App by replacing the "About" link with a "Login/Logout" one.
    ![Pre and post of the main layout page](/img/blog/layout_login_button.png)

    Check out the URL highlighted within red: **"Azure Static Web Apps uses the [/.auth system folder](https://docs.microsoft.com/en-us/azure/static-web-apps/authentication-authorization/?WT.mc_id=AZ-MVP-5003041&tabs=invitations#system-folder) to provide access to authorization-related APIs."**

5. Run the SWA CLI command to bring up the Azure SWA app locally. When you click the Login link, you will come across one of the best features of SWA CLI: its emulation of the Azure SWA authentication infrastructure.
    ![SWA CLI emulation of Azure SWA authentication](/img/blog/swa_cli_authentication_emulation.png)
    The provider is pre-filled with the one we have in our path in the .auth link above, with a text box for the user name and a text area for Roles[for now, we leave it untouched]. Clicking on the Login button will lead you back to the index page with the Login link replaced with a message welcoming the username entered in the emulator page and a **logout** link.
    ![Azure SWA app's index page with the user name highlighted](/img/blog/azureswa_index_post_login.png)

6. Presently, anyone can access the Weather Forecast page [reachable at the /fetchdata route].

    ![Weather Forecast page with the Login](/img/blog/wasm_weather_forecast_pre_login.png)

    Let's change that. Adding just two lines in your FetchDate.razor file and a restart should make that happen.

    ![FetchData.razor file with the code addition highlighted in green](/img/blog/fetchdata_post_authorization_code.png)  

    Now, when an unauthenticated user clicks on the Fetch Data link in the navbar, the page will display a terse message instead of the weather forecast. "Note to self: It would be cool if the famous MC Hammer  **[U can't touch this](https://www.youtube.com/watch?v=otCpCn0l4Wo)** gif plays when an un-authenticated user clicks that link."

    ![Weather Forecast page displaying "Not Authorized" message which is highlighted in red](/img/blog/weatherforecast_post_login_unauthenticated.png)

7. Hey, wait a minute, even John Smith from earlier can access the Weather Forecast page?!! Quite right, and here's the thing with "[attribute [Authorize]](https://docs.microsoft.com/en-us/aspnet/core/blazor/security/?WT.mc_id=AZ-MVP-5003041&view=aspnetcore-6.0#authorize-attribute)" as it is, it only restricts anonymous access; once you are authenticated(doesn't matter as who), you are through.

    ![The weather forecast is displayed with John Smith as logged in user](/img/blog/weatherforecast_post_login_authenticated.png)

    So let's ensure only weather reporters can access the forecast page; we are now introducing Role-based Access Control[RBAC]. It requires a mere amendment to the Authorize Attribute.
    ![fetch data code with Authorize attribute amended with weather-reporter role](/img/blog/fetchdata_post_role_authorization.png)

    And now, our authenticated but not having the requisite role(i.e. unauthorized) user can't access the forecast page.
    ![Weather Forecast page displays a message of "Not authorized" with John Smith as the logged in user](/img/blog/fetchdata_post_role_unauthorized.png)

    #TIL: David Letterman started his career as a weather reporter in the 70's.
    ![David Letterman in front of weather map](/img/blog/DavidLetterman.png)

    So let's logout and then click on the Login link again to bring us back to the emulator. Only this time, we masquerade as David Letterman in the role of a weather reporter.
    ![Azure SWA CLI emulator with username as David Letterman and role as weather-reporter](/img/blog/swa_emulator_david_weather_role.png)

    And lo and behold, David Letterman can access the weather forecast.
    ![Weather Forecast page successfully displayed with David Letterman highlighted in green](/img/blog/weatherforecast_post_login_authorized.png)

### Pull Request in Pre-Production

Great, now that we have corroborated on our workstation, the web app has a functioning IAM; let's validate it after deploying it on Azure.

Push the branch to GitHub.

```git
git push -u origin CustomAuth
```

On the GitHub dashboard for the project, a helpful message is displayed persuading us for a Pull Request.

![GitHub project dashboard with pull request button](/img/blog/github_dashboard_branch.png)

And this is a best practice for merging a code into an upstream or main branch.
![GitHub pull request page](/img/blog/github_pull_request.png)

Remember the GitHub Actions created by Azure SWA?  It also gets triggered for any Pull Request on the main branch.
![GitHub actions running on pull request](/img/blog/github_actions_pullrequest.png)

And here's one small but crucial productivity feature of Azure SWA: at the end of the successful processing of the GitHub action, the code will be available at a dedicated Stage URL. The Stage URL is almost identical to the production[main/master] branch URL, except for the subdomain appended with the GitHub Pull Request Number and Azure region.
![GitHub Pull Request Page showing the automated comment with the stage URL. The Pull Request on the page is highlighted, and so too is the Stage URL in the comments](/img/blog/github_actions_stage_url.png)

You can test your stage URL independently and also make a side-by-side comparison with the production branch.
![Two browser tabs resized to fit screen side by side for comparison of the production branch and the Stage branch](/img/blog/sidebyside_production_stage.png)

Click on the login link[at present only available in the stage URL], and immediately you realize the training wheels are off when the browser is redirected to the GitHub Sign-in page.
![GitHub Sign-in page](/img/blog/azure_github_login_page.png)

On successfully logging in for the first time, you need to consent to your personal information being shared with the app.[Yup, privacy is taken seriously.]
![Azure consent page when visiting the site for the first time](/img/blog/azureswa_consent_authentication.png)

We are authenticated but we do not have access to the Weather Forecast page.
![Weather Forecast page on stage with username highlighted in green and the page message of "Unauthorized access" highlighted in red](/img/blog/azureswa_stage_post_login.png)

Why? David was doing a standup job as a weather reporter on our local development [SWA CLI], but on the Azure Portal my GitHub profile is unknown. Anyway since David has a flourishing career as a late night host, its time we bid him Adieu and have me, or to be precise my GitHub profile take over his weather reporting duties on the app. Head on over to the Azure portal and visit the Role management page.

Can you grasp the significance of the last statement? We created an Azure SWA app, developed it locally, deployed it on Azure, created another branch to incorporate the IAM feature, hosted on its own stage URL, and we did not have to visit the Azure Portal till now. All this accomplished from the comforts of the tools you are most familiar with: VS Code, and GitHub. Remarkable win for developer productivity.

Azure SWA uses a built-in [invitation system](https://docs.microsoft.com/en-us/azure/static-web-apps/authentication-authorization/?WT.mc_id=M365-MVP-5003041&tabs=invitations#role-management) to assign roles to users
![Azure SWA Role invitation tab](/img/blog/azureswa_role_invitation.png)

Oops, looks like we need to revisit our code. Roles in Azure cannot contain hyphens. Replace the old role with "weathercaster".
![Role in Authorize attribute changed to weather caster in Fetch data razor page ](/img/blog/fetchdata_post_rolename_change.png)

Lets test it locally like we had done earlier.
![SWA CLI authentication emulator page with username filled with Github Profile name and weathercaster added to the list of roles](/img/blog/swacli_emulator_login_weathercaster.png)

Looks good.
![Weather Forecast page with username as GitHub profile name](/img/blog/weatherforecast_post_role_change.png)

In the interim, lets add the "weathercaster" role to my GitHub Profile name in the Azure Portal. And click on the invitation link generated below, which will redirect you to the web app of the main branch version.
![Role Management page in Azure Portal with weathercaster entered in the role text area](/img/blog/azureswa_role_invitation_change.png)

Push the changes to GitHub. Doing so, will once again trigger the GitHub Actions, and the end of its successful processing, it will generate a new comment with the same Stage URL.
![Visage GitHub Actions page with Azure SWA comments with stage URL](/img/blog/github_actions_page_comments.png)

Yay, my Github profile has finally got access to the Weather Forecast page.
![Weather Forecast page on the Stage URL with GitHub user profile](/img/blog/azurswa_weather_forecast_role_change.png)
