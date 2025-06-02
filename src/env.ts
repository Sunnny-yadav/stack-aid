export const env = {
    appWrite : {
        endPoint: String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
        projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
        apiKey: String(process.env.APPWRITE_API_KEY)
    }
};

