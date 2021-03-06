const notifier = require('node-notifier')

export async function compile (task) {
  await task.parallel(['bin', 'server', 'nextbuild', 'nextbuildstatic', 'pages', 'lib', 'client'])
}

export async function bin (task, opts) {
  await task.source(opts.src || 'bin/*').typescript({module: 'commonjs', stripExtension: true}).target('dist/bin', {mode: '0755'})
  notify('Compiled binaries')
}

export async function lib (task, opts) {
  await task.source(opts.src || 'lib/**/*.+(js|ts|tsx)').typescript({module: 'commonjs'}).target('dist/lib')
  notify('Compiled lib files')
}

export async function server (task, opts) {
  await task.source(opts.src || 'server/**/*.+(js|ts|tsx)').typescript({module: 'commonjs'}).target('dist/server')
  notify('Compiled server files')
}

export async function nextbuild (task, opts) {
  await task.source(opts.src || 'build/**/*.+(js|ts|tsx)').typescript({module: 'commonjs'}).target('dist/build')
  notify('Compiled build files')
}

export async function client (task, opts) {
  await task.source(opts.src || 'client/**/*.+(js|ts|tsx)').typescript({module: 'commonjs', target: 'es5'}).target('dist/client')
  notify('Compiled client files')
}

// export is a reserved keyword for functions
export async function nextbuildstatic (task, opts) {
  await task.source(opts.src || 'export/**/*.+(js|ts|tsx)').typescript({module: 'commonjs'}).target('dist/export')
  notify('Compiled export files')
}

export async function pages (task, opts) {
  await task.source(opts.src || 'pages/**/*.+(js|ts|tsx)').typescript({module: 'commonjs', target: 'es5'}).target('dist/pages')
}

export async function build (task) {
  await task.serial(['compile'])
}

export default async function (task) {
  await task.clear('dist')
  await task.start('build')
  await task.watch('bin/*', 'bin')
  await task.watch('pages/**/*.+(js|ts|tsx)', 'pages')
  await task.watch('server/**/*.+(js|ts|tsx)', 'server')
  await task.watch('build/**/*.+(js|ts|tsx)', 'nextbuild')
  await task.watch('export/**/*.+(js|ts|tsx)', 'nextexport')
  await task.watch('client/**/*.+(js|ts|tsx)', 'client')
  await task.watch('lib/**/*.+(js|ts|tsx)', 'lib')
}

export async function release (task) {
  await task.clear('dist').start('build')
}

// notification helper
function notify (msg) {
  return notifier.notify({
    title: '▲ Next',
    message: msg,
    icon: false
  })
}
