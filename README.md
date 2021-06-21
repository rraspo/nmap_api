# Bishop Fox API challenge

Please note, this repository includes a git local repository if you feel curious to see a more detailed work log.

I initially thought about processing the XML file and simply use a library to parse XML data. Then found out about
node.JS streams and thought it was a much faster better option.

## Installation

### Migrations

This API relies on sqlite3 database. To get the schema set up and running you should type

`yarn migrate`

This will run a node script that creates the schema the API needs. 
There is also `yarn seed`, but this command was only used for manual tests and you do not need it.

This API was created using the Express generator and is currently dockerized.
Please note, you need to run the migrations before starting the container.
You should only run:

`docker compose up --build`

This command should create an image in your computer and then start a container based on the image.
