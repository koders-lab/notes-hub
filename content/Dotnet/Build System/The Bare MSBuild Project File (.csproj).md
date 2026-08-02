You are completely correct to notice that **there are no coordinate strings** (like `groupId`, `artifactId`, or `version`) in a bare .NET project file.

In .NET, a project's coordinates are inferred implicitly from its physical file name and folder structure, rather than being hardcoded inside the file itself.

Here is what a bare, minimal MSBuild console project file looks like today:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
```

---

## 🔍 Line-by-Line Breakdown

### 1. `Sdk="Microsoft.NET.Sdk"` (The Parent POM Plugin)

This is the single most critical attribute. By declaring the `Sdk`, you are importing thousands of lines of hidden, pre-configured MSBuild instructions behind the scenes.

- **The Maven Equivalent:** This acts exactly like a combined **Maven Parent POM and the default lifecycle plugin bindings**. It tells the compiler how to resolve compilation commands, how to run tests, and how to pack binaries without you writing a single plugin step.

### 2. `<OutputType>Exe</OutputType>` (The Packaging Goal)

This defines what kind of application artifact this compilation process produces.

- `Exe` instructs the compiler to produce an executable application (like a spring-boot application or a JAR with a `main` class manifest).
- If you remove this line completely, it defaults to a class library, producing a plain `.dll` (the direct equivalent to a standard Maven utility JAR).

### 3. `<TargetFramework>net10.0</TargetFramework>` (The Compilation Target)

This establishes the specific runtime environment and language version constraints.

- **The Maven Equivalent:** This maps exactly to `<maven.compiler.release>17</maven.compiler.release>`.

---

## 🗺️ Why Are There No Coordinates?

In Maven, an artifact **must** define its coordinates explicitly so the repository engine knows its identity:

```xml
<!-- 🍃 Maven Coordinates -->
<groupId>com.enterprise</groupId>
<artifactId>billing-engine</artifactId>
<version>1.0.0</version>
```

In .NET, MSBuild skips this internal declaration entirely by applying the following architectural rules:

### 1. The `artifactId` is the File Name

If your project file on disk is physically named `BillingEngine.csproj`, MSBuild automatically assigns the assembly/artifact identity as **`BillingEngine`**. If you compile it, it outputs a binary file named `BillingEngine.dll`.

- _To change this behavior,_ you can optionally add an override tag inside a `<PropertyGroup>`: `<AssemblyName>CustomName</AssemblyName>`.

### 2. The `groupId` is Inferred by Directory Namespace

.NET avoids a rigid `groupId` attribute inside the configuration script. Instead, .NET follows standard C# naming conventions where your unique organization namespace is encoded directly into the file name itself (e.g., naming your file `Company.Department.BillingEngine.csproj`).

### 3. The `version` Defaults to a Base State

If a version tag is omitted, MSBuild automatically treats the compilation assembly version as `1.0.0`.

- As your pipeline scales, you can inject the version dynamically from your terminal line (`dotnet build -p:Version=2.3.4`) or manage it centrally using a shared **`Directory.Build.props`** file.
