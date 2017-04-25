# :cactus: Fixer :cactus:

Fixer is a tool for automatically generating React component fixtures for all components on a page, using the props they use. Fixer runs your app in an electron browser window and allows you to generate fixtures for every component in your application.

## Use

In order for fixer to read the source file of components and automatically write test files, first ensure you're using the [`babel-plugin-transform-react-jsx-source`](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source) babel plugin.


```bash
$ npm i --save-dev fixer babel-plugin-transform-react-jsx-source
```

**.babelrc (example)**
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

##### Note: Fixer currently only works with React versions >15.0

Ensure that your app is running (in this example our app is running at http://localhost:3000), and run fixer. The address supplied to fixer is the address that will be opened in the electron browser window.
```bash
$ fixer http://localhost:3000
```

Fixer takes a few arguments, which are used to configure the way it finds components and generates tests:

argument | description
-------- | -----------
`--root` | The root selector for the element your React app renders to
`--page` | The name of the page, used for generating the namespaces for fixtures

## Develop

In order to work with and develop fixer, it's useful to symlink to the local fixer repo from your target React app repo. That way you can build the code in watch mode locally and iterate on fixer's functionality

**fixer repo**
```bash
$ npm run watch
```

**target app repo**
```bash
$ npm link ../path/to/fixer && fixer http://localhost:3000 --root=#app --page index
```

## Changelog

#### 0.0.1

Initial release
