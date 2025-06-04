import { Client, Account, Avatars, Databases, Storage } from "appwrite";
import { env } from "@/app/env";

const client = new Client()
    .setEndpoint(env.appWrite.endPoint) // Your API Endpoint
    .setProject(env.appWrite.projectId); // Your project ID

const account = new Account(client);
const databases = new Databases(client);
const storages = new Storage(client);
const avatars = new Avatars(client);

export {account, databases, storages, avatars, client}
