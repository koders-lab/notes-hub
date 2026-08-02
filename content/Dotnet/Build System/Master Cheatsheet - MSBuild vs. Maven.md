This cheatsheet provides a definitive cross-reference guide between the Java/Maven ecosystem and the modern .NET/MSBuild ecosystem.

---

## 🏷️ 1. Core Terminology Translation

| 🍃 Java / Maven Term         | 🔷 .NET / MSBuild Term         | What It Actually Is                                                               |
| :--------------------------- | :----------------------------- | :-------------------------------------------------------------------------------- |
| **`pom.xml` (Module)**       | **`.csproj` (Project)**        | The central configuration file for a single compilation unit.                     |
| **Parent `pom.xml`**         | **`Directory.Build.props`**    | The file used to pass global compiler settings downward using folder inheritance. |
| **`<dependencyManagement>`** | **`Directory.Packages.props`** | The central dictionary where package versions are locked down.                    |
| **JAR / WAR**                | **Assembly (`.dll`)**          | The compiled binary output of executable code or libraries.                       |
| **Artifact Coordinator**     | **Package Identity**           | The combination of Name and Version used to pinpoint a resource.                  |
| **Maven Central**            | **NuGet.org**                  | The primary public repository for hosting and downloading packages.               |
| **`~/.m2/repository`**       | **`~/.nuget/packages`**        | The local machine cache where downloaded packages are stored.                     |

---

## 🏃‍♂️ 2. CLI Command Lifecycle Cheat Sheet

The `dotnet` CLI tool functions as a modern command-line wrapper built right on top of the underlying MSBuild engine.

| 🍃 Maven Command | 🔷 .NET CLI Command | MSBuild Native Equivalent | What It Does |
| :--- | :--- | :--- | :--- |
| `mvn clean` | `dotnet clean` | `msbuild /t:Clean` | Deletes intermediate output folders (`bin/` and `obj/`). |
| `mvn compile` | `dotnet build --no-restore` | `msbuild /t:Build` | Compiles the source files into an execution assembly. |
| `mvn test` | `dotnet test` | `msbuild /t:Test` | Discovers and executes automated unit test projects. |
| `mvn package` | `dotnet pack` | `msbuild /t:Pack` | Bundles compiled code and manifest into a `.nupkg` archive. |
| `mvn deploy` | `dotnet nuget push` | _None_ | Uploads your packaged artifact to a remote package registry feed. |
| `mvn architecture:generate` | `dotnet new <template>` | _None_ | Scaffolds a new project from an archetypal template structure. |

> [!TIP] Dependency Restoration
> While Maven runs a resolution pass on almost every execution lifecycle command, modern .NET automatically runs an implicit `dotnet restore` right before executing `dotnet build` or `dotnet run`. You rarely need to type `dotnet restore` manually.

---

## 🎛️ 3. Dependency Scope & Management Mapping

| 🍃 Maven Syntax               | 🔷 MSBuild / CPM Syntax        | Functional Behavior                                                                                                  |
| :---------------------------- | :----------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| **`<dependencyManagement>`**  | **`<PackageVersion>`**         | Reserves a version string centrally. Does _not_ install the package into sub-modules automatically.                  |
| **Parent `<dependencies>`**   | **`<GlobalPackageReference>`** | Force-injects a package dependency into _every single child project_ automatically without exception.                |
| **`<scope>compile</scope>`**  | _Default Behavior_             | Available at compile time, execution runtime, and bubbles transitively downstream.                                   |
| **`<scope>provided</scope>`** | **`PrivateAssets="all"`**      | Used for build utilities, compiler extensions, or analyzers. It compiles your project but _never_ passes downstream. |
| **`<scope>test</scope>`**     | _Isolate via Target Project_   | .NET handles this by completely isolating test dependencies within separate `.csproj` test runner assemblies.        |

---

## 💡 4. Top 3 Conceptual Differences to Remember

1. **Top-Down vs. Bottom-Up Architecture:**
   In Maven, a child module must explicitly point to its parent using the `<parent>` tag coordinates. In MSBuild, inheritance is implicit and **top-down**. Any file named `Directory.Build.props` automatically injects its configurations straight down into any `.csproj` file found in the folders underneath it.
2. **The Activation Switch:**
   Unlike Maven, where using a parent POM turns on dependency features natively, .NET Central Package Management (CPM) is strictly opt-in. You must explicitly write `<ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>` in your props file to activate version verification rules.
3. **The Single-Artifact Matrix:**
   Maven generates separate physical JAR artifacts for different target execution profiles or platforms. MSBuild can compile a codebase for multiple target runtimes concurrently using the pluralized `<TargetFrameworks>` attribute, bundling all target binaries into a single, cohesive `.nupkg` file.
