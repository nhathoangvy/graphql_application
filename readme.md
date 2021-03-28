## Backend-Auth

This is small deno application has built with GrapQL!
With a couple basic features: 

User can add column with name
User can modify column name
User can delete column
User can change column ordering
User can add card to column with name and description
User can modify card details
User can identify / switch status of card
User can change card ordering
User can archive card

### Install

Docker
+ Window: https://download.docker.com/win/beta/InstallDocker.msi
+ Linux: 
```
sudo apt-get update -y && sudo apt-get install -y linux-image-extra-$(uname -r)
sudo apt-get install docker-engine -y
sudo service docker start
```
+ Mac: https://docs.docker.com/docker-for-mac/install/

Deno ( For run local )
Deno ships as a single executable with no dependencies. You can install it using the installers below, or download a release binary from the releases page.

Shell (Mac, Linux):

curl -fsSL https://deno.land/x/install/install.sh | sh
PowerShell (Windows):

iwr https://deno.land/x/install/install.ps1 -useb | iex
Homebrew (Mac):

brew install deno
Chocolatey (Windows):

choco install deno
Scoop (Windows):

scoop install deno
Build and install from source using Cargo:

cargo install deno --locked

### Run
```
    ./run.sh
```

### Testing
```
    ./test.sh
```

### Docker
```
    docker build -t deno_app -f Dockerfile . 
    docker run -d -p 8088:8088 -e PORT="8088" -e ENV="STAGING" --name="application" app_container
```

### Postman test api

Create Column
```
curl --location --request POST 'http://localhost:8088/graphql' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"mutation {createColumn(name: \"New_col\", order: 10) {... on MessageOptions {code,\n           message}   ... on Column {id,name,order,created,updated}}}}","variables":{"input":"a7c9a3b6-4806-4cd3-8ffa-995cbcb605b2"}}'
```

List Column
```
curl --location --request POST 'http://localhost:8088/graphql' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"query {columns {id,name,order,created,updated}}","variables":{"input":"a7c9a3b6-4806-4cd3-8ffa-995cbcb605b2"}}'
```

Similiar with Card, Archive ...etc....
List API:
```
  findColumnId(id) -> Column
  columns() -> [Column]

  createColumn(name, order) -> Column
  updateColumn(id, name, order) -> Message
  removeColumn(id) -> Message
  
  findCardId(id) -> Card
  cards -> [Card]
  createCard(name, description, order, status, columnName) -> Card
  updateCard(id, name, description, order, status, columnName) -> Message
  archiveCard(id, status) -> Message
```