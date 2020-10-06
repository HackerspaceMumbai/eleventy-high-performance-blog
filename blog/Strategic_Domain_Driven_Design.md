---
title: Domain-Driven Design
date: 2020-09-29
description: Strategic Domain-Design for Visage with EventStorming, Domain Storytelling, Core Charts, Bounded Context Canvas.
image: /img/blog/Bounded_Context_Canvas.png
tags:
  - blog
layout: layouts/post.njk
---
A software project is akin to crossing familiar valleys to scale up a new mountain: maps are vital. And [Domain Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design) does just that: it not only provides a 20000 feet view but also guides us along a pathway to flesh out our project.

Visage's [Statement of Intent](https://github.com/HackerspaceMumbai/Visage/wiki/1-Statement-Of-Intent) and [Workflow](https://github.com/HackerspaceMumbai/Visage/wiki/2-Essential-Workflow) forms the foundation for the design decisions to follow.

In this first blog post about the project, we will model the Domain through a process of intentional discovery and rely on different tools to build broad contours, tease out implicit requirements as well as unearth any blind spots. All this will become apparent below as a "clearer picture" emerges.

> The goal of Strategic DDD is to help us chart the most elusive things in Domain-driven Design: [Bounded Contexts](https://www.infoq.com/news/2019/06/bounded-context-eric-evans/).

## Big Picture Event Storming

Our first tool is Event Storming[ES], which is essentially the plotting of Domain events [usually depicted in orange] on a somewhat linear time scale as they occur in real life.

Our 1st iteration yielded:

![1st iteration Event Storming](/img/blog/Event_Storming_I1.jpg)

While [Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html) is the key to separate out Bounded Contexts, I feel there should also be a core set of Unambiguous Vocabulary to unify a domain. The word _Event_ in English has different meanings depending on the context, especially in software & DDD. So in a nod to my Indian heritage, I standardized on the Sanskrit root word for events, meetups, conferences, functions, etc -> **Karyakaram**

Please notice the spacing between the events. Some are bunched up together and this is a reflection of their proximity to each other in respect of time. Our bounded contexts are emerging.

These events are triggered by commands[depicted as blue rectangular boxes] which are usually "intentioned" by users [in yellow] or external systems [in pink].

Our 2nd iteration results in:

![2nd iteration Event Storming](https://res.cloudinary.com/mumbai-hackerspace/image/upload/q_auto,f_auto/v1599142822/Visage/Design-ES-2nd.jpg)

Note how we have now added a few more Domain events. This process of discovery is encouraged in Event Storming. Our first draft will never be perfect but it sets the bedrock for further exploration.

Also, we noticed that our technical biases are creeping in[Send Email, duh🤦‍♂️]. We need to ensure all terms are only domain-specific. Let's do some correction, and flesh out the rest of the diagram.

Voila, the final version of the Big Picture Event Storming is built with [Mural](https://app.mural.co/invitation/mural/hm2422/1595976908405?sender=augcor3018&key=22e68a54-6b14-413d-a37c-b6278ccacfb7) which has a more professional looking Event Storming template.

![Big Picture Event Storming](/img/blog/Big_Picture_Event_Storming.png)

Based on a few design heuristics, "I spy" the nebulous contours of at least two bounded contexts[BC] with the "RegistrationClosed" being the pivotal event. I have named them "Event Registration" and "Check-ins" respectively after agonizingly iterating over them over a day or so especially the former.

## Domain Storytelling

[Domain Storytelling](https://domainstorytelling.org/) is a DDD tool where Domain Experts pictorially depict their workflow involving actors and work objects. The kicker here is that the activities are numbered in order of their occurrence.

Thanks to the good folks at [WPS](https://github.com/WPS), who have provided a Domain Storytelling [Modeller](https://www.wps.de/modeler/) to make our lives much easier, we have a short 20-second video of the Visage "story".

<iframe loading="lazy" name="DomainStoryTelling" width="100%" height="auto" src="https://www.youtube.com/embed/5vXRYps9_n8" srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/5vXRYps9_n8?autoplay=1><img src=https://img.youtube.com/vi/5vXRYps9_n8/hqdefault.jpg alt='Domain StoryTelling for Visage as part of Strategic DDD'><span>▶</span></a>" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Domain StoryTelling for Visage as part of Strategic DDD"></iframe>

One of the heuristics that is associated with Domain StoryTelling is that uni-directional flows are usually indicative of bounded contexts. This was quite revealing for now it shows that they are definitely [three distinct bounded contexts](https://docs.microsoft.com/azure/architecture/microservices/model/domain-analysis?WT.mc_id=OSS-MVP-5003041).

1. Scheduling
2. Shortlisting
   The above two have been carved out from the earlier Event Management. While ruminating over the names [deja vu, I know], I had a look at Eventbrite's blade for event creation and found that they named it _Scheduling_. And truth be told, at a higher level, that's what it actually is. **To let DDD help you, you got to learn to keep your ego/biases aside.**
3. CheckingIn

## Core Domains Charts

Now that we have our Bounded Contexts, let's see how they work with each other. Most folks go with Context Maps as their tool for this as recommended by [Eric Evans](https://dddcommunity.org/book/evans_2003/) but I prefer Core Domain Charts since the latter strategically depicts the relationships between bounded contexts.

![Core Domain Charts](/img/blog/Visage_Core_Domain_Charts.png)

## Bounded Context Canvas

Next up we try to focus on each Bounded Context individually. [Nick Tune](https://medium.com/@ntcoding) & his buddies at [DDD Crew](https://github.com/ddd-crew) [go check out their GitHub organization for more DDD goodies] had come up with a modeling technique to approach a Bounded Context like a black box: see what goes in, what comes out and what gets processed. The canvases have been sketched out using [draw.io](https://drawio-app.com/)

![Shortlisting Bounded Context Canvas](/img/blog/Bounded_Context_Canvas.png)

Can you see the Core Domain Charts effect out here? Since Shortlisting is a core domain, it will be in a driving position vis-a-vis Scheduling, which is a Generic/Supporting domain, hence the former is the customer while the latter is a supplier. On the other hand with CheckingIn, which is also a core domain, it is treated on an equal footing. Don't ignore realpolitik.

These canvases are the first artifacts to be [checked into the GitHub repo hosted source folder](https://github.com/HackerspaceMumbai/Visage/commit/6768e24bc865e2b12109198ebe0421ba93991b2b) of their respective microservices as part of [Living Documentation](https://leanpub.com/livingdocumentation). In a sense, it signifies these canvases are the spiritual fountainhead of the co-located code.

## Impact Mapping

Lastly, an app or a project does not exist in a vacuum, rather its invariably part of an ecosystem. I use Impact Mapping to do a kind of out of the box thinking, getting the lay of the land so to say, see who are allies of the project and what it is up against to make a dent in the cosmos.

![Impact Mapping](/img/blog/Impact_Mapping.png)

> "Make your vision so clear that your fears become irrelevant."

You can follow the progress of this project on [Azure DevOps](https://bit.ly/2YHTZgq)

For the next blog post, we will be going into Tactical DDD with Example Mapping based BDD, Process Modelling EventStorming, Aggregate Canvases, etc.
