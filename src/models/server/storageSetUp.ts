import { Permission } from "node-appwrite";
import {storages} from './config'
import {questionAttachmentBucket} from '../name'

export default async function getOrCreateStorage(){
    try {
        await storages.getBucket(questionAttachmentBucket)
        console.log("storage connected")
    } catch (_) {
        try {
            await storages.createBucket(
                questionAttachmentBucket,
                questionAttachmentBucket,
                [
                Permission.read("any"),
                Permission.read("users"),
                Permission.create("users"),
                Permission.update("users"),
                Permission.delete("users")
                ],
                false,
                undefined,
                undefined,
                ["jpg","png","gif","jpeg","webp","heic"]
        );

        console.log("Storage Created")
        console.log("Storage Connected")
        } catch (error) {
            console.log("Error Occured while Creating Storage",error)
        }
    }
}
