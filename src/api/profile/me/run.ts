import { IMongoContext } from "../../../types";

export default async function run({}, context: IMongoContext) {
  return { data: context.user };
}
