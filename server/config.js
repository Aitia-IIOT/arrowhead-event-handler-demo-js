import minimist from 'minimist'
const argv = minimist(process.argv.slice(2))
console.log(argv)

export const config = {
    n: "Arrowhead Application System",
    t: "provider",
    p: 8000,
    service_registry: "127.0.0.1:8443",
    ...argv
}

export const coreSystemInfo = {
    
}
