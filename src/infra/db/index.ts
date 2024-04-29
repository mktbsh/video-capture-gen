import { APP_NAME } from "@/const/site";
import Dexie, { Table } from "dexie";
import { Meta } from "./meta";
import { Capture } from "./capture";

const DB_NAME = APP_NAME.split(' ').join('-').toLowerCase();
const DB_VERSION = 1;

class MyDb extends Dexie {
  meta!: Table<Meta>;
  captures!: Table<Capture>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores({
      meta: "&key, title, createdAt, updatedAt",
      captures: "++id, key, createdAt"
    });
  }
}

export const db = new MyDb();
