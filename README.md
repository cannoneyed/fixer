# Pomello

Pomello is a tool for automatically generating React component fixtures and unit tests for all components on a page, using their own props. Pomello runs your app in an electron browser window and allows you to generate fixtures and unit tests for every component in your application.

## Use

In order for pomello to read the source file of components and automatically write test files, first ensure you're using the [`babel-plugin-transform-react-jsx-source`](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source) babel plugin.


```bash
$ npm i --save-dev pomello babel-plugin-transform-react-jsx-source
```

**.babelrc**
```bash
{
    "presets": ["stage-2", "react", "es2015"],
    "env": {
        "development": {
            "plugins": [ "transform-react-jsx-source" ]
        }
    }
}
```

Ensure that your app is running (in this example our app is running at http://localhost:3000), and run pomello. The address supplied to pomello is the address that will be opened in the electron browser window.
```bash
$ pomello http://localhost:3000
```

Pomello takes a few arguments, which are used to configure the way it finds components and generates tests:

argument | description
-------- | -----------
`--root` | The root selector for the element your React app renders to
`--page` | The name of the page, used for generating the namespaces for fixtures

## Changelog

#### 0.0.1

Initial release
