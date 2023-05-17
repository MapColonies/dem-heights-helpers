
# Dem-heights-helpers

Included scripts:

* Json points generator in area
* Json to protobuf binary encoder


## Usage

### Json points generator  

run script in terminal:

`npm run generateJsonPoints ` 

* `<JSON_FILE_PATH> `

* `<COORDINATE - latitude,longitude>`

* ` <NUMBER_OF_POINTS - DEFAULT 100> `

* `<RECT_HALF_SIZE (Radians) - DEFAULT 0.2 for ~100 tiles range>` 

example usage:

`npm run generateJsonPoints ./myJson.json 33.33443,35.77340 1000`


### Json to protobuf binary encoder 

run script in terminal:

`npm run generateProtoReqBinary ` 

* `<JSON FILE INPUT PATH>`

* `<PROTOBUFF FILE PATH>`

* `<PROTOBUFF TYPE PATH e.g myPackageName.myMessageType>`

* `<BIN FILE RESULT PATH>` 

example usage:

`npm run generateProtoReqBinary ./example_input.json ./example_input.proto examplePackage.exampleMessageType ./result.bin`