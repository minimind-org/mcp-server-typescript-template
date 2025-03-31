import { z } from "zod";
import { sendRequest, buildUrl } from "../common/utils";
import { AdditionSchema, ExampleSchema } from "../common/types";

export function exampleAddition(params: z.infer<typeof AdditionSchema>) {
  return params.a + params.b;
}

export async function exampleApiCall(params: z.infer<typeof ExampleSchema>) {
  return sendRequest(buildUrl("https://example.com/search", params));
}