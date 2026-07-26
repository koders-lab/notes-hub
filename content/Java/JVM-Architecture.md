---
publish: true
title: JVM Architecture (full note, pre-AI era)
tags:
  - java
  - refresher
---

> [!note] This is my original deep-dive note, converted to Markdown word-for-word.
> Nothing removed. Source of the stack-vs-heap thread-safety insight.

# Contents

- Virtual Machine

- JVM

- JRE

- Why JVM

- Function of JVM

- Features of JVM

- Stack-based virtual machine

- Symbolic reference

- Garbage collection

- Guarantees platform independence by clearly defining the primitive data
  type

- Network byte order

- java command

- Components of JVM

- Class loader

- Execution Engine

- Data / Memory Areas

- Classloader

- Quick

- Detailed

- Features of Java class loader

- Hierarchical Structure

- Delegation mode

- Visibility limit

- Unload is not allowed

- Components/ Phases of Classloader

- Loading

- Bootstrap class loader

- Extension class loader

- Application / System class loader

- User-defined class loader

- Linking

- Verifying

- Preparing:

- Resolving:

- Initialization

- Runtime Data Area

- Method / Class Area

- Metaspace

- Method Area in some detail

- Quick

- Detailed

- The Constant Pool

- Field Information

- Method Information

- Class Variables

- A Reference to Class ClassLoader

- A Reference to Class Class

- Heap Area

- OutOfMemoryError in Java Heap

- PC (Program Counter) Registers

- Register Area

- JVM (Java Thread) Stacks

- Frames

- Operand Stack

- Local variable array

- Run-time constant pool reference

- Native Method stacks

- Execution Engine

- Interpreter

- JIT (Just-In-Time) compiler

- Intermediate Code generator

- Code Optimizer

- Target Code Generator

- (Hotspot) Profiler

- Garbage Collector

- Java Native Interface (JNI)

- Native Method Libraries

- Performance

- Summary

- Questions

- Constant Pool

- Commands

- Check

# Virtual Machine

A virtual machine (VM)\* _is a software implementation of a machine (i.e.
a computer) that executes programs like a physical machine_.\*

# JVM

The Java Virtual (or abstract) Machine (JVM) that analyzes and executes
Java byte code instructions.

# JRE

The JRE is composed of the Java API and the JVM. It is an implementation
of the JVM specification. The role of the JVM is to read the Java
application through the Class Loader and execute it along with the Java
API.

## Why JVM

1. For implementation of <span class="mark">WORA</span> (_Write Once
   Run Anywhere_) principle, Java was designed to run based on a
   virtual machine separated from a physical machine.

2. Once source code (.java file) is compiled on one platform (bytecode
   is formed), that bytecode can be executed (interpreted) on any other
   platform running a JVM.

3. The compiler compiles the Java file into a Java .class file, then
   that .class file is input into the JVM, which Loads and executes the
   class file.

4. Therefore, the JVM runs on all kinds of hardware to execute
   the **Java Bytecode** without changing the Java execution code.

5. The implementations of JVM vary depending on the operating system it
   is meant for

6. Sun Microsystems developed Java. However, any vendor can develop and
   provide a JVM by following the Java Virtual Machine Specification.
   For this reason, there are various JVMs, including <span class="mark">Oracle Hotspot JVM</span> and <span class="mark">IBM JVM</span>.

<img src="media/image1.tmp" style="width:3.50018in;height:3.01404in"
alt="Screen Clipping" />

## Function of JVM

> Java Virtual Machine (JVM), analyzes the bytecode, interprets the
> code, and executes it.

- Loading, verifying, and executing the byte code (application, which is
  > a .class file)

- Providing a runtime environment for execution of byte code

- Memory management and garbage collection

## Features of JVM

> The features of JVM are as follows:

### Stack-based virtual machine

> The most popular computer architectures such as Intel x86 Architecture
> and ARM Architecture run based on a register. However, JVM runs based
> on a stack.

### Symbolic reference

> All types (class and interface) except for primitive data types are
> referred to through symbolic reference, instead of through explicit
> memory address-based reference. 

### Garbage collection

> A class instance is explicitly created by the user code and
> automatically destroyed by garbage collection.

### Guarantees platform independence by clearly defining the primitive data type

> A traditional language such as C/C++ has different int type size
> according to the platform. The JVM clearly defines the primitive data
> type to maintain its compatibility and guarantee platform
> independence.

### Network byte order

> The Java class file uses the network byte order. To maintain platform
> independence between the little endian used by Intel x86 Architecture
> and the big endian used by the RISC Series Architecture, a fixed byte
> order must be kept. Therefore, JVM uses the network byte order, which
> is used for network transfer. The network byte order is the big
> endian.

# java command

Creates a JVM instance which load and executes class file using Class
loader and Execution Engine respectively

<img src="media/image2.png" style="width:4.65833in;height:3.76597in"
alt="Screen Clipping" />

# Components of JVM

The JVM is divided into three main subsystems

- Class Loader

- Runtime Data (Memory) Areas

- Execution Engine

<img src="media/image3.png" style="width:5.42431in;height:3.62639in"
alt="Screen Clipping" />

## Class loader

> This is responsible for loading the class files or byte code files. It
> verifies class files using a bytecode verifier. A class file will only
> be loaded if it is valid. The class loader is responsible for loading <span class="mark">classes</span> and <span class="mark">interfaces</span> residing in the byte code. It
> consists of three distinct phases whose function are

- Load - Loading byte code

- Link - Linking (verification, memory allocation for byte code, and
  > resolution or transformation of symbolic references to direct
  > references)

- Initialize - Initialization of variables to their default values

## Execution Engine

- It executes the byte code

- Talks to the host operation system in order to execute the
  instructions finally against the machine instruction set

- Makes use of native method calls which translate bytecode into machine
  codes value and carry out the operations

## Data / Memory Areas

- Used to load class bytecode to a memory area

# Classloader

## Quick

<img src="media/image4.png" style="width:5in;height:2.88611in"
alt="Screen Clipping" />

## Detailed

Java's [**dynamic class
loading**](http://www.javainterviewpoint.com/use-of-class-forname-in-java/) functionality
is handled by the class loader subsystem. It loads, links. and
initializes the class file when it refers to a class for the first time <span class="mark">at **runtime**, not **compile time**</span>\*\*. \*\*

### Features of Java class loader

#### Hierarchical Structure

Class loaders in Java are organized into a hierarchy with <span class="mark">a parent-child relationship</span>. The Bootstrap
Class Loader is the parent of all class loaders.

#### Delegation mode

Based on the hierarchical structure, load is delegated between class
loaders. When a class is loaded, <span class="mark">the parent class
loader is checked</span> to determine whether or not the class is in the
parent class loader. If the upper-class loader has the class, the class
is used. If not, the class loader requested for loading loads the class.

#### Visibility limit

A child class loader can find the class in the parent class loader;
however<span class="mark">, a parent class loader cannot find the class
in the child class loader.</span> **(reverse of inheritance)**

#### Unload is not allowed

A class loader can load a class <span class="mark">but cannot unload
it</span>. Instead of unloading, the current class loader can be
deleted, and a new class loader can be created.

<span class="mark">Each class loader has its namespace that stores the
loaded classes</span>. When a class loader loads a class, it searches
the class based on <span class="mark">FQCN</span> (Fully Qualified Class
Name) stored in the namespace to check whether or not the class has been
already loaded. Even if the class has <span class="mark">an identical
FQCN but a different namespace</span>, it is regarded as a different
class. A different namespace means that the class has been loaded by
another class loader

## Components/ Phases of Classloader

### Loading

- A class is obtained from a file and loaded to the JVM memory

- The Class Loaders will follow <span class="mark">Delegation Hierarchy
  Algorithm</span>\*\* \*\*while loading the class files.

  1. When a class loader is requested for class load, it checks whether
     or not the class exists in the class loader cache, the parent
     class loader, and itself, in the order listed.

- Boot Strap class Loader, Extension class Loader, and Application class
  Loader are the three-class loader which will help in achieving it

#### Bootstrap class loader

- This is created when running the JVM

- Responsible for loading classes from the bootstrap classpath, nothing
  but <span class="mark">rt.jar</span>

- It loads Java APIs, including object classes

- Highest priority will be given to this loader

- Unlike other class loaders, it is implemented in <span class="mark">native code</span> instead of Java.

#### Extension class loader

- Responsible for loading classes which are
  inside ext folder <span class="mark">(jre\lib)</span>

- It loads the extension classes excluding the basic Java APIs.

- It also loads various <span class="mark">security extension</span>
  functions.

#### Application / System class loader

- If the bootstrap class loader and the extension class loader load the
  JVM components, the system class loader loads the application classes
  using Application Level Classpath

- It loads the class in the Environment Variable <span class="mark">\$CLASSPATH</span> specified by the user.

#### User-defined class loader

- This is a class loader that an application user directly creates on
  the code.

### Linking

#### Verifying

- Check whether or not the read class is configured as described in the
  Java Language Specification and JVM specifications.

- This is the most complicated test process of the class load processes
  and takes the longest time.

- Bytecode verifier will verify whether the generated bytecode is proper
  or not if verification fails we will get the **verification error.**

#### Preparing:

- Prepare a data structure that assigns the memory required by classes
  and indicates the fields, methods, and interfaces defined in the
  class.

- All <span class="mark">static variables</span> memory will be
  allocated and assigned with <span class="mark">default values.</span>

#### Resolving:

- Change all <span class="mark">symbolic</span> memory references in the
  constant pool of the class to direct / <span class="mark">original</span> references from Method Area\*\*.\*\*

### Initialization

- Initialize the class variables to proper values.

- Execute the static initializers and initialize the static fields to
  the configured values.

  - All [<span class="mark">static
    variables</span>](http://www.javainterviewpoint.com/use-of-static-keyword-in-java/)\*\* \*\*will
    be assigned with the original values and

  - the [<span class="mark">static
    block</span>](http://www.javainterviewpoint.com/java-static-import/) will
    be executed.

# Runtime Data Area

Runtime Data Areas are the memory areas assigned when the JVM program
runs on the OS. The runtime data areas can be divided into 5 major
areas.

1. Method / Class Area, Metaspace( Java8)

2. Heap Area

3. PC Registers

4. Java Stacks

5. Native Method Stacks

Of the five, one PC Register, JVM Stack and Native Method Stack are
created for one thread.

<span class="mark">Heap, Method Area, and Runtime Constant Pool are
shared by all threads.</span>

Link - [Oracle JVM
Structure](https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-2.html#jvms-2.5)

<img src="media/image5.tmp" style="width:6.19476in;height:2.99321in"
alt="Screen Clipping" />

## Method / Class Area

1. Created on JVM Startup

2. All the class level data (metadata corresponding to class) are
   stored here, including 

   1. static variables

   2. bytecode

   3. class level Runtime Constant Pool

   4. <span class="mark">field</span>

   5. <span class="mark">method data</span>

   6. <span class="mark">the code for methods and constructors</span>

      1. <span class="mark">including the special methods used in
         class, instance, and interface initialization.</span>

3. There is only one method area per JVM hence it is a shared resource

4. Java reflection API for the class class enquires data in the method
   area

5. It is the memory allocated to the JVM i.e the system's (physical
   machine) physical memory, if you are talking about JVM for computer

6. Although it is logically a part of the heap but it can or cannot be
   garbage collected

   1. whereas garbage collection in heap is mandatory.

7. Also known as PermGen (Permanent Generation) Space

   1. By default, 64 MB is allocated

   2. It can be tuned if more memory is needed using

      1. -XX:MaxPermSize, Can be set to certain MB or GB, as needed

      2. java.lang.OutOfMemoryError: PermGen space
         <https://stackoverflow.com/questions/88235/dealing-with-java-lang-outofmemoryerror-permgen-space-error>

      3. java.lang.OutOfMemoryError: Metaspace
         <https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/memleaks002.html>

## Metaspace

Java 8 has gotten rid of the Method area / PermGen and now uses
Metaspace for similar functionality.

1. Moved the Method area into a separate memory in the native operating
   system, known as Metaspace

2. Metaspace is a part of native memory

3. By default, there is no limit to the size of metaspace in Java 8

   1. It can just grow as long as needed and can occupy full memory

   2. However, <span class="mark">if it grows more than the available
      physical memory, then the operating system will use virtual
      memory</span>. This will have an <span class="mark">adverse</span> effect on application
      performance, as swapping the data from virtual memory to
      physical memory and vice versa is a costly operation.

      1. Will throw out of memory operation

4. It can be tuned to limit its size

   1. -XX:MaxMetaspaceSize=512m

<span class="mark">Difference between PermGen and Metaspace</span>

## Method Area in some detail

### Quick

\[[Ref](https://blog.codecentric.de/en/2010/01/the-java-memory-architecture-1-act/)]

The method area is responsible for storing class information. The
Class-Loader will load the bytecode of a class and will pass it to the
JVM. The JVM will generate an internal class representation of the
bytecode and store it in the method area. The internal representation of
a class will have the following data areas:

- Runtime Constant Pool 

  - Numeric constants of the class of types int, long, float or double,
    String-constants and symbolic references to all methods, attributes
    and types of this class.

- Method Code

  - The implementation (code) of all methods of this class including
    constructors etc.

- Attributes 

  - A list of all named attributes of this class.

- FieldsValues

  - of all fields of this class as references to the Runtime Constant
    Pool.

### Detailed

\[[Ref](https://www.artima.com/insidejvm/ed2/jvm5.html)]

1. Inside a Java virtual machine instance, information about loaded
   types is stored in a logical area of memory called the method area.
   When the Java virtual machine loads a type, it uses a class loader
   to locate the appropriate class file. The class loader reads in the
   class file--a linear stream of binary data--and passes it to the
   virtual machine. The virtual machine extracts information about the
   type from the binary data and stores the information in the method
   area. Memory for class (static) variables declared in the class is
   also taken from the method area. The virtual machine will search
   through and use the type information stored in the method area as it
   executes the application it is hosting. All threads share the same
   method area, so access to the method area's data structures must be
   designed to be thread-safe.

2. The size of the method area need not be fixed. Also, the memory of
   the method area need not be contiguous.

3. The method area can also be garbage collected. Because Java programs
   can be dynamically extended via user-defined class loaders, classes
   can become "unreferenced" by the application. If a class becomes
   unreferenced, a Java virtual machine can unload the class (garbage
   collects it) to keep the memory occupied by the method area at a
   minimum.

4. In addition to the basic type information listed previously, the
   virtual machine must also store for each loaded type:

   1. The constant pool for the type

   2. Field information

   3. Method information

   4. All class (static) variables declared in the type, except
      constants

   5. A reference to class ClassLoader

   6. A reference to class Class

#### The Constant Pool

\[[Ref](https://www.developer.com/java/data/understanding-the-jvm-architecture.html)]
The constant pool is a pool of constants. In other words, it contains a
list of all the constants contained in a class. Note that each class has
its own constant pool in memory. The constants are literals that don't
change over time.

\[[Ref 2](https://dzone.com/articles/understanding-jvm-internals)] An
area that corresponds to the constant\_pool table in the class file
format. This area is included in the method area; however, it plays the
most core role in JVM operation. Therefore, the JVM specification
separately describes its importance. As well as the constant of each
class and interface, it contains all references for methods and fields.
In short, when a method or field is referred to, the JVM searches the
actual address of the method or field on the memory by using the runtime
constant pool.

For each type it loads, a Java virtual machine must store a _constant
pool_. <span class="mark">A constant pool is an ordered set of constants
used by the type, including literals (string, integer, and
floating-point constants) and symbolic references to types, fields, and
methods</span>. Entries in the constant pool are referenced by index,
much like the elements of an array. <span class="mark">Because it holds
symbolic references to all types, fields, and methods used by a type,
the constant pool plays a central role in the dynamic linking of Java
programs</span>. The constant pool is described in more detail later in
this chapter and in Chapter 6, "The Java Class File."

#### Field Information

For each field declared in the type, the following information must be
stored in the method area. In addition to the information for each
field, the order in which the fields are declared by the class or
interface must also be recorded. Here's the list for fields:

- The field's name

- The field's type

- The field's modifiers (some subset
  of public, private, protected, static, final, volatile, transient)

#### Method Information

For each method declared in the type, the following information must be
stored in the method area. As with fields, the order in which the
methods are declared by the class or interface must be recorded as well
as the data. Here's the list:

- The method's name

- The method's return type (or void)

- The number and types (in order) of the method's parameters

- The method's modifiers (some subset
  of public, private, protected, static, final, synchronized, native, abstract)

In addition to the items listed previously, the following information
must also be stored with each method that is not abstract or native:

- The method's bytecodes

- The sizes of the operand stack and local variables sections of the
  method's stack frame (these are described in a later section of this
  chapter)

- An exception table (this is described in Chapter 17, "Exceptions")

#### Class Variables

Class variables are shared among all instances of a class and can be
accessed even in the absence of any instance. These variables are
associated with the class--not with instances of the class--so they are
logically part of the class data in the method area. Before a Java
virtual machine uses a class, it must allocate memory from the method
area for each non-final class variable declared in the class.

Constants (class variables declared final) are not treated in the same
way as non-final class variables. Every type that uses a final class
variable gets a copy of the constant value in its own constant pool. As
part of the constant pool, final class variables are stored in the
method area--just like non-final class variables. But whereas non-final
class variables are stored as part of the data for the type
that _declares_ them, final class variables are stored as part of the
data for any type that _uses_ them. This special treatment of constants
is explained in more detail in Chapter 6, "The Java Class File."

#### A Reference to Class ClassLoader

For each type it loads, a Java virtual machine must keep track of
whether or not the type was loaded via the bootstrap class loader or a
user-defined class loader. For those types loaded via a user-defined
class loader, the virtual machine must store a reference to the
user-defined class loader that loaded the type. This information is
stored as part of the type's data in the method area.

The virtual machine uses this information during dynamic linking. When
one type refers to another type, the virtual machine requests the
referenced type from the same class loader that loaded the referencing
type. This process of dynamic linking is also central to the way the
virtual machine forms separate name spaces. To be able to properly
perform dynamic linking and maintain multiple name spaces, the virtual
machine needs to know what class loader loaded each type in its method
area. The details of dynamic linking and name spaces are given in
Chapter 8, "The Linking Model."

#### A Reference to Class Class

An instance of class java.lang.Class is created by the Java virtual
machine for every type it loads. The virtual machine must in some way
associate a reference to the Class instance for a type with the type's
data in the method area.

Your Java programs can obtain and use references to Class objects. One
static method in class Class, allows you to get a reference to
the Classinstance for any loaded class:

## Heap Area

1. The heap is the place where all objects data (their corresponding
   instance variables) are stored

   1. Every time an object is instantiated (using new operator), that
      object is created in the heap

   2. Arrays will be stored here only

2. The heap area also contains the Garbage Collected Heap

   1. The garbage collected heap is an area of the memory within the
      context of the JVM where objects are stored

   2. It de-allocates the memory occupied by these objects as and when
      they are no longer needed or referenced in the code.

   3. The GC works on the basis of two principles - reference counting
      and mark and sweep

   4. <span class="mark">The local object references reside in the
      stack whereas the actual objects are stored in the heap</span>.
      The GC works in the background and releases memory when objects
      are no longer in use.

3. Only one Heap Area per JVM is available.

   1. <span class="mark">Since the Method and Heap areas share memory
      for multiple threads, the data stored is not thread safe.</span>

4. Most of the time needs to be tuned based on the application
   requirements( use m and g to specify MB or GB)

   1. <span class="mark">-Xms, Minimum (Initial Size), Default - one
      fourth of the physical memory</span>

   2. <span class="mark">-Xmx, Maximum Size, Default – min {1/4th of
      the physical memory, 1GB}</span>

5. _Heap sizes\
   Initial heap size of 1/64 of physical memory up to 1Gbyte\
   Maximum heap size of 1/4 of physical memory up to 1Gbyte_

<https://www.mkyong.com/java/find-out-your-java-heap-memory-size/>

<http://javarevisited.blogspot.com/2013/04/what-is-maximum-heap-size-for-32-bit-64-JVM-Java-memory.html>

<http://javarevisited.blogspot.sg/2012/01/tomcat-javalangoutofmemoryerror-permgen.html>

https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gc-ergonomics.html

https://stackoverflow.com/questions/28272923/default-xmxsize-in-java-8/28273076

## OutOfMemoryError in Java Heap

1. When JVM starts JVM heap space is equal to the initial size of Heap
   specified by -Xms parameter

2. As application progress more objects get created and heap space is
   expanded to accommodate new objects. JVM also run garbage collector
   periodically to reclaim memory back from dead objects

3. The JVM expands Heap in Java somewhere near to Maximum Heap Size
   specified by -Xmx

4. If there is no more memory left for creating new object in java heap
   , JVM throws <span class="mark">java.lang.OutOfMemoryError</span>
   and your application dies.

5. Before throwing [OutOfMemoryError No Space in Java
   Heap](http://javarevisited.blogspot.sg/2011/09/javalangoutofmemoryerror-permgen-space.html)

   1. JVM tries to run garbage collector to free any available space
      but even after that not much space available on Heap in Java it
      results into OutOfMemoryError.

   2. To resolve this error you need to understand your application
      object profile i.e. what kind of object you are creating, which
      objects are taking how much memory etc. you can use <span class="mark">profiler</span> or <span class="mark">heap
      analyzer</span> to troubleshoot OutOfMemoryError in Java.

6. The "<span class="mark">java.lang.OutOfMemoryError: Java heap
   space</span>" error messages denotes that Java heap does not have
   sufficient space and cannot be expanded further
   while "<span class="mark">java.lang.OutOfMemoryError: PermGen
   space</span>" error message comes when the permanent generation of
   Java Heap is full, the application will [fail to load a
   class](http://javarevisited.blogspot.sg/2011/08/classnotfoundexception-in-java-example.html) or
   to allocate an interned string.

   Read
   more: <http://javarevisited.blogspot.com/2011/05/java-heap-space-memory-size-jvm.html#ixzz59vxvIGAI>

> \[[Oracle
> Docs](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/memleaks002.html)]

## PC (Program Counter) Registers

Each thread has its own PC Registers, to hold the address of current
executing instruction. Once the instruction is executed the PC register
will be updated with the next instructions

1. The program counter registers contain the address of the
   instructions currently being executed and the address of next
   instruction as well

2. If the method currently being executed by the thread is native, the
   value of the Java Virtual Machine's pc register is undefined. The
   Java Virtual Machine's pc register is wide enough to hold
   a returnAddress or a native pointer on the specific platform.
   \[[Ref](https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-2.html#jvms-2.5.1)]

### Register Area

This contains the registers used by the JVM. The JVM contains four
registers: pc, optop, frame, and vars. Here is what these registers are
used for
\[[Ref](https://www.developer.com/java/data/understanding-the-jvm-architecture.html)]

1. pc: This is the program counter or the register that points to the
   address of the currently executing instruction.

2. optop: This is the register that contains the address of the top of
   the operand stack.

3. frame: This register points to the execution environment of the
   currently executing method.

4. vars: This register points to the first local variable in the
   currently executing method.

## JVM (Java Thread) Stacks

Stack memory is responsible for holding references to heap objects and
for storing value types (also known in Java as primitive types), which
hold the value itself rather than a reference to an object from the
heap. In addition, variables on the stack have a certain visibility,
also called scope. Only objects from the active scope are used.

For example, assuming that we do not have any global scope variables
(fields), and only local variables, if the compiler executes a method’s
body, it can access only objects from the stack that are within the
method’s body. It cannot access other local variables, as those are out
of scope. Once the method completes and returns, the top of the stack
pops out, and the active scope changes.

_In The Java Virtual Machine Specification, First Edition, the Java
Virtual Machine stack was known as the Java stack._

\*Java Virtual Machine Stack \*Each thread gets its own stack on which so
called _Frames_ are pushed for each method the thread currently
executed. This means that there can be many frames on the stack for
nested method calls – but there is only one frame active at the same
time for one thread. The frame contains the local variables of the
method, a reference to the Runtime Constant Pool of the method’s class
and an operand stack for the execution of JVM operations. (The JVM is a
stack machine!)
\[[Ref](https://blog.codecentric.de/en/2010/01/the-java-memory-architecture-1-act)]

<img src="media/image6.tmp" style="width:2.68595in;height:3.34681in"
alt="Screen Clipping" /><img src="media/image7.tmp" style="width:4.56152in;height:3.25885in"
alt="Screen Clipping" />

<img src="media/image8.png" style="width:3.93738in;height:2.08845in"
alt="Screen Clipping" />

1. Creation

   1. Each JVM thread has a private JVM Stack, created at the same
      time as the thread.

   2. Its memory need not be contiguous

2. Memory

   1. Similar to heap, the memory for a Java Virtual Machine stack
      does not need to be contiguous.

   2. The specification permits Java Virtual Machine stacks either to
      be of a fixed size or to dynamically expand and contract as
      required by the computation.

   3. If the Java Virtual Machine stacks are of a fixed size, the size
      of each Java Virtual Machine stack may be chosen independently
      when that stack is created.

   4. User can control

      1. The initial size of the stack for a fixed size

      2. Min and max limit for dynamically expanding or contracting
         Java Virtual Machine stacks

   5. Exception

      1. If the computation in a thread requires a larger Java
         Virtual Machine stack than is permitted, the Java Virtual
         Machine throws
         a <span class="mark">StackOverflowError</span>

      2. If Java Virtual Machine stacks can be dynamically expanded,
         and expansion is attempted but insufficient memory can be
         made available to effect the expansion, or if insufficient
         memory can be made available to create the initial Java
         Virtual Machine stack for a new thread, the Java Virtual
         Machine throws
         an <span class="mark">OutOfMemoryError</span>.

3. Operation

   1. Never manipulated directly except to push and pop frames

   2. Hence, frames may be heap allocated.

4. Storage

   1. A Java Virtual Machine stack stores Stack frames

### Frames

A stack frame is a data structure that contains multiple data that
represent the state of the thread in the **current method** (the method
being called). It is created whenever a method is executed in the JVM,
and then added to the JVM stack of the thread. When the method is ended,
the stack frame is removed. It is used to store data and partial
results, as well as to perform dynamic linking, return values for
methods, and dispatch exceptions.

Each stack frame has the reference for local variable array, Operand
stack, and runtime constant pool of a class where the method being
executed belongs. The size of local variable array and Operand stack is
determined while compiling. Therefore, the size of stack frame is fixed
according to the method.

<span class="mark">The size of Stack can be initialized using
-Xssn</span> , where n is size prefixed by m or g

It consists of three parts

1. Operand Stack

2. Local Variable Array

3. Frame Data / Run-time constant pool reference

#### Operand Stack

1. This stack is used by the bytecode instructions for handling
   parameters. This stack is also used to pass parameters in a (java)
   method call and to get the result of the called method at the top of
   the stack of the calling method.

2. JVM uses operand stack as work space like rough work or we can say
   for storing intermediate calculation’s result.

3. Operand stack is organized as array of words like local variable
   array.

   1. But this is not accessed by using index like local variable
      array.

   2. Rather it is accessed by some instructions that can push the
      value to the operand stack and some instructions that can pop
      values from operand stack and some instructions that can perform
      required operations.

4. An actual workspace of a method. Each method exchanges data between
   the Operand stack and the local variable array and pushes or pops
   other method invoke results. The necessary size of the Operand stack
   space can be determined during compiling. Therefore, the size of the
   Operand stack can also be determined during compiling.

#### Local variable array

1. This array contains all the local variables in a scope of the
   current method.

   1. It can hold values of

      1. primitive types

      2. reference and

      3. returnAddress

2. The size of this array is computed at compilation time.

3. The Java Virtual Machine uses local variables to pass parameters on
   method invocation, the array of the called method is created from
   the operand stack of the calling method.

4. The local variables part of stack frame is organized as a zero-based
   array of words.

5. It contains all parameters and local variables of the method.

6. Each slot or entry in the array is of 4 Bytes.

7. Values of type int, float, and reference occupy 1 entry or slot in
   the array i.e. 4 bytes.

8. Values of double and long occupy 2 consecutive entries in the array
   i.e. 8 bytes total.

9. **Byte, short and char values will be converted to int type before
   storing** and occupy 1 slot i.e. 4 Bytes.

10. But the way of storing Boolean values is varied from jvm to jvm. But
    most of the jvm gives 1 slot for Boolean values in the local
    variable array.

11. The parameters are placed into the local variable array first, in
    the order in which they are\
    declared.

12. It has an index starting from 0. 0 is the reference of a class
    instance where the method belongs. From 1, the parameters sent to
    the method are saved. After the method parameters, the local
    variables of the method are saved.

The Java Virtual Machine uses local variables to pass parameters on
method invocation. On class method invocation, any parameters are passed
in consecutive local variables starting from local variable _0_. On
instance method invocation, local variable _0_ is always used to pass a
reference to the object on which the instance method is being invoked
(this in the Java programming language). Any parameters are subsequently
passed in consecutive local variables starting from local variable _1_.

<img src="media/image9.tmp" style="width:4.72941in;height:4.78497in"
alt="Screen Clipping" />

#### Run-time constant pool reference

1. Reference to the constant pool of the **current class** of
   the **current method** being executed.

2. It contains all symbolic reference (_constant pool resolution)_ and
   normal method return related to that particular method.

3. It is used by the JVM to translate symbolic method/variable
   reference (ex: myInstance.method()) to the real memory reference.

4. It also contains a reference to Exception table which provide the
   corresponding catch block information in the case of exceptions.

<img src="media/image10.tmp" style="width:6.09059in;height:4.72247in"
alt="Screen Clipping" />

## Native Method stacks

1. A stack for native code written in a language other than Java. In
   other words, it is a stack used to execute C/C++ codes invoked
   through JNI (Java Native Interface). According to the language, a C
   stack or C++ stack is created.

2. JVM that supports native methods will have native method stacks. It
   is used for native methods and created per thread.

3. If the native methods cannot be loaded by a JVM then it need not
   have native method stacks.

4. Memory size is managed similar to general JVM stacks like fixed or
   dynamic. JVM will throw StackOverflowError or OutOfMemoryError
   accordingly.

5. Also known as C Stacks

6. Eg. – Loading a DLL in the Java Application

# Execution Engine

1. The bytecode which is assigned to the **Runtime Data Areas** in the
   JVM via class loader is executed by the Execution Engine. The
   Execution Engine reads the bytecode and executes it piece by piece
   in the unit of instruction

2. Each command of the bytecode consists of

   1. A 1-byte OpCode and

   2. Additional Operand.

3. The execution engine gets one OpCode and execute task with the
   Operand, and then executes the next OpCode.

4. Contains

   1. Interpreter

   2. Just in Time Complier

   3. Garbage Collector

But the Java Bytecode is written in a language that a human can
understand, rather than in the language that the machine directly
executes. Therefore, the execution engine must change the bytecode to
the language that can be executed by the machine in the JVM. The
bytecode can be changed to the suitable language in one of two ways.

## Interpreter

1. Reads, interprets and executes the bytecode instructions one by one.

2. It can quickly interpret one bytecode, but slowly executes the
   interpreted result.

3. Depending on the bytecode instruction, it finds out what native
   operation has to be done and executes that native operation by using
   native method interface which interfaces the native method libraries
   that are present in the JVM

   1. The native methods are present in JRE bin folder

   2. These are the platform-specific native libraries that are used
      by the execution engine

   3. On Windows - .dll files

   4. On Unix - .so or

## JIT (Just-In-Time) compiler

1. The JIT Compiler neutralizes the disadvantage of the interpreter. 

2. The Execution Engine will be using the help of the interpreter in
   converting bytecode, but when it finds repeated code it uses the JIT
   compiler, which compiles the entire bytecode and changes it to
   native code.

   1. After that, the execution engine no longer interprets the
      method. The native code will be used directly for repeated
      method calls, which improve the performance of the system.

   2. Execution in native code is much faster than interpreting
      instructions one by one.

   3. The compiled code can be executed quickly since the native code
      is stored in the cache. 

3. It uses

### Intermediate Code generator

> Produces intermediate code

### Code Optimizer 

> Responsible for optimizing the intermediate code generated above

### Target Code Generator

> Responsible for Generating Machine Code or Native Code

### (Hotspot) Profiler 

> A special component, responsible for finding <span class="mark">hotspots</span>, i.e. whether the method is called
> multiple times or not.

## Garbage Collector

1. Garbage collection is the process by which the JVM collects and
   removes unreferneced objects (unused objects) from the heap to
   reclaim heap space.

2. Garbage Collection can be triggered by
   calling <span class="mark">System.gc()</span>, but the execution is
   not guaranteed.

# Java Native Interface (JNI)

JNI is an interface that connects the JVM with the native method
libraries for executing native methods. It can be used to write the Java
native methods when an application cannot be written purely in Java.

# Native Method Libraries

It is a collection of the native (host OS) method libraries which is
required for the Execution Engine

# Performance

The most important JVM Components related to performance tuning are:

- Heap

- JIT (Just In Time) Compiler and

- Garbage collector

All objects are stored in the heap, and the garbage collector manages
the heap at JVM initialization.

There are many VM (JVM) options for:

- Increasing and decreasing the heap size for managing object for best
  performance.

- Selecting different garbage collectors, depending on your requirement.

Meanwhile, as for the JIT Compiler:

- The JIT Compiler compiles bytecode to machine code at runtime and
  improves the performance of Java applications.

- JIT Compiler tuning is rarely needed for newer versions of the JVM.

<img src="media/image11.png" style="width:3.71097in;height:2.78323in"
alt="C:\Users\SAMEER~1\AppData\Local\Temp\msohtmlclip1\02\clip_image001.png" />

# Summary

First is the class loader subsystem second is the runtime data areas
third is the execution engine. Class loader subsystem has load, link and
initialize phases.

Load is for the class loaders – Bootstrap(rt.jar), Extension (lib/ext)
and Application (-cp).

Link has three different steps Verify, Prepare and Resolve

Initialize runs the static initializers

Runtime data have five different data areas which are basically the
memory space allocated for JVM

Metadata for class data

Heap for object data

JVM Stack per thread to keep track of currently executing method and its
data

PC registers per thread, the program counters that knows what execution
and what operation to execute next

Native methods stacks corresponding to native methods used by the
application

Execution engine has the interpreter, just-in-time compiler JIT
compiler, hotspot profiler / hotspot VM

and garbage collector

It interfaces with the native method libraries through Java Native
interface

# Java Commands

# Questions

## Constant Pool

1. An area that corresponds to the constant\_pool table in the class
   file format.

2. This area is included in the method area.

3. It plays the most core role in JVM operation. Therefore, the JVM
   specification separately describes its importance.

4. <span class="mark">As well as the constant of each class and
   interface, it contains all references for methods and fields.</span>

5. <span class="mark">In short, when a method or field is referred to,
   the JVM searches the actual address of the method or field on the
   memory by using the runtime constant pool.</span>

## Important Commands

- Metaspace

  - -XX:MaxMetaspaceSize=512m

  -

  - -XX:MaxPermSize=256m

- PermGen

  - -XX:PermSize=256m

- Heap Size

  - Following is for **Eclipse Helios/Juno/Kepler**:

  - Right mouse click on

  - Run As - Run Configuration - Arguments - Vm Arguments,

  - then add this

  - -Xmx2048m

- JVM Stack

By default for development JVM uses small size and small config for
other performance related features. But for production you can tuning
e.g. (In addition it Application Server specific config can exist) ->
(If there still isn't enough memory to satisfy the request and the heap
has already reached the maximum size, an OutOfMemoryError will occur)

-Xms\<size> set initial Java heap size

-Xmx\<size> set maximum Java heap size

-Xss\<size> set java thread stack size

-XX:ParallelGCThreads=8

-XX:+CMSClassUnloadingEnabled

-XX:InitiatingHeapOccupancyPercent=70

-XX:+UnlockDiagnosticVMOptions

-XX:+UseConcMarkSweepGC

-Xms512m

-Xmx8192m

-XX:MaxPermSize=256m (in java 8 optional)

<img src="media/image12.tmp" style="width:4.15994in;height:0.57642in"
alt="Screen Clipping" />

\*\*<https://docs.oracle.com/javase/8/docs/technotes/tools/windows/java.html#BABCBGHF>\
\*\*

- Configure your JVM based on your application requirements. Explicitly
  specify the heap size for the JVM when running the application. The
  memory allocation process is also expensive, so allocate a reasonable
  initial and maximum amount of memory for the heap. If you know it will
  not make sense to start with a small initial heap size from the
  beginning, the JVM will extend this memory space. Specifying the
  memory options with the following options:

  - Initial heap size -Xms512m – set the initial heap size to 512
    megabytes.

  - Maximum heap size -Xmx1024m – set the maximum heap size to 1024
    megabytes.

  - Thread stack size -Xss128m – set the thread stack size to 128
    megabytes.

  - Young generation size -Xmn256m – set the young generation size to
    256 megabytes.

- If a Java application crashes with an OutOfMemoryError and you need
  some extra info to detect the leak, run the process with
  the –XX:HeapDumpOnOutOfMemory parameter, which will create a heap dump
  file when this error happens next time.

- Use the -verbose:gc option to get the garbage collection output. Each
  time a garbage collection takes place, an output will be generated.

# Check

<https://www.tutorialspoint.com/java/java_jvm.htm>

**<https://dzone.com/articles/java-memory-architecture-model-garbage-collection>**

**<https://javatutorial.net/java-increase-memory>**

[JVM ( java virtual machine) architecture –
tutorial](https://www.youtube.com/watch?v=ZBJ0u9MaKtM\&t=1523s)

<https://youtu.be/dncpVFP1JeQ?t=19m14s>

[Garbage collection in Java, with Animation and discussion of G1
GC](https://www.youtube.com/watch?v=UnaNQgzw4zY\&t=2046s)s
