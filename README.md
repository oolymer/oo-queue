# oo-worker

[![Travis Build](https://img.shields.io/travis/oolymer/oo-worker/master.svg)](https://travis-ci.org/oolymer/oo-worker)
[![MIT License](https://img.shields.io/badge/license-MIT%20License-blue.svg?style=flat)](https://opensource.org/licenses/MIT)
[![Polymer 2](https://img.shields.io/badge/webcomponents-Polymer%202-orange.svg?style=flat)](https://www.polymer-project.org/2.0/start/)
<!-- [![Canoo Incubator](https://img.shields.io/badge/canoo-incubator-be1432.svg?style=flat)](https://github.com/canoo) -->

> Polymer mixin to process batches of tasks sorted by priority.

**Table of Contents:**

<!-- TOC depthFrom:2 -->

- [Features (to be implemented)](#features-to-be-implemented)
- [Usage](#usage)
- [Contribute](#contribute)

<!-- /TOC -->

## Features (to be implemented)

- **Add new tasks to the worker.** Tasks contain a callback function and a metadata object. They are used for conditional templating.

- **Sort tasks by priority and partion them into batches.**

- **Allow to define triggers that start or stop processing of tasks.**

- **Provide the status of the process.**

- **Allow to provide an exection context where a task or a task batch is processed.**

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
$ yarn install
$ yarn install:bower
$ yarn build
$ yarn test
$ yarn start
~~~

Semantic versions.

- Version number format `MAJOR.MINOR.PATCH`, e.g. "1.5.3".
- Increase MAJOR for breaking changes.
- Increase MINOR for new features.
- Increase PATCH for bug fixes.
