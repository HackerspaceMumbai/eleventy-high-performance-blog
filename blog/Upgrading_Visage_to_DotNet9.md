---
title: Upgrading Visage to .NET 9
layout: layouts/post.njk
date: 2025-03-30
description: Learn how we upgraded the Visage app to .NET 9, leveraging cutting-edge features to enhance our community platform.
tags:
  - blog
category: Visage
image: /img/blog/Visage_Architecture.png
---


We are thrilled to announce that our community management app, Visage, has been upgraded to **.NET 9**! This significant update builds upon the foundation we presented at .NET Conf 2024 and represents our commitment to leveraging cutting-edge technology to better serve our community.

## Our Community Challenge

The Hackerspace Mumbai community has grown tremendously over the past decade. As the largest open-source community in Mumbai with over 10 years of regular tech meetups, we face unique challenges:

- Our events are consistently at capacity, requiring careful registration management.
- Venue compliance mandates accurate tracking of attendee check-ins and check-outs.
- We need to ensure diversity and inclusiveness in our registration process.

Rather than continuing with manual processes, we decided to do what tech communities do best: build a solution. And .NET 9 provided the perfect foundation.

## Why .NET 9?

.NET 9 brings substantial improvements that align perfectly with our community platform needs:

- **Enhanced Performance**: Faster startup times and reduced resource consumption.
- **Cloud-Native Architecture**: Better support for distributed applications.
- **AI Integration Capabilities**: Native support for AI models through Semantic Kernel.
- **Cross-Platform Development**: Unified experience across web and mobile.

## Key Technologies Powering Our Upgrade

### .NET Aspire

Aspire has transformed how we architect our cloud-native application:

- **Dashboard Integration**: Centralized monitoring of all microservices.
- **Service Discovery**: Automatic service registration and discovery.
- **Configuration Management**: Streamlined environment management.
- **Built-In Telemetry**: Comprehensive logging and metrics.

### Semantic Kernel/

The AI capabilities of Semantic Kernel enable:

- **Intelligent Registration Prioritization**: Balancing community diversity with engagement history.
- **Automated Communication**: Generating personalized messages for different attendee groups.
- **Post-Event Analysis**: Processing feedback and participation data to improve future events.

### Blazor Hybrid

Our UI layer leverages Blazor Hybrid to:

- **Unify Mobile and Web Experiences**: Shared codebase across platforms.
- **Enable Offline Functionality**: Critical for venue check-in processes.
- **Improve Performance**: Near-native UX for critical attendee-facing features.

## Development Process and GitHub Copilot

Our development was significantly accelerated using GitHub Copilot and Copilot Workspace:

- Rapid prototyping of service interactions.
- Assistance with .NET 9 migration patterns.
- Generation of boilerplate code for new features.
- Intelligent suggestions for API integration.

This developer experience enhancement allowed us to meet our tight deadline for the .NET Conf 2024 presentation.

## Challenges and Solutions

The upgrade journey wasn't without obstacles:

**Challenge**: Adapting to Aspire's new service orchestration model.  
**Solution**: Created a phased migration plan, starting with non-critical services.

**Challenge**: Integrating Semantic Kernel with existing data pipelines.  
**Solution**: Developed a bridge architecture that gradually shifted processing to the AI components.

**Challenge**: Ensuring backward compatibility with existing community data.  
**Solution**: Comprehensive data migration scripts with validation checkpoints.

## Join Our Open Source Journey

Visage is fully open source and available on GitHub at [github.com/HackerspaceMumbai/Visage/tree/dotnet9](https://github.com/HackerspaceMumbai/Visage/tree/dotnet9). We welcome contributors of all experience levels to join our project.

Whether you're interested in .NET 9, AI integration, or community building tools, there's opportunity to make an impact. Our community thrives on collaboration and diverse perspectives.

## Looking Ahead

This upgrade to .NET 9 is just the beginning. We're already planning additional features:

- Advanced analytics dashboard for community growth metrics.
- Enhanced AI-powered networking suggestions for attendees.
- Expanded integration with other community platforms.
- Improved accessibility features.

We're excited about the possibilities that .NET 9 brings to our community platform and look forward to sharing more updates as we continue this journey.

---

*For more details about our .NET 9 upgrade journey, watch Augustine Correa's full presentation from .NET Conf 2024: [With .NET and AI, our community app "aspires" to be on cloud nine](https://www.youtube.com/watch?v=LO4EfQT94BY)*