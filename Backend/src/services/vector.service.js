const {Pinecone} =  require("@pinecone-database/pinecone");

const pc = new Pinecone({apiKey: process.env.PINECONE_API_KEY})

const askMeChatAIIndex =  pc.Index("ask-me");

async function createMemory({vectors,metadata,messageId}){
    await askMeChatAIIndex.upsert([{
        id:messageId,
        values:vectors,
        metadata
    }])
}

async function queryMemory({queryVector,limit,metadata}){

    const data = await askMeChatAIIndex.query({
        vector : queryVector,
        topK : limit,
        // filter: metadata ? {metadata} : undefined,
        filter: metadata ? metadata : undefined,
        includeMetadata: true
    })

    return data.matches
}

module.exports = {createMemory,queryMemory}