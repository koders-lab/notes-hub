# **AuthenticationManager**

The `AuthenticationManager` in Spring Security is

- **A core interface:** `org.springframework.security.core.AuthenticationManager`
- The central authentication entry point:\*\* All authentication requests (e.g., from login forms, API tokens) are submitted to this manager
- **A simple contract:** It defines a single method:

```java
Authentication authenticate(Authentication authentication) throws AuthenticationException;
```

- Responsible for

  - Taking an `Authentication` object (representing the user's credentials)
  - Attempting to authenticate those credentials
  - Returning a **fully authenticated** `Authentication` **object** if successful
  - Throwing an `AuthenticationException` if authentication fails.
    <br>

- **An abstraction:** It doesn't perform the actual authentication logic itself. Instead, it delegates this task to one or more `AuthenticationProvider` implementations.

- Commonly implemented by `ProviderManager`**:** In most Spring Security applications, the `AuthenticationManager` you interact with (often configured via `AuthenticationManagerBuilder`) is actually an instance of `ProviderManager`, which manages a list of `AuthenticationProvider`s.

> [!SUMMARY]
>
> `AuthenticationManager` is the **boss** of authentication, responsible for ensuring an authentication request is handled, but it relies on its **specialists** (`AuthenticationProvider`s) to do the actual work.

# Authentication Interface

The `Authentication` **interface** is  the most fundamental interface in Spring Security's core framework, representing the central concept of an authenticated (or attempting to be authenticated) user.

The `org.springframework.security.core.Authentication` interface ==represents the authentication request or the currently authenticated principal== (user) in a Spring Security application. It's a temporary object that flows through the authentication process, eventually representing the successfully logged-in user.

## **Key Aspects and Methods:**

The Authentication interface extends `java.security.Principal` and `java.io.Serializable`(which is just a marker interface). This means it inherits methods from Principal and can be serialized (important for session management).

Here are its primary methods:

### Object getPrincipal()

- Purpose
  - Returns the principal that is being authenticated or has been authenticated.
- Content
  - This is typically the `UserDetails` object (or a custom object that represents the user) after successful authentication.
  - During an authentication _request_, it might hold the username (e.g., in a `UsernamePasswordAuthenticationToken`).

### Object getCredentials()

- Purpose
  - Returns the credentials used to authenticate the principal.
- Content
  - In an authentication _request_, this would typically be the raw password provided by the user.
  - After successful authentication, it's common practice for `AuthenticationProvider` implementations to ==erase or nullify== these credentials for security reasons (to prevent sensitive information from lingering in memory)

## `Collection<? extends GrantedAuthority\> getAuthorities()`

- Purpose
  - Returns a collection of `GrantedAuthority` objects, which represent the permissions or roles granted to the principal.
- Content
  - These are used for authorization decisions (e.g., "Is this user an ADMIN?"). This collection is typically populated by the `UserDetailsService` (via the `UserDetails` object) during authentication.

### boolean isAuthenticated()

- Purpose
  - Indicates whether the principal has been authenticated.
- Content
  - Returns `true` if the principal is authenticated, `false` otherwise. This is a crucial flag. When an `Authentication` object is first created from a login request, it's `false`. After a successful authentication by an `AuthenticationProvider`, a _new_ `Authentication` object is created with this flag set to `true`.

### String getName()

- Purpose
  - Inherited from `java.security.Principal`. Returns the name of the principal.
- Content
  - In most Spring Security setups, this will return the username of the authenticated user (typically derived from `getPrincipal().getUsername()`)

# Role in the Spring Security Architecture

1. Creation (**Unauthenticated** State)
   - When a user attempts to log in (e.g., via a login form or an API token), a filter (like `UsernamePasswordAuthenticationFilter` or a custom filter) creates an initial Authentication object.
   - This `Authentication` object holds the raw credentials (e.g., `UsernamePasswordAuthenticationToken`(username, password)) and `isAuthenticated()` is false

2. **Submission to** AuthenticationManager
   - This unauthenticated `Authentication` object is then passed to the `AuthenticationManager` (the main authentication entry point)

3. **Delegation to** AuthenticationProvider
   - The `AuthenticationManager` (usually a `ProviderManager`) delegates the authentication task to one or more configured `AuthenticationProvider` instances.
   - Each `AuthenticationProvider` inspects the type of `Authentication` object and decides if it can handle it via its `supports()` method

4. **Authentication Logic** (`AuthenticationProvider.authenticate()`)
   - The chosen `AuthenticationProvider` performs the actual authentication logic (e.g., loading `UserDetails` from a database, verifying passwords, checking account status).
   - **If successful:** It creates and returns a _new_, fully populated, and **authenticated** `**Authentication**` **object** (with `isAuthenticated()` set to `true`, `principal` as `UserDetails`, and `authorities` populated).
   - **If failed:** It throws an `AuthenticationException`

5. **Storing in** `SecurityContextHolder`
   - If authentication is successful, the newly created authenticated `Authentication` object is stored in the `SecurityContextHolder`. This is a static container that holds the security context for the current thread of execution.
   - This means that **anywhere in your application code** (controllers, services, repositories) that runs on the same thread, you can access the details of the currently authenticated user.

### **Common Implementations:**

- UsernamePasswordAuthenticationToken
  - For username/password authentication (most common)
- AnonymousAuthenticationToken
  - Represents an unauthenticated user (when no specific user is logged in)
- OAuth2AuthenticationToken
  - For OAuth 2.0 based authentication
- BearerTokenAuthentication
  - For JWT bearer token authentication
- Custom Implementations
  - You can create your own Authentication implementations for highly specific authentication flows.

### **Accessing the Authenticated User:**

You can access the Authentication object (and thus the logged-in user's details) in your application in several ways:\
1\. **Using** `SecurityContextHolder` **(programmatic):**

```Java
import org.springframework.security.core.Authentication;  
import org.springframework.security.core.context.SecurityContextHolder;  
import org.springframework.security.core.userdetails.UserDetails;  
   
// ... inside a service or controller method  
Authentication authentication = SecurityContextHolder.getContext().getAuthentication();  
if (authentication != null && authentication.isAuthenticated()) {  
	String username = authentication.getName(); // or authentication.getPrincipal().getUsername() // if it's UserDetails  
	
	Object principal = authentication.getPrincipal();  
	if (principal instanceof UserDetails) {  
    	UserDetails userDetails = (UserDetails) principal;  
    	// Access userDetails.getUsername(), userDetails.getAuthorities(), etc.  
	}  
}  
```

```
2.**Injecting** `Authentication` **or** `Principal` **into Controller Methods:**  
```

```
Java  
import org.springframework.security.core.Authentication;  
import org.springframework.security.core.annotation.AuthenticationPrincipal;  
import org.springframework.security.core.userdetails.UserDetails;  
import org.springframework.web.bind.annotation.GetMapping;  
import org.springframework.web.bind.annotation.RestController;  
   
import java.security.Principal; // Standard Java interface  
   
@RestController  
public class UserController {  
   
	@GetMapping("/user/info1")  
	public String getUserInfo(Authentication authentication) {  
    	return "Username: " \+ authentication.getName() \+ ", Authenticated: " \+ authentication.isAuthenticated();  
	}  
   
	@GetMapping("/user/info2")  
	public String getUserInfo(Principal principal) { // Automatically injected  
    	return "Username: " \+ principal.getName();  
	}  
   
	@GetMapping("/user/info3")  
	public String getUserInfo(@AuthenticationPrincipal UserDetails userDetails) { // Even more specific  
    	return "Username: " \+ userDetails.getUsername() \+ ", Roles: " \+ userDetails.getAuthorities();  
	}  
}  
```

> [!SUMMARY]
> The `Authentication` interface is the cornerstone of Spring Security's runtime representation of a user's identity and permissions, flowing through the security mechanisms and ultimately residing in the `SecurityContextHolder` to provide context for authorization.

# UserDetails

In Spring Security, the `UserDetails` interface is a fundamental and core component. It represents **core user information** and acts as an adapter between your application's user storage (e.g., database, LDAP, in-memory) and Spring Security's authentication and authorization mechanisms.

Think of it as the **contract that defines what essential information Spring Security needs to know about a user** to perform its security checks.

## **Definition of UserDetails:**

```
Java  
public interface UserDetails extends Serializable {  
   
	// Returns the authorities granted to the user. Cannot return null.  
	Collection\<? extends GrantedAuthority\> getAuthorities();  
   
	// Returns the password used to authenticate the user. Cannot return null.  
	String getPassword();  
   
	// Returns the username used to authenticate the user. Cannot return null.  
	String getUsername();  
   
	// Indicates whether the user's account has expired.  
	boolean isAccountNonExpired();  
   
	// Indicates whether the user is locked or unlocked.  
	boolean isAccountNonLocked();  
   
	// Indicates whether the user's credentials (password) have expired.  
	boolean isCredentialsNonExpired();  
   
	// Indicates whether the user is enabled or disabled.  
	boolean isEnabled();  
}
```

## Key Methods and Their Purpose:

1. `Collection<? extends GrantedAuthority> getAuthorities()`
   - Returns a collection of GrantedAuthority objects, which represent the permissions or roles granted to the user. These are typically used for authorization decisions (e.g., "Does this user have the 'ADMIN' role to access this resource?")

2. `String getPassword()`
   - Returns the user's encoded password. Spring Security uses this to compare with the password provided by the user during authentication
   - You should **never** store plain-text passwords in your database. Always use a strong password encoder (like BCryptPasswordEncoder)

3. `String getUsername()`
   - Returns the username used to authenticate the user. This is the unique identifier for the user in your authentication system

4. `boolean isAccountNonExpired()`
   - Indicates whether the user's account has expired. If false, the user cannot authenticate

5. `boolean isAccountNonLocked()`
   - Indicates whether the user's account is locked (e.g., due to too many failed login attempts). If false, the user cannot authenticate

6. `boolean isCredentialsNonExpired()`
   - Indicates whether the user's credentials (password) have expired. If false, the user cannot authenticate until their password is changed

7. `boolean isEnabled()`
   - Indicates whether the user is enabled or disabled. If false, the user cannot authenticate

## How UserDetails is Used in Spring Security

1. `UserDetailsService`
   - The `UserDetailsService` interface is responsible for loading `UserDetails` objects. Your custom implementation of `UserDetailsService` (e.g., MyUserDetailsService) will fetch user data from your persistence layer (database, LDAP, etc.) and construct a `UserDetails` object from it.
   - During the authentication process, Spring Security's `DaoAuthenticationProvider` (or similar providers) will call `userDetailsService.loadUserByUsername(String username)` to get the `UserDetails` object for the user attempting to log in.

2. Authentication Process
   - Once the `UserDetails` object is loaded, the `AuthenticationProvider` uses the `getPassword()` from UserDetails to compare it with the password provided by the user (after both are processed by the `PasswordEncoder`).
   - It also checks the various `isAccountNonExpired()`, `isAccountNonLocked()`, `isCredentialsNonExpired()`, and `isEnabled()` flags to ensure the user's account is in a valid state for authentication.

3. Security Context

- `Upon successful authentication, Spring Security stores an `Authentication`object in the`SecurityContextHolder`. This Authentication object typically contains the authenticated `UserDetails\` object (or a User object, which is a concrete implementation of UserDetails).
- `This allows you to access the currently logged-in user's details (username, roles, etc.) anywhere in your application (e.g., in controllers, services) using `SecurityContextHolder.getContext().getAuthentication().getPrincipal()\`

## `User` Class: A Common Implementation

- Spring Security provides a default implementation of `UserDetails` called `org.springframework.security.core.userdetails.User`.
- You can use this directly or create your own **custom** UserDetails implementation if you need to store more specific user data that isn't covered by the default User class (e.g., email address, first name, last name).

### Example of a Custom\*\* UserDetailsService **returning a** User **object:**

```
Java  
import org.springframework.security.core.userdetails.User;  
import org.springframework.security.core.userdetails.UserDetails;  
import org.springframework.security.core.userdetails.UserDetailsService;  
import org.springframework.security.core.userdetails.UsernameNotFoundException;  
import org.springframework.security.core.authority.SimpleGrantedAuthority;  
import org.springframework.stereotype.Service;  
   
import java.util.Collections;  
   
@Service  
public class MyCustomUserDetailsService implements UserDetailsService {  
   
	@Override  
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {  
    	// In a real application, you would fetch user data from a database  
    	// based on the username.  
   
    	if ("user".equals(username)) {  
        	// Example for a regular user  
        	return User.withUsername("user")  
                   	.password("{noop}password") // Use a real password encoder in production\!  
                   	.roles("USER")  
                   	.build();  
    	} else if ("admin".equals(username)) {  
        	// Example for an admin user  
        	return User.withUsername("admin")  
                   	.password("{noop}adminpass")  
                   	.roles("ADMIN", "USER") // Can have multiple roles  
                   	.accountExpired(false)  
                   	.accountLocked(false)  
                   	.credentialsExpired(false)  
                   	.disabled(false)  
                   	.build();  
    	} else {  
        	throw new UsernameNotFoundException("User not found: " \+ username);  
    	}  
	}  
}  
```

> [!SUMMARY]
> `UserDetails` is the contract that defines the essential user data required by Spring Security for authentication and authorization. It's the bridge between your application's user data model and Spring Security's powerful features.

## Difference between UserDetails and Principal

In Spring Security, `UserDetails` and `Principal` are both fundamental concepts related to identifying a user, but they serve different purposes and operate at different levels of abstraction.

```
- java.security.Principal
	- This is a **standard Java interface** (java.security.Principal), not specific to Spring Security.  
```

```java
public interface Principal {  
   String getName();  
   // ... other methods like equals, hashCode, toString  
}  
```

`public default boolean implies(Subject subject)` was added in Java 8

- Purpose (General Java Security)
  - It represents an **abstract notion of an identity**. A principal can be an individual, a corporation, a program thread, or anything that can have an identity.
  - Its primary role is to provide a unique name for that identity.

- In Spring Security Context
  - In Spring Security, the `Authentication` object (which represents the currently authenticated user or an authentication request) itself **extends** Principal.
  - This means that when you retrieve the `Authentication` object from the `SecurityContextHolder`, you can directly call `authentication.getName()`, which will typically return the username of the authenticated user.
  - It's a very **lightweight representation** – it primarily provides the "name" of the authenticated entity.

### 2. `org.springframework.security.core.userdetails.UserDetails`

This is a \*\*Spring Security-specific interface

```
Java  
public interface UserDetails extends Serializable {  
	Collection\<? extends GrantedAuthority\> getAuthorities();  
	String getPassword();  
	String getUsername(); // This method directly correlates to Principal.getName()  
	boolean isAccountNonExpired();  
	boolean isAccountNonLocked();  
	boolean isCredentialsNonExpired();  
	boolean isEnabled();  
}  
```

- Purpose (Spring Security Specific)
  - It provides **comprehensive user details** that Spring Security needs to perform both **authentication** and **authorization** checks. It's the adapter that connects your application's user data model to Spring Security's security mechanisms.

- Key Information: It includes:
  - The username (`getUsername()`)
  - The encoded password (`getPassword()`)
  - A collection of granted authorities (roles/permissions) (`getAuthorities()`)
  - Account status flags (e.g., `isAccountNonExpired()`, `isAccountNonLocked()`, `isCredentialsNonExpired()`, `isEnabled()`)

- Role in Authentication
  - The `UserDetailsService` is responsible for loading a UserDetails object based on a username during the authentication process.

- Role in Authorization
  - The `getAuthorities()` method is crucial for authorization decisions (e.g., using `@PreAuthorize("hasRole('ADMIN')")`).

### Key Differences Summarized

| Feature | java.security.Principal | org.springframework.security.core.userdetails.UserDetails |
| :---- | :---- | :---- |
| **Origin** | Standard Java API (java.security) | Spring Security specific (org.springframework.security.core.userdetails) |
| **Abstraction** | Represents a generic "identity" | Represents comprehensive "user details" for Spring Security |
| **Primary Method** | getName() (returns the principal's name) | getUsername(), getPassword(), getAuthorities(), and account status flags |
| **Information** | Very minimal: just a name. | Detailed information required for authentication and authorization. |
| **Usage** | General identification of a user. Can be passed directly to @Controller methods. Authentication implements it. | Core data model for Spring Security's authentication providers and access decision managers. |
| **Relationship** | UserDetails objects are **frequently the** Principal after successful authentication in Spring Security. | Authentication.getPrincipal() often returns a UserDetails instance. |

---

---

## **Relationship in Spring Security's Authentication Object:**

When a user successfully authenticates in Spring Security, an Authentication object is stored in the SecurityContextHolder. This Authentication object has:\
·       getPrincipal(): This method returns an Object. In most standard Spring Security setups (e.g., using DaoAuthenticationProvider with a UserDetailsService), this Object will actually be an instance of your UserDetails implementation (or Spring's default User class).\
·       getCredentials(): The password (often nullified after authentication for security).\
·       getAuthorities(): The granted authorities.\
·       isAuthenticated(): A boolean indicating if the principal has been authenticated.\
·       getName(): Since Authentication implements Principal, this method directly returns the username of the authenticated user (which often comes from UserDetails.getUsername()).

**Example:**\
Java\
import org.springframework.security.core.Authentication;\
import org.springframework.security.core.context.SecurityContextHolder;\
import org.springframework.security.core.userdetails.UserDetails;\
import java.security.Principal; // The standard Java Principal

public class SecurityInfo {

```
public void displayCurrentUser() {  
	Authentication authentication \= SecurityContextHolder.getContext().getAuthentication();  

	if (authentication \!= null && authentication.isAuthenticated()) {  
    	System.out.println("--- Using Authentication Object \---");  
    	System.out.println("Authenticated: " \+ authentication.isAuthenticated());  
    	System.out.println("Authentication Name: " \+ authentication.getName()); // This comes from Principal interface  

    	// The principal object itself  
    	Object principal \= authentication.getPrincipal();  

    	// Check if the principal is a UserDetails instance (most common case in Spring Security)  
    	if (principal instanceof UserDetails) {  
        	UserDetails userDetails \= (UserDetails) principal;  
        	System.out.println("--- Casting to UserDetails \---");  
        	System.out.println("UserDetails Username: " \+ userDetails.getUsername());  
        	System.out.println("UserDetails Password (encoded): " \+ userDetails.getPassword());  
        	System.out.println("UserDetails Authorities: " \+ userDetails.getAuthorities());  
        	System.out.println("Account Non-Expired: " \+ userDetails.isAccountNonExpired());  
    	} else if (principal instanceof Principal) {  
        	// This might happen if you have a very custom authentication provider  
        	// that puts something else as principal that only implements java.security.Principal  
        	Principal javaPrincipal \= (Principal) principal;  
        	System.out.println("--- Principal is not UserDetails \---");  
        	System.out.println("Principal Name: " \+ javaPrincipal.getName());  
    	} else {  
        	System.out.println("Principal is an unknown type: " \+ principal.getClass().getName());  
    	}  
	} else {  
    	System.out.println("No user is currently authenticated.");  
	}  
}  
```

}

In short, Principal is a generic concept of an identity, while UserDetails is Spring Security's specialized and richer implementation of that identity concept, providing all the necessary attributes for robust security handling. UserDetails very often _is_ the Principal in a Spring Security application.

# **AuthenticationManager vs ProviderManager**

In Spring Security, AuthenticationManager and ProviderManager are closely related concepts, but they exist at different levels of abstraction:\
1\.	AuthenticationManager **(Interface)**\
2\.	ProviderManager **(Concrete Implementation of** AuthenticationManager\*\*)\*\*\
Let's break down their roles and relationship:

### **1. AuthenticationManager (Interface)**

·       **What it is:** AuthenticationManager is the **main strategy interface** for authentication in Spring Security. It defines the core contract for how authentication should be performed.\
·       **Single Method:** It has only one method:\
Java\
Authentication authenticate(Authentication authentication) throws AuthenticationException;\
This method takes an Authentication object (which represents an authentication request, usually containing raw credentials like username and password) and attempts to authenticate it.\
·       **Return Value:**\
o   If authentication is successful, it returns a **fully populated and authenticated** Authentication **object** (with isAuthenticated() set to true and usually containing UserDetails as its principal).\
o   If authentication fails, it throws an AuthenticationException (e.g., BadCredentialsException, DisabledException, LockedException).\
·       **Abstraction:** It represents the **high-level authentication process**. It doesn't care _how_ the authentication is done, only that it _can_ be done. This allows for various authentication mechanisms (database, LDAP, OAuth2, custom logic) to be plugged in.\
·       **Role:** It acts as the **central entry point** for authentication requests within Spring Security. Filters (like UsernamePasswordAuthenticationFilter) pass authentication requests to the AuthenticationManager.

### **2. ProviderManager (Concrete Class)**

·       **What it is:** ProviderManager is the **default and most common implementation** of the AuthenticationManager interface provided by Spring Security.\
·       **Delegation Pattern:** Its primary function is to **delegate authentication requests to a list of configured** AuthenticationProvider **instances**.\
·       **How it works (its** authenticate **method):**\
1\.	When ProviderManager.authenticate(Authentication authentication) is called, it iterates through its internal list of AuthenticationProviders.\
2\.	For each AuthenticationProvider, it calls provider.supports(authentication.getClass()) to check if that provider is capable of authenticating the given Authentication object type.\
3\.	If a provider supports the type, ProviderManager calls provider.authenticate(authentication).\
4\.	**Order and Success:** Providers are tried in order.\
§  If an AuthenticationProvider successfully authenticates the request (returns a non-null Authentication object), ProviderManager immediately returns that authenticated object, and no further providers are tried.\
§  If an AuthenticationProvider throws an AuthenticationException, ProviderManager catches it and may try the next provider. It keeps track of the last AuthenticationException thrown.\
5\.	**Failure:**\
§  If none of the configured AuthenticationProviders can authenticate the request (either none support the Authentication type, or all that support it throw an exception), ProviderManager will re-throw the last AuthenticationException it received.\
§  If no provider supports the Authentication type, it throws a ProviderNotFoundException.\
·       **Parent AuthenticationManager:** ProviderManager can also be configured with a "parent" AuthenticationManager. 1If none of its configured AuthenticationProviders can authenticate the request, it can delegate to this parent AuthenticationManager as a fallback. This is less common in modern Spring Boot apps but can be useful for advanced setups or chaining.\
·       **Event Publishing:** ProviderManager is also responsible for publishing authentication success and failure events, which can be useful for auditing, logging, or triggering other actions.

### **Analogy:**

Think of it like this:

·       AuthenticationManager **is the "CEO of Authentication."** It gets an authentication request and is responsible for getting it done. It doesn't get into the nitty-gritty details of _how_ it's done.\
·       ProviderManager **is the "HR Department."** It's the CEO's direct report for authentication. It doesn't do the actual interviews (authentication) itself, but it knows _who_ to send the candidates (authentication requests) to. It manages a team of "interviewers" (AuthenticationProviders) and dispatches the candidates to the right one.2\
·       AuthenticationProvider**s are the "Interviewers/Specialists."** Each one is an expert in a specific type of authentication (e.g., "I authenticate with usernames and passwords from a database," "I authenticate with LDAP," "I authenticate with JWT tokens"). They do the actual verification work.

### **Why this Design?**

This design provides immense flexibility and extensibility:

·       **Decoupling:** The AuthenticationManager interface decouples the core authentication process from the specific authentication mechanisms. Your filters and security configurations only interact with the AuthenticationManager interface, not a concrete ProviderManager or specific AuthenticationProviders directly.\
·       **Pluggability:** You can easily plug in different AuthenticationProviders (built-in or custom) to support various authentication methods without changing the core authentication flow.\
·       **Chain of Responsibility:** ProviderManager implements a chain-of-responsibility pattern, allowing multiple providers to be tried until one successfully authenticates the user.\
In most Spring Boot applications, when you configure authentication using AuthenticationManagerBuilder (e.g., auth.userDetailsService(...), auth.inMemoryAuthentication()), Spring Boot automatically configures an instance of ProviderManager behind the scenes, populating it with the appropriate AuthenticationProviders. While you interact with the AuthenticationManagerBuilder to define your authentication sources, the actual AuthenticationManager bean that gets created and used by the filters is typically a ProviderManager.

#

# **AuthenticationManagerBuilder**

The AuthenticationManagerBuilder in Spring Security doesn't _provide_ a fixed number of authentication mechanisms itself. Instead, it acts as a **convenient builder pattern** that allows you to **configure and register various** AuthenticationProvider **implementations** that Spring Security will then use to authenticate users.\
Think of AuthenticationManagerBuilder as a central point where you tell Spring Security: "Here are all the different ways I want to allow users to authenticate in my application."\
Here's a breakdown of the authentication mechanisms AuthenticationManagerBuilder allows you to set up:\
**Common Built-in Authentication Providers/Mechanisms Supported by** AuthenticationManagerBuilder\*\*:\*\*\
1\.	**In-Memory Authentication:**\
o   auth.inMemoryAuthentication(): This is the simplest form, used primarily for development or testing. You define usernames, passwords, and roles directly in your application's configuration.1\
o   It uses an InMemoryUserDetailsManager and a DaoAuthenticationProvider internally.\
2\.	**JDBC Authentication (Database-backed):**\
o   auth.jdbcAuthentication(): Allows you to authenticate users against a relational database. You provide a DataSource and SQL queries (or let Spring Security use its default schema) to retrieve user details and authorities.2\
o   It uses a JdbcUserDetailsManager and a DaoAuthenticationProvider internally.\
3\.	**LDAP Authentication:**\
o   auth.ldapAuthentication(): For authenticating users against an LDAP (Lightweight Directory Access Protocol) server. You configure the LDAP server details, search bases, and user DN patterns.\
o   It uses an LdapAuthenticationProvider.

4\.	**Custom** UserDetailsService\*\*:\*\*\
o   auth.userDetailsService(userDetailsService): This is one of the most common and powerful ways to integrate custom authentication. You provide your own implementation of the UserDetailsService interface, which is responsible for loading user-specific data (username, password, authorities) from any source (e.g., a custom database schema, a REST API, a NoSQL database).\
o   When you use this, AuthenticationManagerBuilder typically wraps it in a DaoAuthenticationProvider by default (along with a PasswordEncoder for password validation).\
5\.	**Direct** AuthenticationProvider **Registration:**\
o   auth.authenticationProvider(authenticationProvider): This gives you the ultimate flexibility. You can create your own custom AuthenticationProvider by implementing the AuthenticationProvider interface.3 This is useful for integrating with highly specific or proprietary authentication systems, or for implementing multi-factor authentication flows. You then register your custom provider directly with the builder.4\
6\.	**Parent** AuthenticationManager\*\*:\*\*\
o   auth.parentAuthenticationManager(parentAuthenticationManager): Allows you to chain authentication managers.5 If the current AuthenticationManager (built by AuthenticationManagerBuilder) cannot authenticate a user, it can delegate to a parent AuthenticationManager.\
**How** AuthenticationManagerBuilder **Works:**\
AuthenticationManagerBuilder doesn't perform the authentication itself. Instead, it helps to construct an AuthenticationManager (specifically, a ProviderManager by default), which is the core interface responsible for authentication in Spring Security.\
The ProviderManager holds a list of AuthenticationProvider instances.6 When an Authentication request comes in, the ProviderManager iterates through its registered AuthenticationProviders. Each AuthenticationProvider is asked if it supports() the type of Authentication token presented. If it does, its authenticate() method is called.\
The AuthenticationManagerBuilder simplifies this configuration process by providing chained methods for commonly used authentication scenarios.\
**In summary:**\
AuthenticationManagerBuilder doesn't _provide_ a fixed number of authentication methods. It provides a flexible API to **configure and register any number of** AuthenticationProvider**s** (both built-in and custom) that your application needs. The actual authentication work is then delegated to these registered AuthenticationProviders. This design makes Spring Security highly extensible and adaptable to diverse authentication requirements.

# **AuthenticationProvider**

·      In Spring Security, the AuthenticationProvider is a core component that plays a crucial role in the **authentication process**.\
·      It's responsible for performing the actual validation of a user's credentials (like username/password, or an authentication token) and returning a fully authenticated Authentication object if successful.\
·      It has 2 methods\
o	Authentication authenticate(Authentication authentication) throws AuthenticationException;\
o
o	boolean supports(Class\<?> authentication);

## **The Role of AuthenticationProvider**

·      Think of AuthenticationProvider as a **specialized authenticator** for a particular type of authentication.\
·      Spring Security's AuthenticationManager (specifically, its default implementation, ProviderManager) doesn't know _how_ to authenticate a user directly. Instead, it delegates this responsibility to one or more AuthenticationProvider instances.

When an Authentication request (which typically holds the user's raw credentials, like username and password) is submitted to the AuthenticationManager, the manager does the following:

1. **Finds a Suitable Provider:** It iterates through its list of configured AuthenticationProviders.
2. **Checks Support:** For each provider, it calls the supports(Class\<?> authentication) method to see if that particular provider knows how to handle the type of Authentication request received.
3. **Delegates Authentication:** If a provider supports the Authentication type, the AuthenticationManager then calls the provider's authenticate(Authentication authentication) method.
4. **Returns Result:**
   - If authenticate() is successful, it returns a **fully populated and authenticated Authentication object**. This object will contain the user's UserDetails (username, roles, enabled status, etc.) and no longer holds the sensitive raw credentials.
   - If authenticate() fails (e.g., wrong password, user not found), it throws an AuthenticationException.

**The AuthenticationProvider Interface**\
The AuthenticationProvider interface defines two key methods:\
Java\
public interface AuthenticationProvider {

```
// Performs the actual authentication.  
// Throws AuthenticationException if authentication fails.  
Authentication authenticate(Authentication authentication) throws AuthenticationException;  

// Indicates whether this AuthenticationProvider supports the presented Authentication object.  
boolean supports(Class\<?\> authentication);  
```

}

**Common Built-in Implementations:**

Spring Security provides several pre-built AuthenticationProvider implementations for common authentication scenarios:

1. **DaoAuthenticationProvider:**
   - This is the most frequently used provider. It works with a UserDetailsService (to load user details by username) and a PasswordEncoder (to verify the password).
   - It's used for in-memory, JDBC, and custom UserDetailsService-based authentication.
   - **Mechanism:** It gets UserDetails from UserDetailsService, compares the provided password (after encoding) with the one from UserDetails, and if they match, creates an authenticated Authentication object.
2. **LdapAuthenticationProvider:**
   - Used for authenticating users against an LDAP directory server. It interacts with the LDAP server to bind the user with their credentials.
3. **PreAuthenticatedAuthenticationProvider:**
   - Used when authentication has already happened upstream (e.g., by a reverse proxy, a single sign-on system) and the user's identity is passed to the Spring Security application. It typically works with a PreAuthenticatedUserDetailsService.
4. **RememberMeAuthenticationProvider:**
   - Handles "remember me" functionality, allowing users to stay logged in across sessions without re-entering credentials.
5. **AbstractUserDetailsAuthenticationProvider:**
   - An abstract base class for providers that rely on UserDetailsService to load UserDetails. DaoAuthenticationProvider extends this.

**Example: How DaoAuthenticationProvider Fits In**\
Let's imagine a user logs in with a username and password:

1. A UsernamePasswordAuthenticationToken (an implementation of Authentication) is created containing the raw username and password.
2. This token is passed to the AuthenticationManager.
3. The AuthenticationManager finds the DaoAuthenticationProvider (because DaoAuthenticationProvider.supports(UsernamePasswordAuthenticationToken.class) returns true).
4. The DaoAuthenticationProvider
   - Calls your UserDetailsService.loadUserByUsername() to get the UserDetails object.
   - Uses a PasswordEncoder to compare the submitted password with the stored (encoded) password from UserDetails.
   - If successful, it creates a new, fully authenticated UsernamePasswordAuthenticationToken (which now holds the UserDetails principal and granted authorities, but no longer the raw password).
   - If unsuccessful, it throws an AuthenticationException.
5. The authenticated Authentication object is then placed into the SecurityContextHolder.

**Creating a Custom AuthenticationProvider**\
You might create a custom AuthenticationProvider in scenarios where:

- You need to integrate with a unique, non-standard authentication system (e.g., a proprietary identity management system, a custom token-based authentication where no existing provider fits).
- You need to implement complex authentication logic that goes beyond simple username/password validation (e.g., multi-factor authentication, device-based authentication).
- You need to apply very specific business rules during authentication.

Java\
import org.springframework.security.authentication.AuthenticationProvider;\
import org.springframework.security.authentication.BadCredentialsException;\
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;\
import org.springframework.security.core.Authentication;\
import org.springframework.security.core.AuthenticationException;\
import org.springframework.security.core.userdetails.UserDetails;\
import org.springframework.security.core.userdetails.UserDetailsService;\
import org.springframework.security.crypto.password.PasswordEncoder;\
import org.springframework.stereotype.Component;

// This example is similar to DaoAuthenticationProvider but demonstrates how you'd build one.\
@Component\
public class CustomAuthenticationProvider implements AuthenticationProvider {

```
private final UserDetailsService userDetailsService;  
private final PasswordEncoder passwordEncoder;  

public CustomAuthenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {  
	this.userDetailsService \= userDetailsService;  
	this.passwordEncoder \= passwordEncoder;  
}  

@Override  
public Authentication authenticate(Authentication authentication) throws AuthenticationException {  
	// 1\. Get credentials from the incoming Authentication object  
	String username \= authentication.getName();  
	String rawPassword \= authentication.getCredentials().toString();  

	// 2\. Load user details  
	UserDetails userDetails \= userDetailsService.loadUserByUsername(username);  
	if (userDetails \== null) {  
    	throw new BadCredentialsException("User not found.");  
	}  

	// 3\. Validate password  
	if (\!passwordEncoder.matches(rawPassword, userDetails.getPassword())) {  
    	throw new BadCredentialsException("Invalid password.");  
	}  

	// 4\. Check account status (e.g., locked, expired, disabled)  
	if (\!userDetails.isEnabled() || \!userDetails.isAccountNonLocked() || \!userDetails.isAccountNonExpired() || \!userDetails.isCredentialsNonExpired()) {  
    	throw new BadCredentialsException("User account is not valid."); // More specific exceptions can be thrown  
	}  

	// 5\. If successful, return a fully authenticated Authentication object  
	return new UsernamePasswordAuthenticationToken(  
    	userDetails, // Principal (the UserDetails object)  
    	userDetails.getPassword(), // Credentials (encoded password, not raw)  
    	userDetails.getAuthorities() // Authorities/Roles  
	);  
}  

@Override  
public boolean supports(Class\<?\> authentication) {  
	// This provider supports UsernamePasswordAuthenticationToken  
	return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);  
}  
```

}\
You would then register this custom provider with AuthenticationManagerBuilder:\
Java\
@Configuration\
@EnableWebSecurity\
public class SecurityConfig {

```
@Autowired  
private CustomAuthenticationProvider customAuthenticationProvider;  

@Bean  
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {  
	http  
    	.authorizeHttpRequests(auth \-\> auth  
        	.anyRequest().authenticated()  
    	)  
        .formLogin(Customizer.withDefaults()); // Use default form login  
	return http.build();  
}  

@Bean  
public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {  
	AuthenticationManagerBuilder authenticationManagerBuilder \=  
        	http.getSharedObject(AuthenticationManagerBuilder.class);  
    authenticationManagerBuilder.authenticationProvider(customAuthenticationProvider);  
	return authenticationManagerBuilder.build();  
}  

// Don't forget your PasswordEncoder bean  
@Bean  
public PasswordEncoder passwordEncoder() {  
	return new BCryptPasswordEncoder();  
}  
```

}\
In essence, AuthenticationProvider is the plug-in point for defining distinct ways to authenticate users within the Spring Security framework, enabling tremendous flexibility and extensibility.

# **UsernamePasswordAuthenticationToken**

The UsernamePasswordAuthenticationToken in Spring Security is a concrete implementation of the org.springframework.security.core.Authentication interface. It's a fundamental part of the standard username and password-based authentication flow.

### **What it is:**

·       **An** Authentication **implementation:** It represents an authentication request or an authenticated principal within Spring Security's framework.\
·       **Holds Username and Password:** Its primary purpose is to carry the username and password provided by a user during a login attempt.\
·       **Two States:** It exists in two main states:\
o   **Unauthenticated (before login):** When a user submits their username and password (e.g., from a login form), a UsernamePasswordAuthenticationToken is created. In this state, its isAuthenticated() method returns false, and the password is still present in the credentials field.\
o   **Authenticated (after successful login):** After the authentication process (handled by an AuthenticationProvider) successfully validates the credentials, a _new_ UsernamePasswordAuthenticationToken is usually created. In this state, isAuthenticated() returns true, the sensitive password information is typically cleared (set to null), and the principal field holds a UserDetails object (or an equivalent representation of the authenticated user), while authorities are populated with the user's roles/permissions.

### **Key Components of UsernamePasswordAuthenticationToken:**

When you create an instance, you typically use one of its constructors:

1\.	**For an unauthenticated request (before authentication):**\
Java\
UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, password);\
o   principal: The username provided by the user.\
o   credentials: The raw (unencoded) password provided by the user.\
o   authorities: Empty or null.\
o   isAuthenticated(): false.\
2\.	**For an authenticated principal (after successful authentication):**\
Java\
// Typically created internally by an AuthenticationProvider after validation\
UsernamePasswordAuthenticationToken authenticatedToken = new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());\
// Or, more commonly, the credentials are nullified for security:\
UsernamePasswordAuthenticationToken authenticatedToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());\
o   principal: A UserDetails object (or a custom object representing the authenticated user). This is the key piece of information about _who_ is logged in.\
o   credentials: The password. It's best practice for AuthenticationProvider implementations to set this to null after successful authentication to prevent sensitive data from lingering in memory.\
o   authorities: A Collection of GrantedAuthority objects, representing the user's roles and permissions.\
o   isAuthenticated(): true.

### **How it's Used in the Spring Security Flow:**

Let's trace a typical login process:

1\.	**Login Form Submission:** A user enters their username and password into a login form and submits it.\
2\.	UsernamePasswordAuthenticationFilter\*\*:\*\* Spring Security's UsernamePasswordAuthenticationFilter (or a custom filter) intercepts this request.\
3\.	**Token Creation (Unauthenticated):** The filter extracts the username and password from the request and creates a UsernamePasswordAuthenticationToken instance:\
Java\
Authentication authenticationRequest = new UsernamePasswordAuthenticationToken(usernameFromForm, passwordFromForm);\
4\.	**Delegation to** AuthenticationManager\*\*:\*\* The filter then delegates this authenticationRequest to the configured AuthenticationManager:\
Java\
Authentication authenticatedResult = authenticationManager.authenticate(authenticationRequest);\
5\.	AuthenticationManager **to** AuthenticationProvider\*\*:\*\* The AuthenticationManager (which is typically a ProviderManager) finds an AuthenticationProvider (e.g., DaoAuthenticationProvider) that supports() UsernamePasswordAuthenticationToken.\
6\.	AuthenticationProvider **Authenticates:** The selected AuthenticationProvider\
o   Retrieves UserDetails for the username via a UserDetailsService.\
o   Compares the password from the authenticationRequest with the password from UserDetails using a PasswordEncoder.\
o   Performs additional checks (account enabled, non-expired, non-locked, credentials non-expired).

o   **If successful:** Creates a _new_, **authenticated** UsernamePasswordAuthenticationToken (with isAuthenticated() set to true, and potentially credentials cleared) and returns it.\
o   **If failed:** Throws an AuthenticationException.\
7\.	SecurityContextHolder **Update:** If authentication is successful, the UsernamePasswordAuthenticationToken (now authenticated) is set in the SecurityContextHolder:\
Java\
SecurityContextHolder.getContext().setAuthentication(authenticatedResult);\
This makes the authenticated user's details available to the rest of the application.

### **Example in Code:**

Java\
import org.springframework.security.authentication.AuthenticationManager;\
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;\
import org.springframework.security.core.Authentication;\
import org.springframework.security.core.context.SecurityContextHolder;\
import org.springframework.stereotype.Service;

// This would typically be in a controller or service that handles login requests\
@Service\
public class AuthService {

```
private final AuthenticationManager authenticationManager;  

public AuthService(AuthenticationManager authenticationManager) {  
	this.authenticationManager \= authenticationManager;  
}  

public String login(String username, String password) {  
	try {  
    	// 1\. Create an unauthenticated token with raw credentials  
    	Authentication authenticationToken \= new UsernamePasswordAuthenticationToken(username, password);  

    	// 2\. Authenticate the token using the AuthenticationManager  
    	// This will delegate to the configured AuthenticationProvider(s)  
    	Authentication authenticatedResult \= authenticationManager.authenticate(authenticationToken);  

    	// 3\. Set the authenticated result in the SecurityContextHolder  
    	// This makes the user "logged in" for the current request context  
    	SecurityContextHolder.getContext().setAuthentication(authenticatedResult);  

    	// 4\. Return success or generate a token (e.g., JWT)  
    	return "Login successful for user: " \+ authenticatedResult.getName();  

	} catch (org.springframework.security.core.AuthenticationException e) {  
    	// Handle authentication failure (e.g., BadCredentialsException, DisabledException)  
    	System.err.println("Login failed: " \+ e.getMessage());  
    	throw e; // Re-throw or handle as appropriate for your application  
	}  
}  

// You can access the authenticated user later  
public void doSomethingSecured() {  
	Authentication authentication \= SecurityContextHolder.getContext().getAuthentication();  
	if (authentication \!= null && authentication.isAuthenticated()) {  
    	System.out.println("Current user: " \+ authentication.getName());  
    	authentication.getAuthorities().forEach(a \-\> System.out.println("Role: " \+ a.getAuthority()));  
	} else {  
    	System.out.println("No user is authenticated.");  
	}  
}  
```

}\
In essence, UsernamePasswordAuthenticationToken serves as the standard container for transferring username and password credentials through the Spring Security authentication pipeline, first in an unauthenticated state and then in an authenticated state after successful validation.
