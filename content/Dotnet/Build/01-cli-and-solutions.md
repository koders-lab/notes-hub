---
publish: true
title: 01. .NET CLI & Solutions Architecture
---

# 🛠️ .NET CLI & Solutions Architecture

This module covers project initialization, solution tracking, and core project file architecture for .NET developers, mapped against Maven project structures.

---

## 🚀 Core Project Templates & CLI Flags

The `dotnet new` command instantiates structural assets based on explicit SDK boilerplate profiles. This is the structural equivalent of executing a `mvn archetype:generate` template sweep.

### Common Templates

- `dotnet new console` — Bare-bones execution entry point (Equivalent to a basic Java application with a `public static void main`).
- `dotnet new webapi` — RESTful ASP.NET Core API engine.
- `dotnet new mvc` — Model-View-Controller framework.
- `dotnet new classlib` — Pure utility dependency layer (Outputs a `.dll`, the direct equivalent to a Maven utility JAR).
- `dotnet new xunit` — Automated test project isolation.
- `dotnet new sln` — Metadata wrapper file.

### Modification Switches

- `-n <NAME>` — Sets the output project identification moniker.
- `-o <DIR>` — Explicitly maps target compilation file paths.
- `-f <FRAMEWORK>` — Selects runtime platform targets (e.g., `net9.0`).

> [!TIP] Execution Script Profile
> `dotnet new mvc -n MyBillingUI -o ./src/BillingUI -f net9.0`

---

## 📦 Solution Architecture (`.sln`)

A .NET **Solution (`.sln`)** is a plain-text configuration layer used to map relationships across multiple independent sub-projects. It acts as an organizational blueprint rather than an artifact container.

Unlike a Maven Multi-Module parent project where modules are rigidly coupled via a hierarchical structure, a .NET Solution uses a **Top-Down Link**. The solution points to projects, but individual `.csproj` projects do not inherently know they belong to a solution. This allows a single project file to be reused across entirely different solutions.

### Core CLI Management Commands

- `dotnet new sln -n EnterpriseSystem` — Generates an empty master solution index.
- `dotnet sln add <CSPROJ_PATH>` — Registers an independent project to the solution footprint.
- `dotnet sln remove <CSPROJ_PATH>` — Drops project tracing without touching physical source code assets.
- `dotnet sln list` — Queries all projects currently tracked by the solution file.
- `dotnet build` — Iterates through and compiles the dependency hierarchy of all listed projects.

---

## 🔷 Anatomy of a Bare `.csproj` File

Unlike Maven configurations, a bare .NET project contains zero explicit artifact coordinates (`groupId`, `artifactId`, `version`). Instead, attributes are **implicitly evaluated** based on physical file placement and folder designations.

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
```

### Architectural Translations

- **`Sdk="Microsoft.NET.Sdk.Web"`:** Acts like a combined **Maven Parent POM + Plugin Registry**. It implicitly inherits thousands of build lifecycles and compilation rules behind the scenes, such as web compilation, asset minification, and self-hosted server deployments.
- **Artifact Names:** In Maven, you define an `<artifactId>billing-engine</artifactId>`. In .NET, if your project file on disk is physically named `BillingEngine.csproj`, MSBuild automatically assigns the identity as `BillingEngine`, compiling it out to `BillingEngine.dll`.
- **Group Identifiers:** Instead of a rigid `<groupId>` property, .NET natively follows standard C# naming conventions where your unique organization namespace is encoded directly into the file name itself (e.g., naming your file `Company.Department.BillingEngine.csproj`).
- **Project Versions:** If a version tag is omitted, MSBuild automatically treats the compilation assembly version as `1.0.0`. You can inject the version dynamically from your terminal line (`dotnet build -p:Version=2.3.4`) or manage it centrally.
