WebPd dev tools
==================

Package containing shared dev tools for the [WebPd](https://github.com/sebpiq/WebPd/) library.

This is not released on npm, install directly from github by pinning version to the latest tag : 

```
npm i --save git://github.com/sebpiq/WebPd_dev.git#<LATEST_TAG>
```


scripts/
-----------

**→ update-licenses.sh** : Run in a package to update all files' license headers. Run with : 

```
./node_modules/@webpd/dev/scripts/update-licenses.sh
```


configs/
-----------

**→ dist.rollup.mjs** and **dist.tsconfig.json** : Base files to create a customized rollup config for building TS packages to distributable JS files.

**→ base.tsconfig.json** : Base tsconfig file for development (different as the one used for distributing the package).

**→ jest.js** : Config file for Jest tests. 

**→ prettier.json** : Config file for prettier.


package.json
--------------

Contains among other things common development dependencies such as typecript and rollup. Having these in one place allows to share dependency versions between all packages in the project.