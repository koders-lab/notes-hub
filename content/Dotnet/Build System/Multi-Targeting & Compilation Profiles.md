In Maven, targeting multiple Java versions or environments typically requires configuring complex build profiles (`<profiles>`), shifting properties, or executing matrix builds in a CI/CD pipeline.

In .NET, compiling a single codebase for multiple framework versions or environmental configurations is a **first-class language feature built directly into the project file (`.csproj`)**.

---

## 🎯 Multi-Targeting (The Framework Matrix)

Instead of target-compiling one specific runtime version, a single .NET project can build separate output binaries for multiple framework versions simultaneously.

### 1. Project Configuration (`.csproj`)

To switch from single-targeting to multi-targeting, you change the single pluralization of the XML tag from **`<TargetFramework>`** to **`<TargetFrameworks>`** (note the trailing **s**) and separate the target frameworks with a semicolon.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <!-- ❌ Single-targeting: <TargetFramework>net8.0</TargetFramework> -->
    
    <!-- 🔷 Multi-targeting: Builds for cloud and legacy systems concurrently -->
    <TargetFrameworks>net9.0;net8.0;net481</TargetFrameworks>
    
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
```

### 2. Handling API Differences with Preprocessor Directives

If you are compiling for multiple frameworks, certain newer APIs might not exist in older runtime versions. You handle this right inside your C# source files using **conditional compilation switches** (similar to C/C++ preprocessing).

```csharp
public class SystemUtility
{
    public string GetRuntimeInfo()
    {
#if NET9_0
        return "Running on ultra-modern .NET 9 cloud engine.";
#elif NET8_0
        return "Running on Long-Term Support .NET 8 runtime.";
#elif NET481
        // Legacy .NET Framework running strictly on Windows
        return "Running on enterprise legacy .NET Framework 4.8.1.";
#else
        return "Running on an unknown historical platform.";
#endif
    }
}
```

> [!NOTE] How Compilation Outputs Change
> When you run `dotnet build`, the engine compiles your code three separate times. If you look inside your `/bin/Debug/` folder, you will find three distinct isolation directories, each containing its own optimized assembly:
>
> - `bin/Debug/net9.0/MyLibrary.dll`
> - `bin/Debug/net8.0/MyLibrary.dll`
> - `bin/Debug/net481/MyLibrary.dll`

---

## 🏗️ Conditional Dependency Injection (Profiles Replacement)

In Maven, you might use a profile to inject a specific mock dependency when running local tests, but a heavy driver when deploying to production.

In .NET, because the `.csproj` file is evaluated dynamically as an MSBuild script, you can write conditional logic directly into your item and package groups based on properties like the current build configuration.

### Example: Swapping Packages based on Configuration Profile

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
  </PropertyGroup>

  <!-- Default dependencies for all environments -->
  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" />
  </ItemGroup>

  <!-- 🧪 Profile: Inject this package ONLY when compiling in 'Debug' mode -->
  <ItemGroup Condition="'\$(Configuration)' == 'Debug'">
    <PackageReference Include="Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore" />
    <PackageReference Include="Serilog.Sinks.Console" />
  </ItemGroup>

  <!-- 🚀 Profile: Inject this package ONLY when compiling in 'Release' mode -->
  <ItemGroup Condition="'\$(Configuration)' == 'Release'">
    <PackageReference Include="Serilog.Sinks.ApplicationInsights" />
  </ItemGroup>
</Project>
```

---

## 💻 CLI Commands for Multi-Targeting

When you have a multi-targeted project, your CLI commands can target the entire matrix or point to a single framework slice:

- `dotnet build` — Compiles the code for **all** target frameworks defined in the file.
- `dotnet build -f net9.0` — Compiles the code **only** for the .NET 9 framework slice (saves time during local development loops).
- `dotnet run -f net8.0` — Explicitly launches the application using the compiled binary inside the .NET 8 target slice.
- `dotnet pack` — Generates a single `.nupkg` package file that neatly wraps all target binaries inside it. When a consumer downloads your NuGet package, their project will automatically extract the best-fitting framework slice.

---

## ⚖️ Translation Cheat Sheet

| Intent | 🍃 Maven Ecosystem | 🔷 .NET Ecosystem |
| :--- | :--- | :--- |
| **Build for multiple environments** | Build Profiles (`<profiles>`) | MSBuild `Condition` evaluation on `<ItemGroup>` |
| **Output multiple compilation binaries** | Matrix plugin setups / Separate CI steps | Multi-Targeting `<TargetFrameworks>` tag |
| **Isolate platform-specific code** | Separate source sets or interfaces | Preprocessor blocks (`#if NET9_0`) |
