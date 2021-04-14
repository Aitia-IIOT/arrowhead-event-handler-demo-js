import 'babel-polyfill'
import express from 'express'
import moment from 'moment'
import { config, coreSystemInfo } from './config'
import { echo as echoSR, register, query, unregister, registerSystem } from './services/arrowhead/serviceRegistry'
import { echo as echoEH, publish, subscibe} from './services/arrowhead/eventHandler'


let app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// npm run start -- -n "svetlin_system" -t consumer -p 8080  --service_registry 192.168.0.157:8443

app.post('/event', (req, res) => {
    console.log('Received event: ', req.body)
    res.sendStatus(200)
})

const publishEvent = async () => {
    // random number in range
    // Math.random() * (max - min) + min
     const payload = { temperature: (Math.random() * (40 - 10) + 10).toFixed(3), unit: 'Celsius'}

        const publishRequest = {
            "eventType": "my-event",
            "payload": JSON.stringify(payload),
            "source": {
              "address": "127.0.0.1",
              "authenticationInfo": "",
              "port": config.p,
              "systemName": config.n
            },
            "timestamp": moment().format('YYYY-MM-DD HH:mm:ss')
        }
        
        console.log(publishRequest)

        await publish(publishRequest)
}

// start
(async () => {
    const response = await echoSR()
    console.log(response)
})()
.then(async () => {
    const response = await query({ serviceDefinitionRequirement: "event-publish" })
    // console.log(response.serviceQueryData)
    coreSystemInfo.eventhandler = response.serviceQueryData[0].provider
})
.then(async () => {
    const systemData = {
        address: "127.0.0.1",
        authenticationInfo: "",
        port: config.p,
        systemName: config.n
    }
  
    const response = await echoEH()
    console.log(response)

    if(config.t === 'provider') {
        // provider system, registers its service and lets start broadcasting events
        const serviceRegistryEntry = {
            "endOfValidity": "2021-12-05 12:00:00",
            "interfaces": [
              "HTTP-INSECURE-JSON"
            ],
            "providerSystem": {
              "address": "127.0.0.1 ",
              "authenticationInfo": "",
              "port": config.p,
              "systemName": config.n
            },
            "serviceDefinition": "temperature",
            "serviceUri": "/",
            "version": 1
          }

       const registerServiceResponse = await register(serviceRegistryEntry)
       console.log(registerServiceResponse)

        // active
        // send event periodically
        setInterval(() => publishEvent(), 5000)

    } else if(config.t === 'consumer') {

        const registerSystemResponse = await registerSystem(systemData)
        console.log(registerSystemResponse)

        // consumer system, subscribe to the event
        const subscriptionRequest = {
            "eventType": "my-event",
            "matchMetaData": false,
            "notifyUri": "/event",
            "subscriberSystem": {
              "systemName": config.n,
              "address": "127.0.0.1",
              "authenticationInfo": "",
              "port": config.p
            }
          }

         // console.log(JSON.stringify(subscriptionRequest))

       const subscribeResponse = await subscibe(subscriptionRequest)
       console.log(subscribeResponse)
    } else {
        console.log('Unrecognized application type!')
    }
})

.then(() => {
    app.listen(config.p, () => {
        console.log(`${config.n} is running as ${config.t} on port ${config.p}`)
    })
})

// stop

process.on('SIGINT', async () => {
    console.log('\nApplication System is shutting down!\n')
    if(config.t === 'provider'){
        console.log('Unregistering service')
        const unregisterResponse = await unregister("temperature")
        console.log(unregisterResponse)
    }

    process.exit()
})
