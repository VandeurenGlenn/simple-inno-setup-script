# simple-inno-setup-script
>

## install
```sh
npm install --save simple-inno-setup-script
```
or
```sh
yarn add simple-inno-setup-script
```

## usage
```js
import simpleInno from 'simple-inno-setup-script';

// required config
(async () => {
  const config = {

  }

  const script = await simpleInno(config);
  // do something with script, manipulate, write, etc...
})();

  // full config example
(async () => {
  const config = {

  }

  const script = await simpleInno(config);  
  // do something with script, manipulate, write, etc...
})();
```

## API
### simpleInno({config})

##### id
defaults to new uidv4
`Do not use the same AppId value in installers for other applications`

#### config

##### name

##### outputDir

##### output

##### sourceDir
`path to exe file to create setup for`
 array [x64, x86] or string x64

 required when sourceDirX86 is not defined

##### sourceDirX86
`build x86 only`

##### destDir
`install location`

##### version

##### author

##### url
`string or object`
string = AppPublisherURL
object = {
  publisherURL
  supportURL
  updatesURL  
}

##### vbs
`path to vbs script (defaults to included vbs script, when hideTerminal is true)`

#### signTool
`name for used signtool`

##### write
`path to write the .iss file to (optional)`

##### compressLevel
`default: ultra64`

http://www.jrsoftware.org/ishelp/index.php?topic=setup_compression
