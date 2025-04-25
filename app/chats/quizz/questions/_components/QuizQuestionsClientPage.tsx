"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "sonner"
import confetti from "canvas-confetti"

// Define the question type
interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  explainAnswer?: string
}

// Sample quiz data for all languages and levels
const sampleQuizData = {
  nextjs: {
    beginner: [
      {
        id: 1,
        question: "What is the main advantage of using Next.js over plain React?",
        options: [
          "It has a better logo",
          "Server-side rendering and static site generation",
          "It's written in TypeScript",
          "It's owned by Facebook",
        ],
        correctAnswer: "Server-side rendering and static site generation",
        explainAnswer:
          "Next.js extends React by providing server-side rendering (SSR) and static site generation (SSG) capabilities out of the box, which improves performance and SEO compared to client-side rendered React applications.",
      },
      {
        id: 2,
        question: "Which file would you create to define a new page in Next.js App Router?",
        options: ["page.js or page.tsx", "index.js", "route.js", "view.js"],
        correctAnswer: "page.js or page.tsx",
        explainAnswer:
          "In the Next.js App Router, you create a page.js or page.tsx file within a directory to define a route. The file name 'page' is a special convention that Next.js uses to identify route components.",
      },
      {
        id: 3,
        question: "What is the default behavior of components in the App Router?",
        options: ["Client Components", "Server Components", "Static Components", "Hybrid Components"],
        correctAnswer: "Server Components",
        explainAnswer:
          "In Next.js App Router, components are Server Components by default. This means they render on the server and don't increase the JavaScript bundle sent to the client unless explicitly marked with 'use client'.",
      },
      {
        id: 4,
        question: "How do you create a layout that applies to all pages in Next.js App Router?",
        options: [
          "Create a _layout.js file",
          "Create a layout.js file in the app directory",
          "Use the <Layout> component from Next.js",
          "Set the layout property in next.config.js",
        ],
        correctAnswer: "Create a layout.js file in the app directory",
        explainAnswer:
          "In the App Router, you create a layout.js file in the app directory to define a layout that wraps all pages. This layout will be applied to all routes in your application.",
      },
      {
        id: 5,
        question: "Which of these is NOT a built-in data fetching method in Next.js?",
        options: ["getStaticProps", "getServerSideProps", "getInitialProps", "getFetchProps"],
        correctAnswer: "getFetchProps",
        explainAnswer:
          "getFetchProps is not a built-in data fetching method in Next.js. The valid methods are getStaticProps, getServerSideProps, and getInitialProps (though getInitialProps is considered legacy in favor of the newer methods).",
      },
    ],
    intermediate: [
      {
        id: 1,
        question: "What is a Server Action in Next.js?",
        options: [
          "A function that runs on the client",
          "A function that runs on the server and can be called from the client",
          "A special type of middleware",
          "A component that only renders on the server",
        ],
        correctAnswer: "A function that runs on the server and can be called from the client",
        explainAnswer:
          "Server Actions are functions that run on the server but can be invoked from client components. They allow you to perform server-side operations like database queries directly from client components.",
      },
      {
        id: 2,
        question: "How do you optimize images in Next.js?",
        options: [
          "Use the <img> tag with width and height attributes",
          "Use the next/image component",
          "Use CSS to resize images",
          "Use the Image API from next/server",
        ],
        correctAnswer: "Use the next/image component",
        explainAnswer:
          "Next.js provides the next/image component which automatically optimizes images by resizing, optimizing, and serving images in modern formats like WebP when the browser supports it.",
      },
      {
        id: 3,
        question: "What is the purpose of the 'use client' directive in Next.js?",
        options: [
          "To mark a component as client-side only",
          "To enable client-side data fetching",
          "To optimize the component for client rendering",
          "To prevent the component from being server-side rendered",
        ],
        correctAnswer: "To mark a component as client-side only",
        explainAnswer:
          "The 'use client' directive is used to mark a component and all its imports as client components, which means they will be rendered on the client side and can use client-side features like useState or useEffect.",
      },
      {
        id: 4,
        question: "How can you implement route protection in Next.js?",
        options: [
          "Using the protected property in page components",
          "Using middleware to check authentication before rendering routes",
          "Using the auth.config.js file",
          "Using the <Protected> component from next/auth",
        ],
        correctAnswer: "Using middleware to check authentication before rendering routes",
        explainAnswer:
          "Next.js middleware allows you to run code before a request is completed. You can use it to check if a user is authenticated before allowing access to protected routes.",
      },
      {
        id: 5,
        question: "What is the purpose of the .env.local file in Next.js?",
        options: [
          "To store global CSS variables",
          "To configure build settings",
          "To store environment variables",
          "To define local development server settings",
        ],
        correctAnswer: "To store environment variables",
        explainAnswer:
          "The .env.local file is used to store environment variables that should not be committed to version control. Next.js automatically loads these variables into the Node.js environment.",
      },
    ],
    advanced: [
      {
        id: 1,
        question: "Which of the following is true about RSC (React Server Components)?",
        options: [
          "They can use browser APIs like localStorage",
          "They always require a client-side hydration step",
          "They can directly access backend resources",
          "They must be wrapped in 'use client' directive",
        ],
        correctAnswer: "They can directly access backend resources",
        explainAnswer:
          "React Server Components can directly access backend resources like databases, file systems, or APIs without exposing sensitive information to the client, as they run exclusively on the server.",
      },
      {
        id: 2,
        question: "What is the purpose of the generateStaticParams function in Next.js?",
        options: [
          "To generate dynamic route parameters at build time",
          "To validate URL parameters",
          "To create static props for components",
          "To define API endpoints",
        ],
        correctAnswer: "To generate dynamic route parameters at build time",
        explainAnswer:
          "The generateStaticParams function is used to define the dynamic segments that should be pre-rendered at build time. It replaces the getStaticPaths function from the Pages Router.",
      },
      {
        id: 3,
        question: "How can you implement Incremental Static Regeneration (ISR) in Next.js App Router?",
        options: [
          "Using the revalidate property in getStaticProps",
          "Using the revalidate segment config option",
          "Using the generateISR function",
          "Using the <ISR> component",
        ],
        correctAnswer: "Using the revalidate segment config option",
        explainAnswer:
          "In the App Router, you can implement ISR by setting the revalidate option in the route segment config, or by using the revalidate option in fetch requests.",
      },
      {
        id: 4,
        question: "What is the purpose of the next.config.mjs file?",
        options: [
          "To define React components",
          "To configure the Next.js build system and runtime",
          "To store environment variables",
          "To define API routes",
        ],
        correctAnswer: "To configure the Next.js build system and runtime",
        explainAnswer:
          "The next.config.mjs file is used to customize the Next.js build system and runtime, allowing you to configure features like redirects, rewrites, image optimization, and more.",
      },
      {
        id: 5,
        question: "What is the correct way to implement streaming in Next.js?",
        options: [
          "Using the <Stream> component",
          "Using React Suspense and async components",
          "Using the streamData function",
          "Using WebSockets with the useStream hook",
        ],
        correctAnswer: "Using React Suspense and async components",
        explainAnswer:
          "Next.js implements streaming through React Suspense. By wrapping components in Suspense boundaries, you can stream parts of the UI as they become ready, improving the perceived performance.",
      },
    ],
  },
  reactjs: {
    beginner: [
      {
        id: 1,
        question: "What is React?",
        options: [
          "A JavaScript library for building user interfaces",
          "A programming language",
          "A database management system",
          "A server-side framework",
        ],
        correctAnswer: "A JavaScript library for building user interfaces",
        explainAnswer:
          "React is a JavaScript library developed by Facebook for building user interfaces, particularly single-page applications where UI updates are frequent.",
      },
      {
        id: 2,
        question: "What is JSX?",
        options: [
          "A JavaScript extension that allows writing HTML in React",
          "A JavaScript XML parser",
          "A React-specific styling language",
          "JavaScript execution engine",
        ],
        correctAnswer: "A JavaScript extension that allows writing HTML in React",
        explainAnswer:
          "JSX is a syntax extension for JavaScript that looks similar to HTML. It allows you to write HTML elements in JavaScript and place them in the DOM without using functions like createElement() or appendChild().",
      },
      {
        id: 3,
        question: "What is a React component?",
        options: ["A CSS file", "A reusable piece of UI", "A JavaScript variable", "A database model"],
        correctAnswer: "A reusable piece of UI",
        explainAnswer:
          "A React component is a reusable piece of UI that can be a function or a class that returns a React element describing what should appear on the screen.",
      },
      {
        id: 4,
        question: "How do you create a React functional component?",
        options: [
          "function MyComponent() { return <div>Hello</div>; }",
          "class MyComponent extends React { render() { return <div>Hello</div>; } }",
          "const MyComponent = React.createComponent(<div>Hello</div>);",
          "React.Component(<div>Hello</div>);",
        ],
        correctAnswer: "function MyComponent() { return <div>Hello</div>; }",
        explainAnswer:
          "A functional component in React is simply a JavaScript function that returns JSX. The example shows the correct way to define a functional component that renders a div with the text 'Hello'.",
      },
      {
        id: 5,
        question: "What hook is used to manage state in a functional component?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: "useState",
        explainAnswer:
          "The useState hook is used to add state management to functional components. It returns a stateful value and a function to update it.",
      },
    ],
    intermediate: [
      {
        id: 1,
        question: "What is the purpose of the useEffect hook?",
        options: [
          "To manage component state",
          "To perform side effects in functional components",
          "To create context providers",
          "To optimize rendering performance",
        ],
        correctAnswer: "To perform side effects in functional components",
        explainAnswer:
          "The useEffect hook allows you to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in class components.",
      },
      {
        id: 2,
        question: "What is the purpose of React.memo?",
        options: [
          "To memorize values between renders",
          "To create memoized selectors",
          "To prevent unnecessary re-renders of functional components",
          "To store values in browser memory",
        ],
        correctAnswer: "To prevent unnecessary re-renders of functional components",
        explainAnswer:
          "React.memo is a higher-order component that memoizes the result of a function component. It prevents the component from re-rendering if its props haven't changed, which can improve performance.",
      },
      {
        id: 3,
        question: "What is the Context API used for in React?",
        options: [
          "To manage global state",
          "To handle form validation",
          "To create routing configurations",
          "To optimize images",
        ],
        correctAnswer: "To manage global state",
        explainAnswer:
          "The Context API provides a way to share values like themes, user data, or other global state between components without having to explicitly pass props through every level of the component tree.",
      },
      {
        id: 4,
        question: "What is the correct way to conditionally render a component in React?",
        options: [
          "Using if-else statements inside the render method",
          "Using the conditional operator (ternary) or logical && operator",
          "Using the <If> component from React",
          "Using the show attribute",
        ],
        correctAnswer: "Using the conditional operator (ternary) or logical && operator",
        explainAnswer:
          "In React, you can conditionally render elements using JavaScript operators like the ternary operator (condition ? true : false) or the logical && operator (condition && element).",
      },
      {
        id: 5,
        question: "What is the purpose of the key prop when rendering lists in React?",
        options: [
          "To provide accessibility features",
          "To style list items differently",
          "To help React identify which items have changed, been added, or removed",
          "To enable list item selection",
        ],
        correctAnswer: "To help React identify which items have changed, been added, or removed",
        explainAnswer:
          "The key prop is a special attribute that helps React identify which items in a list have changed, been added, or removed. It helps React optimize the rendering of lists by reusing existing DOM elements when possible.",
      },
    ],
    advanced: [
      {
        id: 1,
        question: "What is the purpose of React.lazy()?",
        options: [
          "To delay rendering of components",
          "To implement code splitting with dynamic imports",
          "To lazy load images and media",
          "To reduce the frequency of re-renders",
        ],
        correctAnswer: "To implement code splitting with dynamic imports",
        explainAnswer:
          "React.lazy() enables code splitting by allowing you to dynamically import component definitions. This helps reduce the initial bundle size and load components only when they're needed.",
      },
      {
        id: 2,
        question: "What is the purpose of the useCallback hook?",
        options: [
          "To memoize values",
          "To memoize functions",
          "To create callback URLs",
          "To handle asynchronous callbacks",
        ],
        correctAnswer: "To memoize functions",
        explainAnswer:
          "The useCallback hook returns a memoized version of the callback function that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.",
      },
      {
        id: 3,
        question: "What is the purpose of the useMemo hook?",
        options: [
          "To memoize values",
          "To memoize functions",
          "To memorize component state",
          "To create memoization patterns",
        ],
        correctAnswer: "To memoize values",
        explainAnswer:
          "The useMemo hook memoizes a computed value, recalculating it only when one of its dependencies changes. This optimization helps avoid expensive calculations on every render.",
      },
      {
        id: 4,
        question: "What is the React Profiler used for?",
        options: [
          "To create user profiles",
          "To measure rendering performance",
          "To profile user interactions",
          "To generate component documentation",
        ],
        correctAnswer: "To measure rendering performance",
        explainAnswer:
          "The React Profiler is a tool that measures how often components render and the 'cost' of rendering. It helps identify parts of an application that may be slow or causing performance issues.",
      },
      {
        id: 5,
        question: "What is the purpose of the useReducer hook?",
        options: [
          "To reduce the bundle size",
          "To manage complex state logic in a more predictable way",
          "To reduce the number of components",
          "To compress data before sending to an API",
        ],
        correctAnswer: "To manage complex state logic in a more predictable way",
        explainAnswer:
          "The useReducer hook is an alternative to useState that's more suitable for managing complex state logic. It works similar to Redux, using a reducer function to determine state changes based on actions.",
      },
    ],
  },
  javascript: {
    beginner: [
      {
        id: 1,
        question: "Which of the following is a primitive data type in JavaScript?",
        options: ["Array", "Object", "String", "Function"],
        correctAnswer: "String",
        explainAnswer:
          "In JavaScript, primitive data types include String, Number, Boolean, Undefined, Null, Symbol, and BigInt. Arrays, Objects, and Functions are non-primitive (reference) types.",
      },
      {
        id: 2,
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["var myVar = 10;", "variable myVar = 10;", "v myVar = 10;", "int myVar = 10;"],
        correctAnswer: "var myVar = 10;",
        explainAnswer:
          "In JavaScript, variables can be declared using var, let, or const keywords. The example shows the correct syntax using var.",
      },
      {
        id: 3,
        question: "What does the === operator do in JavaScript?",
        options: [
          "Assigns a value to a variable",
          "Compares values and types for equality",
          "Compares only values for equality",
          "Checks if a variable exists",
        ],
        correctAnswer: "Compares values and types for equality",
        explainAnswer:
          "The === operator is the strict equality operator in JavaScript. It compares both the value and the type of the operands, returning true only if both are the same.",
      },
      {
        id: 4,
        question: "How do you create a function in JavaScript?",
        options: [
          "function myFunction() {}",
          "create function myFunction() {}",
          "new Function() {}",
          "def myFunction() {}",
        ],
        correctAnswer: "function myFunction() {}",
        explainAnswer:
          "The correct way to define a function in JavaScript is using the function keyword followed by the function name, parameters in parentheses, and the function body in curly braces.",
      },
      {
        id: 5,
        question: "What is the purpose of the console.log() function?",
        options: [
          "To display a message box",
          "To write output to the console",
          "To create a log file",
          "To check if the console is working",
        ],
        correctAnswer: "To write output to the console",
        explainAnswer:
          "console.log() is a debugging function that outputs a message to the web console. It's commonly used to display variable values or debug information during development.",
      },
    ],
    intermediate: [
      {
        id: 1,
        question: "What is closure in JavaScript?",
        options: [
          "A way to close browser windows",
          "A function that has access to variables from its outer scope",
          "A method to end JavaScript execution",
          "A way to close connections to a database",
        ],
        correctAnswer: "A function that has access to variables from its outer scope",
        explainAnswer:
          "A closure in JavaScript is a function that has access to its own scope, the outer function's variables, and global variables, even after the outer function has finished executing.",
      },
      {
        id: 2,
        question: "What is the purpose of the 'this' keyword in JavaScript?",
        options: [
          "To refer to the current HTML element",
          "To refer to the current function",
          "To refer to the context in which a function is executed",
          "To create a new instance of an object",
        ],
        correctAnswer: "To refer to the context in which a function is executed",
        explainAnswer:
          "The 'this' keyword in JavaScript refers to the object that is executing the current function. Its value depends on how the function is called, not where it's defined.",
      },
      {
        id: 3,
        question: "What is the purpose of the Promise object in JavaScript?",
        options: [
          "To guarantee code performance",
          "To represent the eventual completion or failure of an asynchronous operation",
          "To promise that a function will execute",
          "To ensure variables don't change value",
        ],
        correctAnswer: "To represent the eventual completion or failure of an asynchronous operation",
        explainAnswer:
          "A Promise in JavaScript represents an asynchronous operation that hasn't completed yet but is expected to in the future. It provides methods to handle the successful completion or failure of that operation.",
      },
      {
        id: 4,
        question: "What is event bubbling in JavaScript?",
        options: [
          "Creating multiple events simultaneously",
          "The process where an event triggers on the innermost element and propagates outward",
          "A method to prevent events from firing",
          "Creating animated bubble effects with events",
        ],
        correctAnswer: "The process where an event triggers on the innermost element and propagates outward",
        explainAnswer:
          "Event bubbling is a mechanism where an event triggered on the most nested element propagates up through its ancestors in the DOM tree, potentially triggering handlers on each ancestor element.",
      },
      {
        id: 5,
        question: "What is the purpose of the map() method in JavaScript?",
        options: [
          "To create a new map data structure",
          "To create a new array by applying a function to each element of the original array",
          "To map keys to values in an object",
          "To create a visual map on the page",
        ],
        correctAnswer: "To create a new array by applying a function to each element of the original array",
        explainAnswer:
          "The map() method creates a new array populated with the results of calling a provided function on every element in the calling array. It transforms each element without mutating the original array.",
      },
    ],
    advanced: [
      {
        id: 1,
        question: "What is the purpose of the Symbol type in JavaScript?",
        options: [
          "To create unique identifiers",
          "To represent mathematical symbols",
          "To encrypt data",
          "To create special characters in strings",
        ],
        correctAnswer: "To create unique identifiers",
        explainAnswer:
          "The Symbol type in JavaScript is used to create unique and immutable values that can be used as object property identifiers. This helps prevent property name collisions, especially when working with objects that might be extended by third-party code.",
      },
      {
        id: 2,
        question: "What is the purpose of the WeakMap object in JavaScript?",
        options: [
          "To create maps with weak encryption",
          "To create maps with weak references to objects as keys",
          "To create maps with limited functionality",
          "To create maps that perform poorly for testing purposes",
        ],
        correctAnswer: "To create maps with weak references to objects as keys",
        explainAnswer:
          "WeakMap is a collection of key-value pairs where the keys must be objects and the references to the objects are held weakly. This means if there are no other references to an object used as a key, it can be garbage collected, which helps prevent memory leaks.",
      },
      {
        id: 3,
        question: "What is the purpose of the async/await syntax in JavaScript?",
        options: [
          "To make code execute faster",
          "To simplify working with Promises and asynchronous code",
          "To create asynchronous variables",
          "To wait for user input",
        ],
        correctAnswer: "To simplify working with Promises and asynchronous code",
        explainAnswer:
          "The async/await syntax provides a more readable and synchronous-looking way to work with Promises. An async function returns a Promise, and the await keyword pauses execution until the Promise resolves, making asynchronous code easier to write and understand.",
      },
      {
        id: 4,
        question: "What is the purpose of the Proxy object in JavaScript?",
        options: [
          "To act as a server proxy",
          "To create a custom behavior for fundamental operations on objects",
          "To hide IP addresses",
          "To improve network performance",
        ],
        correctAnswer: "To create a custom behavior for fundamental operations on objects",
        explainAnswer:
          "The Proxy object enables you to create an object that can intercept and redefine fundamental operations for another object, such as property lookup, assignment, enumeration, function invocation, etc. This allows for custom behaviors like validation, logging, or formatting.",
      },
      {
        id: 5,
        question: "What is the purpose of the Web Workers API in JavaScript?",
        options: [
          "To hire web developers",
          "To run scripts in background threads",
          "To automate web testing",
          "To manage employee schedules on websites",
        ],
        correctAnswer: "To run scripts in background threads",
        explainAnswer:
          "Web Workers allow you to run JavaScript in background threads, separate from the main execution thread. This enables performing computationally intensive tasks without blocking the user interface, improving the responsiveness of web applications.",
      },
    ],
  },
  typescript: {
    beginner: [
      {
        id: 1,
        question: "What is TypeScript?",
        options: [
          "A new programming language unrelated to JavaScript",
          "A superset of JavaScript that adds static typing",
          "A JavaScript framework like React or Angular",
          "A JavaScript runtime environment",
        ],
        correctAnswer: "A superset of JavaScript that adds static typing",
        explainAnswer:
          "TypeScript is a strongly typed programming language that builds on JavaScript by adding static type definitions. It's a superset of JavaScript, meaning any valid JavaScript code is also valid TypeScript code.",
      },
      {
        id: 2,
        question: "How do you define a variable with a specific type in TypeScript?",
        options: [
          "var name: string = 'John';",
          "var name = 'John' as string;",
          "var name = (string)'John';",
          "var name = 'John':string;",
        ],
        correctAnswer: "var name: string = 'John';",
        explainAnswer:
          "In TypeScript, you can specify a type by using a colon after the variable name, followed by the type. The example shows the correct way to define a string variable.",
      },
      {
        id: 3,
        question: "What is the 'any' type in TypeScript?",
        options: [
          "A type that can only hold numeric values",
          "A type that can hold any value, bypassing type checking",
          "A type for arrays that can contain mixed types",
          "A type that automatically detects the correct type",
        ],
        correctAnswer: "A type that can hold any value, bypassing type checking",
        explainAnswer:
          "The 'any' type in TypeScript allows a variable to hold values of any type. It essentially opts out of type checking for that variable, similar to how regular JavaScript variables work.",
      },
      {
        id: 4,
        question: "How do you define an array of numbers in TypeScript?",
        options: ["number[]", "Array<number>", "Both number[] and Array<number>", "array(number)"],
        correctAnswer: "Both number[] and Array<number>",
        explainAnswer:
          "In TypeScript, you can define an array of numbers using either the number[] syntax or the generic Array<number> syntax. Both are equivalent and commonly used.",
      },
      {
        id: 5,
        question: "What is the purpose of an interface in TypeScript?",
        options: [
          "To create user interfaces",
          "To define the structure of an object",
          "To connect to external APIs",
          "To implement inheritance between classes",
        ],
        correctAnswer: "To define the structure of an object",
        explainAnswer:
          "Interfaces in TypeScript are used to define the structure that objects must conform to. They specify the property names, types, and whether they're required or optional, helping catch errors when objects don't match the expected shape.",
      },
    ],
    intermediate: [
      {
        id: 1,
        question: "What is a union type in TypeScript?",
        options: [
          "A type that combines multiple objects into one",
          "A type that can be one of several types",
          "A type used for database unions",
          "A type for joining arrays",
        ],
        correctAnswer: "A type that can be one of several types",
        explainAnswer:
          "A union type in TypeScript allows a variable to hold values of multiple specified types. It's defined using the pipe symbol (|) between types, such as string | number, meaning the variable can be either a string or a number.",
      },
      {
        id: 2,
        question: "What is the purpose of the 'readonly' modifier in TypeScript?",
        options: [
          "To make properties visible only when reading code",
          "To prevent properties from being changed after initialization",
          "To optimize reading operations",
          "To make properties only readable by certain functions",
        ],
        correctAnswer: "To prevent properties from being changed after initialization",
        explainAnswer:
          "The 'readonly' modifier in TypeScript makes properties immutable after they're initialized. You can assign a value during declaration or in the constructor, but not afterwards, helping prevent accidental modifications.",
      },
      {
        id: 3,
        question: "What is a generic in TypeScript?",
        options: [
          "A default implementation",
          "A type that works with any data type",
          "A placeholder for a type that is specified later",
          "A common utility function",
        ],
        correctAnswer: "A placeholder for a type that is specified later",
        explainAnswer:
          "Generics in TypeScript allow you to create components that work with any data type while still providing type safety. They act as placeholders for types that are specified when the component is used, enabling reusable, type-safe code.",
      },
      {
        id: 4,
        question: "What is the purpose of the 'as' keyword in TypeScript?",
        options: [
          "To create aliases for imported modules",
          "To perform type assertion",
          "To compare values",
          "To create conditional types",
        ],
        correctAnswer: "To perform type assertion",
        explainAnswer:
          "The 'as' keyword in TypeScript is used for type assertion, allowing you to tell the compiler to treat a value as a specific type. It's useful when you have more information about a type than TypeScript can infer.",
      },
      {
        id: 5,
        question: "What is the difference between an interface and a type alias in TypeScript?",
        options: [
          "They are exactly the same",
          "Interfaces can be extended, while type aliases cannot",
          "Type aliases can use union types, interfaces cannot",
          "Interfaces can be implemented by classes, type aliases cannot",
        ],
        correctAnswer: "Interfaces can be extended, while type aliases cannot",
        explainAnswer:
          "While interfaces and type aliases are similar, interfaces can be extended using the 'extends' keyword and can be implemented by classes. Type aliases are more flexible for complex types like unions and intersections, but they cannot be extended or implemented.",
      },
    ],
    advanced: [
      {
        id: 1,
        question: "What is a mapped type in TypeScript?",
        options: [
          "A type that uses the Map data structure",
          "A type that transforms each property in an object type",
          "A type for mapping functions",
          "A type that maps keys to values",
        ],
        correctAnswer: "A type that transforms each property in an object type",
        explainAnswer:
          "Mapped types in TypeScript allow you to create new types by transforming the properties of an existing type. They use the syntax { [K in keyof T]: ... } to iterate over all properties of T and apply transformations to them.",
      },
      {
        id: 2,
        question: "What is the purpose of the 'keyof' operator in TypeScript?",
        options: [
          "To extract all key values from an object at runtime",
          "To get a union type of all property names of an object type",
          "To check if a key exists in an object",
          "To create a new key for an object",
        ],
        correctAnswer: "To get a union type of all property names of an object type",
        explainAnswer:
          "The 'keyof' operator in TypeScript creates a union type of all property names (keys) of an object type. For example, keyof {a: string, b: number} would be the type 'a' | 'b'.",
      },
      {
        id: 3,
        question: "What is a conditional type in TypeScript?",
        options: [
          "A type that depends on a runtime condition",
          "A type that depends on another type",
          "A type used in if-else statements",
          "A type that may or may not exist",
        ],
        correctAnswer: "A type that depends on another type",
        explainAnswer:
          "Conditional types in TypeScript allow you to select a type based on a condition involving another type. They use the syntax T extends U ? X : Y, meaning 'if T is assignable to U, use type X, otherwise use type Y'.",
      },
      {
        id: 4,
        question: "What is the 'infer' keyword used for in TypeScript?",
        options: [
          "To automatically infer types without explicit declarations",
          "To extract a type from another type in a conditional type",
          "To create inference rules for the compiler",
          "To infer the return type of a function",
        ],
        correctAnswer: "To extract a type from another type in a conditional type",
        explainAnswer:
          "The 'infer' keyword is used within conditional types to extract and capture a type. For example, type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any extracts the return type R from a function type.",
      },
      {
        id: 5,
        question: "What is the purpose of the 'unknown' type in TypeScript?",
        options: [
          "It's the same as the 'any' type",
          "It represents values that are currently unknown but will be defined later",
          "It's a type-safe alternative to 'any' that requires type checking before use",
          "It's used for variables that might not exist",
        ],
        correctAnswer: "It's a type-safe alternative to 'any' that requires type checking before use",
        explainAnswer:
          "The 'unknown' type is a type-safe counterpart of 'any'. While both can hold any value, you cannot perform operations on an 'unknown' value or assign it to other types without first checking or asserting its type, making it safer than 'any'.",
      },
    ],
  },
  python: {
    beginner: [
      {
        id: 1,
        question: "What is Python?",
        options: [
          "A snake species",
          "A high-level programming language",
          "A database management system",
          "A web browser",
        ],
        correctAnswer: "A high-level programming language",
        explainAnswer:
          "Python is a high-level, interpreted programming language known for its readability and simplicity. It supports multiple programming paradigms including procedural, object-oriented, and functional programming.",
      },
      {
        id: 2,
        question: "How do you create a comment in Python?",
        options: [
          "// This is a comment",
          "/* This is a comment */",
          "# This is a comment",
          "<!-- This is a comment -->",
        ],
        correctAnswer: "# This is a comment",
        explainAnswer:
          "In Python, single-line comments are created using the hash symbol (#). Everything after the # on that line is ignored by the interpreter.",
      },
      {
        id: 3,
        question: "Which of these is a valid way to create a variable in Python?",
        options: ["var x = 5;", "let x = 5;", "x = 5", "int x = 5;"],
        correctAnswer: "x = 5",
        explainAnswer:
          "In Python, variables are created by simply assigning a value to a name. There's no need for keywords like var, let, or const, or for semicolons at the end of statements.",
      },
      {
        id: 4,
        question: "What is the correct way to create a function in Python?",
        options: [
          "function myFunc(): { return 0; }",
          "def myFunc(): return 0",
          "def myFunc(): \n    return 0",
          "function myFunc() => { return 0; }",
        ],
        correctAnswer: "def myFunc(): \n    return 0",
        explainAnswer:
          "In Python, functions are defined using the 'def' keyword, followed by the function name, parameters in parentheses, and a colon. The function body is indented, as Python uses indentation to define code blocks.",
      },
      {
        id: 5,
        question: "What is the output of print(2 + 2 * 3)?",
        options: ["8", "12", "10", "Error"],
        correctAnswer: "8",
        explainAnswer:
          "Python follows the standard order of operations (PEMDAS). Multiplication has higher precedence than addition, so 2 * 3 is evaluated first (6), then 2 is added, resulting in 8.",
      },
    ],
    intermediate: [
      {
        id: 1,
        question: "What is a list comprehension in Python?",
        options: [
          "A way to understand lists better",
          "A concise way to create lists based on existing iterables",
          "A method to compress lists to save memory",
          "A function that explains what a list contains",
        ],
        correctAnswer: "A concise way to create lists based on existing iterables",
        explainAnswer:
          "List comprehensions provide a concise way to create lists based on existing lists or other iterables. They consist of brackets containing an expression followed by a for clause, then zero or more for or if clauses, e.g., [x*2 for x in range(10) if x % 2 == 0].",
      },
      {
        id: 2,
        question: "What is the purpose of the __init__ method in Python classes?",
        options: [
          "To initialize the class itself",
          "To initialize the instance variables when an object is created",
          "To define which methods are public",
          "To import required modules",
        ],
        correctAnswer: "To initialize the instance variables when an object is created",
        explainAnswer:
          "The __init__ method in Python is a special method (constructor) that is automatically called when a new instance of a class is created. It's used to initialize the attributes of the new object.",
      },
      {
        id: 3,
        question: "What is the purpose of the 'with' statement in Python?",
        options: [
          "To create a new scope for variables",
          "To handle exceptions in a cleaner way",
          "To ensure proper acquisition and release of resources",
          "To include external Python files",
        ],
        correctAnswer: "To ensure proper acquisition and release of resources",
        explainAnswer:
          "The 'with' statement in Python is used for resource management. It ensures that resources like files are properly acquired and released, even if exceptions occur. It's commonly used with file operations to automatically close files after use.",
      },
      {
        id: 4,
        question: "What is a decorator in Python?",
        options: [
          "A design pattern for creating user interfaces",
          "A function that takes another function and extends its behavior",
          "A way to add comments to functions",
          "A tool for formatting code",
        ],
        correctAnswer: "A function that takes another function and extends its behavior",
        explainAnswer:
          "A decorator in Python is a function that takes another function as input and extends or modifies its behavior without explicitly modifying its code. Decorators are applied using the @decorator_name syntax above function definitions.",
      },
      {
        id: 5,
        question: "What is the purpose of the 'yield' keyword in Python?",
        options: [
          "To pause execution and return a value in a generator function",
          "To give up control of a thread",
          "To return multiple values from a function",
          "To signal that a function has completed",
        ],
        correctAnswer: "To pause execution and return a value in a generator function",
        explainAnswer:
          "The 'yield' keyword is used in generator functions to pause execution and return a value to the caller. When the generator function is called again, it resumes execution from where it left off, maintaining its state between calls.",
      },
    ],
    advanced: [
      {
        id: 1,
        question: "What is a metaclass in Python?",
        options: [
          "A class that inherits from multiple parent classes",
          "A class that defines how classes are created",
          "A class that cannot be instantiated",
          "A class that contains only static methods",
        ],
        correctAnswer: "A class that defines how classes are created",
        explainAnswer:
          "A metaclass in Python is a class of a class that defines how a class behaves. It's the template for creating class objects, just as a class is the template for creating instance objects. The default metaclass is 'type'.",
      },
      {
        id: 2,
        question: "What is the Global Interpreter Lock (GIL) in Python?",
        options: [
          "A security feature that prevents unauthorized access to Python code",
          "A mutex that protects access to Python objects, preventing multiple threads from executing Python bytecode at once",
          "A lock that prevents global variables from being modified",
          "A system that locks the interpreter to a specific version of Python",
        ],
        correctAnswer:
          "A mutex that protects access to Python objects, preventing multiple threads from executing Python bytecode at once",
        explainAnswer:
          "The Global Interpreter Lock (GIL) is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecode simultaneously. This simplifies memory management but can limit performance in CPU-bound multi-threaded programs.",
      },
      {
        id: 3,
        question: "What are Python descriptors?",
        options: [
          "Functions that describe what other functions do",
          "Objects that implement __get__, __set__, or __delete__ methods",
          "Special comments that describe code functionality",
          "Tools for generating documentation",
        ],
        correctAnswer: "Objects that implement __get__, __set__, or __delete__ methods",
        explainAnswer:
          "Descriptors in Python are objects that implement at least one of the methods __get__, __set__, or __delete__. They allow you to customize what happens when an attribute is accessed, set, or deleted. Properties, methods, and class methods are all implemented using descriptors.",
      },
      {
        id: 4,
        question: "What is the purpose of the __slots__ attribute in Python classes?",
        options: [
          "To define which methods are available to instances",
          "To restrict the attributes that can be assigned to instances, saving memory",
          "To specify the order of attributes in the class",
          "To define slots for callback functions",
        ],
        correctAnswer: "To restrict the attributes that can be assigned to instances, saving memory",
        explainAnswer:
          "The __slots__ attribute in a Python class defines a fixed set of attributes that instances of the class can have. This both restricts attribute creation and saves memory by avoiding the creation of a __dict__ for each instance.",
      },
      {
        id: 5,
        question: "What is a context manager in Python?",
        options: [
          "A tool for managing different execution contexts",
          "An object that defines __enter__ and __exit__ methods for use with the 'with' statement",
          "A system for managing thread contexts",
          "A tool for managing different Python environments",
        ],
        correctAnswer: "An object that defines __enter__ and __exit__ methods for use with the 'with' statement",
        explainAnswer:
          "A context manager in Python is an object that implements the __enter__ and __exit__ methods, designed to be used with the 'with' statement. It handles setup and teardown actions, ensuring resources are properly managed even if exceptions occur.",
      },
    ],
  },
}

export default function QuizQuestionsClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const level = searchParams.get("level") || "beginner"
  const language = searchParams.get("language") || "nextjs"

  // State for quiz data and UI
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userAnswers, setUserAnswers] = useState<number[]>([])

  // Load sample quiz data instead of fetching from API
  useEffect(() => {
    try {
      setLoading(true)

      // Get questions for the selected language and level
      const quizData =
        sampleQuizData[language as keyof typeof sampleQuizData]?.[level as keyof typeof sampleQuizData.nextjs]

      if (!quizData || quizData.length === 0) {
        throw new Error(`No questions available for ${language} at ${level} level`)
      }

      setQuestions(quizData)
      setUserAnswers(Array(quizData.length).fill(null))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error loading questions:", err)
    } finally {
      setLoading(false)
    }
  }, [level, language])

  // Handle loading state
  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading quiz questions...</p>
      </div>
    )
  }

  // Handle error state
  if (error || questions.length === 0) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4 mt-40">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Unable to Load Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error || "No questions available for this combination."}</p>
            <p>Try selecting a different skill level or language.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/chats/quizz")} className="w-full">
              Back to Selection
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Find the index of the correct answer in the options array
  const getCorrectAnswerIndex = (question: QuizQuestion) => {
    return question.options.findIndex((option) => option === question.correctAnswer)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answerIndex)
    }
  }

  const checkAnswer = () => {
    if (selectedAnswer === null) return

    setIsAnswerSubmitted(true)

    // Store the user's answer
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestionIndex] = selectedAnswer
    setUserAnswers(newUserAnswers)

    // Check if the selected answer is correct
    const correctAnswerIndex = getCorrectAnswerIndex(currentQuestion)
    if (selectedAnswer === correctAnswerIndex) {
      setScore(score + 1)
    }
  }

  const showQuizCompletionFeedback = () => {
    const percentage = (score / questions.length) * 100

    if (percentage === 100) {
      toast.success("Perfect! You got all answers correct! 🎉", {
        duration: 5000,
        position: "top-center",
      })
      // Small confetti burst at the top
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.1 },
        zIndex: 1000,
      })
    } else if (percentage >= 70) {
      toast.success(`Great job! You got ${score} out of ${questions.length} correct!`, {
        duration: 4000,
      })
    } else if (percentage >= 40) {
      toast("Good effort! Keep practicing to improve!", {
        icon: "👍",
        duration: 4000,
      })
    } else {
      toast("Don't worry! Everyone starts somewhere. Try again!", {
        icon: "💪",
        duration: 4000,
      })
    }
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswerSubmitted(false)
    } else {
      setQuizCompleted(true)
      showQuizCompletionFeedback()
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
    setScore(0)
    setQuizCompleted(false)
    setUserAnswers(Array(questions.length).fill(null))
  }

  const goBack = () => {
    router.push("/chats/quizz")
  }

  // Quiz results view
  if (quizCompleted) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-2xl font-bold mb-6">
              Your Score: {score} out of {questions.length}
            </div>
            <Progress value={(score / questions.length) * 100} className="h-3" />

            <div className="mt-8 space-y-4">
              {questions.map((question, index) => {
                const correctAnswerIndex = getCorrectAnswerIndex(question)
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      {userAnswers[index] === correctAnswerIndex ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">
                          Question {index + 1}: {question.question}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your answer:{" "}
                          <span
                            className={
                              userAnswers[index] === correctAnswerIndex
                                ? "text-green-500 font-medium"
                                : "text-red-500 font-medium"
                            }
                          >
                            {userAnswers[index] !== null ? question.options[userAnswers[index]] : "Not answered"}
                          </span>
                        </p>
                        {userAnswers[index] !== correctAnswerIndex && (
                          <p className="text-sm text-green-600 mt-1">Correct answer: {question.correctAnswer}</p>
                        )}

                        {/* Add the explanation section */}
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 mt-2 text-sm text-muted-foreground hover:text-primary"
                            >
                              {question.explainAnswer ? "Show explanation" : ""}
                            </Button>
                          </CollapsibleTrigger>
                          {question.explainAnswer && (
                            <CollapsibleContent className="mt-2">
                              <div className="p-3 bg-muted/50 rounded-md">
                                <p className="text-sm font-medium text-foreground">Explanation:</p>
                                <p className="text-sm text-muted-foreground mt-1">{question.explainAnswer}</p>
                              </div>
                            </CollapsibleContent>
                          )}
                        </Collapsible>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Selection
            </Button>
            <Button onClick={restartQuiz}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Quiz question view
  const correctAnswerIndex = getCorrectAnswerIndex(currentQuestion)

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer?.toString()} className="space-y-5">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-6 rounded-md border cursor-pointer transition-colors ${
                  isAnswerSubmitted
                    ? index === correctAnswerIndex
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : selectedAnswer === index
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-transparent"
                    : selectedAnswer === index
                      ? "border-primary"
                      : "hover:bg-muted"
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isAnswerSubmitted} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
                {isAnswerSubmitted && index === correctAnswerIndex && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {isAnswerSubmitted && selectedAnswer === index && index !== correctAnswerIndex && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isAnswerSubmitted ? (
            <Button onClick={goToNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next Question <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Complete Quiz"
              )}
            </Button>
          ) : (
            <Button onClick={checkAnswer} disabled={selectedAnswer === null}>
              Check Answer
            </Button>
          )}
        </CardFooter>
      </Card>

      {isAnswerSubmitted && (
        <Alert
          className={
            selectedAnswer === correctAnswerIndex
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }
        >
          <AlertDescription>
            {selectedAnswer === correctAnswerIndex
              ? "Correct! Well done."
              : `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
