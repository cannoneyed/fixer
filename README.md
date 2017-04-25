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

##### Note: Pomello currently only works with React versions >15.0

Ensure that your app is running (in this example our app is running at http://localhost:3000), and run pomello. The address supplied to pomello is the address that will be opened in the electron browser window.
```bash
$ pomello http://localhost:3000
```

Pomello takes a few arguments, which are used to configure the way it finds components and generates tests:

argument | description
-------- | -----------
`--root` | The root selector for the element your React app renders to
`--page` | The name of the page, used for generating the namespaces for fixtures

## Develop

In order to work with and develop pomello, it's useful to symlink to the local pomello repo from your target React app repo. That way you can build the code in watch mode locally and iterate on pomello's functionality

**pomello repo**
```bash
$ npm run watch
```

**target app repo**
```bash
$ npm link ../path/to/pomello && pomello http://localhost:3000 --root=#app --page index
```

## Changelog

#### 0.0.1

Initial release
