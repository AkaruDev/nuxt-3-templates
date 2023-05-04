# Nuxt templates

> Nuxt features for various use cases

Each feature is in its own branch. Documentation, when available, is in the branches `README.md` file.

## Installation

#### By hand

Copy all files that differs from a fresh Nuxt installation in your Nuxt project.

#### With `nuxt-templates-cli` (easier)

Install `nuxt-templates-cli` command and run `nuxt-templates install`. Choose one or more features, it will download all required files and install dependencies automatically.

More informations on how to install and use it in the [Nuxt templates CLI repository](https://github.com/quentinneyraud/nuxt-templates-cli).

## Add your own feature

- Create a new branch
- Test your code locally by running `npm run dev`

#### Nuxt templates CLI compatibility

To make your feature available for installation by `nuxt-templates install` command, you need to :

- Create a branch that starts with `features/`
- Create a `./nuxt-templates-cli.js` file which exports an object :
	- `metas.title`: Title of the feature
	- `metas.description`: Description of the feature
	- `dependencies`: Dependencies that will be installed
	- `devDependencies`: devDependencies that will be installed
	- `files`: An array of files or directories paths (relative to the root directory) that will be downloaded to the same path in your working directory
- Create a `./config.js` file which exports a function that get context arguments (`IS_DEV`, `IS_PROD`, etc...) and need to return an object that will be merged in Nuxt config.