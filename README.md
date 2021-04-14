# ARROWHEAD EVENT HANDLER CLIENT

This is a NodeJS project, which offers Arrowhead compliant clients which are able to use the Event Handler

### For the first time

1. Make sure you have `node` and `git` installed.
2. Check out the repo.
3. Run `npm install` to download the project dependencies.


5. Run `npm run start -- <command line arguments> ` to start the client.

### Command line arguments

| Argument Name       | Syntax           | Value  | Mandatory |
|:-------------------:|:----------------:|:------:|:---------:|
| System Name         | -n               | String | yes       |
| Port                | -p               | Number | yes       |
| System Type         | -t               | provider or consumer | yes |
| Service Registry Address | --service_registry | String | no |

Example to start a provider:
`npm run start -- -n svetlin_system -t provider -p 8080`

Example to start a consumer:  
`npm run start -- -n svetlin_consumer -p 8081 -t consumer`

Example with defining Service Registry address:  
`npm run start -- -n svetlin_system -t provider -p 8080 --service_registry 192.168.0.157`

