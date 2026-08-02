# Why Java Has No Native Equivalent to .NET Multi-Targeting

In .NET, compiling a single codebase for multiple framework versions simultaneously is a **first-class language feature natively baked into MSBuild** (e.g., `<TargetFrameworks>net9.0;net8.0</TargetFrameworks>`). Running `dotnet build` instantly generates multiple framework-specific binaries in one pass.

In the **Java/Maven ecosystem, this does not exist**. A standard `pom.xml` can only point to a single bytecode target via `<maven.compiler.release>`. If you need to compile a Java library for _both_ Java 8 and Java 17 simultaneously, you cannot do it cleanly within a single core Maven configuration.

To achieve the same output, Java developers must orchestrate a **Separate CI Step Matrix** or use specialized plugins like **Maven Toolchains**. Here is exactly what those two patterns look like.

---

## 🛠️ Pattern 1: Separate CI Step Matrix (The Industry Standard)

Instead of forcing Maven to handle multi-version compilation, developers leave the `pom.xml` open-ended by utilizing an external variable (`${java.version}`). They then delegate the matrix execution to a CI pipeline runner like **GitHub Actions**.

### 1. The Dynamic Maven Configuration (`pom.xml`)

Instead of hardcoding `17` or `21`, the POM uses a parameter that must be passed down from the command line:

```xml
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.enterprise</groupId>
    <artifactId>core-utility</artifactId>
    <version>1.0.0</version>

    <properties>
        <!-- The version is left dynamic; fallback default to Java 17 -->
        <java.compiler.version>17</java.compiler.version>
        <maven.compiler.release>\${java.compiler.version}</maven.compiler.release>
    </properties>
</project>
```

### 2. The External CI Matrix Configuration (`.github/workflows/build.yml`)

Because Maven can only run one build lifecycle execution per command loop, the GitHub Actions platform creates isolated virtual machine containers concurrently. It explicitly hooks up different JDK platforms and injects the runtime arguments into Maven:

```yaml
name: Cross-Compilation Matrix Build

on: [push]

jobs:
  build-matrix:
    runs-on: ubuntu-latest
    strategy:
      # 🎛️ The Matrix: Defines the isolated runtime variables
      matrix:
        java-version: [8, 11, 17, 21]

    name: Build Targeting Java \${{ matrix.java-version }}
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK \${{ matrix.java-version }}
        uses: actions/setup-java@v4
        with:
          java-version: \${{ matrix.java-version }}
          distribution: 'temurin'

      - name: Build Module for Target Version
        # Dynamically overrides properties and generates the localized artifact
        run: mvn clean package -Djava.compiler.version=\${{ matrix.java-version }}
```

> [!CAUTION] The Output Catch
> Unlike .NET, which cleanly places outputs side-by-side (`/bin/net8.0/` and `/bin/net9.0/`), every time Maven runs here, it outputs to the exact same folder structure (`/target/core-utility-1.0.0.jar`). The CI pipeline must explicitly rename or move the generated file after each parallel run block to prevent artifacts from overwriting one another.

---

## 🔌 Pattern 2: Maven Toolchains Plugin Setup

If you want to build for multiple Java versions inside a single local build without spinning up a CI server matrix, you must use the **Maven Toolchains Plugin**.

This plugin disconnects Maven from using whatever global version of Java is running on your machine (`JAVA_HOME`) and forces it to locate alternative compilers explicitly mapped in your local metadata files.

### 1. The Local Registry Configuration (`~/.m2/toolchains.xml`)

You must manually define exactly where alternative Java runtimes are located on your local computer:

```xml
<toolchains>
  <toolchain>
     <type>jdk</type>
     <provides>
         <version>11</version>
         <vendor>temurin</vendor>
     </provides>
     <configuration>
         <jdkHome>/Library/Java/JavaVirtualMachines/temurin-11.jdk/Contents/Home</jdkHome>
     </configuration>
  </toolchain>
</toolchains>
```

### 2. The Project Pipeline Configuration (`pom.xml`)

You register the toolchain block inside a distinct profile loop:

```xml
<project>
    <profiles>
        <!-- Profile to compile the library targeting legacy Java 11 engines -->
        <profile>
            <id>target-java11</id>
            <build>
                <plugins>
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-toolchains-plugin</artifactId>
                        <version>3.2.0</version>
                        <executions>
                            <execution>
                                <goals>
                                    <goal>toolchain</goal>
                                </goals>
                            </execution>
                        </executions>
                        <configuration>
                            <toolchains>
                                <jdk>
                                    <version>11</version>
                                </jdk>
                            </toolchains>
                        </configuration>
                    </plugin>
                </plugins>
            </build>
        </profile>
    </profiles>
</project>
```

To compile, you must call the execution switches sequentially in your terminal:

```bash
mvn clean package -P target-java11
```

---

## ⚖️ Why the Discrepancy Exists

- **Java Philosophy (Write Once, Run Anywhere):** Java leans heavily on **backward compatibility**. A compiled JAR from Java 8 runs seamlessly on a Java 17 JVM runtime without modification. Therefore, the core Maven ecosystem rarely forces you to cross-compile unless you are maintaining low-level core foundation frameworks or framework drivers.
- **.NET Philosophy (Optimized Evolution):** .NET underwent a significant historical architectural rewrite from legacy `.NET Framework` (Windows-only) to modern, cross-platform open-source `.NET Core` (now just called .NET 5/6/7/8/9). Because of this split, cross-compiling inside a single project file via `<TargetFrameworks>` became a required necessity for authors to support both old enterprise legacy infrastructure and modern container systems concurrently.
