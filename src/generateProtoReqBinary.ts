import { readFile, writeFile } from "fs/promises";
import path from "path";
import protobuf from "protobufjs";

// CLI args <JSON FILE INPUT PATH> <PROTOBUFF FILE PATH> <PROTOBUFF TYPE PATH e.g myPackageName.myMessageType>  <BIN FILE RESULT PATH>
const [jsonInputFilePath, protoFilePath, protoMessagePath, binFileResultPath] = process.argv.slice(
    2
);

async function generateProtoEncodedBinFile() {
    // Proto init
    const protoRoot = await protobuf.load(path.resolve(protoFilePath));
    const messageType = protoRoot.lookupType(protoMessagePath);

    // Read JSON file data
    const inputJsonData = await readFile(path.resolve(jsonInputFilePath), { encoding: "utf-8" });
    const jsonData = JSON.parse(inputJsonData);

    const encodedProto = messageType.encode(jsonData).finish();
    
    if(encodedProto.buffer.byteLength === 0) {
        console.error('\x1B[38;5;196m',"There was an error encoding the provided data for the provided proto schema.");
        process.exit(1);
    }

    await writeFile(path.resolve(binFileResultPath), encodedProto, {
        encoding: "utf-8"
    });

    console.log('\x1B[38;5;76m',`Proto encoded bin created at \x1b[36m${path.resolve(binFileResultPath)}\x1b[0m`);
}

generateProtoEncodedBinFile();
