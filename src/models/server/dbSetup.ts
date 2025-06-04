import { db } from "../name";
import { databases } from "./config";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";


export default async function getOrCreateDB(){
    try {
        await databases.get(db)
        console.log("Database connected")
    } catch {
        
        try {
            await databases.create(db,db);
            console.log("Databases Created")

            await Promise.all([
                createAnswerCollection(),
                createCommentCollection(),
                createQuestionCollection(),
                createVoteCollection()
            ]);

            console.log("collections created")
            console.log("Database Connected")
        } catch (error) {
            console.log("Error Occured while creating databases or collections",error)
        }
    }

    return databases
}