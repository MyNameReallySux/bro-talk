# express-context-router
## Overview
The Express Context Router (ECR) package is used to define a file based routing structure, as well as provide an 'app-context' and a 'route-context' to each route. These objects will look something like...

```javascript
const context = {
    app: {
      name: "My App Name"
      developer: Chris Coppola
      meta: {
        "title": This is the site title
      }
      ...
    },
    route: {
      route_name: "About"
      route_url:  "/about"
      meta: {
        title: "This is the route title, this overrides the site title if present"
      }
      ...
    }
}
```   
   
The context objects are meant to be passed to your templates as is, to provide a slew of variables that can be used instead of re-using commonly used terms, elements, etc.

## Defining Individual Routes
ECR provides a new way to define routes in your projects. Routes are defined by creating a js file, usually the same name as your route's url. (ex: a file called 'about.js' in the folder '/routes' would create the route '/about). ECR also knows not to use any additional name if the "index.js" or "index.route.js" names are used. In this case, the route would be the name of the parent folder structure. (ex: a file called 'index.js' created in the folder '/routes/about' would create the route '/about'). Some more examples below

*Root routes directory: "/routes"*

| file path                      | route url     |
| ------------------------------ |---------------|
| /routes/index.js               | /             |
| /routes/about.js               | /about        |
| /routes/about/index.js         | /about        |
| /routes/about/resume.js        | /about/resume |
| /routes/about/resume/index.js  | /about/resume |

After creating a file, you can define multiple parts of the route by exporting them using `module.exports`.
### Route / Router
`module.exports.router`

The router object is where you define the route endpoints. Typically, route endpoints will be something like `/`, `/:paramater`, or `/verb`. See below for an example of a simple route definition.

```javascript
module.exports.router = (router, context)=>{
    router.get("/", (req, res)=>{
        res.send(`Route "${context.route_name}" successfully loaded`)
    })
    return router
}
````

### Route / Context
`module.exports.router`

You can manually override any settings in a routes context object.

```javascript
module.exports.context = {
	name: "About",
	title: "About Page",
	route_url: "/arbitrary"
}
```
    
