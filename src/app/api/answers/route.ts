import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { userPrefereces } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
    const { content, questionId, authorId } = await request.json();

    const response = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        content,
        authorId,
        questionId,
      }
    );

    const prefs = await users.getPrefs<userPrefereces>(authorId);

    await users.updatePrefs(authorId, {
      reputation: Number(prefs.reputation) + 1,
    });

    return NextResponse.json(
      { data: response },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("answer post route error", error);
    let errorMessage = "Error occured while adding the answer";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        Error: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { answerId } = await request.json();

    const answer = await databases.getDocument(db, answerCollection, answerId);

    const response = await databases.deleteDocument(
      db,
      answerCollection,
      answerId
    );

    // decrease thee reputation for the author whose ans is deleted

    const prefs = await users.getPrefs(answer.authorId);

    await users.updatePrefs(answer.authorId, {
      reputation: Number(prefs.reputation) - 1,
    });

    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error) {
    console.error("answer delete route error", error);
    let errorMessage = "Error occured while deleting the answer";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        Error: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}
