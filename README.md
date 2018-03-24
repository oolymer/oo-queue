# oo-worker

[![Travis Build](https://img.shields.io/travis/oolymer/oo-worker/master.svg)](https://travis-ci.org/oolymer/oo-worker)
[![MIT License](https://img.shields.io/badge/license-MIT%20License-blue.svg?style=flat)](https://opensource.org/licenses/MIT)
[![Polymer 2](https://img.shields.io/badge/webcomponents-Polymer%202-orange.svg?style=flat)](https://www.polymer-project.org/2.0/start/)
<!-- [![Canoo Incubator](https://img.shields.io/badge/canoo-incubator-be1432.svg?style=flat)](https://github.com/canoo) -->

**Table of Contents:**

<!-- TOC depthFrom:2 -->

- [Usage](#usage)
- [Contribute](#contribute)

<!-- /TOC -->

## Usage

~~~
$ bower install --save oolymer/oo-worker
~~~

~~~html
<link rel="import" href="../oo-worker/oo-worker.html">

<oo-worker></oo-worker>
~~~

## Contribute

Develop.

~~~
$ npm install
$ bower install --force-latest
$ npm run build:node:watch
$ npm run test:node:watch
$ npm run browser
~~~

Semantic versions.

- Version number format `MAJOR.MINOR.PATCH`, e.g. "1.5.3".
- Increase MAJOR for breaking changes.
- Increase MINOR for new features.
- Increase PATCH for bug fixes.
