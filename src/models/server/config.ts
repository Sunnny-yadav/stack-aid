import {env} from '@/app/env'
import { Client, Avatars, Storage, Databases, Users } from 'node-appwrite';


let client = new Client();

client
    .setEndpoint(env.appWrite.endPoint) // Your API Endpoint
    .setProject(env.appWrite.projectId) // Your project ID
    .setKey(env.appWrite.apiKey) // Your secret API key
;

const avatars = new Avatars(client);
const databases = new Databases(client);
const storages = new Storage(client);
const users = new Users(client);

export {avatars, databases, storages, users, client}
