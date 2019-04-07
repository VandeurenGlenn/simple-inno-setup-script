const test = require('tape');
const m = require('./../index');

test('required', async tape => {
  tape.plan(1);
  try {
    const result = await m({
      name: 'test',
      version: '0.0.1',
      author: 'simple-inno',
      url: '',
      outputDir: '../',
      sourceDir: "build/executables/test-win-x64.exe",
      sourceDirX86: "build/executables/test-win-x86.exe",
      vbsPath: '../templates/vbs.vbs'
      // include: ['Source: "../../node_modules/go-ipfs-dep/go-ipfs/ipfs.exe"; DestDir: "{pf}/test";']
    });
    await result.write(__dirname + '/test.iss', result.script);
    tape.ok(true)
  } catch (error) {
    console.error(error)

    tape.ok(false)
  }

})
