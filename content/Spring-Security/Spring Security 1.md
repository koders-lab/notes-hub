# Properties

```
spring.security.user.name
spring.security.user.password
```

# Servlet

- Is a small Java program which runs inside web server
- Servlet container create instance of `Servlet` and initialize it based upon configuration parameter provided in deployment descriptor and invokes it's `service()` method every time a request comes in. 

## References

https://immodal.github.io/building-cloud-services-blog/servlets-and-spring/
https://stackoverflow.com/questions/7213541/what-is-java-servlet
https://jakarta.ee/specifications/servlet/5.0/jakarta-servlet-spec-5.0
https://www.baeldung.com/intro-to-servlets
https://www.baeldung.com/register-servlet
https://www.codejava.net/java-ee/servlet/java-servlet-quick-start-tomcat-xml-config

# Dispatcher Servlet

- Provided by Spring framework
- Custom extension of HttpServlet

https://stackoverflow.com/a/70030561/6465925

# Filter

- Filter is an object which can intercept both request and response on their way and modify them.
- They can modify headers e.g. they can add additional headers or remove existing headers or they can modify response body e.g. an encryption filter can encrypt the response before sending or a compression filter can compress the response before sending to a client. 
- One of the best example of filters are Spring Security framework whose security implementation is totally based upon Filters. They have a chain of filters to perform various security related task e.g. authentication and authorization before handing over request to Servlet or response to Client. 

https://javarevisited.blogspot.com/2024/03/difference-between-servlet-and-filter.html

==The first and foremost difference between a Servlet and a Filter is their purpose, Filter is for pre-processing and post-processing request, while Servlet is for processing the request.==

![[assets/spring-security/Pasted image 20260802155148.png]]

- Authentication Filter
- UsernamePasswordAuthenticationFilter

# Basic Terms

> [!NOTE]+ Authentication
> Who is this user

> [!NOTE]+ Authorization
> Are they allowed to do this

> [!NOTE]+ Principal
> Person who has been identified through the process of authentication. i.e the Currently logged in user
>
> ![[assets/spring-security/Pasted image 20260802163030.png]]

> [!NOTE]+ Granted Authority
> Bunch of permissions allowed for a given user. Way of providing Authorization.

> [!NOTE]+ Role
> Group of authority.

# Flow Overview

- Incoming Request → Hits Servlet Filter Chain (including Spring Security filters).
- Spring Security Filters → Handle authentication and authorization.
- DispatcherServlet → Routes request to appropriate controllers.
- Controller → Processes business logic and returns a response.
- Response → Passes back through the Spring Security filters before reaching the client.

# Spring Security Filters

- Spring Security filters are part of the servlet filter chain and execute before the DispatcherServlet processes the request.
- If authentication or authorization fails, Spring Security blocks the request before it reaches the controller.
- Only authenticated and authorized requests reach the DispatcherServlet and the rest of the application.
- Post-processing security filters can modify or sanitize responses before sending them back to the client.

# Password Encoder

### BCrypt

- This is widely recommended choice for securely hashing passwords in Spring Security.
- It handles the generation of random salts for each password.

### NoOp

- This encoder ==does not perform any hashing== or encoding of passwords and stores passwords in plain text which makes them highly vulnerable.

### Standard

- This encoder uses ==one-way hashing== algorithm which is less secure and it is not recommended.

### MessageDigest

- This encoder uses a specified message digest algorithm (e.g., SHA-256) to hash passwords.
- While it’s more secure than plain text, it’s not as strong as BCrypt and is considered less secure in modern applications.

### SCrypt

- SCrypt is another secure password hashing algorithm, similar to BCrypt.
- It’s designed to be memory-intensive, making it resistant to certain types of attacks.
- SCryptPasswordEncoder is a good choice for secure password hashing.

# Difference between X-API-KEY and Authorization

https://medium.com/@rasheed99/introduction-on-spring-security-architecture-eb5d7de75a4f
https://medium.com/@greekykhs/springsecurity-part-3-spring-security-flow-7da9cc3624ab
https://backendstory.com/spring-security-authentication-architecture-explained-in-depth/

# Flow 2

## Authentication Manager

- Entry point of Spring Security
- It has just one method ==authenticate==, which returns successful authentication or AuthenticationException
- It is responsible for the authentication. It does not know itself
- What authentication does is configured through AuthenticationManagerBuilder

## WebSecurityConfigurerAdapter

- Has method configure(), which takes AuthenticationManagerBuilder

## AuthenticationManagerBuilder

- Doesn't provide a fixed number of authentication mechanisms itself.

- Instead, it acts as a convenient builder pattern that allows you to configure and register various ==AuthenticationProvider== implementations that Spring Security will then use to authenticate users.

- It is a central point where you tell Spring Security - Here are all the different ways I want to allow users to authenticate in my application

- Below a breakdown of the authentication mechanisms AuthenticationManagerBuilder allows you to set up:

### Common Built-in Authentication Providers/Mechanisms Supported by\*\* `AuthenticationManagerBuilder`**:**

#### In-Memory Authentication

- `auth.inMemoryAuthentication()`: This is the simplest form, used primarily for development or testing. You define usernames, passwords, and roles directly in your application's configuration.
- It uses an `InMemoryUserDetailsManager` and a `DaoAuthenticationProvider` internally.

#### JDBC Authentication (Database-backed)

- `auth.jdbcAuthentication()`: Allows you to authenticate users against a relational database. You provide a DataSource and SQL queries (or let Spring Security use its default schema) to retrieve user details and authorities.
- It uses a `JdbcUserDetailsManager` and a `DaoAuthenticationProvider` internally.

#### LDAP Authentication

- `auth.ldapAuthentication()`: For authenticating users against an LDAP (Lightweight Directory Access Protocol) server. You configure the LDAP server details, search bases, and user DN patterns.
- It uses an `LdapAuthenticationProvider`.

#### Custom `UserDetailsService`

- `auth.userDetailsService(userDetailsService)`: This is one of the most common and powerful ways to integrate custom authentication. You provide your own implementation of the `UserDetailsService` interface, which is responsible for loading user-specific data (username, password, authorities) from any source (e.g., a custom database schema, a REST API, a NoSQL database).
- When you use this, `AuthenticationManagerBuilder` typically wraps it in a `DaoAuthenticationProvider` by default (along with a `PasswordEncoder` for password validation).

#### Direct `AuthenticationProvider` **Registration:**

- `auth.d(authenticationProvider)`: This gives you the ultimate flexibility. You can create your own custom AuthenticationProvider by implementing the AuthenticationProvider interface.
- This is useful for integrating with highly specific or proprietary authentication systems, or for implementing multi-factor authentication flows. You then register your custom provider directly with the builder.4

#### Parent `AuthenticationManager`

- auth.parentAuthenticationManager(parentAuthenticationManager): Allows you to chain authentication managers.
- If the current `AuthenticationManager` (built by `AuthenticationManagerBuilder`) cannot authenticate a user, it can delegate to a parent `AuthenticationManager`.

### How `AuthenticationManagerBuilder` \*\*Works

`AuthenticationManagerBuilder` doesn't perform the authentication itself. Instead, it helps to construct an `AuthenticationManager` (specifically, a `ProviderManager` by default), which is the core interface responsible for authentication in Spring Security.

The ProviderManager holds a list of AuthenticationProvider instances.6 When an `Authentication` request comes in, the `ProviderManager` iterates through its registered `AuthenticationProvider`s. Each `AuthenticationProvider` is asked if it `supports()` the type of `Authentication` token presented. If it does, its `authenticate()` method is called.

The `AuthenticationManagerBuilder` simplifies this configuration process by providing chained methods for commonly used authentication scenarios.

> [!SUMMARY]
> `AuthenticationManagerBuilder` doesn't _provide_ a fixed number of authentication methods. It provides a flexible API to **configure and register any number of** `**AuthenticationProvider**`**s** (both built-in and custom) that your application needs.
>
> The actual authentication work is then delegated to these registered `AuthenticationProvider`s. This design makes Spring Security highly extensible and adaptable to diverse authentication requirements.

# JWT

https://www.youtube.com/watch?v=X80nJ5T7YpE\&list=PLqq-6Pq4lTTYTEooakHchTGglSvkZAjnE\&index=12

# OAuth

- NOT for authentication
- Is used for authorization, where it authorizes a service
- Allows Access

## Resource / Protected resource

- What is sought by an actor in auth
  - Eg – A photo file

## Resource Owner

- Person who has access or can grant access to protected resource

## Resource Server

- Server holding the resource
  - Eg – google drive
- Has the burden of security as a resource holder, so it’s generally coupled with Authorization server
  - Like by implement Auth

## Client

- That application which needs access to protected resource
- An application making protected resource requests on behalf of the resource owner and with its authorization

## Authorization server

- Responsible for making sure whoever is access the resource server is authorized
- Can be separate from Resource server or can be combined together
- Issues access token to clients
  - Eg - JWT

#### Code Flows

#### Authorization Code Flow

![[assets/spring-security/Pasted image 20260802165025.png]]

![[assets/spring-security/Pasted image 20260802165034.png]]

![[assets/spring-security/Pasted image 20260802165040.png]]![[assets/spring-security/Pasted image 20260802165058.png]]
