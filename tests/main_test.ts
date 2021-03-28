import { assertEquals } from "https://deno.land/std@0.91.0/testing/asserts.ts";
import { 
  CARD, 
  COLUMN,
  archive_card,
  archive_column,
  columns_ctx,
  card_ctx
} from "./context_test.ts"
import {archive, column, card} from "../repositories.ts";

const archive_item_card = await archive.get({
  type: CARD
});

const archive_item_column = await archive.get({
  type: COLUMN
});

Deno.test("Archive testing: get", () => {
  assertEquals(archive_card, archive_item_card);
  assertEquals(archive_column, archive_item_column);
});

Deno.test("Archive testing: set", () => {});
Deno.test("Archive testing: create_block", () => {});
Deno.test("Archive testing: push", () => {});

const columns_data = await column.lists();
const columns_data_item = await column.get({id:"43b9cc18-140a-465f-85d3-ac4b18005ab7"});

Deno.test("Column testing: list", () => {
  assertEquals(columns_ctx, columns_data);
});

Deno.test("Column testing: get", () => {
  assertEquals(columns_ctx[2], columns_data_item);
});
Deno.test("Column testing: set", () => {});
Deno.test("Column testing: existed", () => {});
Deno.test("Column testing: update", () => {});
Deno.test("Column testing: remove", () => {});

const card_data = await card.lists();
const card_data_item = await card.get({id:"89a0092c-b86f-4d2f-80e7-3226b2cae4f7"});

Deno.test("Card testing: list", () => {
  assertEquals(card_ctx, card_data);
});

Deno.test("Card testing: get", () => {
  assertEquals(card_ctx[1], card_data_item);
});

Deno.test("Card testing: set", () => {});
Deno.test("Card testing: existed", () => {});
Deno.test("Card testing: update", () => {});
Deno.test("Card testing: remove", () => {});