import fs from "fs";
import path from "path";

const [namespace, apiName] = process.argv.slice(2);

if (!namespace || !apiName) {
  console.error("Usage: npm run gen <namespace> <apiName>");
  process.exit(1);
}

const dir = path.join(process.cwd(), "src", "api", namespace, apiName);

// Templates
const constantsContent = `import { z } from "zod";

export const inputSchema = z.object({
  // Define your zod schema here
});
export type IBodyType = z.infer<typeof inputSchema>;
export const requiresAuth = true;
`;

const runContent = `import { IMongoContext } from "../../../types"
  import { IBodyType } from "./constants";
  export default async function run(data: IBodyType, context: IMongoContext) {
  // Logic goes here
  
  return {
    message: "Success from ${apiName}",
    data: data
  };
}
`;

// Create folders and files
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "constants.ts"), constantsContent);
  fs.writeFileSync(path.join(dir, "run.ts"), runContent);
  console.log(`Created API: src/api/${namespace}/${apiName}`);
} else {
  console.error(`Error: API ${namespace}${apiName} already exists`);
}
