---
title: Event Modeling and Feature Mapping
date: 2021-01-15
description: Using Event Modeling and Feature Mapping to understand the domain better
image: /img/blog/Event_Modelling_Conways_Law.png
tags:
  - blog
category: Visage
layout: layouts/post.njk
---

In the [first post](./Strategic_Domain_Driven_Design.html), we identified the various Bounded Contexts that make up our domain. Let's dive in to deepen our understanding of our domain with the help of Event Modeling and Feature Mapping.

## Event Modeling

[Event Modeling](https://eventmodeling.org/posts/what-is-event-modeling/) is a great tool to depict the relationships between Events and your UI models. While it starts as a blueprint, post design it serves as a map.

We are using Evident System's [oNote app](https://app.onote.com/) to apply Event Modeling to Visage.

### Brain Storming & The Plot

The first step lays out the events chronologically. I won't blame you if get a feeling of deja vu after reading the [previous post's Big Picture Event Storming](https://www.hackmum.in/blog/strategic_domain_driven_design#big-picture-event-storming).

![Event Modeling Brain Storming](https://res.cloudinary.com/mumbai-hackerspace/image/upload/v1603718923/Visage/Event_Modelling_-_Brain_Storming_and_Plot.png)

### Story Board & UX Concurrency

This is where Event Modeling gets interesting, it incorporates UX mockups early so that stakeholders get a visual feel of the system in action. This is in a sense wireframing the domain space.

![Event Modeling Story Board](https://res.cloudinary.com/mumbai-hackerspace/image/upload/v1603718918/Visage/Event_Modelling_-_The_Story_Board.png)

Also, another cool thing is, we can depict which screens are available for different classes of users as well as those that are common.

![Event Modeling Storyboard Login](https://res.cloudinary.com/mumbai-hackerspace/image/upload/v1603718926/Visage/Event_Modelling_Storyboard_LogIn.png)

### Identify Inputs

Events are manifestations of state changes, which are executed by commands. And which are, in turn, usually initiated by users. In this step, we find out those commands and users.

![Event Modeling Identify Inputs Command](https://res.cloudinary.com/mumbai-hackerspace/image/upload/v1603718922/Visage/Event_Modelling_Identify_inputs.png)

### Identify Outputs

Users are usually in the habit of seeing the current state of their system, especially after they pressed an alluring button to explicitly change the state.😊

This is where we wire up the UI with the View Models.

![Event Modeling Identify outputs](https://res.cloudinary.com/mumbai-hackerspace/image/upload/v1603718925/Visage/Event_Modelling_Identify_Outputs.png)

### Conway's Law

Here's the thing about Events: they usually coalesce themselves around autonomous functionality aka Bounded Contexts which we have already identified in the [previous post](./strategic_domain_driven_design.html#core-domains-charts). And that's the last step for completing the Event Modeling for Visage.

![Event Modeling Conway's Law](https://res.cloudinary.com/mumbai-hackerspace/image/upload/v1604013150/Visage/Event_Modelling_Conways_Law.png)

> **Completeness Check: Event modeling ensures "all information has a source and a destination."**

## Project Management

Software Design is continuously refactored, and we revisit [Impact Mapping](Strategic_Domain_Driven_Design.html#impact-mapping) for the project.

1. To add or tweak features that have been discovered.
2. To identify the feature that will give us the most bang for the buck.

![Impact Mapping Revised](/img/blog/Impact_Mapping_Revised.png)

If you had ever done Impact Mapping before, you would notice we added an extra layer to our map: Customer Outcomes. Achieving the customer outcome for core personas spans almost the entire product life cycle. It, in fact, neatly maps to Epics in Agile methodology, and the deliverables to Features. This completely orients our project management towards business outcomes.

![Azure DevOps Epics](/img/blog/Azure_DevOps_Epics.png)

We do the same for Features. Note that we do not add all the features yet. We are prioritizing features for the initial iterations.

![Azure DevOps Features](/img/blog/Azure_DevOps_Features.png)

## Features Mapping

Most projects, especially #OSS develop a technical lingo that seeps into their project management, making it an onerous task for newbies and non-tech folks to follow. That is where [Behaviour Driven Design BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) comes to the rescue, and in the last few years, I have come to rely on [Feature Mapping](https://johnfergusonsmart.com/feature-mapping-a-lightweight-requirements-discovery-practice-for-agile-teams/) as my go-to BDD tool.

![Feature Mapping for Shortlisting](/img/blog/Feature_Mapping_Shortlisting.png)

1. At the top is an anchoring use case which provides the foundation for the feature.
1. On the left, we jot the different rules of the feature [in green box].
1. It is followed by a series of steps that an example illustrating the rule would typically have to follow[in pale yellow]
1. Finally a series of consequences for the example are jotted down [in purple].

To round up this post, we now add the rules as User Stories under Feature in our [Azure DevOps Project](https://dev.azure.com/augcor/Visage/_workitems/recentlyupdated/).

![Azure DevOps User Story](/img/blog/azure_devops_user-story.png)

![Azure DevOps Feature Hierarchy](/img/blog/azure_devops_user_stories.png)

In our next post, we complete the Tactical DDD followed by User Journey Mapping and start the development for the Project with the most important cross-cutting concern: Authentication (Login).
