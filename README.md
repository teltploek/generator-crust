# generator-crust

This generator will provide you with a jump start to new [Crust](https://github.com/PentiaLabs/crust-io) projects.

## Getting Started

#### Prerequisites

You need to have [Bower](http://bower.io) and [Yeoman](http://yeoman.io) installed on your system.

```bash
npm install -g bower
npm install -g yo
```

And then this generator:

```bash
npm install -g generator-crust
```

#### Initiating the crust generator:

Create a new folder, cd into it and run:

```bash
yo crust
```

Follow the instructions.

#### Developer workflow

When you'd like to develop on your sources run:

```bash
gulp serve
```

Open up your favorite IDE, do changes and point your browser to http://localhost:4200

If you're in doubt about the general crust file structure, take a look at the crust instructions [here](https://github.com/PentiaLabs/crust-io)

#### Building for production

When you'd like to develop on your sources run:

```bash
gulp
```

This will create a static HTML-representation of your content merged with your templates ready to ship inside the dist-folder in the project root.

***

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-crust from npm, run:

```bash
npm install -g generator-crust
```

Finally, initiate the generator:

```bash
yo crust
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

MIT
