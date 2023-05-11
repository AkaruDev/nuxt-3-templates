# Nuxt templates

> Nuxt features for various use cases

Each feature is in its own branch. Documentation, when available, is in the branches `README.md` file.

## Installation

#### With `nuxt-3-templates-cli` (easier)

Install a fresh Nuxt 3.

Install `nuxt-3-templates-cli` command and run `nuxt-3-templates install`. Choose one or more features, it will download all required files and install dependencies automatically.

More informations on how to install and use it in the [Nuxt 3 templates CLI repository](https://github.com/AkaruDev/nuxt-3-templates-cli).

## Add your own feature

- Go to branch `features-template`
- Create a new branch based on it
- Developp your new features

#### Nuxt templates CLI compatibility

To make your feature available for installation by `nuxt-templates install` command, you need to :

- Create a branch that starts with `features/`. You have a template of it in the branch `features-template`
- Create a `./nuxt-templates-cli.js` file which exports an object :
	- `metas.title`: Title of the feature
	- `metas.description`: Description of the feature
	- `dependencies`: Dependencies that will be installed
	- `devDependencies`: devDependencies that will be installed
	- `files`: An array of files or directories paths (relative to the root directory) that will be downloaded to the same path in your working directory
- Create a `./configs/nuxt.config.ts` that will have your configuration for the features (path for a module for exemple).