When publishing a multi-targeted project, **NuGet simplifies the process by packing everything into a single file**, whereas **Maven treats each version slice as an entirely separate artifact**.

Here is exactly how the compilation outputs are bundled and delivered in both ecosystems.

---

## 🍃 The Maven Way: Separated Artifact Coordinates (Multiple Artifacts)

Because Maven does not natively support multi-version compilation inside a single module, it cannot bundle different Java bytecode targets inside a single `.jar` file. To achieve cross-platform distribution, you must build and upload **completely separate artifacts with unique coordinate identities**.

### 1. The Multi-Artifact Layout on Maven Central

To publish for both Java 8 and Java 17, you must publish two distinct objects. This is typically done by appending a version classifier or altering the `artifactId`:

```text
📦 Maven Central Repository
├── 📂 com/enterprise/my-library-java8/1.0.0/my-library-java8-1.0.0.jar
└── 📂 com/enterprise/my-library-java17/1.0.0/my-library-java17-1.0.0.jar
```

### 2. The Publishing and Consumption Experience

- **Publishing:** Your build script or CI/CD platform must run separate compilation sweeps and execute `mvn deploy` multiple times, pushing individual JARs, source JARs, and Javadoc signatures for _each_ targeted Java version.
- **Consumption:** The consumer cannot just download "the library" and let the engine figure it out. They must explicitly change their dependency coordinates based on the Java runtime they are currently running:
  ```xml
  <!-- If the consumer is running a legacy Java 8 app -->
  <dependency>
      <groupId>com.enterprise</groupId>
      <artifactId>my-library-java8</artifactId>
      <version>1.0.0</version>
  </dependency>
  ```

---

## The NuGet Way: The "Fat Package" (Single Artifact)

In .NET, multi-targeting is native. When you run `dotnet pack`, the MSBuild engine compiles all target versions defined in your project file (e.g., `net8.0` and `net9.0`) and wraps them inside **one single `.nupkg` archive**.

### 1. Structure of a Cross-Compiled `.nupkg`

A `.nupkg` file is just a renamed `.zip` archive. If you unzip it, you will see a `lib/` directory organized by framework identifiers:

```text
my-library.1.0.0.nupkg
├── my-library.nuspec (Metadata manifest)
└── lib/
    ├── net8.0/
    │   └── MyLibrary.dll  (Optimized for .NET 8)
    └── net9.0/
        └── MyLibrary.dll  (Optimized for .NET 9)
```

### 2. The Publishing and Consumption Experience

Because all versions are baked into one file, publishing and consuming are incredibly clean:

- **Publishing:** You push only one file to the registry using a single command:
  ```bash
  dotnet nuget push my-library.1.0.0.nupkg --api-key <KEY> --source https://nuget.org
  ```
- **Consumption:** The consumer adds your library to their project file versionlessly or with a single version string:
  ```xml
  <PackageReference Include="MyLibrary" />
  ```
- **The Magic:** When the consumer runs `dotnet build`, the NuGet restore engine inspects their project's `<TargetFramework>`. If they are running a `.NET 9` app, it automatically pulls the binary out of the `lib/net9.0/` folder. If they are on an older `.NET 8` app, it pulls the binary from `lib/net8.0/`.

---

## ⚖️ Architectural Summary

| Metric                  | 🍃 Maven Central (`.jar`)                                          | 🔷 NuGet (`.nupkg`)                                                      |
| :---------------------- | :----------------------------------------------------------------- | :----------------------------------------------------------------------- |
| **Artifact Count**      | **Multiple JARs** are required for different bytecodes.            | **One package** holds all targeted runtime variations.                   |
| **Registry Footprint**  | Unique entries/directories per runtime version.                    | One upload pointer entry on NuGet.org.                                   |
| **Consumer Resolution** | **Explicit**: The developer must change the `artifactId` manually. | **Implicit**: The client build engine extracts the correct folder slice. |
