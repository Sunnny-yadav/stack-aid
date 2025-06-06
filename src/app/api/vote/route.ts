import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { userPrefereces } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
         /*
        - type : question or answer
        - typeId: documentId of question or answer
        - voteStatus: upvote or downvote
        - votedById : ID of the user who is performing the action
        */

    const { type, typeId, voteStatus, votedById } = await request.json();

    const response = await databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
    ]);

    // checked whether the vote Document already exist or not
    if (response.documents.length > 0) {
      await databases.deleteDocument(
        db,
        voteCollection,
        response.documents[0].$id
      );

      // revert the reputation of the author of question/answer
      const quesitonOrAnswerDoc = await databases.getDocument(
        db,
        type == "question" ? questionCollection : answerCollection,
        typeId
      );

      const authorPrefs = await users.getPrefs(quesitonOrAnswerDoc.authorId);
      await users.updatePrefs(quesitonOrAnswerDoc.authorId, {
        reputation:
          response.documents[0].voteStatus === "upvoted"
            ? Number(authorPrefs.reputation) - 1
            : Number(authorPrefs.reputation) + 1,
      });
    };

    // new vote document is created when there is no existing vote by user or voteStatus changed
    if (response.documents[0].voteStatus !== voteStatus) {

      const newVoteDoc = await databases.createDocument(db, voteCollection, ID.unique(), {
        type,
        typeId,
        votedById,
        voteStatus,
      });

      const quesitonOrAnswerDoc = await databases.getDocument(
        db,
        type === "question" ? questionCollection : answerCollection,
        typeId
      );

      const authorPref = await users.getPrefs<userPrefereces>(
        quesitonOrAnswerDoc.authorId
      );
      await users.updatePrefs(quesitonOrAnswerDoc.authorId, {
        reputation:
          voteStatus === "upvoted"
            ? Number(authorPref.reputation) + 1
            : Number(authorPref.reputation) - 1,
      });

      const [upvotes, downvotes] = await Promise.all([
        databases.listDocuments(db, voteCollection, [
            Query.equal("type", type),
            Query.equal("typeId", typeId),
            Query.equal("voteStatus", "upvoted"),
            Query.equal("votedById", votedById),
            Query.limit(1)
        ]),
        databases.listDocuments(db, voteCollection, [
            Query.equal("type", type),
            Query.equal("typeId", typeId),
            Query.equal("voteStatus", "downvoted"),
            Query.equal("votedById", votedById),
            Query.limit(1)
        ]),
    ]);

    return NextResponse.json(
        {
            data: { document: newVoteDoc, voteResult: upvotes.total - downvotes.total },
            message: response.documents[0] ? "Vote Status Updated" : "Voted",
        },
        {
            status: 201,
        }
    );

    };

    // calculation for return statement if same vote is done again like upvote -> upvote again
    const [upvotes, downvotes] = await Promise.all([
        databases.listDocuments(db, voteCollection, [
            Query.equal("type", type),
            Query.equal("typeId", typeId),
            Query.equal("voteStatus", "upvoted"),
            Query.equal("votedById", votedById),
            Query.limit(1)
        ]),
        databases.listDocuments(db, voteCollection, [
            Query.equal("type", type),
            Query.equal("typeId", typeId),
            Query.equal("voteStatus", "downvoted"),
            Query.equal("votedById", votedById),
            Query.limit(1)
        ]),
    ]);

    return NextResponse.json(
        {
            data: { 
                document: null, voteResult: upvotes.total - downvotes.total 
            },
            message: "Vote Withdrawn",
        },
        {
            status: 200,
        }
    );
    
  } catch (error) {
    console.log("Error in Vote route :: POST ::", error);
    let ErrMsg = "Error occured in the Post method of Vote route";

    if (error instanceof Error) {
      ErrMsg = error.message;
    }

    return NextResponse.json(
      {
        Error: ErrMsg,
      },
      {
        status: 500,
      }
    );
  }
};
